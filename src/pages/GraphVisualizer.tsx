
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface Node {
  id: string;
  x: number;
  y: number;
  color: 'default' | 'visited' | 'current' | 'path';
}

interface Edge {
  from: string;
  to: string;
  weight: number;
}

const GraphVisualizer = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [algorithm, setAlgorithm] = useState("bfs");
  const [isPlaying, setIsPlaying] = useState(false);
  const [startNode, setStartNode] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const algorithms = {
    bfs: { name: "Breadth-First Search", complexity: "O(V + E)", description: "Explore nodes level by level" },
    dfs: { name: "Depth-First Search", complexity: "O(V + E)", description: "Explore as far as possible along each branch" },
    dijkstra: { name: "Dijkstra's Algorithm", complexity: "O((V + E) log V)", description: "Find shortest path with weights" }
  };

  const generateSampleGraph = () => {
    const sampleNodes: Node[] = [
      { id: "A", x: 100, y: 100, color: 'default' },
      { id: "B", x: 300, y: 100, color: 'default' },
      { id: "C", x: 500, y: 100, color: 'default' },
      { id: "D", x: 200, y: 250, color: 'default' },
      { id: "E", x: 400, y: 250, color: 'default' }
    ];
    
    const sampleEdges: Edge[] = [
      { from: "A", to: "B", weight: 4 },
      { from: "A", to: "D", weight: 2 },
      { from: "B", to: "C", weight: 3 },
      { from: "B", to: "E", weight: 1 },
      { from: "D", to: "E", weight: 5 },
      { from: "C", to: "E", weight: 2 }
    ];

    setNodes(sampleNodes);
    setEdges(sampleEdges);
    setStartNode("A");
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      
      if (fromNode && toNode) {
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw weight
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        ctx.fillStyle = '#1e293b';
        ctx.font = '14px sans-serif';
        ctx.fillText(edge.weight.toString(), midX, midY);
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
      
      switch (node.color) {
        case 'visited':
          ctx.fillStyle = '#10b981';
          break;
        case 'current':
          ctx.fillStyle = '#f59e0b';
          break;
        case 'path':
          ctx.fillStyle = '#ef4444';
          break;
        default:
          ctx.fillStyle = '#3b82f6';
      }
      
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw node label
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.id, node.x, node.y + 5);
    });
  };

  const runBFS = async () => {
    if (!startNode) return;
    
    setIsPlaying(true);
    const visited = new Set<string>();
    const queue = [startNode];
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      
      if (visited.has(current)) continue;
      
      visited.add(current);
      
      setNodes(prev => prev.map(node => ({
        ...node,
        color: node.id === current ? 'current' : visited.has(node.id) ? 'visited' : 'default'
      })));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add neighbors to queue
      edges.forEach(edge => {
        if (edge.from === current && !visited.has(edge.to)) {
          queue.push(edge.to);
        }
        if (edge.to === current && !visited.has(edge.from)) {
          queue.push(edge.from);
        }
      });
    }
    
    setIsPlaying(false);
  };

  const resetVisualization = () => {
    setNodes(prev => prev.map(node => ({ ...node, color: 'default' })));
    setIsPlaying(false);
  };

  useEffect(() => {
    generateSampleGraph();
  }, []);

  useEffect(() => {
    drawGraph();
  }, [nodes, edges]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/" className="text-purple-600 hover:text-purple-800 mb-2 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-slate-800">Graph Algorithm Visualizer</h1>
            <p className="text-slate-600 mt-2">Explore pathfinding and graph traversal algorithms</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {algorithms[algorithm as keyof typeof algorithms]?.complexity}
          </Badge>
        </div>

        {/* Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Algorithm Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Algorithm</label>
                <Select value={algorithm} onValueChange={setAlgorithm} disabled={isPlaying}>
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

              <div>
                <label className="block text-sm font-medium mb-2">Start Node</label>
                <Select value={startNode} onValueChange={setStartNode} disabled={isPlaying}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {nodes.map(node => (
                      <SelectItem key={node.id} value={node.id}>
                        {node.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                {!isPlaying ? (
                  <Button onClick={runBFS} className="flex-1">
                    <Play size={16} className="mr-2" />
                    Start
                  </Button>
                ) : (
                  <Button disabled className="flex-1">
                    <Pause size={16} className="mr-2" />
                    Running...
                  </Button>
                )}
                <Button onClick={resetVisualization} variant="outline">
                  <RotateCcw size={16} />
                </Button>
                <Button onClick={generateSampleGraph} variant="outline" disabled={isPlaying}>
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visualization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{algorithms[algorithm as keyof typeof algorithms]?.name} Visualization</span>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                  <span>Unvisited</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                  <span>Visited</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                  <span>Path</span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-100 p-6 rounded-lg">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="border border-slate-300 rounded bg-white mx-auto block"
              />
            </div>
            <div className="mt-4 text-center text-slate-600">
              {algorithms[algorithm as keyof typeof algorithms]?.description}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GraphVisualizer;
