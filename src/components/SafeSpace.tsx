import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, MessageCircle, Users, Shield, Plus, ChevronRight, Send, User } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Database types
interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  display_name: string | null;
}

interface Post {
  id: string;
  content: string;
  topic: string;
  user_id: string;
  is_anonymous: boolean;
  anonymous_name: string | null;
  hearts: number;
  hugs: number;
  relates: number;
  created_at: string;
  profiles?: Profile;
  replies?: Reply[];
  user_reactions?: { reaction_type: string }[];
}

interface Reply {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  is_anonymous: boolean;
  anonymous_name: string | null;
  is_ai_mentor: boolean;
  created_at: string;
  profiles?: Profile;
}

export const SafeSpace = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [newPost, setNewPost] = useState({ content: '', topic: 'general' });
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Fetch posts with replies and user reactions
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles(username, display_name),
          replies(
            *,
            profiles(username, display_name)
          ),
          post_reactions(reaction_type)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const topics = [
    { id: 'all', label: 'All Topics', count: posts?.length || 0 },
    { id: 'anxiety', label: 'Anxiety & Stress', count: posts?.filter(p => p.topic === 'anxiety').length || 0 },
    { id: 'depression', label: 'Depression', count: posts?.filter(p => p.topic === 'depression').length || 0 },
    { id: 'relationships', label: 'Relationships', count: posts?.filter(p => p.topic === 'relationships').length || 0 },
    { id: 'grief', label: 'Grief & Loss', count: posts?.filter(p => p.topic === 'grief').length || 0 },
    { id: 'recovery', label: 'Recovery Journey', count: posts?.filter(p => p.topic === 'recovery').length || 0 },
    { id: 'general', label: 'General Support', count: posts?.filter(p => p.topic === 'general').length || 0 },
  ];

  const generateAnonymousName = () => {
    const adjectives = ['Gentle', 'Brave', 'Kind', 'Strong', 'Peaceful', 'Wise', 'Caring', 'Silent', 'Bright', 'Hope'];
    const nouns = ['River', 'Mountain', 'Star', 'Ocean', 'Moon', 'Sun', 'Tree', 'Bird', 'Butterfly', 'Walker'];
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
  };

  // Create new post mutation
  const createPostMutation = useMutation({
    mutationFn: async (postData: { content: string; topic: string; is_anonymous: boolean; anonymous_name?: string }) => {
      if (!user) throw new Error('Must be logged in');
      
      const { data, error } = await supabase
        .from('posts')
        .insert([{
          user_id: user.id,
          content: postData.content,
          topic: postData.topic,
          is_anonymous: postData.is_anonymous,
          anonymous_name: postData.anonymous_name
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setNewPost({ content: '', topic: 'general' });
      setShowNewPostForm(false);
      toast.success('Your story has been shared');
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  // Create reply mutation
  const createReplyMutation = useMutation({
    mutationFn: async (replyData: { post_id: string; content: string; is_anonymous: boolean; anonymous_name?: string }) => {
      if (!user) throw new Error('Must be logged in');
      
      const { data, error } = await supabase
        .from('replies')
        .insert([{
          post_id: replyData.post_id,
          user_id: user.id,
          content: replyData.content,
          is_anonymous: replyData.is_anonymous,
          anonymous_name: replyData.anonymous_name,
          is_ai_mentor: false
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setReplyText('');
      setReplyingTo(null);
      toast.success('Reply sent');
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  // Toggle reaction mutation
  const toggleReactionMutation = useMutation({
    mutationFn: async ({ postId, reactionType }: { postId: string; reactionType: 'hearts' | 'hugs' | 'relates' }) => {
      if (!user) throw new Error('Must be logged in');
      
      // Check if user already has this reaction
      const { data: existing } = await supabase
        .from('post_reactions')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .eq('reaction_type', reactionType)
        .single();
      
      if (existing) {
        // Remove reaction
        const { error } = await supabase
          .from('post_reactions')
          .delete()
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        // Add reaction
        const { error } = await supabase
          .from('post_reactions')
          .insert([{
            post_id: postId,
            user_id: user.id,
            reaction_type: reactionType
          }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const handleNewPost = () => {
    if (!newPost.content.trim() || !user) return;
    
    const anonymousName = isAnonymous ? generateAnonymousName() : undefined;
    
    createPostMutation.mutate({
      content: newPost.content,
      topic: newPost.topic,
      is_anonymous: isAnonymous,
      anonymous_name: anonymousName
    });
  };

  const handleReply = (postId: string) => {
    if (!replyText.trim() || !user) return;
    
    const anonymousName = isAnonymous ? generateAnonymousName() : undefined;
    
    createReplyMutation.mutate({
      post_id: postId,
      content: replyText,
      is_anonymous: isAnonymous,
      anonymous_name: anonymousName
    });
  };

  const addReaction = (postId: string, reactionType: 'hearts' | 'hugs' | 'relates') => {
    if (!user) {
      toast.error('Please sign in to react to posts');
      return;
    }
    toggleReactionMutation.mutate({ postId, reactionType });
  };

  const filteredPosts = selectedTopic === 'all' ? posts : posts.filter(post => post.topic === selectedTopic);

  const getAuthorName = (post: Post | Reply) => {
    if (post.is_anonymous) {
      return post.anonymous_name || 'Anonymous';
    }
    return post.profiles?.display_name || post.profiles?.username || 'User';
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">SafeSpace</h2>
            <p className="text-muted-foreground mb-4">
              Please sign in to access our community support space
            </p>
            <Button onClick={() => window.location.href = '/auth'}>
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="animate-pulse">Loading community posts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                SafeSpace
              </h1>
              <Badge variant="secondary" className="mt-1">Anonymous Community</Badge>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Share your experiences and find support in our safe, anonymous community. 
            Connect with others who understand your journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Topics */}
          <Card className="lg:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Support Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {topics.map((topic) => (
                <Button
                  key={topic.id}
                  variant={selectedTopic === topic.id ? "default" : "outline"}
                  className="w-full justify-between"
                  onClick={() => setSelectedTopic(topic.id)}
                >
                  <span>{topic.label}</span>
                  <Badge variant="secondary">{topic.count}</Badge>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* New Post Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {topics.find(t => t.id === selectedTopic)?.label || 'Community Posts'}
              </h2>
              <Button onClick={() => setShowNewPostForm(true)} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Share Your Story
              </Button>
            </div>

            {/* New Post Form */}
            {showNewPostForm && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Share Your Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic</Label>
                    <Select value={newPost.topic} onValueChange={(value) => setNewPost(prev => ({ ...prev, topic: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Support</SelectItem>
                        <SelectItem value="anxiety">Anxiety & Stress</SelectItem>
                        <SelectItem value="depression">Depression</SelectItem>
                        <SelectItem value="relationships">Relationships</SelectItem>
                        <SelectItem value="grief">Grief & Loss</SelectItem>
                        <SelectItem value="recovery">Recovery Journey</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="content">Your Story</Label>
                    <Textarea
                      id="content"
                      placeholder="Share what's on your mind... You're in a safe space."
                      value={newPost.content}
                      onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                      className="min-h-[120px]"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="anonymous"
                      checked={isAnonymous}
                      onCheckedChange={setIsAnonymous}
                    />
                    <Label htmlFor="anonymous" className="text-sm">
                      Post anonymously ({isAnonymous ? 'Will show as anonymous' : 'Will show your name'})
                    </Label>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowNewPostForm(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleNewPost} disabled={!newPost.content.trim()}>
                      <Send className="w-4 h-4 mr-2" />
                      Share Story
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Posts Feed */}
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Post Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{getAuthorName(post)}</div>
                          <div className="text-xs text-muted-foreground">{formatTimeAgo(post.created_at)}</div>
                        </div>
                        <Badge variant="outline" className="ml-auto">
                          {topics.find(t => t.id === post.topic)?.label}
                        </Badge>
                      </div>

                      {/* Post Content */}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>

                      {/* Reactions */}
                      <div className="flex items-center gap-4 pt-4 border-t">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 hover:bg-red-50 hover:text-red-600"
                          onClick={() => addReaction(post.id, 'hearts')}
                        >
                          <Heart className="w-4 h-4" />
                          <span>{post.hearts}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 hover:bg-blue-50 hover:text-blue-600"
                          onClick={() => addReaction(post.id, 'hugs')}
                        >
                          🤗 <span>{post.hugs}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 hover:bg-green-50 hover:text-green-600"
                          onClick={() => addReaction(post.id, 'relates')}
                        >
                          💚 <span>{post.relates}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 ml-auto"
                          onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                        >
                          <MessageCircle className="w-4 h-4" />
                          Reply
                        </Button>
                      </div>

                      {/* Replies */}
                      {post.replies && post.replies.length > 0 && (
                        <div className="mt-4 space-y-3">
                          <div className="text-sm font-medium text-muted-foreground">
                            {post.replies.length} {post.replies.length === 1 ? 'Reply' : 'Replies'}
                          </div>
                          {post.replies.map((reply) => (
                            <div key={reply.id} className="bg-muted/50 rounded-lg p-3 ml-4">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                                  <User className="w-3 h-3 text-primary" />
                                </div>
                                <span className={`text-xs font-medium ${reply.is_ai_mentor ? 'text-purple-600' : 'text-foreground'}`}>
                                  {getAuthorName(reply)}
                                </span>
                                {reply.is_ai_mentor && (
                                  <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                                    AI Mentor
                                  </Badge>
                                )}
                                <span className="text-xs text-muted-foreground">{formatTimeAgo(reply.created_at)}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Form */}
                      {replyingTo === post.id && (
                        <div className="mt-4 space-y-3 p-4 bg-muted/30 rounded-lg">
                          <Textarea
                            placeholder="Share your thoughts or offer support..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="min-h-[80px]"
                          />
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`reply-anonymous-${post.id}`}
                                checked={isAnonymous}
                                onCheckedChange={setIsAnonymous}
                              />
                              <Label htmlFor={`reply-anonymous-${post.id}`} className="text-xs">
                                Reply anonymously
                              </Label>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setReplyingTo(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleReply(post.id)}
                                disabled={!replyText.trim()}
                              >
                                <Send className="w-3 h-3 mr-2" />
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredPosts.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Be the first to share your story in this topic
                    </p>
                    <Button onClick={() => setShowNewPostForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Post
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Community Guidelines */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Community Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-medium text-foreground mb-2">Be Kind & Supportive</h4>
              <p>Treat others with empathy and respect. We're all here to support each other.</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Stay Anonymous</h4>
              <p>Protect your privacy and others'. Avoid sharing identifying information.</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Seek Professional Help</h4>
              <p>This is peer support, not professional therapy. Reach out to professionals when needed.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};