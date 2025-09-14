import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Brain, Phone, Users, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface NavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Heart },
  { id: 'mindmate', label: 'MindMate', icon: Brain },
  { id: 'reachin', label: 'ReachIn', icon: Phone },
  { id: 'safespace', label: 'SafeSpace', icon: Users },
];

export const Navigation = ({ activeView, onViewChange }: NavigationProps) => {
  const { signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MindReach
            </span>
          </div>

          {/* Desktop Sign Out */}
          <div className="hidden md:block">
            <Button
              variant="ghost"
              onClick={signOut}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm pt-16">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeView === item.id ? "default" : "ghost"}
                  className="w-full justify-start gap-3 h-12"
                  onClick={() => {
                    onViewChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <IconComponent className="w-5 h-5" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
          
          {/* Mobile Sign Out */}
          <div className="pt-4 border-t border-border">
            <Button
              variant="ghost"
              onClick={signOut}
              className="w-full justify-start text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-background/95 backdrop-blur-sm border-r flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                MindReach
              </h1>
              <p className="text-xs text-muted-foreground">Mental Health Support</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeView === item.id ? "default" : "ghost"}
                  className="w-full justify-start gap-3 h-11"
                  onClick={() => onViewChange(item.id)}
                >
                  <IconComponent className="w-5 h-5" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6">
          <Button
            variant="ghost"
            onClick={signOut}
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground mb-4"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
          
          <div className="p-4 bg-primary/5 rounded-lg">
            <p className="text-sm font-medium text-primary mb-1">
              Safe & Confidential
            </p>
            <p className="text-xs text-muted-foreground">
              Your privacy is protected. All conversations are secure.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}