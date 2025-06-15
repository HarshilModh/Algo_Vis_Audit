import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw, Code2 } from "lucide-react";
import { Link } from "react-router-dom";

const CustomCode = () => {
  const [code, setCode] = useState(`// Write your algorithm here
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// Test your algorithm
const testArray = [64, 34, 25, 12, 22, 11, 90];
console.log("Original:", testArray);
console.log("Sorted:", bubbleSort([...testArray]));`);

  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runCode = () => {
    setIsRunning(true);
    setOutput([]);

    // Create a custom console to capture output
    const capturedLogs: string[] = [];
    const originalConsole = console.log;
    
    console.log = (...args) => {
      capturedLogs.push(args.map(arg => String(arg)).join(' '));
    };

    try {
      // Execute the code
      eval(code);
      setOutput(capturedLogs);
    } catch (error) {
      setOutput([`Error: ${error}`]);
    } finally {
      // Restore original console
      console.log = originalConsole;
      setIsRunning(false);
    }
  };

  const clearOutput = () => {
    setOutput([]);
  };

  const loadExample = (exampleCode: string) => {
    setCode(exampleCode);
    setOutput([]);
  };

  const examples = {
    binarySearch: `// Binary Search Algorithm
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    console.log(\`Checking index \${mid}, value: \${arr[mid]}\`);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}

const sortedArray = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
const target = 7;
console.log("Array:", sortedArray);
console.log("Target:", target);
const result = binarySearch(sortedArray, target);
console.log(\`Target \${target} found at index: \${result}\`);`,

    fibonacci: `// Fibonacci with Memoization
function fibonacciMemo(n, memo = {}) {
  if (n in memo) {
    console.log(\`Using memoized value for F(\${n})\`);
    return memo[n];
  }
  
  if (n <= 1) {
    console.log(\`Base case: F(\${n}) = \${n}\`);
    return n;
  }
  
  console.log(\`Calculating F(\${n})\`);
  memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
  return memo[n];
}

// Test Fibonacci
for (let i = 0; i <= 10; i++) {
  console.log(\`F(\${i}) = \${fibonacciMemo(i)}\`);
}`,

    quickSort: `// Quick Sort Algorithm
function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);
    console.log(\`Pivot at index \${pivotIndex}, array: [\${arr.join(', ')}]\`);
    
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

const testArray = [64, 34, 25, 12, 22, 11, 90];
console.log("Original array:", testArray);
const sorted = quickSort([...testArray]);
console.log("Sorted array:", sorted);`
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/" className="text-orange-600 hover:text-orange-800 mb-2 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-slate-800">Custom Code Sandbox</h1>
            <p className="text-slate-600 mt-2">Write and test your own algorithms with live debugging</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            JavaScript Sandbox
          </Badge>
        </div>

        {/* Examples */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Example Algorithms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <Button 
                onClick={() => loadExample(examples.binarySearch)} 
                variant="outline"
                disabled={isRunning}
              >
                Binary Search
              </Button>
              <Button 
                onClick={() => loadExample(examples.fibonacci)} 
                variant="outline"
                disabled={isRunning}
              >
                Fibonacci (Memoized)
              </Button>
              <Button 
                onClick={() => loadExample(examples.quickSort)} 
                variant="outline"
                disabled={isRunning}
              >
                Quick Sort
              </Button>
              <Button 
                onClick={() => loadExample(`// Custom Example
function customExample() {
  console.log("This is a custom example");
}`)} 
                variant="outline"
                disabled={isRunning}
              >
                Custom Example
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Code Editor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 size={20} />
                Code Editor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="font-mono text-sm min-h-96 resize-none"
                placeholder="Write your algorithm here..."
                disabled={isRunning}
              />
              <div className="flex gap-2 mt-4">
                <Button onClick={runCode} disabled={isRunning} className="flex-1">
                  <Play size={16} className="mr-2" />
                  {isRunning ? 'Running...' : 'Run Code'}
                </Button>
                <Button onClick={clearOutput} variant="outline">
                  <RotateCcw size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Output Console */}
          <Card>
            <CardHeader>
              <CardTitle>Console Output</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm min-h-96 overflow-auto">
                {output.length === 0 ? (
                  <div className="text-gray-500">
                    $ Console output will appear here...
                  </div>
                ) : (
                  output.map((line, index) => (
                    <div key={index} className="mb-1">
                      <span className="text-gray-500">$ </span>
                      {line}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Tips for Algorithm Development</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Debugging</h3>
                <p className="text-sm text-blue-700">Use console.log() to trace your algorithm's execution and understand each step.</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Testing</h3>
                <p className="text-sm text-green-700">Test with different input sizes and edge cases to verify correctness.</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2">Optimization</h3>
                <p className="text-sm text-orange-700">Consider time and space complexity. Try to optimize your solution iteratively.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomCode;
