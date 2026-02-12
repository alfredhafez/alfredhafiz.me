import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import CustomCursor from '@/components/CustomCursor';
import {
  LayoutDashboard,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Messages',
    href: '/admin/messages',
    icon: Mail,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
  {
    title: 'Activity Log',
    href: '/admin/activity',
    icon: Activity,
  },
];

export const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/secret-admin-login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Custom cursor on admin pages */}
      <CustomCursor />
      
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b z-50 flex items-center justify-between px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <span className="font-semibold">Admin Dashboard</span>
        <div className="w-10" />
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-64 bg-card border-r transition-transform duration-300 lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b px-6">
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">A</span>
              </div>
              <span className="font-semibold text-lg">Admin Panel</span>
            </Link>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-3">
              {sidebarItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          {/* User & Logout */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <span className="text-sm font-medium">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.email}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          'min-h-screen transition-all duration-300 lg:ml-64 pt-16 lg:pt-0'
        )}
      >
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};
