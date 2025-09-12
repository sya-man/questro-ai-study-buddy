import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Image, 
  MessageCircle, 
  History, 
  Globe, 
  Smartphone,
  Edit3,
  Trash2,
  Upload
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: FileText,
      title: "PDF to MCQ Generator",
      description: "Upload textbook PDFs and automatically generate comprehensive multiple-choice questions with detailed explanations in any language.",
      highlight: "Smart Analysis"
    },
    {
      icon: Image,
      title: "Question Paper Solver",
      description: "Take photos of question papers and get step-by-step solutions. Works with handwritten and printed questions in multiple languages.",
      highlight: "Visual AI"
    },
    {
      icon: MessageCircle,
      title: "Intelligent Chat Assistant",
      description: "Ask questions and get detailed answers. The AI remembers your conversation history and provides contextual responses.",
      highlight: "Memory Enabled"
    },
    {
      icon: History,
      title: "Chat History",
      description: "Access all your previous conversations, search through your learning history, and continue where you left off.",
      highlight: "Never Lose Context"
    },
    {
      icon: Globe,
      title: "Multilingual Support", 
      description: "Ask questions and receive answers in any language. Perfect for international students and diverse learning environments.",
      highlight: "100+ Languages"
    },
    {
      icon: Smartphone,
      title: "Cross-Platform Access",
      description: "Use Questro seamlessly across all your devices - mobile, tablet, and desktop with synchronized data.",
      highlight: "Responsive Design"
    },
    {
      icon: Edit3,
      title: "API Key Management",
      description: "Easily add, edit, or update your Gemini API keys. Secure storage with encryption ensures your keys are safe.",
      highlight: "Secure & Flexible"
    },
    {
      icon: Upload,
      title: "File Upload Support",
      description: "Support for various file formats including PDF documents and image formats (JPEG, PNG, etc.) for comprehensive learning.",
      highlight: "Multiple Formats"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-secondary">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-primary-glow/20 rounded-full px-4 py-2 mb-6">
              <MessageCircle className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Powerful Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need for
              <span className="bg-gradient-hero bg-clip-text text-transparent"> Smart Learning</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Questro combines cutting-edge AI with intuitive design to transform how you study and learn
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index}
                  className="p-6 shadow-soft hover:shadow-medium transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm group hover:-translate-y-1"
                >
                  <CardHeader className="p-0 pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-xs font-medium text-primary bg-primary-glow/20 px-2 py-1 rounded-full">
                        {feature.highlight}
                      </span>
                    </div>
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;