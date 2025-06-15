import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw, Shuffle, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import StepExplainer from "@/components/ai/StepExplainer";
import ComplexityExplainer from "@/components/ai/ComplexityExplainer";
import ApiKeySettings from "@/components/ai/ApiKeySettings";

interface ArrayElement {
  value: number;
  color: 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'merging' | 'selected' | 'minimum' | 'partition-left' | 'partition-right';
}

const SortingVisualizer = () => {
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [algorithm, setAlgorithm] = useState("bubble");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState([50]);
  const [arraySize, setArraySize] = useState([20]);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [customValues, setCustomValues] = useState("");
  const [currentOperation, setCurrentOperation] = useState("");
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai-api-key') || "");
  const intervalRef = useRef<NodeJS.Timeout>();

  const algorithms = {
    bubble: { 
      name: "Bubble Sort", 
      description: "Adjacent elements bubble up to their correct position",
      timeComplexity: "O(n²)"
    },
    merge: { 
      name: "Merge Sort", 
      description: "Divide array into halves, sort, then merge back together",
      timeComplexity: "O(n log n)"
    },
    quick: { 
      name: "Quick Sort", 
      description: "Choose pivot, partition around it, then sort sub-arrays",
      timeComplexity: "O(n log n)"
    },
    selection: { 
      name: "Selection Sort", 
      description: "Find minimum element and place it in correct position",
      timeComplexity: "O(n²)"
    }
  };

  const generateArray = () => {
    const newArray = Array.from({ length: arraySize[0] }, (_, i) => ({
      value: Math.floor(Math.random() * 300) + 10,
      color: 'default' as const
    }));
    setArray(newArray);
    resetStats();
  };

  const generateFromCustomValues = () => {
    const trimmedValues = customValues.trim();
    if (!trimmedValues) {
      console.log("No custom values provided");
      return;
    }
    
    const values = trimmedValues
      .split(/[,\s]+/)
      .map(v => v.trim())
      .filter(v => v !== '')
      .map(v => parseInt(v))
      .filter(v => !isNaN(v) && v > 0 && v <= 500);
    
    console.log("Parsed values:", values);
    
    if (values.length === 0) {
      console.log("No valid values found");
      return;
    }
    
    const newArray = values.map(value => ({
      value: value,
      color: 'default' as const
    }));
    
    setArray(newArray);
    setArraySize([newArray.length]);
    setCustomValues("");
    resetStats();
    console.log("Generated array from custom values:", newArray);
  };

  const resetStats = () => {
    setCurrentStep(0);
    setTotalSteps(0);
    setComparisons(0);
    setSwaps(0);
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentOperation("");
  };

  const bubbleSort = async () => {
    const arr = [...array];
    const steps = [];
    let compCount = 0;
    let swapCount = 0;

    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        steps.push({
          array: arr.map((el, idx) => ({
            ...el,
            color: (idx === j || idx === j + 1) ? 'comparing' : (idx >= arr.length - i) ? 'sorted' : 'default'
          })),
          comparisons: ++compCount,
          swaps: swapCount,
          operation: `Comparing ${arr[j].value} and ${arr[j + 1].value}`
        });

        if (arr[j].value > arr[j + 1].value) {
          steps.push({
            array: arr.map((el, idx) => ({
              ...el,
              color: (idx === j || idx === j + 1) ? 'swapping' : (idx >= arr.length - i) ? 'sorted' : 'default'
            })),
            comparisons: compCount,
            swaps: ++swapCount,
            operation: `Swapping ${arr[j].value} and ${arr[j + 1].value}`
          });

          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }

    steps.push({
      array: arr.map(el => ({ ...el, color: 'sorted' })),
      comparisons: compCount,
      swaps: swapCount,
      operation: "Sorting complete!"
    });

    return steps;
  };

  const selectionSort = async () => {
    const arr = [...array];
    const steps = [];
    let compCount = 0;
    let swapCount = 0;

    for (let i = 0; i < arr.length - 1; i++) {
      let minIdx = i;
      
      steps.push({
        array: arr.map((el, idx) => ({
          ...el,
          color: idx < i ? 'sorted' : idx === i ? 'selected' : 'default'
        })),
        comparisons: compCount,
        swaps: swapCount,
        operation: `Finding minimum from position ${i}`
      });

      for (let j = i + 1; j < arr.length; j++) {
        steps.push({
          array: arr.map((el, idx) => ({
            ...el,
            color: idx < i ? 'sorted' : 
                   idx === i ? 'selected' : 
                   idx === j ? 'comparing' : 
                   idx === minIdx ? 'minimum' : 'default'
          })),
          comparisons: ++compCount,
          swaps: swapCount,
          operation: `Comparing ${arr[j].value} with current minimum ${arr[minIdx].value}`
        });

        if (arr[j].value < arr[minIdx].value) {
          minIdx = j;
        }
      }

      if (minIdx !== i) {
        steps.push({
          array: arr.map((el, idx) => ({
            ...el,
            color: idx < i ? 'sorted' : 
                   (idx === i || idx === minIdx) ? 'swapping' : 'default'
          })),
          comparisons: compCount,
          swaps: ++swapCount,
          operation: `Placing minimum ${arr[minIdx].value} at position ${i}`
        });

        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      }
    }

    steps.push({
      array: arr.map(el => ({ ...el, color: 'sorted' })),
      comparisons: compCount,
      swaps: swapCount,
      operation: "Selection sort complete!"
    });

    return steps;
  };

  const quickSort = async () => {
    const arr = [...array];
    const steps = [];
    let compCount = 0;
    let swapCount = 0;

    const partition = (low: number, high: number) => {
      const pivot = arr[high];
      let i = low - 1;

      steps.push({
        array: arr.map((el, idx) => ({
          ...el,
          color: idx === high ? 'pivot' : (idx >= low && idx <= high) ? 'comparing' : 'sorted'
        })),
        comparisons: compCount,
        swaps: swapCount,
        operation: `Pivot selected: ${pivot.value}`
      });

      for (let j = low; j < high; j++) {
        steps.push({
          array: arr.map((el, idx) => ({
            ...el,
            color: idx === high ? 'pivot' : 
                   idx === j ? 'comparing' : 
                   idx <= i ? 'partition-left' :
                   (idx >= low && idx < high) ? 'partition-right' : 'default'
          })),
          comparisons: ++compCount,
          swaps: swapCount,
          operation: `Comparing ${arr[j].value} with pivot ${pivot.value}`
        });

        if (arr[j].value < pivot.value) {
          i++;
          if (i !== j) {
            steps.push({
              array: arr.map((el, idx) => ({
                ...el,
                color: idx === high ? 'pivot' : 
                       (idx === i || idx === j) ? 'swapping' : 
                       (idx >= low && idx <= high) ? 'default' : 'sorted'
              })),
              comparisons: compCount,
              swaps: ++swapCount,
              operation: `Moving ${arr[j].value} to left partition`
            });
            [arr[i], arr[j]] = [arr[j], arr[i]];
          }
        }
      }

      if (i + 1 !== high) {
        steps.push({
          array: arr.map((el, idx) => ({
            ...el,
            color: (idx === i + 1 || idx === high) ? 'swapping' : 'default'
          })),
          comparisons: compCount,
          swaps: ++swapCount,
          operation: `Placing pivot ${pivot.value} in correct position`
        });
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      }

      return i + 1;
    };

    const quickSortHelper = (low: number, high: number) => {
      if (low < high) {
        const pi = partition(low, high);
        quickSortHelper(low, pi - 1);
        quickSortHelper(pi + 1, high);
      }
    };

    quickSortHelper(0, arr.length - 1);

    steps.push({
      array: arr.map(el => ({ ...el, color: 'sorted' })),
      comparisons: compCount,
      swaps: swapCount,
      operation: "Quick sort complete!"
    });

    return steps;
  };

  const mergeSort = async () => {
    const arr = [...array];
    const steps = [];
    let compCount = 0;
    let swapCount = 0;

    const merge = (left: number, mid: number, right: number) => {
      const leftArray = arr.slice(left, mid + 1);
      const rightArray = arr.slice(mid + 1, right + 1);
      
      let i = 0, j = 0, k = left;

      steps.push({
        array: arr.map((el, idx) => ({
          ...el,
          color: (idx >= left && idx <= mid) ? 'partition-left' : 
                 (idx > mid && idx <= right) ? 'partition-right' : 'default'
        })),
        comparisons: compCount,
        swaps: swapCount,
        operation: `Merging subarrays [${left}-${mid}] and [${mid+1}-${right}]`
      });

      while (i < leftArray.length && j < rightArray.length) {
        compCount++;
        steps.push({
          array: arr.map((el, idx) => ({
            ...el,
            color: (idx >= left && idx <= right) ? 'merging' : 'default'
          })),
          comparisons: compCount,
          swaps: swapCount,
          operation: `Comparing ${leftArray[i].value} and ${rightArray[j].value}`
        });

        if (leftArray[i].value <= rightArray[j].value) {
          arr[k] = leftArray[i];
          i++;
        } else {
          arr[k] = rightArray[j];
          j++;
        }
        k++;
        swapCount++;
      }

      while (i < leftArray.length) {
        arr[k] = leftArray[i];
        i++;
        k++;
        swapCount++;
      }

      while (j < rightArray.length) {
        arr[k] = rightArray[j];
        j++;
        k++;
        swapCount++;
      }

      steps.push({
        array: arr.map((el, idx) => ({
          ...el,
          color: (idx >= left && idx <= right) ? 'sorted' : 'default'
        })),
        comparisons: compCount,
        swaps: swapCount,
        operation: `Merged section [${left}-${right}]`
      });
    };

    const mergeSortHelper = (left: number, right: number) => {
      if (left < right) {
        const mid = Math.floor((left + right) / 2);
        mergeSortHelper(left, mid);
        mergeSortHelper(mid + 1, right);
        merge(left, mid, right);
      }
    };

    mergeSortHelper(0, arr.length - 1);

    return steps;
  };

  const startSorting = async () => {
    if (isPaused) {
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    setIsPlaying(true);
    resetStats();

    let steps = [];
    switch (algorithm) {
      case 'bubble':
        steps = await bubbleSort();
        break;
      case 'selection':
        steps = await selectionSort();
        break;
      case 'quick':
        steps = await quickSort();
        break;
      case 'merge':
        steps = await mergeSort();
        break;
      default:
        steps = await bubbleSort();
    }

    setTotalSteps(steps.length);
    
    let stepIndex = 0;
    intervalRef.current = setInterval(() => {
      if (stepIndex < steps.length) {
        const step = steps[stepIndex];
        setArray(step.array);
        setComparisons(step.comparisons);
        setSwaps(step.swaps);
        setCurrentStep(stepIndex + 1);
        setCurrentOperation(step.operation || "");
        stepIndex++;
      } else {
        setIsPlaying(false);
        clearInterval(intervalRef.current);
      }
    }, 1000 - speed[0] * 10);
  };

  const pauseSorting = () => {
    setIsPlaying(false);
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resetArray = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    generateArray();
  };

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    localStorage.setItem('openai-api-key', key);
  };

  useEffect(() => {
    generateArray();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [arraySize]);

  const getBarColor = (color: string) => {
    switch (color) {
      case 'comparing': return 'bg-yellow-400 border-yellow-600 shadow-lg';
      case 'swapping': return 'bg-red-500 border-red-700 shadow-lg animate-pulse';
      case 'sorted': return 'bg-green-500 border-green-700';
      case 'pivot': return 'bg-purple-600 border-purple-800 shadow-lg';
      case 'merging': return 'bg-blue-500 border-blue-700 shadow-md';
      case 'selected': return 'bg-orange-500 border-orange-700 shadow-md';
      case 'minimum': return 'bg-pink-500 border-pink-700 shadow-md';
      case 'partition-left': return 'bg-cyan-400 border-cyan-600';
      case 'partition-right': return 'bg-amber-400 border-amber-600';
      default: return 'bg-gray-300 border-gray-400 hover:bg-gray-400 transition-colors';
    }
  };

  const getBarHeight = (value: number) => {
    const maxValue = Math.max(...array.map(el => el.value));
    return Math.max((value / maxValue) * 280, 20);
  };

  const getAlgorithmLegend = () => {
    switch (algorithm) {
      case 'bubble':
        return [
          { color: 'bg-gray-300 border-gray-400', label: 'Unsorted' },
          { color: 'bg-yellow-400 border-yellow-600', label: 'Comparing' },
          { color: 'bg-red-500 border-red-700', label: 'Swapping' },
          { color: 'bg-green-500 border-green-700', label: 'Sorted' }
        ];
      case 'selection':
        return [
          { color: 'bg-gray-300 border-gray-400', label: 'Unsorted' },
          { color: 'bg-orange-500 border-orange-700', label: 'Current Position' },
          { color: 'bg-yellow-400 border-yellow-600', label: 'Comparing' },
          { color: 'bg-pink-500 border-pink-700', label: 'Current Minimum' },
          { color: 'bg-red-500 border-red-700', label: 'Swapping' },
          { color: 'bg-green-500 border-green-700', label: 'Sorted' }
        ];
      case 'quick':
        return [
          { color: 'bg-gray-300 border-gray-400', label: 'Unsorted' },
          { color: 'bg-purple-600 border-purple-800', label: 'Pivot' },
          { color: 'bg-yellow-400 border-yellow-600', label: 'Comparing' },
          { color: 'bg-cyan-400 border-cyan-600', label: 'Left Partition (< pivot)' },
          { color: 'bg-amber-400 border-amber-600', label: 'Right Partition (> pivot)' },
          { color: 'bg-red-500 border-red-700', label: 'Swapping' },
          { color: 'bg-green-500 border-green-700', label: 'Sorted' }
        ];
      case 'merge':
        return [
          { color: 'bg-gray-300 border-gray-400', label: 'Unsorted' },
          { color: 'bg-cyan-400 border-cyan-600', label: 'Left Subarray' },
          { color: 'bg-amber-400 border-amber-600', label: 'Right Subarray' },
          { color: 'bg-blue-500 border-blue-700', label: 'Merging' },
          { color: 'bg-green-500 border-green-700', label: 'Sorted' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="text-blue-600 hover:text-blue-800 underline font-medium">← Back to Home</Link>
          <div className="flex items-center justify-between mt-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Sorting Algorithm Visualizer</h1>
              <p className="text-gray-600 mt-1">Watch how different sorting algorithms work step by step</p>
            </div>
            <div className="flex gap-2">
              <ApiKeySettings apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-lg shadow-md border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm font-semibold text-gray-700">Algorithm:</label>
                <ComplexityExplainer 
                  algorithm={algorithm}
                  algorithmInfo={algorithms[algorithm as keyof typeof algorithms]}
                  apiKey={apiKey}
                />
              </div>
              <Select value={algorithm} onValueChange={setAlgorithm} disabled={isPlaying}>
                <SelectTrigger className="border-2">
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
              <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                <p className="text-gray-700">{algorithms[algorithm as keyof typeof algorithms]?.description}</p>
                <p className="text-gray-600 font-mono text-xs mt-1">
                  Time: {algorithms[algorithm as keyof typeof algorithms]?.timeComplexity}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Array Size: <span className="font-mono text-blue-600">{arraySize[0]}</span>
              </label>
              <Slider
                value={arraySize}
                onValueChange={setArraySize}
                min={5}
                max={50}
                step={5}
                disabled={isPlaying}
                className="mt-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Speed: <span className="font-mono text-blue-600">{speed[0]}%</span>
              </label>
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

          <div className="flex gap-3 mb-4 flex-wrap">
            {!isPlaying ? (
              <Button onClick={startSorting} className="bg-green-600 hover:bg-green-700 text-white font-medium">
                <Play size={18} className="mr-2" />
                {isPaused ? 'Resume' : 'Start Sorting'}
              </Button>
            ) : (
              <Button onClick={pauseSorting} className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium">
                <Pause size={18} className="mr-2" />
                Pause
              </Button>
            )}
            <Button onClick={resetArray} className="bg-gray-600 hover:bg-gray-700 text-white font-medium" disabled={isPlaying}>
              <RotateCcw size={18} className="mr-2" />
              Reset
            </Button>
            <Button onClick={generateArray} className="bg-blue-600 hover:bg-blue-700 text-white font-medium" disabled={isPlaying}>
              <Shuffle size={18} className="mr-2" />
              Shuffle
            </Button>
            <StepExplainer
              algorithm={algorithms[algorithm as keyof typeof algorithms]?.name}
              currentState={{ array: array.map(el => el.value), step: currentStep }}
              stepDescription={currentOperation}
              disabled={isPlaying}
              apiKey={apiKey}
            />
          </div>

          <div className="flex gap-3 items-center">
            <label className="text-sm font-semibold text-gray-700">Custom values:</label>
            <Input
              placeholder="Enter numbers: 64, 34, 25, 12, 22, 11, 90"
              value={customValues}
              onChange={(e) => setCustomValues(e.target.value)}
              disabled={isPlaying}
              className="flex-1 border-2"
            />
            <Button
              onClick={generateFromCustomValues}
              disabled={isPlaying || !customValues.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus size={18} />
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg shadow-md border p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{comparisons}</div>
              <div className="text-sm text-gray-600">Comparisons</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{swaps}</div>
              <div className="text-sm text-gray-600">Swaps/Moves</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{currentStep}</div>
              <div className="text-sm text-gray-600">Current Step</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{totalSteps}</div>
              <div className="text-sm text-gray-600">Total Steps</div>
            </div>
          </div>
          {currentOperation && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-sm font-medium text-yellow-800">Current Operation:</div>
              <div className="text-yellow-700">{currentOperation}</div>
            </div>
          )}
        </div>

        {/* Visualization Section */}
        <div className="bg-white rounded-lg shadow-md border p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Array Visualization</h3>
          <div className="flex items-end justify-center bg-gray-50 p-4 rounded-lg" style={{ height: '320px' }}>
            {array.map((element, index) => (
              <div
                key={index}
                className={`${getBarColor(element.color)} mx-0.5 border-2 relative flex items-end justify-center transition-all duration-300 rounded-t-sm`}
                style={{
                  height: `${getBarHeight(element.value)}px`,
                  width: `${Math.max(400 / array.length, 8)}px`,
                }}
                title={`Value: ${element.value}, Index: ${index}`}
              >
                <span 
                  className="text-xs font-bold text-white absolute bottom-1 transform drop-shadow-sm"
                  style={{ 
                    writingMode: array.length > 25 ? 'vertical-rl' : 'horizontal-tb',
                    textOrientation: array.length > 25 ? 'mixed' : 'initial'
                  }}
                >
                  {element.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Legend Section */}
        <div className="bg-white rounded-lg shadow-md border p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Color Legend for {algorithms[algorithm as keyof typeof algorithms]?.name}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {getAlgorithmLegend().map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-5 h-5 ${item.color} border-2 rounded`}></div>
                <span className="text-sm text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortingVisualizer;
