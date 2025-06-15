
interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface AIExplanationRequest {
  algorithm: string;
  currentState?: any;
  stepDescription?: string;
  code?: string;
  type: 'step' | 'bigo' | 'review';
}

export class OpenAIService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest(messages: Array<{ role: string; content: string }>): Promise<string> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          max_tokens: 400,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || 'No response received';
    } catch (error) {
      console.error('OpenAI API call failed:', error);
      throw new Error('Failed to get AI response. Please check your API key and try again.');
    }
  }

  async explainStep(request: AIExplanationRequest): Promise<string> {
    const messages = [
      {
        role: 'system',
        content: 'You are a computer science tutor. Explain algorithm steps clearly and concisely in under 150 words.',
      },
      {
        role: 'user',
        content: `Explain this step in ${request.algorithm}:
Current state: ${JSON.stringify(request.currentState)}
Step: ${request.stepDescription}
Why is this step necessary? Keep it simple and educational.`,
      },
    ];

    return this.makeRequest(messages);
  }

  async explainComplexity(algorithm: string): Promise<string> {
    const messages = [
      {
        role: 'system',
        content: 'You are a computer science educator. Explain algorithm complexity in simple terms for beginners.',
      },
      {
        role: 'user',
        content: `Explain the time and space complexity of ${algorithm} in simple terms. 
Include best, average, and worst cases. Keep it under 200 words and avoid heavy mathematical notation.`,
      },
    ];

    return this.makeRequest(messages);
  }

  async reviewCode(algorithm: string, code: string, language: string = 'javascript'): Promise<string> {
    const messages = [
      {
        role: 'system',
        content: 'You are a senior software engineer. Review code for bugs, efficiency, and best practices. Be constructive and educational.',
      },
      {
        role: 'user',
        content: `Review this ${language} implementation of ${algorithm}:

${code}

Highlight any bugs, discuss time/space complexity, and suggest optimizations. If the code looks good, mention that too.`,
      },
    ];

    return this.makeRequest(messages);
  }
}
