import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Heart, Sparkles, BookOpen, Palette, Music, Wind } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  mood?: string;
}

export function MindMate() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I'm MindMate, your AI companion. I'm here to listen without judgment and support you through whatever you're feeling. What's on your mind today? 💚",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const copingStrategies = [
    { icon: Wind, label: "Breathing Exercise", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { icon: Music, label: "Calming Sounds", color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
    { icon: Palette, label: "Art Therapy", color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20" },
    { icon: BookOpen, label: "Journaling", color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('anxious') || message.includes('anxiety')) {
      return "I hear that you're feeling anxious. That's a completely normal feeling, and I'm here with you. Try this: Take a deep breath in for 4 counts, hold for 4, then breathe out for 6. Your feelings are valid, and this moment will pass. 🌸";
    }
    
    if (message.includes('sad') || message.includes('depressed') || message.includes('down')) {
      return "I'm sorry you're feeling this way. It takes courage to share these feelings. Remember that feeling sad doesn't mean you're broken - it means you're human. Would you like to try a gentle activity together, or would you prefer to talk about what's making you feel this way? 💙";
    }
    
    if (message.includes('stressed') || message.includes('overwhelmed')) {
      return "Feeling overwhelmed can be really tough. Let's break things down together. Sometimes when everything feels too much, focusing on just one small thing can help. What's one tiny step you could take right now? I believe in you. ✨";
    }
    
    if (message.includes('angry') || message.includes('mad') || message.includes('frustrated')) {
      return "Your anger is valid - it's telling you something important. Take a moment to breathe. Sometimes anger is protecting other feelings like hurt or fear. I'm here to listen to whatever you're experiencing without judgment. 🔥➡️💚";
    }
    
    if (message.includes('tired') || message.includes('exhausted')) {
      return "It sounds like you're carrying a heavy load. Rest isn't selfish - it's necessary. Your worth isn't determined by your productivity. Be gentle with yourself today. 🌙";
    }
    
    if (message.includes('thank') || message.includes('grateful')) {
      return "It means so much to hear that! Remember, you have the strength within you - I'm just here to remind you of it. You're doing great by taking care of your mental health. 🌟";
    }
    
    // Default supportive responses
    const defaultResponses = [
      "Thank you for sharing that with me. Your feelings matter, and I'm here to listen. Can you tell me more about what's been on your mind? 💚",
      "I appreciate you opening up. That takes courage. How can I best support you right now? 🤗",
      "You're not alone in feeling this way. Many people experience similar emotions. What would feel most helpful to you in this moment? 🌸",
      "I hear you, and your experience is valid. Sometimes just being heard can make a difference. How are you taking care of yourself today? ✨"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: generateAIResponse(inputMessage),
      isUser: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-950/20 p-4 lg:pl-64 pt-20 lg:pt-8">
      <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] lg:h-[calc(100vh-4rem)] flex flex-col">
        
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-wellness">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-700 dark:text-green-300">MindMate</h1>
              <Badge variant="secondary" className="text-xs">AI Emotional Support</Badge>
            </div>
          </div>
        </div>

        {/* Coping Strategies Quick Access */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {copingStrategies.map((strategy, index) => {
              const IconComponent = strategy.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className={cn("gap-2", strategy.bg, "border-0 hover:scale-105 transition-transform")}
                >
                  <IconComponent className={cn("w-4 h-4", strategy.color)} />
                  {strategy.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Chat Messages */}
        <Card className="flex-1 flex flex-col bg-white/70 dark:bg-black/20 backdrop-blur-sm border-0 shadow-wellness">
          <CardContent className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.isUser ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] p-4 rounded-2xl shadow-soft",
                    message.isUser
                      ? "bg-green-600 text-white rounded-br-md"
                      : "bg-white dark:bg-gray-800 text-foreground rounded-bl-md"
                  )}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <span className={cn(
                    "text-xs mt-2 block",
                    message.isUser ? "text-green-100" : "text-muted-foreground"
                  )}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-bl-md shadow-soft">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Message Input */}
          <div className="p-4 border-t bg-white/50 dark:bg-black/10 backdrop-blur-sm">
            <div className="flex gap-2">
              <Input
                placeholder="Share what's on your mind... I'm here to listen 💚"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-white/80 dark:bg-black/20 border-green-200 dark:border-green-800 focus:border-green-400"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-green-600 hover:bg-green-700 shadow-soft"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              💚 This is a safe, confidential space. MindMate is here for emotional support.
            </p>
          </div>
        </Card>
        
      </div>
    </div>
  );
}