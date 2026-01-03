import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-500 bg-clip-text text-transparent">
              Vartalaap AI 2.0
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-4">
            Real-Time Voice-Based English Learning Platform
          </p>
          <p className="text-lg text-slate-400 mb-8">
            AI interrupts mid-sentence to correct mistakes in your native language
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/practice">
              <Button size="lg">Start Free Practice</Button>
            </Link>
            <Link href="/interview">
              <Button size="lg" variant="outline">Interview Prep</Button>
            </Link>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <Card className="text-center">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-cyan-400 mb-3">
              Real-Time Interruption
            </h3>
            <p className="text-slate-400">
              AI corrects your grammar mistakes instantly (&lt; 300ms) - before you finish speaking!
            </p>
          </Card>

          <Card className="text-center">
            <div className="text-5xl mb-4">🌐</div>
            <h3 className="text-xl font-semibold text-cyan-400 mb-3">
              10+ Indian Languages
            </h3>
            <p className="text-slate-400">
              Get explanations in Hindi, Tamil, Telugu, Marathi, and more native languages
            </p>
          </Card>

          <Card className="text-center">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-cyan-400 mb-3">
              Domain-Specific Practice
            </h3>
            <p className="text-slate-400">
              Prepare for UPSC, Tech, Finance, and Business interviews with tailored questions
            </p>
          </Card>
        </div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Why Choose <span className="text-cyan-400">Vartalaap AI</span>?
          </h2>
          <Card>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4">Feature</th>
                  <th className="text-center py-3 px-4">GPT/Gemini Voice</th>
                  <th className="text-center py-3 px-4 text-cyan-400">Vartalaap AI 2.0</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-slate-800">
                  <td className="py-3 px-4">Real-time interruption</td>
                  <td className="text-center">❌</td>
                  <td className="text-center">✅ &lt; 300ms</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-3 px-4">Native language explanations</td>
                  <td className="text-center">❌</td>
                  <td className="text-center">✅ 10+ languages</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-3 px-4">Grammar-focused learning</td>
                  <td className="text-center">❌</td>
                  <td className="text-center">✅ Built for learning</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-3 px-4">Interview preparation</td>
                  <td className="text-center">Generic</td>
                  <td className="text-center">✅ Domain-specific</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-3 px-4">Indian context</td>
                  <td className="text-center">❌</td>
                  <td className="text-center">✅ Built for Indians</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Cost</td>
                  <td className="text-center">$20/month</td>
                  <td className="text-center">✅ ₹99/month</td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>

        {/* Use Cases */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Perfect For</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:border-cyan-500 transition-colors cursor-pointer">
              <div className="text-4xl mb-3">👨‍💻</div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">Tech Interviews</h3>
              <p className="text-sm text-slate-400">Software, Data Science, DevOps, Product</p>
            </Card>
            <Card className="text-center hover:border-cyan-500 transition-colors cursor-pointer">
              <div className="text-4xl mb-3">🏛️</div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">Government Exams</h3>
              <p className="text-sm text-slate-400">UPSC, NDA, CDS, SSC, Railway</p>
            </Card>
            <Card className="text-center hover:border-cyan-500 transition-colors cursor-pointer">
              <div className="text-4xl mb-3">💼</div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">Business</h3>
              <p className="text-sm text-slate-400">MBA, Marketing, HR, Sales</p>
            </Card>
            <Card className="text-center hover:border-cyan-500 transition-colors cursor-pointer">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">Finance</h3>
              <p className="text-sm text-slate-400">Banking, Investment, CA, Accounting</p>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link href="/practice">
            <Button size="lg">
              Start Your Free 30-Minute Session Today
            </Button>
          </Link>
          <p className="text-sm text-slate-500 mt-4">No credit card required</p>
        </div>
      </div>
    </div>
  );
}
