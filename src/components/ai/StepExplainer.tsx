
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Brain, Loader2 } from 'lucide-react';
import { OpenAIService } from '@/services/openaiService';

interface StepExplainerProps {
  algorithm: string;
  currentState: any;
  stepDescription: string;
  disabled?: boolean;
  apiKey?: string;
}

const StepExplainer = ({ algorithm, currentState, stepDescription, disabled, apiKey }: StepExplainerProps) => {
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [open, setOpen] = useState(false);

  const handleExplain = async () => {
    if (!apiKey) {
      setError('Please enter your OpenAI API key in the settings.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const openai = new OpenAIService(apiKey);
      const result = await openai.explainStep({
        algorithm,
        currentState,
        stepDescription,
        type: 'step'
      });
      setExplanation(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get explanation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={disabled || !stepDescription}
          className="bg-purple-50 hover:bg-purple-100 border-purple-200"
        >
          <Brain size={16} className="mr-2" />
          Explain Step
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain size={20} className="text-purple-600" />
            AI Step Explanation
            <Badge variant="secondary">{algorithm}</Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm text-gray-700 mb-1">Current Step:</h4>
            <p className="text-sm">{stepDescription || 'No step information available'}</p>
          </div>

          {!explanation && !loading && !error && (
            <Button onClick={handleExplain} disabled={loading || !apiKey}>
              {loading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Getting explanation...
                </>
              ) : (
                'Get AI Explanation'
              )}
            </Button>
          )}

          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="animate-spin text-purple-600" />
              <span className="ml-2 text-gray-600">AI is thinking...</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {explanation && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">AI Explanation:</h4>
              <p className="text-blue-800 text-sm leading-relaxed whitespace-pre-wrap">{explanation}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StepExplainer;
