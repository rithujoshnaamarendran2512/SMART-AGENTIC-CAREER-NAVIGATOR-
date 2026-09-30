import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Compass, Mail, Lock, User as UserIcon, ArrowRight, AlertCircle } from 'lucide-react';

export function AuthPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    if (mode === 'signup' && !fullName.trim()) {
      setError('Please enter your name.');
      setSubmitting(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setSubmitting(false);
      return;
    }
    const result =
      mode === 'signin'
        ? await signIn(email, password)
        : await signUp(email, password, fullName);
    if (result.error) setError(result.error);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 via-teal-50 to-slate-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-600 text-white mb-4 shadow-lg shadow-teal-200">
            <Compass className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Agentic Career Navigator</h1>
          <p className="text-slate-500 mt-2 text-sm">
            A multi-agent system for real-time skill evolution
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'signup' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500'
              }`}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'signin' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500'
              }`}
            >
              Sign In
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                  placeholder="At least 6 characters"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 text-rose-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
              {!submitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}