import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Key, Shield, Zap } from "lucide-react";

const ApiKeyGuide = () => {
  return (
    <section id="api-key" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-primary-glow/20 rounded-full px-4 py-2 mb-6">
              <Key className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">API Setup</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Get Your Gemini API Key
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Follow these simple steps to unlock the full power of Questro with Google's Gemini AI
            </p>
          </div>

          <div className="grid gap-8 mb-12">
            {/* Step Cards */}
            <Card className="p-8 shadow-soft border-border/50">
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-3">Visit Google AI Studio</h3>
                  <p className="text-muted-foreground mb-4">
                    Go to Google AI Studio to access the Gemini API. You'll need a Google account to proceed.
                  </p>
                  <Button className="bg-gradient-primary hover:opacity-90 text-white" size="sm" asChild>
                    <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open AI Studio
                    </a>
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-8 shadow-soft border-border/50">
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-3">Create Your API Key</h3>
                  <p className="text-muted-foreground mb-4">
                    Click on "Get API key" and then "Create API key in new project" or select an existing project.
                  </p>
                  <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
                    <p className="text-sm text-muted-foreground">
                      💡 <strong>Tip:</strong> Keep your API key secure and never share it publicly. 
                      Questro stores it safely in your encrypted account.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 shadow-soft border-border/50">
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-3">Add to Questro</h3>
                  <p className="text-muted-foreground mb-4">
                    Copy your API key and paste it in Questro after signing up. You can edit or delete it anytime from your settings.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center shadow-soft border-border/50">
              <Shield className="h-8 w-8 text-primary mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Secure Storage</h4>
              <p className="text-sm text-muted-foreground">
                Your API keys are encrypted and stored securely in Supabase
              </p>
            </Card>

            <Card className="p-6 text-center shadow-soft border-border/50">
              <Zap className="h-8 w-8 text-primary mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Lightning Fast</h4>
              <p className="text-sm text-muted-foreground">
                Powered by Google's latest Gemini models for instant responses
              </p>
            </Card>

            <Card className="p-6 text-center shadow-soft border-border/50">
              <Key className="h-8 w-8 text-primary mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Easy Management</h4>
              <p className="text-sm text-muted-foreground">
                Add, edit, or delete your API keys anytime from your dashboard
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApiKeyGuide;