import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import { Link } from "react-router-dom";

interface DPCell {
  value: number | null;
  color: 'default' | 'computed' | 'optimal' | 'current';
}

const DPVisualizer = () => {
  const [problem, setProblem] = useState("fibonacci");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState([50]);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [dpTable, setDpTable] = useState<DPCell[][]>([]);
  const [inputValue, setInputValue] = useState("5");
  const [showOptimal, setShowOptimal] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout>();

  const algorithms = {
    fibonacci: { 
      name: "Fibonacci Sequence", 
      complexity: "O(n²) → O(n)", 
      description: "Classic DP problem showing optimization from recursion" 
    },
    knapsack: { 
      name: "0/1 Knapsack", 
      complexity: "O(nW)", 
      description: "Maximize value within weight constraint" 
    },
    lcs: { 
      name: "Longest Common Subsequence", 
      complexity: "O(mn)", 
      description: "Find longest subsequence common to two sequences" 
    }
  };

  const fibonacciDP = async (n: number) => {
    const table: DPCell[][] = [Array(n + 1).fill(null).map(() => ({ value: null, color: 'default' }))];
    table[0][0].value = 0;
    table[0][1].value = 1;
    const steps = [];

    for (let i = 2; i <= n; i++) {
      const newTable = table.map(row => row.map(cell => ({ ...cell })));
      newTable[0][i].color = 'current';
      steps.push({ table: newTable });

      const newTable1 = table.map(row => row.map(cell => ({ ...cell })));
      newTable1[0][i].value = (table[0][i - 1].value || 0) + (table[0][i - 2].value || 0);
      newTable1[0][i].color = 'computed';
      steps.push({ table: newTable1 });

      table[0][i].value = (table[0][i - 1].value || 0) + (table[0][i - 2].value || 0);
    }

    return steps;
  };

  const knapsackDP = async (capacity: number, weights: number[], values: number[]) => {
    const n = weights.length;
    const table: DPCell[][] = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(null).map(() => ({ value: 0, color: 'default' })));
    const steps = [];

    for (let i = 1; i <= n; i++) {
      for (let w = 1; w <= capacity; w++) {
        const newTable = table.map(row => row.map(cell => ({ ...cell })));
        newTable[i][w].color = 'current';
        steps.push({ table: newTable });

        if (weights[i - 1] <= w) {
          const newTable1 = table.map(row => row.map(cell => ({ ...cell })));
          newTable1[i][w].value = Math.max(
            values[i - 1] + (table[i - 1][w - weights[i - 1]].value || 0),
            table[i - 1][w].value || 0
          );
          newTable1[i][w].color = 'computed';
          steps.push({ table: newTable1 });

          table[i][w].value = Math.max(
            values[i - 1] + (table[i - 1][w - weights[i - 1]].value || 0),
            table[i - 1][w].value || 0
          );
        } else {
          const newTable1 = table.map(row => row.map(cell => ({ ...cell })));
          newTable1[i][w].value = table[i - 1][w].value;
          newTable1[i][w].color = 'computed';
          steps.push({ table: newTable1 });
          table[i][w].value = table[i - 1][w].value;
        }
      }
    }

    return steps;
  };

  const lcsDP = async (str1: string, str2: string) => {
    const m = str1.length;
    const n = str2.length;
    const table: DPCell[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(null).map(() => ({ value: 0, color: 'default' })));
    const steps = [];

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const newTable = table.map(row => row.map(cell => ({ ...cell })));
        newTable[i][j].color = 'current';
        steps.push({ table: newTable });

        if (str1[i - 1] === str2[j - 1]) {
          const newTable1 = table.map(row => row.map(cell => ({ ...cell })));
          newTable1[i][j].value = (table[i - 1][j - 1].value || 0) + 1;
          newTable1[i][j].color = 'computed';
          steps.push({ table: newTable1 });
          table[i][j].value = (table[i - 1][j - 1].value || 0) + 1;
        } else {
          const newTable1 = table.map(row => row.map(cell => ({ ...cell })));
          newTable1[i][j].value = Math.max(table[i - 1][j].value || 0, table[i][j - 1].value || 0);
          newTable1[i][j].color = 'computed';
          steps.push({ table: newTable1 });
          table[i][j].value = Math.max(table[i - 1][j].value || 0, table[i][j - 1].value || 0);
        }
      }
    }

    return steps;
  };

  const startDP = async () => {
    if (isPaused) {
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    setIsPlaying(true);
    setCurrentStep(0);
    setTotalSteps(0);

    let steps = [];
    switch (problem) {
      case 'fibonacci':
        steps = await fibonacciDP(parseInt(inputValue));
        break;
      case 'knapsack':
        // Example values, replace with user input if needed
        const capacity = 10;
        const weights = [3, 4, 5, 8];
        const values = [4, 5, 10, 11];
        steps = await knapsackDP(capacity, weights, values);
        break;
      case 'lcs':
        // Example strings, replace with user input if needed
        const str1 = "AGGTAB";
        const str2 = "GXTXAYB";
        steps = await lcsDP(str1, str2);
        break;
      default:
        steps = await fibonacciDP(5);
    }

    setTotalSteps(steps.length);
    let stepIndex = 0;

    intervalRef.current = setInterval(() => {
      if (stepIndex < steps.length) {
        const step = steps[stepIndex];
        setDpTable(step.table);
        setCurrentStep(stepIndex + 1);
        stepIndex++;
      } else {
        setIsPlaying(false);
        clearInterval(intervalRef.current);
      }
    }, 1000 - speed[0] * 10);
  };

  const pauseDP = () => {
    setIsPlaying(false);
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resetDP = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    startDP();
  };

  useEffect(() => {
    startDP();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [problem, inputValue]);

  const getCellColor = (color: string) => {
    switch (color) {
      case 'computed': return 'bg-blue-200';
      case 'optimal': return 'bg-green-200';
      case 'current': return 'bg-yellow-200';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/" className="text-blue-600 hover:text-blue-800 mb-2 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-slate-800">Dynamic Programming Visualizer</h1>
            <p className="text-slate-600 mt-2">Visualize DP algorithms step by step</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {algorithms[problem as keyof typeof algorithms]?.complexity}
          </Badge>
        </div>

        {/* Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Algorithm Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Problem</label>
                <Select value={problem} onValueChange={setProblem} disabled={isPlaying}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(algorithms).map(([key, algo]) => (
                      <SelectItem key={key} value={key}>
                        {algo.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {problem === 'fibonacci' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Input Value</label>
                  <Input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isPlaying}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Speed: {speed[0]}%</label>
                <Slider
                  value={speed}
                  onValueChange={setSpeed}
                  min={1}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {!isPlaying ? (
                <Button onClick={startDP} className="flex items-center gap-2">
                  <Play size={16} />
                  {isPaused ? 'Resume' : 'Start'}
                </Button>
              ) : (
                <Button onClick={pauseDP} variant="outline" className="flex items-center gap-2">
                  <Pause size={16} />
                  Pause
                </Button>
              )}
              <Button onClick={resetDP} variant="outline" className="flex items-center gap-2">
                <RotateCcw size={16} />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{currentStep}</div>
              <div className="text-sm text-purple-700">Current Step</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{totalSteps}</div>
              <div className="text-sm text-orange-700">Total Steps</div>
            </CardContent>
          </Card>
        </div>

        {/* Visualization */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{algorithms[problem as keyof typeof algorithms]?.name} Visualization</span>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 rounded shadow-sm"></div>
                  <span>Default</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-200 rounded shadow-sm"></div>
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-200 rounded shadow-sm"></div>
                  <span>Computed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-200 rounded shadow-sm"></div>
                  <span>Optimal</span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-slate-500">
                <thead>
                  <tr>
                    {dpTable.length > 0 && dpTable[0].map((_, index) => (
                      <th key={index} className="border border-slate-600 p-2 text-sm font-semibold text-left">
                        {problem === 'knapsack' ? `Weight ${index}` : `Index ${index}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dpTable.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className={`border border-slate-600 p-2 text-center ${getCellColor(cell.color)}`}>
                          {cell.value !== null ? cell.value : '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 text-center">
              <p className="text-slate-600 text-lg">
                {algorithms[problem as keyof typeof algorithms]?.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DPVisualizer;
