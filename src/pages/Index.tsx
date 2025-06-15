import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, GitBranch, Network, Code, ExternalLink, Home, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const algorithmCategories = [
    {
      title: "Sorting Algorithms",
      description: "Visualize sorting algorithms",
      icon: BarChart3,
      algorithms: ["Bubble Sort", "Merge Sort", "Quick Sort"],
      route: "/sorting",
      color: "blue"
    },
    {
      title: "Graph Algorithms", 
      description: "Graph traversal algorithms",
      icon: Network,
      algorithms: ["DFS", "BFS", "Dijkstra"],
      route: "/graph",
      color: "green"
    },
    {
      title: "Dynamic Programming",
      description: "DP algorithms visualization",
      icon: GitBranch,
      algorithms: ["LCS", "Knapsack", "Fibonacci"],
      route: "/dp",
      color: "purple"
    },
    {
      title: "Custom Code",
      description: "Write your own algorithms",
      icon: Code,
      algorithms: ["JavaScript", "Testing", "Debug"],
      route: "/custom",
      color: "yellow"
    },
    {
      title: "AI Code Review",
      description: "Get AI feedback on your code",
      icon: Code,
      algorithms: ["Code Analysis", "Bug Detection", "Optimization"],
      route: "/playground",
      color: "pink"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 group">
                <Code className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-blue-700 transition-colors">AlgoViz</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Link to="/">
                <Button variant="ghost" className="flex items-center space-x-2 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant="ghost" className="flex items-center space-x-2 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight drop-shadow-sm">
            Algorithm Visualizer
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Learn algorithms through interactive visualizations and step-by-step explanations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {algorithmCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card key={index} className="h-full border-0 bg-white/90 shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-2xl group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-3 rounded-xl bg-gradient-to-br from-${category.color}-100 to-${category.color}-200 group-hover:scale-110 transition-transform`}>
                      <IconComponent size={28} className={`text-${category.color}-600`} />
                    </div>
                    <CardTitle className="text-xl text-slate-900 group-hover:text-${category.color}-700 transition-colors">
                      {category.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-slate-600">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {category.algorithms.map((algo, algoIndex) => (
                      <span 
                        key={algoIndex} 
                        className={`inline-block bg-${category.color}-50 text-${category.color}-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm`}
                      >
                        {algo}
                      </span>
                    ))}
                  </div>
                  {/* Add navigation buttons for Custom Code and AI Code Review */}
                  {category.route === "/custom" && (
                    <Link to="/custom">
                      <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow transition-colors duration-200 mt-2">
                        Go to Custom Code
                      </Button>
                    </Link>
                  )}
                  {category.route === "/playground" && (
                    <Link to="/playground">
                      <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg shadow transition-colors duration-200 mt-2">
                        Go to AI Code Review
                      </Button>
                    </Link>
                  )}
                  {/* Existing View Algorithms button for other categories */}
                  {["/sorting", "/graph", "/dp"].includes(category.route) && (
                    <Link to={category.route}>
                      <Button className={`w-full bg-${category.color}-600 hover:bg-${category.color}-700 text-white font-semibold rounded-lg shadow transition-colors duration-200`}>
                        View Algorithms
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* AI Code Audit Tool */}
        <div className="mt-12">
          <Card className="border-0 bg-gradient-to-r from-purple-50 to-blue-50 shadow-lg rounded-2xl">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <ExternalLink size={24} className="text-purple-600" />
                </div>
                <CardTitle className="text-xl text-slate-900">
                  AI Code Audit Tool
                </CardTitle>
              </div>
              <CardDescription className="text-slate-600">
                Advanced AI-powered code analysis and security audit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                  Security Analysis
                </span>
                <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                  Code Quality
                </span>
                <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                  Best Practices
                </span>
              </div>
              <Link to="/audit">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow transition-colors duration-200">
                  <ExternalLink size={16} className="mr-2" />
                  Open AI Code Audit
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 tracking-tight">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow">
                <BarChart3 className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Step by Step</h3>
              <p className="text-slate-600">Watch algorithms work step by step with detailed explanations</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow">
                <Network className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Interactive</h3>
              <p className="text-slate-600">Control speed and input data to understand algorithms better</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow">
                <Code className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Educational</h3>
              <p className="text-slate-600">Learn how algorithms work through visual examples</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
