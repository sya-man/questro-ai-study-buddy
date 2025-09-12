import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Image, Upload, Camera, Zap, Copy, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Solution {
  question: string;
  steps: string[];
  answer: string;
  explanation: string;
}

const ImageSolver = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [language, setLanguage] = useState('en');
  const [isProcessing, setIsProcessing] = useState(false);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ar', name: 'Arabic' },
  ];

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      toast({
        title: 'Image selected',
        description: `Selected: ${file.name}`,
      });
    } else {
      toast({
        title: 'Invalid file',
        description: 'Please select an image file (PNG, JPG, etc.)',
        variant: 'destructive',
      });
    }
  };

  const solveQuestions = async () => {
    if (!image) return;

    setIsProcessing(true);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock solutions based on detected questions
      const mockSolutions: Solution[] = [
        {
          question: "Solve: 2x + 5 = 13",
          steps: [
            "Start with the equation: 2x + 5 = 13",
            "Subtract 5 from both sides: 2x + 5 - 5 = 13 - 5",
            "Simplify: 2x = 8",
            "Divide both sides by 2: x = 8 ÷ 2",
            "Final answer: x = 4"
          ],
          answer: "x = 4",
          explanation: "This is a linear equation. We isolate x by performing inverse operations on both sides of the equation."
        },
        {
          question: "Find the derivative of f(x) = 3x² + 2x - 1",
          steps: [
            "Apply the power rule to each term",
            "For 3x²: d/dx(3x²) = 3 × 2x = 6x",
            "For 2x: d/dx(2x) = 2",
            "For -1: d/dx(-1) = 0",
            "Combine all terms: f'(x) = 6x + 2"
          ],
          answer: "f'(x) = 6x + 2",
          explanation: "Using the power rule for differentiation: d/dx(xⁿ) = nxⁿ⁻¹"
        }
      ];

      setSolutions(mockSolutions);
      
      toast({
        title: 'Success!',
        description: `Found and solved ${mockSolutions.length} questions in the image.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process image. Please make sure you have configured your Gemini API key.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Solution copied to clipboard.',
    });
  };

  const exportSolutions = () => {
    const data = {
      image_name: image?.name,
      processed_at: new Date().toISOString(),
      language: language,
      solutions: solutions
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solutions-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Exported!',
      description: 'Solutions exported successfully.',
    });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border/50 p-6 bg-card/50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Image className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Image Question Solver</h1>
            <p className="text-sm text-muted-foreground">Upload question papers and get detailed solutions in any language</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Upload Section */}
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="h-5 w-5 text-primary" />
                <span>Upload Question Image</span>
              </CardTitle>
              <CardDescription>
                Take a photo or upload an image of questions, and AI will solve them step by step
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Image Upload Area */}
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className="space-y-2">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-h-32 mx-auto rounded-lg object-contain"
                      />
                      <p className="text-sm text-muted-foreground">
                        {image?.name}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                      <p className="font-medium">Click to upload image</p>
                      <p className="text-sm text-muted-foreground">
                        Supports JPG, PNG, WebP
                      </p>
                    </div>
                  )}
                </div>

                {/* Settings */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Solution Language
                    </label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {image && (
                    <div className="space-y-2">
                      <Button
                        onClick={solveQuestions}
                        disabled={isProcessing}
                        className="w-full bg-gradient-primary hover:opacity-90 text-white"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        {isProcessing ? 'Solving Questions...' : 'Solve Questions'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full"
                      >
                        Change Image
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </CardContent>
          </Card>

          {/* Processing Indicator */}
          {isProcessing && (
            <Card className="shadow-soft border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <div>
                    <p className="font-medium">AI is analyzing your image...</p>
                    <p className="text-sm text-muted-foreground">Detecting questions and generating step-by-step solutions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Solutions */}
          {solutions.length > 0 && (
            <Card className="shadow-soft border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Question Solutions</CardTitle>
                    <CardDescription>
                      Found {solutions.length} questions with detailed solutions
                    </CardDescription>
                  </div>
                  <Button onClick={exportSolutions} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {solutions.map((solution, index) => (
                  <div key={index} className="space-y-4 p-6 border border-border/50 rounded-lg bg-card/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="bg-primary text-white text-sm px-2 py-1 rounded font-medium">
                            Q{index + 1}
                          </span>
                          <h3 className="font-medium text-foreground">
                            {solution.question}
                          </h3>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(
                          `Question: ${solution.question}\n\nSteps:\n${solution.steps.join('\n')}\n\nAnswer: ${solution.answer}\n\nExplanation: ${solution.explanation}`
                        )}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Solution Steps */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground">Solution Steps:</h4>
                      <ol className="space-y-2">
                        {solution.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start space-x-3">
                            <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded font-medium min-w-[24px] text-center">
                              {stepIndex + 1}
                            </span>
                            <span className="text-sm">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Final Answer */}
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-primary">Final Answer:</span>
                        <span className="font-mono font-medium">{solution.answer}</span>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Explanation:</p>
                      <p className="text-sm">{solution.explanation}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageSolver;