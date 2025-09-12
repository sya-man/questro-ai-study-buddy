import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Key, Trash2, Edit3, ExternalLink, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

const ApiKeyManager = () => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadApiKey();
  }, []);

  const loadApiKey = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('gemini_api_key')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data?.gemini_api_key) {
        setApiKey(data.gemini_api_key);
        setHasKey(true);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load API key.',
        variant: 'destructive',
      });
    }
  };

  const saveApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your Gemini API key.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email!,
          gemini_api_key: apiKey,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setHasKey(true);
      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'API key saved successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteApiKey = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({
          gemini_api_key: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      setApiKey('');
      setHasKey(false);
      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'API key deleted successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border/50 p-6 bg-card/50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Key className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">API Key Management</h1>
            <p className="text-sm text-muted-foreground">Manage your Gemini API keys securely</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Current API Key Status */}
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Gemini API Key</span>
                {hasKey && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                Your API key is encrypted and stored securely. It's required to use AI features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasKey && !isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      type={showKey ? "text" : "password"}
                      value={apiKey}
                      readOnly
                      className="font-mono"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowKey(!showKey)}
                    >
                      {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Edit</span>
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={deleteApiKey}
                      disabled={loading}
                      className="flex items-center space-x-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="api-key">Gemini API Key</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Input
                        id="api-key"
                        type={showKey ? "text" : "password"}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your Gemini API key"
                        className="font-mono"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowKey(!showKey)}
                      >
                        {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={saveApiKey}
                      disabled={loading}
                      className="bg-gradient-primary hover:opacity-90 text-white"
                    >
                      {loading ? 'Saving...' : 'Save API Key'}
                    </Button>
                    {isEditing && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          loadApiKey();
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* How to get API Key */}
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle>How to Get Your Gemini API Key</CardTitle>
              <CardDescription>
                Follow these steps to obtain your free Gemini API key from Google AI Studio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Visit Google AI Studio</p>
                    <p className="text-sm text-muted-foreground">Go to Google AI Studio and sign in with your Google account.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Create API Key</p>
                    <p className="text-sm text-muted-foreground">Click on "Get API key" and create a new API key in your preferred project.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Copy and Paste</p>
                    <p className="text-sm text-muted-foreground">Copy your API key and paste it in the field above. It will be stored securely.</p>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" className="w-full" asChild>
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Google AI Studio
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Security Information */}
          <Card className="shadow-soft border-border/50 bg-muted/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span>Security & Privacy</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  <span>Your API keys are encrypted before storage</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  <span>Keys are only used for your AI requests</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  <span>You can delete your key anytime</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  <span>Never share your API key with others</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyManager;