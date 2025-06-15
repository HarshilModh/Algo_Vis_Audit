
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Code, MessageSquare, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OpenAIService } from '@/services/openaiService';
import ApiKeySettings from '@/components/ai/ApiKeySettings';

const CodePlayground = () => {
  const [algorithm, setAlgorithm] = useState('bubble-sort');
  const [code, setCode] = useState(`function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}`);
  const [review, setReview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai-api-key') || "");

  const algorithms = {
    'bubble-sort': 'Bubble Sort',
    'merge-sort': 'Merge Sort',
    'quick-sort': 'Quick Sort',
    'selection-sort': 'Selection Sort',
    'binary-search': 'Binary Search',
    'linear-search': 'Linear Search',
  };

  const codeTemplates = {
    'bubble-sort': `function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}`,
    'merge-sort': `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  let result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
    'quick-sort': `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    let pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  let pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
    'selection-sort': `function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  
  return arr;
}`,
    'binary-search': `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}`,
    'linear-search': `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}`
  };

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    localStorage.setItem('openai-api-key', key);
  };

  const handleAlgorithmChange = (newAlgorithm: string) => {
    setAlgorithm(newAlgorithm);
    setCode(codeTemplates[newAlgorithm as keyof typeof codeTemplates] || '');
    setReview('');
    setError('');
  };

  const handleReviewCode = async () => {
    if (!apiKey) {
      setError('Please enter your OpenAI API key in the settings.');
      return;
    }

    if (!code.trim()) {
      setError('Please enter some code to review.');
      return;
    }

    setLoading(true);
    setError('');
    setReview('');

    try {
      const openai = new OpenAIService(apiKey);
      const result = await openai.reviewCode(
        algorithms[algorithm as keyof typeof algorithms],
        code,
        'javascript'
      );
      setReview(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get code review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/" className="text-indigo-600 hover:text-indigo-800 mb-2 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-slate-800">AI Code Playground</h1>
            <p className="text-slate-600 mt-2">Write algorithm implementations and get AI-powered code reviews</p>
          </div>
          <ApiKeySettings apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code size={20} />
              Algorithm Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Choose Algorithm</label>
                <Select value={algorithm} onValueChange={handleAlgorithmChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(algorithms).map(([key, name]) => (
                      <SelectItem key={key} value={key}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                JavaScript
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Code Editor and Review */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Editor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Code Editor</span>
                <Button onClick={handleReviewCode} disabled={loading || !apiKey}>
                  {loading ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Reviewing...
                    </>
                  ) : (
                    <>
                      <MessageSquare size={16} className="mr-2" />
                      Review My Code
                    </>
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Write your algorithm implementation here..."
                className="min-h-96 font-mono text-sm"
              />
            </CardContent>
          </Card>

          {/* AI Review */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare size={20} className="text-green-600" />
                AI Code Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-96">
                {!review && !loading && !error && (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>Click "Review My Code" to get AI feedback</p>
                      <p className="text-sm mt-2">The AI will analyze your code for bugs, complexity, and optimizations</p>
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Loader2 size={48} className="mx-auto mb-4 animate-spin text-indigo-600" />
                      <p className="text-gray-600">AI is reviewing your code...</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-900 mb-2">Error:</h4>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                {review && (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                        <MessageSquare size={16} />
                        AI Code Review:
                      </h4>
                      <div className="text-green-800 text-sm leading-relaxed whitespace-pre-wrap">
                        {review}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>💡 Tips for Better Code Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li>Write complete, runnable functions for the best analysis</li>
              <li>Include edge case handling to see comprehensive feedback</li>
              <li>Try different algorithms to compare AI suggestions</li>
              <li>The AI will check for bugs, complexity analysis, and optimization opportunities</li>
              <li>Consider the AI suggestions but always verify them yourself</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CodePlayground;
