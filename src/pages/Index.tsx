
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, GitBranch, Network, Code, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const algorithmCategories = [
    {
      title: "Sorting Algorithms",
      description: "Visualize sorting algorithms",
      icon: BarChart3,
      algorithms: ["Bubble Sort", "Merge Sort", "Quick Sort"],
      route: "/sorting"
    },
    {
      title: "Graph Algorithms", 
      description: "Graph traversal algorithms",
      icon: Network,
      algorithms: ["DFS", "BFS", "Dijkstra"],
      route: "/graph"
    },
    {
      title: "Dynamic Programming",
      description: "DP algorithms visualization",
      icon: GitBranch,
      algorithms: ["LCS", "Knapsack", "Fibonacci"],
      route: "/dp"
    },
    {
      title: "Custom Code",
      description: "Write your own algorithms",
      icon: Code,
      algorithms: ["JavaScript", "Testing", "Debug"],
      route: "/custom"
    },
    {
      title: "AI Code Review",
      description: "Get AI feedback on your code",
      icon: Code,
      algorithms: ["Code Analysis", "Bug Detection", "Optimization"],
      route: "/playground"
    }
  ];

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">
            Algorithm Visualizer
          </h1>
          <p className="text-lg text-gray-600">
            Learn algorithms through visual examples
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {algorithmCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card key={index} className="border border-gray-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded">
                      <IconComponent size={20} className="text-blue-600" />
                    </div>
                    <CardTitle className="text-lg text-black">
                      {category.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-gray-600">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    {category.algorithms.map((algo, algoIndex) => (
                      <span key={algoIndex} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mr-2 mb-2">
                        {algo}
                      </span>
                    ))}
                  </div>
                  <Link to={category.route}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      View Algorithms
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* AI Code Audit Tool */}
        <div className="mt-8">
          <Card className="border border-gray-300 bg-gradient-to-r from-purple-50 to-blue-50">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded">
                  <ExternalLink size={20} className="text-purple-600" />
                </div>
                <CardTitle className="text-lg text-black">
                  AI Code Audit Tool
                </CardTitle>
              </div>
              <CardDescription className="text-gray-600">
                Advanced AI-powered code analysis and security audit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs mr-2 mb-2">
                  Security Analysis
                </span>
                <span className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs mr-2 mb-2">
                  Code Quality
                </span>
                <span className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs mr-2 mb-2">
                  Best Practices
                </span>
              </div>
              <Link to="/audit">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  <ExternalLink size={16} className="mr-2" />
                  Open AI Code Audit
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-black mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded mx-auto mb-3 flex items-center justify-center">
                <BarChart3 className="text-blue-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Step by Step</h3>
              <p className="text-gray-600">Watch algorithms work step by step</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded mx-auto mb-3 flex items-center justify-center">
                <Network className="text-blue-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Interactive</h3>
              <p className="text-gray-600">Control speed and input data</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded mx-auto mb-3 flex items-center justify-center">
                <Code className="text-blue-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Educational</h3>
              <p className="text-gray-600">Learn how algorithms work</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
