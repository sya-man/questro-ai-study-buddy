import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Brain,
  MessageCircle, 
  FileText, 
  Image, 
  History, 
  Settings, 
  LogOut,
  Key,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const menuItems = [
    { id: 'chat', label: 'AI Chat', icon: MessageCircle },
    { id: 'pdf-mcq', label: 'PDF to MCQ', icon: FileText },
    { id: 'image-solver', label: 'Image Solver', icon: Image },
    { id: 'history', label: 'Chat History', icon: History },
    { id: 'api-keys', label: 'API Keys', icon: Key },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          {(!isCollapsed || isMobileOpen) && (
            <span className="font-bold text-lg text-sidebar-foreground">Questro</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                activeTab === item.id 
                  ? "bg-gradient-primary text-white shadow-soft" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
              onClick={() => {
                onTabChange(item.id);
                setIsMobileOpen(false);
              }}
            >
              <Icon className="h-4 w-4" />
              {(!isCollapsed || isMobileOpen) && <span className="ml-2">{item.label}</span>}
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          {(!isCollapsed || isMobileOpen) && <span className="ml-2">Sign Out</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 right-4 z-50 md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <div className="relative w-64 h-full">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className={cn("hidden md:flex flex-col", isCollapsed ? "w-16" : "w-64")}>
        <div className="relative">
          <SidebarContent />
          <Button
            variant="ghost"
            size="sm"
            className="absolute -right-3 top-6 bg-background border border-border rounded-full p-1 h-6 w-6"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;