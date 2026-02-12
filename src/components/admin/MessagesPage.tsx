import React, { useEffect, useState } from 'react';

import { 
  fetchContactMessages, 
  updateMessageStatus, 
  deleteMessage, 
  subscribeToMessages,
  type ContactMessage 
} from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Search, 
  Mail, 
  MailOpen, 
  Reply, 
  Trash2, 
  RefreshCw, 
  Loader2,
  Archive,
  Send
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  

  const loadMessages = async () => {
    setIsLoading(true);
    const { data, error } = await fetchContactMessages({ limit: 100 });
    
    if (error) {
      toast.error('Failed to load messages');
      console.error(error);
    } else if (data) {
      setMessages(data);
      setFilteredMessages(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadMessages();

    // Subscribe to real-time updates
    const subscription = subscribeToMessages((payload) => {
      if (payload.eventType === 'INSERT') {
        const newMessage = payload.new as ContactMessage;
        setMessages(prev => [newMessage, ...prev]);
        setFilteredMessages(prev => [newMessage, ...prev]);
        toast.info(`New message from ${newMessage.name}`);
      } else if (payload.eventType === 'UPDATE') {
        const updatedMessage = payload.new as ContactMessage;
        setMessages(prev => 
          prev.map(msg => msg.id === updatedMessage.id ? updatedMessage : msg)
        );
        setFilteredMessages(prev => 
          prev.map(msg => msg.id === updatedMessage.id ? updatedMessage : msg)
        );
      } else if (payload.eventType === 'DELETE') {
        const deletedId = payload.old.id;
        setMessages(prev => prev.filter(msg => msg.id !== deletedId));
        setFilteredMessages(prev => prev.filter(msg => msg.id !== deletedId));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let filtered = messages;

    // Apply status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'unread') {
        filtered = filtered.filter(m => !m.is_read);
      } else {
        filtered = filtered.filter(m => m.status === statusFilter);
      }
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(query) ||
        m.email.toLowerCase().includes(query) ||
        (m.subject && m.subject.toLowerCase().includes(query)) ||
        m.message.toLowerCase().includes(query)
      );
    }

    setFilteredMessages(filtered);
  }, [searchQuery, statusFilter, messages]);

  const handleMarkAsRead = async (messageId: string) => {
    const { error } = await updateMessageStatus(messageId, {
      isRead: true,
      readAt: new Date().toISOString()
    });

    if (error) {
      toast.error('Failed to mark as read');
    } else {
      toast.success('Marked as read');
    }
  };

  const handleArchive = async (messageId: string) => {
    const { error } = await updateMessageStatus(messageId, {
      status: 'archived'
    });

    if (error) {
      toast.error('Failed to archive message');
    } else {
      toast.success('Message archived');
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    const { error } = await deleteMessage(messageId);

    if (error) {
      toast.error('Failed to delete message');
    } else {
      toast.success('Message deleted');
      if (selectedMessage?.id === messageId) {
        setIsViewDialogOpen(false);
      }
    }
  };

  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsViewDialogOpen(true);
    
    // Mark as read if not already
    if (!message.is_read) {
      await handleMarkAsRead(message.id);
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyContent.trim()) return;

    setIsSendingReply(true);
    
    try {
      // Send reply via backend API
      const response = await fetch(`${API_URL}/api/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: selectedMessage.email,
          subject: `Re: ${selectedMessage.subject || 'Your message'}`,
          message: replyContent,
          originalMessageId: selectedMessage.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send reply');
      }

      // Update message status in Supabase
      await updateMessageStatus(selectedMessage.id, {
        status: 'replied',
        repliedAt: new Date().toISOString(),
        replyContent: replyContent
      });

      toast.success('Reply sent successfully');
      setIsReplyDialogOpen(false);
      setReplyContent('');
    } catch (error) {
      toast.error('Failed to send reply');
      console.error(error);
    } finally {
      setIsSendingReply(false);
    }
  };

  const getStatusBadge = (status: string, isRead: boolean) => {
    if (!isRead) {
      return <Badge className="bg-red-500">Unread</Badge>;
    }
    
    switch (status) {
      case 'replied':
        return <Badge className="bg-green-500">Replied</Badge>;
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>;
      default:
        return <Badge variant="outline">Read</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">
            Manage and respond to contact form submissions
          </p>
        </div>
        <Button
          variant="outline"
          onClick={loadMessages}
          disabled={isLoading}
        >
          <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-md border bg-background text-sm"
        >
          <option value="all">All Messages</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Messages List */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-16">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No messages found</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "p-4 flex items-start gap-4 hover:bg-muted/50 transition-colors cursor-pointer",
                    !message.is_read && "bg-muted/30"
                  )}
                  onClick={() => handleViewMessage(message)}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                    !message.is_read ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    {!message.is_read ? (
                      <Mail className="h-5 w-5" />
                    ) : (
                      <MailOpen className="h-5 w-5" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold truncate">
                        {message.name}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        &lt;{message.email}&gt;
                      </span>
                      {getStatusBadge(message.status, message.is_read)}
                    </div>
                    <p className="text-sm font-medium truncate">
                      {message.subject || 'No subject'}
                    </p>
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {message.message.substring(0, 100)}
                      {message.message.length > 100 && '...'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {format(new Date(message.created_at), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMessage(message);
                        setIsReplyDialogOpen(true);
                      }}
                    >
                      <Reply className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArchive(message.id);
                      }}
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(message.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Message Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject || 'No subject'}</DialogTitle>
            <DialogDescription>
              From: {selectedMessage?.name} &lt;{selectedMessage?.email}&gt;
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Received: {selectedMessage && format(new Date(selectedMessage.created_at), 'PPpp')}</span>
              {selectedMessage?.status === 'replied' && (
                <Badge className="bg-green-500">Replied</Badge>
              )}
            </div>
            
            <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap">
              {selectedMessage?.message}
            </div>

            {selectedMessage?.reply_content && (
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <p className="text-sm font-medium text-green-600 mb-2">Your Reply:</p>
                <div className="text-sm whitespace-pre-wrap">
                  {selectedMessage.reply_content}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Sent: {selectedMessage.replied_at && format(new Date(selectedMessage.replied_at), 'PPpp')}
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => handleDelete(selectedMessage?.id || '')}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <Button
              variant="outline"
              onClick={() => handleArchive(selectedMessage?.id || '')}
            >
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </Button>
            <Button
              onClick={() => {
                setIsViewDialogOpen(false);
                setIsReplyDialogOpen(true);
              }}
            >
              <Reply className="mr-2 h-4 w-4" />
              Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reply to {selectedMessage?.name}</DialogTitle>
            <DialogDescription>
              Original subject: {selectedMessage?.subject || 'No subject'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-lg text-sm">
              <p className="text-muted-foreground mb-2">Original message:</p>
              <p className="line-clamp-3">{selectedMessage?.message}</p>
            </div>
            
            <Textarea
              placeholder="Type your reply here..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={8}
              className="resize-none"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReplyDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReply}
              disabled={!replyContent.trim() || isSendingReply}
            >
              {isSendingReply ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Reply
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
