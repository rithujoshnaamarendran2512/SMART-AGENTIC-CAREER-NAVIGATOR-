import { Compass, Brain, Target, TrendingUp, GraduationCap, Map, BarChart3, Sparkles, ArrowRight, Bot, Workflow } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function HomePage() {
  const { user, signIn, signOut } = useAuth();

  const agents = [
    { icon: Target, name: 'Profile Analysis', desc: 'Analyzes your education, skills, experience, and interests into a structured profile.' },
    { icon: Compass, name: 'Career Recommendation', desc: 'Ranks careers by a transparent compatibility score across five weighted factors.' },
    { icon: Brain, name: 'Skill Requirement', desc: 'Identifies the exact skills, tools, and proficiency levels each career demands.' },
    { icon: BarChart3, name: 'Skill Gap Analysis', desc: 'Compares your current skills against requirements to pinpoint what is missing.' },
    { icon: TrendingUp, name: 'Industry Trend', desc: 'Monitors emerging and declining skills so recommendations stay current.' },
    { icon: GraduationCap, name: 'Learning Recommendation', desc: 'Suggests courses, tutorials, and projects tailored to your gaps and level.' },
    { icon: Map, name: 'Career Roadmap', desc: 'Builds a 7-phase adaptive plan from foundation through job readiness.' },
    { icon: Sparkles, name: 'Progress Tracking', desc: 'Tracks your progress and continuously re-evaluates your career readiness.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-teal-700 to-slate-800" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur text-teal-100 text-sm mb-6 border border-white/20">
            <Bot className="w-4 h-4" />
            Multi-Agent AI System
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            The Agentic Career Navigator
          </h1>
          <p className="mt-4 text-lg md:text-xl text-teal-100 max-w-2xl mx-auto">
            A multi-agent system for real-time skill evolution. Eight specialized AI agents
            collaborate to turn your skills and interests into an adaptive, personalized career plan.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            {user ? (
              <>
                <a
                  href="#/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-teal-700 font-semibold hover:bg-teal-50 transition-all shadow-lg"
                >
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  onClick={signOut}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-all border border-white/20"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <a
                href="#/auth"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-teal-700 font-semibold hover:bg-teal-50 transition-all shadow-lg text-lg"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Pipeline overview */}
      <section className="max-w-6xl mx-auto px-4 -mt-12 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <Workflow className="w-6 h-6 text-teal-600" />
            <h2 className="text-xl font-bold text-slate-800">The Agent Pipeline</h2>
          </div>
          <p className="text-slate-500 text-sm mb-4">
            Unlike a simple chatbot, this system runs specialized agents in sequence — each one's
            output feeds the next, forming a continuous feedback loop.
          </p>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {['Profile', 'Career', 'Skills', 'Gap', 'Trends', 'Learning', 'Roadmap', 'Progress'].map(
              (step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 font-medium border border-teal-100">
                    {step}
                  </span>
                  {i < 7 && <ArrowRight className="w-3.5 h-3.5 text-slate-300" />}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Agents grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800">Eight Specialized Agents</h2>
          <p className="text-slate-500 mt-2">Each agent has a single responsibility. Together, they form an intelligent decision-support system.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {agents.map((agent) => (
            <div
              key={agent.name}
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-teal-200 transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                <agent.icon className="w-5.5 h-5.5" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1.5">{agent.name}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{agent.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key differentiator */}
      <section className="bg-slate-800 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Continuous Skill Evolution</h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Traditional systems give a static recommendation. This system continuously compares your
            current skills with current industry requirements, then updates your gap analysis,
            learning plan, and career readiness every time you make progress.
          </p>
          <div className="mt-8 flex flex-wrap justify-center items-center gap-3 text-sm text-slate-300">
            <span className="px-4 py-2 rounded-lg bg-white/10">Current Skills</span>
            <ArrowRight className="w-4 h-4 text-teal-400" />
            <span className="px-4 py-2 rounded-lg bg-white/10">Industry Requirements</span>
            <ArrowRight className="w-4 h-4 text-teal-400" />
            <span className="px-4 py-2 rounded-lg bg-white/10">Updated Gap</span>
            <ArrowRight className="w-4 h-4 text-teal-400" />
            <span className="px-4 py-2 rounded-lg bg-teal-500 text-white font-medium">Updated Plan</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-3">Ready to navigate your career?</h2>
        <p className="text-slate-500 mb-6">Create a free account, build your profile, and let the agents do the rest.</p>
        {user ? (
          <a href="#/dashboard" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-all shadow-lg">
            Go to Dashboard <ArrowRight className="w-5 h-5" />
          </a>
        ) : (
          <button
            onClick={() => { window.location.hash = '/auth'; }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-all shadow-lg"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </section>

      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-400">
        Agentic Career Navigator &middot; Academic Project &middot; Multi-Agent Architecture
      </footer>
    </div>
  );
}