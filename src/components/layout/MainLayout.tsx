import { useState } from 'react';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <main className={cn(
        "flex-1 overflow-y-auto transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "ml-[80px]" : "ml-[250px]"
      )}>
        <div className="main-container flex flex-col flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
