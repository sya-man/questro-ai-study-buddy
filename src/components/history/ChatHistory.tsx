import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  History, 
  Search, 
  MessageCircle, 
  FileText, 
  Image, 
  Calendar,
  Trash2,
  Eye,
  Download
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ChatSession {
  id: string;
  title: string;
  type: 'chat' | 'pdf-mcq' | 'image-solver';
  lastMessage: string;
  messageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ChatHistory = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<ChatSession[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const mockSessions: ChatSession[] = [
    {
      id: '1',
      title: 'Biology Chapter 5 Questions',
      type: 'pdf-mcq',
      lastMessage: 'Generated 15 MCQ questions about photosynthesis and cellular respiration',
      messageCount: 8,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2', 
      title: 'Math Problem Solving',
      type: 'image-solver',
      lastMessage: 'Solved quadratic equation and calculus derivatives from your homework',
      messageCount: 12,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      title: 'Chemistry Discussion',
      type: 'chat',
      lastMessage: 'Explained atomic structure and chemical bonding concepts',
      messageCount: 25,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: '4',
      title: 'Physics Formulas Study',
      type: 'chat',
      lastMessage: 'Discussed Newton\'s laws and motion equations with examples',
      messageCount: 18,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
    },
    {
      id: '5',
      title: 'Literature Analysis',
      type: 'pdf-mcq',
      lastMessage: 'Created comprehension questions from Shakespeare\'s Hamlet',
      messageCount: 6,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    }
  ];

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    filterSessions();
  }, [sessions, searchQuery, selectedType]);

  const loadSessions = async () => {
    try {
      // Load chat sessions from localStorage
      const chatHistory = JSON.parse(localStorage.getItem('questro_chat_history') || '{}');
      const mcqHistory = JSON.parse(localStorage.getItem('questro_mcq_history') || '{}');
      const imageHistory = JSON.parse(localStorage.getItem('questro_image_history') || '{}');
      
      const loadedSessions: ChatSession[] = [];
      
      // Load chat sessions
      Object.entries(chatHistory).forEach(([sessionId, data]: [string, any]) => {
        if (data.messages && data.messages.length > 0) {
          const lastMessage = data.messages[data.messages.length - 1];
          loadedSessions.push({
            id: sessionId,
            title: data.title || `Chat Session ${sessionId.slice(-8)}`,
            type: 'chat',
            lastMessage: lastMessage.content.substring(0, 100) + (lastMessage.content.length > 100 ? '...' : ''),
            messageCount: data.messages.length,
            createdAt: new Date(data.messages[0].timestamp),
            updatedAt: new Date(data.lastUpdated || data.messages[data.messages.length - 1].timestamp)
          });
        }
      });
      
      // Load MCQ sessions
      Object.entries(mcqHistory).forEach(([sessionId, data]: [string, any]) => {
        if (data.questions && data.questions.length > 0) {
          loadedSessions.push({
            id: sessionId,
            title: data.title || `MCQ Session ${sessionId.slice(-8)}`,
            type: 'pdf-mcq',
            lastMessage: `Generated ${data.questions.length} MCQ questions`,
            messageCount: data.questions.length,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.lastUpdated || data.createdAt)
          });
        }
      });
      
      // Load image sessions
      Object.entries(imageHistory).forEach(([sessionId, data]: [string, any]) => {
        if (data.solutions && data.solutions.length > 0) {
          const lastSolution = data.solutions[data.solutions.length - 1];
          loadedSessions.push({
            id: sessionId,
            title: data.title || `Image Solution ${sessionId.slice(-8)}`,
            type: 'image-solver',
            lastMessage: lastSolution.solution.substring(0, 100) + (lastSolution.solution.length > 100 ? '...' : ''),
            messageCount: data.solutions.length,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.lastUpdated || data.createdAt)
          });
        }
      });
      
      // Sort by last update date
      loadedSessions.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      
      if (loadedSessions.length > 0) {
        setSessions(loadedSessions);
      } else {
        // If no local data, show the mock data for demonstration
        setSessions(mockSessions);
      }
    } catch (error: any) {
      console.error('Error loading chat history:', error);
      // Fall back to mock data on error
      setSessions(mockSessions);
      toast({
        title: 'Error',
        description: 'Failed to load chat history from local storage. Showing sample data.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterSessions = () => {
    let filtered = sessions;

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(session => session.type === selectedType);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(session => 
        session.title.toLowerCase().includes(query) ||
        session.lastMessage.toLowerCase().includes(query)
      );
    }

    setFilteredSessions(filtered);
  };

  const deleteSession = async (sessionId: string) => {
    try {
      const sessionToDelete = sessions.find(s => s.id === sessionId);
      if (!sessionToDelete) return;
      
      // Delete from appropriate localStorage based on session type
      let storageKey = '';
      switch (sessionToDelete.type) {
        case 'chat':
          storageKey = 'questro_chat_history';
          break;
        case 'pdf-mcq':
          storageKey = 'questro_mcq_history';
          break;
        case 'image-solver':
          storageKey = 'questro_image_history';
          break;
      }
      
      if (storageKey) {
        const history = JSON.parse(localStorage.getItem(storageKey) || '{}');
        delete history[sessionId];
        localStorage.setItem(storageKey, JSON.stringify(history));
      }
      
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      toast({
        title: 'Deleted',
        description: 'Session deleted successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to delete session.',
        variant: 'destructive',
      });
    }
  };

  const exportHistory = () => {
    const data = {
      exported_at: new Date().toISOString(),
      total_sessions: sessions.length,
      sessions: sessions
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `questro-history-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Exported!',
      description: 'Chat history exported successfully.',
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf-mcq':
        return <FileText className="h-4 w-4" />;
      case 'image-solver':
        return <Image className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'pdf-mcq':
        return 'PDF MCQ';
      case 'image-solver':
        return 'Image Solver';
      default:
        return 'Chat';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pdf-mcq':
        return 'bg-blue-100 text-blue-800';
      case 'image-solver':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-purple-100 text-purple-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border/50 p-6 bg-card/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <History className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Chat History</h1>
              <p className="text-sm text-muted-foreground">
                Access all your previous conversations and learning sessions
              </p>
            </div>
          </div>
          <Button onClick={exportHistory} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Filters */}
        <div className="p-6 border-b border-border/50 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={selectedType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('all')}
              >
                All
              </Button>
              <Button
                variant={selectedType === 'chat' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('chat')}
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                Chat
              </Button>
              <Button
                variant={selectedType === 'pdf-mcq' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('pdf-mcq')}
              >
                <FileText className="h-4 w-4 mr-1" />
                PDF
              </Button>
              <Button
                variant={selectedType === 'image-solver' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('image-solver')}
              >
                <Image className="h-4 w-4 mr-1" />
                Image
              </Button>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4 max-w-4xl mx-auto">
            {filteredSessions.length === 0 ? (
              <Card className="shadow-soft border-border/50">
                <CardContent className="p-12 text-center">
                  <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No sessions found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || selectedType !== 'all' 
                      ? 'Try adjusting your search or filters'
                      : 'Start a conversation to see your history here'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredSessions.map((session) => (
                <Card key={session.id} className="shadow-soft border-border/50 hover:shadow-medium transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <CardTitle className="text-base">{session.title}</CardTitle>
                          <Badge className={getTypeColor(session.type)}>
                            <div className="flex items-center space-x-1">
                              {getTypeIcon(session.type)}
                              <span>{getTypeName(session.type)}</span>
                            </div>
                          </Badge>
                        </div>
                        <CardDescription className="line-clamp-2">
                          {session.lastMessage}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{session.messageCount} messages</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{session.updatedAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteSession(session.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ChatHistory;