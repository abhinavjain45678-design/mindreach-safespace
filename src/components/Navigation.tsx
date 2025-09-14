import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Mic, Users, Home, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'mindmate', label: 'MindMate', icon: MessageCircle },
  { id: 'reachin', label: 'ReachIn', icon: Mic },
  { id: 'safespace', label: 'SafeSpace', icon: Users },
];

export function Navigation({ activeView, onViewChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary fill-current" />
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              MindReach SafeSpace
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
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
                  className={cn(
                    "w-full justify-start gap-3 h-12",
                    activeView === item.id && "shadow-wellness"
                  )}
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
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-card/50 backdrop-blur-sm border-r border-border flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-wellness">
              <Heart className="w-6 h-6 text-white fill-current" />
            </div>
            <div>
              <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                MindReach
              </h1>
              <p className="text-xs text-muted-foreground">SafeSpace</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeView === item.id ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-11",
                    activeView === item.id && "shadow-wellness bg-gradient-to-r from-primary to-primary/90"
                  )}
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
          <div className="p-4 bg-primary-soft/30 rounded-lg">
            <p className="text-sm font-medium text-primary mb-1">
              Safe & Confidential
            </p>
            <p className="text-xs text-muted-foreground">
              Your privacy is protected. No personal data is stored.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}