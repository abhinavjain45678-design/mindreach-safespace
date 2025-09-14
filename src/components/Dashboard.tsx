import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Mic, Users, Shield, Moon, Sun, Sparkles, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const quickActions = [
    {
      id: 'mindmate',
      title: 'Talk to MindMate',
      description: 'AI companion for emotional support',
      icon: MessageCircle,
      gradient: 'bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20',
      iconColor: 'text-green-600',
      badge: 'Always Available'
    },
    {
      id: 'reachin',
      title: 'Start ReachIn Session',
      description: 'Private voice assistant & breathing exercises',
      icon: Mic,
      gradient: 'bg-gradient-to-br from-purple-100 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/20',
      iconColor: 'text-purple-600',
      badge: 'Offline Ready'
    },
    {
      id: 'safespace',
      title: 'Join SafeSpace',
      description: 'Anonymous community support',
      icon: Users,
      gradient: 'bg-gradient-to-br from-orange-100 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/20',
      iconColor: 'text-orange-600',
      badge: 'Anonymous'
    }
  ];

  const wellnessTips = [
    { text: "Take 3 deep breaths before starting your day", icon: "🌅" },
    { text: "Remember: Your feelings are valid", icon: "💚" },
    { text: "It's okay to ask for help", icon: "🤝" },
    { text: "You're stronger than you think", icon: "💪" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary-soft/10 p-4 lg:pl-64 pt-20 lg:pt-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-soft/50 rounded-full">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Welcome to your safe space</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            How are you feeling today?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your mental wellness journey starts here. Choose how you'd like to connect, share, or find support.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Card 
                key={action.id}
                className={cn(
                  "cursor-pointer transition-all duration-300 hover:shadow-wellness hover:scale-105 border-0",
                  action.gradient
                )}
                onClick={() => onNavigate(action.id)}
              >
                <CardHeader className="text-center pb-3">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-white/70 dark:bg-black/10 flex items-center justify-center mb-3 shadow-soft">
                    <IconComponent className={cn("w-8 h-8", action.iconColor)} />
                  </div>
                  <Badge variant="secondary" className="w-fit mx-auto mb-2">
                    {action.badge}
                  </Badge>
                  <CardTitle className="text-xl">{action.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {action.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="default">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Wellness Tips */}
        <Card className="bg-gradient-to-r from-accent/30 to-primary-soft/30 border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary fill-current" />
              Daily Wellness Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-3">
              {wellnessTips.map((tip, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white/50 dark:bg-black/10 rounded-lg">
                  <span className="text-2xl">{tip.icon}</span>
                  <span className="text-sm font-medium">{tip.text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Safety Notice */}
        <Card className="bg-gradient-to-r from-primary-soft/40 to-accent/20 border border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-2">Your Privacy Matters</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This platform is designed with your safety and privacy in mind. No personal information is required, 
                  conversations are confidential, and offline features work without internet access. 
                  If you're experiencing a crisis, please reach out to local emergency services or a trusted adult.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Indicators */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>All systems operational</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>100% anonymous</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Available 24/7</span>
          </div>
        </div>
        
      </div>
    </div>
  );
}