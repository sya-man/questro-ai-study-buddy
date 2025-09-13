import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Image, MessageCircle, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-screen pt-24 pb-16 bg-gradient-secondary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-primary-glow/20 rounded-full px-4 py-2 mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Education</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            Transform Your
            <span className="bg-gradient-hero bg-clip-text text-transparent"> Learning</span>
            <br />
            Experience
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Convert textbook PDFs into interactive MCQs, solve question papers with AI, 
            and get instant answers in any language. Your personal AI tutor is here.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-white shadow-medium px-8 py-6 text-lg" asChild>
              <Link to="/app">Start Learning Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/5 px-8 py-6 text-lg">
              Watch Demo
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 bg-card/80 backdrop-blur-sm shadow-soft hover:shadow-medium transition-all duration-300 border-border/50">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 mx-auto">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">PDF to MCQs</h3>
              <p className="text-muted-foreground text-sm">
                Upload your textbook PDFs and instantly generate comprehensive multiple-choice questions
              </p>
            </Card>

            <Card className="p-6 bg-card/80 backdrop-blur-sm shadow-soft hover:shadow-medium transition-all duration-300 border-border/50">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Image className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Image Solver</h3>
              <p className="text-muted-foreground text-sm">
                Take photos of question papers and get detailed solutions in any language
              </p>
            </Card>

            <Card className="p-6 bg-card/80 backdrop-blur-sm shadow-soft hover:shadow-medium transition-all duration-300 border-border/50">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 mx-auto">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Chat</h3>
              <p className="text-muted-foreground text-sm">
                Multilingual AI assistant that remembers your conversation history
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;