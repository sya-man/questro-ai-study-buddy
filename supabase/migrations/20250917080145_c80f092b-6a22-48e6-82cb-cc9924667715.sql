-- Create mcq_questions table for storing generated MCQ questions
CREATE TABLE public.mcq_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id TEXT NOT NULL,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.mcq_questions ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own MCQ questions" 
ON public.mcq_questions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own MCQ questions" 
ON public.mcq_questions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own MCQ questions" 
ON public.mcq_questions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own MCQ questions" 
ON public.mcq_questions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_mcq_questions_updated_at
BEFORE UPDATE ON public.mcq_questions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_mcq_questions_user_id ON public.mcq_questions(user_id);
CREATE INDEX idx_mcq_questions_session_id ON public.mcq_questions(session_id);
CREATE INDEX idx_mcq_questions_created_at ON public.mcq_questions(created_at);