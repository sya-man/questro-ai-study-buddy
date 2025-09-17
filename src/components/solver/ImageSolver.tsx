import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Image, Upload, Camera, Copy, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Solution {
  question: string;
  steps: string[];
  final_answer: string;
  explanation: string;
}

const ImageSolver = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi',
    'Bengali', 'Urdu', 'Turkish', 'Dutch', 'Swedish', 'Norwegian'
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
      // Convert image to base64
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = document.createElement('img');
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = imagePreview!;
      });

      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);

      // Call Supabase Edge Function to solve questions
      const response = await supabase.functions.invoke('solve-image', {
        body: { 
          imageData: imageData,
          language: selectedLanguage
        }
      });

      if (response.error) throw response.error;

      const solutions = response.data.solutions || [];
      setSolutions(solutions);
      
      // Save to localStorage
      const sessionId = `image_${Date.now()}`;
      const imageHistory = JSON.parse(localStorage.getItem('questro_image_history') || '{}');
      imageHistory[sessionId] = {
        id: sessionId,
        title: `${selectedLanguage} Image Solutions`,
        solutions: solutions,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('questro_image_history', JSON.stringify(imageHistory));
      
      toast({
        title: 'Questions Solved!',
        description: `Found and solved ${solutions.length || 0} questions in the image.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to solve questions. Please check your API key in settings.',
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

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border/50 p-6 bg-card/50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Camera className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Image Question Solver</h1>
            <p className="text-sm text-muted-foreground">Upload images of questions and get step-by-step solutions</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Upload Section */}
          <Card className="shadow-soft border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5 text-primary" />
                <span>Upload Image</span>
              </CardTitle>
              <CardDescription>
                Upload an image of your question paper, homework, or any academic problem
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <div className="space-y-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-h-48 mx-auto rounded-lg shadow-md"
                    />
                    <p className="font-medium">{image?.name}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Image className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="font-medium">Click to upload image</p>
                    <p className="text-sm text-muted-foreground">
                      Supports PNG, JPG, WEBP formats
                    </p>
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Language Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Solution Language</label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {image && (
                <div className="flex justify-center space-x-2">
                  <Button
                    onClick={solveQuestions}
                    disabled={isProcessing}
                    className="bg-gradient-primary hover:opacity-90 text-white"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {isProcessing ? 'Solving...' : 'Solve Questions'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change Image
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Processing Indicator */}
          {isProcessing && (
            <Card className="shadow-soft border-border/50">
              <CardContent className="p-6 text-center">
                <div className="space-y-4">
                  <Sparkles className="h-8 w-8 text-primary animate-spin mx-auto" />
                  <p className="font-medium">Analyzing image and solving questions...</p>
                  <p className="text-sm text-muted-foreground">
                    AI is processing the image and generating step-by-step solutions
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Solutions */}
          {solutions.length > 0 && (
            <Card className="shadow-soft border-border/50">
              <CardHeader>
                <CardTitle>Solutions Found</CardTitle>
                <CardDescription>
                  {solutions.length} question(s) solved from your image
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {solutions.map((solution, index) => (
                  <div key={index} className="space-y-4 p-4 border border-border/50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-2 flex-1">
                        <span className="bg-primary text-white text-sm px-2 py-1 rounded font-medium">
                          Q{index + 1}
                        </span>
                        <h3 className="font-medium text-foreground flex-1">
                          {solution.question}
                        </h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(
                          `Question: ${solution.question}\n\nSteps:\n${solution.steps.join('\n')}\n\nAnswer: ${solution.final_answer}\n\nExplanation: ${solution.explanation}`
                        )}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="ml-8 space-y-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Step-by-step solution:</p>
                        <ol className="list-decimal list-inside space-y-1">
                          {solution.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="text-sm">{step}</li>
                          ))}
                        </ol>
                      </div>
                      
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-medium text-green-800 mb-1">Final Answer:</p>
                        <p className="text-sm text-green-700 font-mono">{solution.final_answer}</p>
                      </div>
                      
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Explanation:</p>
                        <p className="text-sm">{solution.explanation}</p>
                      </div>
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