import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FileText, Upload, Download, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MCQQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const PdfMcqGenerator = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      toast({
        title: 'File selected',
        description: `Selected: ${selectedFile.name}`,
      });
    } else {
      toast({
        title: 'Invalid file',
        description: 'Please select a PDF file.',
        variant: 'destructive',
      });
    }
  };

  const generateMCQs = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate processing with progress updates
      const intervals = [20, 40, 60, 80, 100];
      
      for (let i = 0; i < intervals.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProgress(intervals[i]);
      }

      // Mock generated questions
      const mockQuestions: MCQQuestion[] = [
        {
          question: "What is the primary function of mitochondria in a cell?",
          options: [
            "Protein synthesis",
            "Energy production (ATP synthesis)", 
            "DNA replication",
            "Waste removal"
          ],
          correctAnswer: 1,
          explanation: "Mitochondria are known as the powerhouse of the cell because they produce ATP through cellular respiration."
        },
        {
          question: "Which of the following best describes photosynthesis?",
          options: [
            "The process of breaking down glucose",
            "The conversion of light energy into chemical energy",
            "The transport of nutrients in plants",
            "The reproduction process in plants"
          ],
          correctAnswer: 1,
          explanation: "Photosynthesis converts light energy from the sun into chemical energy stored in glucose molecules."
        },
        {
          question: "What is the basic unit of heredity?",
          options: [
            "Chromosome",
            "DNA",
            "Gene",
            "Protein"
          ],
          correctAnswer: 2,
          explanation: "A gene is the basic unit of heredity, containing instructions for specific traits."
        }
      ];

      setQuestions(mockQuestions);
      setSelectedAnswers(new Array(mockQuestions.length).fill(-1));
      
      toast({
        title: 'Success!',
        description: `Generated ${mockQuestions.length} MCQ questions from your PDF.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process PDF. Please make sure you have configured your Gemini API key.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const exportQuestions = () => {
    const data = {
      filename: file?.name,
      generated_at: new Date().toISOString(),
      questions: questions.map((q, index) => ({
        ...q,
        userAnswer: selectedAnswers[index],
        isCorrect: selectedAnswers[index] === q.correctAnswer
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mcq-${file?.name?.replace('.pdf', '')}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Exported!',
      description: 'MCQ questions exported successfully.',
    });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border/50 p-6 bg-card/50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">PDF to MCQ Generator</h1>
            <p className="text-sm text-muted-foreground">Convert your textbook PDFs into interactive multiple-choice questions</p>
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
                <span>Upload PDF</span>
              </CardTitle>
              <CardDescription>
                Select a PDF textbook or study material to generate MCQ questions from
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {file ? (
                  <div className="space-y-2">
                    <FileText className="h-12 w-12 text-primary mx-auto" />
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="font-medium">Click to upload PDF</p>
                    <p className="text-sm text-muted-foreground">
                      Supports PDF files up to 10MB
                    </p>
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {file && (
                <div className="flex justify-center space-x-2">
                  <Button
                    onClick={generateMCQs}
                    disabled={isProcessing}
                    className="bg-gradient-primary hover:opacity-90 text-white"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {isProcessing ? 'Generating...' : 'Generate MCQs'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change File
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Processing Progress */}
          {isProcessing && (
            <Card className="shadow-soft border-border/50">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-primary animate-spin" />
                    <span className="font-medium">Processing your PDF...</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-muted-foreground">
                    AI is analyzing the content and generating intelligent questions
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generated Questions */}
          {questions.length > 0 && (
            <Card className="shadow-soft border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Generated MCQ Questions</CardTitle>
                    <CardDescription>
                      {questions.length} questions generated from your PDF
                    </CardDescription>
                  </div>
                  <Button onClick={exportQuestions} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {questions.map((question, questionIndex) => (
                  <div key={questionIndex} className="space-y-4 p-4 border border-border/50 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <span className="bg-primary text-white text-sm px-2 py-1 rounded font-medium">
                        Q{questionIndex + 1}
                      </span>
                      <h3 className="font-medium text-foreground flex-1">
                        {question.question}
                      </h3>
                    </div>
                    
                    <div className="space-y-2 ml-8">
                      {question.options.map((option, optionIndex) => (
                        <button
                          key={optionIndex}
                          onClick={() => handleAnswerSelect(questionIndex, optionIndex)}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${
                            selectedAnswers[questionIndex] === optionIndex
                              ? selectedAnswers[questionIndex] === question.correctAnswer
                                ? 'bg-green-50 border-green-200 text-green-800'
                                : 'bg-red-50 border-red-200 text-red-800'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">
                              {String.fromCharCode(65 + optionIndex)}.
                            </span>
                            <span>{option}</span>
                            {selectedAnswers[questionIndex] === optionIndex && (
                              selectedAnswers[questionIndex] === question.correctAnswer ? (
                                <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600 ml-auto" />
                              )
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {selectedAnswers[questionIndex] !== -1 && (
                      <div className="ml-8 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Explanation:</p>
                        <p className="text-sm">{question.explanation}</p>
                      </div>
                    )}
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

export default PdfMcqGenerator;