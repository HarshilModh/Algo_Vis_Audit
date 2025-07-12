
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Info, Loader2 } from 'lucide-react';
import { OpenAIService } from '@/services/openaiService';

interface ComplexityExplainerProps {
  algorithm: string;
  algorithmInfo: {
    name: string;
    timeComplexity: string;
    description: string;
  };
  apiKey?: string;
}

const ComplexityExplainer = ({ algorithm, algorithmInfo, apiKey }: ComplexityExplainerProps) => {
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [open, setOpen] = useState(false);

  // Safety check for algorithmInfo
  if (!algorithmInfo) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-700 text-sm">Algorithm information not available.</p>
      </div>
    );
  }

  const handleExplain = async () => {
    if (!apiKey) {
      setError('Please enter your OpenAI API key in the settings.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const openai = new OpenAIService(apiKey);
      const result = await openai.explainComplexity(algorithmInfo.name);
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
        <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
          <Info size={14} className="text-blue-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info size={20} className="text-blue-600" />
            Algorithm Complexity Analysis
            <Badge variant="secondary">{algorithmInfo.name}</Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm text-gray-700 mb-1">Time Complexity:</h4>
              <p className="font-mono text-lg text-blue-600">{algorithmInfo.timeComplexity}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm text-gray-700 mb-1">Description:</h4>
              <p className="text-sm">{algorithmInfo.description}</p>
            </div>
          </div>

          {!explanation && !loading && !error && (
            <Button onClick={handleExplain} disabled={loading || !apiKey} className="w-full">
              {loading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Getting detailed explanation...
                </>
              ) : (
                'Get AI Complexity Explanation'
              )}
            </Button>
          )}

          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">AI is analyzing complexity...</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {explanation && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">AI Complexity Analysis:</h4>
              <p className="text-green-800 text-sm leading-relaxed whitespace-pre-wrap">{explanation}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComplexityExplainer;
