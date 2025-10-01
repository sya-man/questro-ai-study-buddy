import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ApiKeyGuide from "@/components/ApiKeyGuide";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Github, Twitter, MessageCircle, FileText, Image, Upload, Send, Check } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started with Questro in minutes. Here's a step-by-step guide to using all features.
            </p>
          </div>

          <div className="space-y-16 max-w-5xl mx-auto">
            {/* Smart Chat Guide */}
            <Card className="p-8 bg-card border-border/50 shadow-soft">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Smart Chat Assistant</h3>
              </div>
              <div className="space-y-4 ml-16">
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
                  <p className="text-muted-foreground">Navigate to the Chat tab from the dashboard</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
                  <p className="text-muted-foreground">Type your question in any language (English, Bengali, etc.)</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
                  <p className="text-muted-foreground">Press Send and watch the AI respond with smooth typing animation</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">4</div>
                  <p className="text-muted-foreground">Use the copy button under any message to save answers</p>
                </div>
              </div>
            </Card>

            {/* PDF to MCQ Guide */}
            <Card className="p-8 bg-card border-border/50 shadow-soft">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">PDF to MCQ Generator</h3>
              </div>
              <div className="space-y-4 ml-16">
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
                  <p className="text-muted-foreground">Click on the "PDF MCQ" tab in the sidebar</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
                  <p className="text-muted-foreground">Upload your textbook or study material PDF file</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
                  <p className="text-muted-foreground">Click "Generate MCQs" and wait while AI analyzes your PDF</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">4</div>
                  <p className="text-muted-foreground">Review the generated multiple-choice questions with explanations</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">5</div>
                  <p className="text-muted-foreground">Select answers and check your knowledge instantly</p>
                </div>
              </div>
            </Card>

            {/* Image Solver Guide */}
            <Card className="p-8 bg-card border-border/50 shadow-soft">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Image className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Image Question Solver</h3>
              </div>
              <div className="space-y-4 ml-16">
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
                  <p className="text-muted-foreground">Go to the "Image Solver" tab in your dashboard</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
                  <p className="text-muted-foreground">Upload a photo of your question paper or homework</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
                  <p className="text-muted-foreground">Select your preferred language for the solution</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">4</div>
                  <p className="text-muted-foreground">Click "Solve" and get detailed step-by-step solutions</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Don't have a Gemini API key yet?
            </p>
            <Button variant="outline" asChild>
              <a href="#api-key">Get Your Free API Key</a>
            </Button>
          </div>
        </div>
      </section>

      <ApiKeyGuide />
      
      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
        <div className="container mx-auto px-4 lg:px-6 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of students already using Questro to ace their studies with AI-powered assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/app">
              <Button size="lg" variant="secondary" className="px-8 py-6 text-lg shadow-large">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t border-border/50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Q</span>
              </div>
              <span className="font-bold text-xl text-foreground">Questro</span>
            </div>
            
            <div className="flex items-center space-x-6 text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
            </div>

            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border/50 text-center">
            <p className="text-muted-foreground flex items-center justify-center gap-1">
              Made by SYA Zone
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;