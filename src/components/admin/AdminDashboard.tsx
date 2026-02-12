import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getMessageStats, subscribeToMessages, fetchContactMessages, updateMessageStatus } from '@/lib/supabase';
import type { ContactMessage, MessageStats } from '@/lib/supabase';
import { 
  Mail, 
  MailOpen, 
  Reply, 
  Clock,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<MessageStats | null>(null);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [statsResult, messagesResult] = await Promise.all([
        getMessageStats(),
        fetchContactMessages({ limit: 5 })
      ]);

      if (statsResult.data) {
        setStats(statsResult.data);
      }

      if (messagesResult.data) {
        setRecentMessages(messagesResult.data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  useEffect(() => {
    loadData().then(() => setIsLoading(false));

    // Subscribe to real-time updates
    const subscription = subscribeToMessages((payload) => {
      if (payload.eventType === 'INSERT') {
        // New message received
        setRecentMessages((prev: ContactMessage[]) => [payload.new as ContactMessage, ...prev].slice(0, 5));
        setStats((prev: MessageStats | null) => prev ? {
          ...prev,
          total: prev.total + 1,
          unread: prev.unread + 1
        } : null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const handleMarkAsRead = async (messageId: string) => {
    const { error } = await updateMessageStatus(messageId, {
      isRead: true,
      readAt: new Date().toISOString()
    });

    if (!error) {
      setRecentMessages((prev: ContactMessage[]) =>
        prev.map((msg: ContactMessage) =>
          msg.id === messageId ? { ...msg, is_read: true } : msg
        )
      );
      setStats((prev: MessageStats | null) => prev ? {
        ...prev,
        unread: Math.max(0, prev.unread - 1),
        read: prev.read + 1
      } : null);
    }
  };

  const statCards = [
    { 
      title: 'Total Messages', 
      value: stats?.total || 0, 
      icon: Mail, 
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    { 
      title: 'Unread', 
      value: stats?.unread || 0, 
      icon: MailOpen, 
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    },
    { 
      title: 'Read', 
      value: stats?.read || 0, 
      icon: Clock, 
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    { 
      title: 'Replied', 
      value: stats?.replied || 0, 
      icon: Reply, 
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your messages.
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                <stat.icon className={cn("h-4 w-4", stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
          <CardDescription>
            You have {stats?.unread || 0} unread messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentMessages.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No messages yet
              </p>
            ) : (
              recentMessages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start justify-between p-4 rounded-lg border",
                    !message.is_read && "bg-muted/50 border-primary/20"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold truncate">
                        {message.name}
                      </span>
                      {!message.is_read && (
                        <Badge variant="default" className="text-xs">New</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {message.subject || 'No subject'}
                    </p>
                    <p className="text-sm truncate mt-1">
                      {message.message.substring(0, 100)}
                      {message.message.length > 100 && '...'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDistanceToNow(new Date(message.created_at))} ago
                    </p>
                  </div>
                  {!message.is_read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(message.id)}
                    >
                      Mark as read
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function for date formatting
function cn(...inputs: (string | boolean | undefined)[]) {
  return inputs.filter(Boolean).join(' ');
}
