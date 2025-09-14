import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Plus, 
  Heart, 
  MessageSquare, 
  Shield, 
  ThumbsUp, 
  Send,
  Clock,
  User,
  AlertTriangle,
  Sparkles,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Post {
  id: string;
  content: string;
  topic: string;
  timestamp: Date;
  author: string;
  reactions: {
    hearts: number;
    hugs: number;
    relates: number;
  };
  replies: Reply[];
  isAIModerated?: boolean;
}

interface Reply {
  id: string;
  content: string;
  timestamp: Date;
  author: string;
  isAIMentor?: boolean;
}

export function SafeSpace() {
  const [selectedTopic, setSelectedTopic] = useState('general');
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      content: "Starting college next month and feeling so anxious about making friends. Anyone else feeling like this? How do you put yourself out there when social situations feel overwhelming?",
      topic: 'social-anxiety',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      author: 'anonymous_butterfly',
      reactions: { hearts: 12, hugs: 8, relates: 15 },
      replies: [
        {
          id: '1-1',
          content: "I felt exactly the same way! What helped me was joining just one club related to something I was genuinely interested in. It's easier to talk when you already have something in common. You've got this! 💚",
          timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
          author: 'kind_stranger'
        },
        {
          id: '1-2',
          content: "Your feelings about starting college are completely valid. Many students experience social anxiety during transitions. Consider these gentle steps: arrive a few minutes early to classes, sit near friendly-looking people, and remember that most others are also looking to connect. Small conversations about assignments can naturally grow into friendships. Take it one interaction at a time. 🌱",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          author: 'AI_Mentor',
          isAIMentor: true
        }
      ]
    },
    {
      id: '2', 
      content: "My parents keep asking about my grades and future plans. I know they care but the pressure is making my anxiety worse. How do I talk to them about giving me some space while still showing I'm responsible?",
      topic: 'family-stress',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      author: 'stressed_student_2024',
      reactions: { hearts: 9, hugs: 14, relates: 18 },
      replies: [
        {
          id: '2-1',
          content: "Maybe try having a calm conversation when they're not stressed? I told my parents I'd update them weekly on my progress if they could give me daily space. It worked!",
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          author: 'peaceful_soul'
        }
      ]
    }
  ]);
  
  const [newPost, setNewPost] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const topics = [
    { id: 'general', label: 'General Support', count: 24, color: 'bg-blue-100 text-blue-700' },
    { id: 'anxiety', label: 'Anxiety & Stress', count: 18, color: 'bg-purple-100 text-purple-700' },
    { id: 'social-anxiety', label: 'Social Situations', count: 15, color: 'bg-green-100 text-green-700' },
    { id: 'family-stress', label: 'Family & Home', count: 12, color: 'bg-orange-100 text-orange-700' },
    { id: 'school-pressure', label: 'School & Academic', count: 21, color: 'bg-red-100 text-red-700' },
    { id: 'identity', label: 'Identity & Self', count: 9, color: 'bg-pink-100 text-pink-700' },
    { id: 'relationships', label: 'Relationships', count: 16, color: 'bg-yellow-100 text-yellow-700' }
  ];

  const generateAnonymousName = () => {
    const adjectives = ['kind', 'brave', 'gentle', 'strong', 'peaceful', 'hopeful', 'caring', 'wise'];
    const nouns = ['soul', 'heart', 'spirit', 'friend', 'warrior', 'dreamer', 'helper', 'light'];
    const randomNum = Math.floor(Math.random() * 999) + 100;
    
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    
    return `${adj}_${noun}_${randomNum}`;
  };

  const generateAIMentorResponse = (postContent: string): string => {
    const content = postContent.toLowerCase();
    
    if (content.includes('anxiety') || content.includes('anxious') || content.includes('worried')) {
      return "Your anxiety is a natural response to challenging situations. Remember that anxiety often comes from caring deeply about outcomes. Try grounding yourself in the present moment: notice 3 things you can see, 2 you can hear, and 1 you can touch. You're stronger than your anxiety, and this feeling will pass. 🌸";
    }
    
    if (content.includes('family') || content.includes('parents') || content.includes('home')) {
      return "Family dynamics can be complex, especially during times of growth and change. Consider having an open, honest conversation when everyone is calm. Use 'I' statements to express your feelings without blame. Remember, healthy boundaries are a sign of maturity, not rebellion. 💚";
    }
    
    if (content.includes('friend') || content.includes('social') || content.includes('lonely')) {
      return "Building connections takes time and courage. Start small - a smile, a kind comment, or asking about someone's day. Authentic friendships often form around shared interests or values. Remember, quality matters more than quantity in relationships. You deserve meaningful connections. ✨";
    }
    
    if (content.includes('school') || content.includes('grade') || content.includes('academic')) {
      return "Academic pressure can feel overwhelming, but remember that your worth isn't determined by grades alone. Break large tasks into smaller steps, celebrate progress, and don't hesitate to ask for help when needed. Learning is a journey, not a destination. 📚";
    }
    
    return "Thank you for sharing this with our community. Your vulnerability helps others feel less alone. Remember that seeking support shows strength, and you're taking positive steps for your wellbeing. Every small step forward matters. 🌟";
  };

  const handleNewPost = () => {
    if (!newPost.trim()) return;

    const post: Post = {
      id: Date.now().toString(),
      content: newPost,
      topic: selectedTopic,
      timestamp: new Date(),
      author: generateAnonymousName(),
      reactions: { hearts: 0, hugs: 0, relates: 0 },
      replies: []
    };

    setPosts(prev => [post, ...prev]);
    setNewPost('');
    setShowNewPostForm(false);

    // Simulate AI mentor response after delay
    setTimeout(() => {
      const aiReply: Reply = {
        id: `${post.id}-ai`,
        content: generateAIMentorResponse(newPost),
        timestamp: new Date(),
        author: 'AI_Mentor',
        isAIMentor: true
      };

      setPosts(prev => prev.map(p => 
        p.id === post.id 
          ? { ...p, replies: [...p.replies, aiReply] }
          : p
      ));
    }, 2000 + Math.random() * 3000);
  };

  const handleReply = (postId: string) => {
    if (!replyText.trim()) return;

    const reply: Reply = {
      id: `${postId}-${Date.now()}`,
      content: replyText,
      timestamp: new Date(),
      author: generateAnonymousName()
    };

    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, replies: [...post.replies, reply] }
        : post
    ));

    setReplyText('');
    setReplyingTo(null);
  };

  const addReaction = (postId: string, reactionType: 'hearts' | 'hugs' | 'relates') => {
    setPosts(prev => prev.map(post => 
      post.id === postId
        ? {
            ...post,
            reactions: {
              ...post.reactions,
              [reactionType]: post.reactions[reactionType] + 1
            }
          }
        : post
    ));
  };

  const filteredPosts = selectedTopic === 'general' 
    ? posts 
    : posts.filter(post => post.topic === selectedTopic);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950/30 dark:to-amber-950/20 p-4 lg:pl-64 pt-20 lg:pt-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-wellness">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-orange-700 dark:text-orange-300">SafeSpace</h1>
              <Badge variant="secondary" className="text-xs">Anonymous Community</Badge>
            </div>
          </div>
          <p className="text-orange-600 dark:text-orange-400 max-w-2xl mx-auto">
            A safe, anonymous space to share experiences and find peer support. 
            AI moderation ensures a positive, supportive environment.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Sidebar - Topics */}
          <div className="lg:col-span-1">
            <Card className="bg-white/70 dark:bg-black/20 backdrop-blur-sm border-0 shadow-wellness sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Support Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {topics.map((topic) => (
                  <Button
                    key={topic.id}
                    variant={selectedTopic === topic.id ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-between h-auto p-3",
                      selectedTopic === topic.id && "bg-orange-600 hover:bg-orange-700"
                    )}
                    onClick={() => setSelectedTopic(topic.id)}
                  >
                    <span className="text-left">
                      <div className="font-medium text-sm">{topic.label}</div>
                    </span>
                    <Badge variant="secondary" className={cn("text-xs", topic.color)}>
                      {topic.count}
                    </Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* New Post Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-orange-700 dark:text-orange-300">
                {topics.find(t => t.id === selectedTopic)?.label || 'All Topics'}
              </h2>
              <Button 
                onClick={() => setShowNewPostForm(true)}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Share Your Experience
              </Button>
            </div>

            {/* New Post Form */}
            {showNewPostForm && (
              <Card className="bg-white/70 dark:bg-black/20 backdrop-blur-sm border-0 shadow-wellness">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-orange-600" />
                    Share Anonymously
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Share what's on your mind... You're in a safe space here."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="min-h-[100px] bg-white/50 dark:bg-black/10"
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="w-4 h-4" />
                      <span>Posted as: {generateAnonymousName()}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setShowNewPostForm(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleNewPost} className="bg-orange-600 hover:bg-orange-700">
                        <Send className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Posts Feed */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="bg-white/70 dark:bg-black/20 backdrop-blur-sm border-0 shadow-soft">
                  <CardContent className="p-6">
                    
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{post.author}</div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {post.timestamp.toLocaleDateString()} at {post.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {topics.find(t => t.id === post.topic)?.label}
                      </Badge>
                    </div>

                    {/* Post Content */}
                    <p className="text-sm leading-relaxed mb-4">{post.content}</p>

                    {/* Reactions */}
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => addReaction(post.id, 'hearts')}
                      >
                        <Heart className="w-4 h-4" />
                        <span>{post.reactions.hearts}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => addReaction(post.id, 'hugs')}
                      >
                        🤗 <span>{post.reactions.hugs}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => addReaction(post.id, 'relates')}
                      >
                        💚 <span>{post.reactions.relates}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 ml-auto"
                        onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                      >
                        <MessageSquare className="w-4 h-4" />
                        Reply
                      </Button>
                    </div>

                    {/* Replies */}
                    {post.replies.length > 0 && (
                      <div className="space-y-3">
                        {post.replies.map((reply) => (
                          <div key={reply.id} className={cn(
                            "pl-4 border-l-2 border-orange-200 dark:border-orange-800",
                            reply.isAIMentor && "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-3 rounded-r-lg border-l-orange-400"
                          )}>
                            <div className="flex items-center gap-2 mb-2">
                              <div className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                                reply.isAIMentor 
                                  ? "bg-gradient-to-br from-orange-500 to-amber-600 text-white"
                                  : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                              )}>
                                {reply.isAIMentor ? <Sparkles className="w-3 h-3" /> : <User className="w-3 h-3" />}
                              </div>
                              <span className={cn(
                                "font-medium text-xs",
                                reply.isAIMentor && "text-orange-700 dark:text-orange-300"
                              )}>
                                {reply.author}
                                {reply.isAIMentor && <Badge variant="secondary" className="ml-2 text-xs">AI Mentor</Badge>}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {reply.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Form */}
                    {replyingTo === post.id && (
                      <div className="mt-4 pt-4 border-t space-y-3">
                        <Textarea
                          placeholder="Share your supportive thoughts..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="bg-white/50 dark:bg-black/10"
                        />
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>
                            Cancel
                          </Button>
                          <Button size="sm" onClick={() => handleReply(post.id)} className="bg-orange-600 hover:bg-orange-700">
                            Reply
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Community Guidelines */}
        <Card className="bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 border border-orange-200 dark:border-orange-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-200 dark:bg-orange-800 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-orange-600 dark:text-orange-300" />
              </div>
              <div>
                <h3 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">
                  Community Guidelines
                </h3>
                <div className="text-sm text-orange-600 dark:text-orange-400 space-y-1">
                  <p>• Be kind, supportive, and respectful to all community members</p>
                  <p>• Share experiences, not advice (unless specifically asked)</p>
                  <p>• Maintain anonymity - don't share personal identifying information</p>
                  <p>• AI moderation actively monitors for harmful content and safety concerns</p>
                  <p>• If you're in crisis, please contact emergency services or a trusted adult immediately</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
      </div>
    </div>
  );
}