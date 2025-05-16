
import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  LayoutDashboard, 
  MessageSquare, 
  Settings, 
  Users,
  Briefcase 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const location = useLocation();
  
  const navItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: '/',
      active: location.pathname === '/'
    },
    {
      title: 'Candidate Pool',
      icon: <Users className="h-5 w-5" />,
      href: '/candidates',
      active: location.pathname.startsWith('/candidates')
    },
    {
      title: 'Jobs',
      icon: <Briefcase className="h-5 w-5" />,
      href: '/jobs',
      active: location.pathname.startsWith('/jobs')
    },
    {
      title: 'Pipeline Overview',
      icon: <Calendar className="h-5 w-5" />,
      href: '/pipeline',
      active: location.pathname === '/pipeline'
    },
    {
      title: 'Analytics',
      icon: <BarChart3 className="h-5 w-5" />,
      href: '/analytics',
      active: location.pathname === '/analytics'
    },
    {
      title: 'TalentTalk',
      icon: <MessageSquare className="h-5 w-5" />,
      href: '/talent-talk',
      active: location.pathname === '/talent-talk'
    },
    {
      title: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      href: '/settings',
      active: location.pathname === '/settings'
    }
  ];

  return (
    <aside className={cn(
      "glass-card h-screen fixed left-0 top-0 z-30 flex flex-col transition-all duration-300 ease-in-out",
      collapsed ? "w-[80px]" : "w-[250px]"
    )}>
      <div className="py-6 px-4 flex items-center justify-between border-b border-border/50">
        <div className={cn(
          "flex items-center space-x-2 transition-all duration-300",
          collapsed && "opacity-0 translate-x-10"
        )}>
          <div className="bg-primary rounded-lg w-8 h-8 flex items-center justify-center text-white font-bold">
            C
          </div>
          <span className="font-semibold text-lg">CandidAI</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 rounded-full hover:bg-muted"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <nav className="flex-1 py-6 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.title}
            to={item.href}
            className={cn(
              "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              item.active 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <span className="mr-3">{item.icon}</span>
            <span className={cn(
              "transition-all duration-300",
              collapsed && "opacity-0 translate-x-10"
            )}>
              {item.title}
            </span>
          </Link>
        ))}
      </nav>
      
      <div className={cn(
        "p-4 border-t border-border/50 flex items-center space-x-3",
        collapsed && "justify-center"
      )}>
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
          HR
        </div>
        <div className={cn(
          "transition-all duration-300 flex-1",
          collapsed && "opacity-0 translate-x-10"
        )}>
          <div className="text-sm font-medium">HR Admin</div>
          <div className="text-xs text-muted-foreground">admin@candidai.com</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
