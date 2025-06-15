
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

const AICodeAudit = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="text-purple-600 hover:text-purple-800 mb-2 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-slate-800">AI Code Audit Tool</h1>
          <p className="text-slate-600 mt-2">Advanced AI-powered code analysis and security audit</p>
        </div>

        {/* Iframe Container */}
        <Card className="border border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-100 to-blue-100">
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <ExternalLink size={20} />
              AI Code Audit Tool
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <iframe
              src="https://ai-code-audit.vercel.app/"
              className="w-full h-[800px] border-0 rounded-b-lg"
              title="AI Code Audit Tool"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>This tool is hosted externally and embedded for your convenience.</p>
        </div>
      </div>
    </div>
  );
};

export default AICodeAudit;
