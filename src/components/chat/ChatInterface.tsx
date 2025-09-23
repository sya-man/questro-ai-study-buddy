import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Paperclip, Copy, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import TypewriterText from './TypewriterText';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(`session_${Date.now()}`);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      toast({
        title: 'Copied!',
        description: 'Message copied to clipboard.',
      });
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy message.',
        variant: 'destructive',
      });
    }
  };

  // Load messages from localStorage on component mount
  useEffect(() => {
    const chatHistory = JSON.parse(localStorage.getItem('questro_chat_history') || '{}');
    const currentSession = chatHistory[sessionId];
    
    if (currentSession?.messages) {
      setMessages(currentSession.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
    } else {
      // Set welcome message if no previous messages
      const welcomeMessage = {
        id: '1',
        role: 'assistant' as const,
        content: 'Hello! I\'m your AI learning assistant. I can help you with questions, solve problems, and explain concepts in any language. How can I help you today?',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const messageContent = inputValue.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Get or create chat session
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get API key from localStorage
      const apiKey = localStorage.getItem('questro_gemini_api_key');
      if (!apiKey) {
        toast({
          title: 'Error',
          description: 'Please add your Gemini API key in settings first.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      const response = await supabase.functions.invoke('chat-ai', {
        body: { 
          message: messageContent,
          sessionId: sessionId,
          apiKey: apiKey
        }
      });

      if (response.error) throw response.error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date(),
        isTyping: true
      };
      
      setMessages(prev => {
        const finalMessages = [...prev, assistantMessage];
        
        // Save to localStorage
        const chatHistory = JSON.parse(localStorage.getItem('questro_chat_history') || '{}');
        chatHistory[sessionId] = {
          id: sessionId,
          title: `Chat Session ${sessionId.slice(-8)}`,
          messages: finalMessages.map(msg => ({ ...msg, isTyping: false })), // Remove typing state when saving
          lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('questro_chat_history', JSON.stringify(chatHistory));
        
        return finalMessages;
      });
      setIsLoading(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message. Please check your API key in settings.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border/50 p-4 bg-card/50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">AI Chat Assistant</h1>
            <p className="text-sm text-muted-foreground">Ask questions in any language</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-gradient-primary'
                }`}>
                  {message.role === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                <Card className={`p-4 shadow-soft border-border/50 relative group ${
                  message.role === 'user' 
                    ? 'bg-primary/10 border-primary/20' 
                    : 'bg-card'
                }`}>
                  {message.role === 'assistant' && message.isTyping ? (
                    <TypewriterText 
                      text={message.content}
                      onComplete={() => {
                        setMessages(prev => 
                          prev.map(msg => 
                            msg.id === message.id 
                              ? { ...msg, isTyping: false }
                              : msg
                          )
                        );
                      }}
                    />
                  ) : (
                    <p className="text-foreground whitespace-pre-wrap">{message.content}</p>
                  )}
                  
                  {/* Copy Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 h-auto"
                    onClick={() => copyToClipboard(message.content, message.id)}
                  >
                    {copiedMessageId === message.id ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3 text-muted-foreground" />
                    )}
                  </Button>
                  
                  {/* Copy Button Below Text */}
                  <div className="mt-3 pt-2 border-t border-border/30">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => copyToClipboard(message.content, message.id)}
                    >
                      {copiedMessageId === message.id ? (
                        <>
                          <Check className="h-3 w-3 mr-1 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <Card className="p-4 shadow-soft border-border/50">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </Card>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border/50 p-4 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything in any language..."
                className="pr-12"
                disabled={isLoading}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 h-auto"
                onClick={handleFileUpload}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-gradient-primary hover:opacity-90 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => {
              // Handle file upload here
              if (e.target.files?.[0]) {
                toast({
                  title: 'File selected',
                  description: `Selected: ${e.target.files[0].name}`,
                });
              }
            }}
          />
          
          <p className="text-xs text-muted-foreground mt-2">
            Upload PDFs or images to get AI-powered analysis and answers
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;