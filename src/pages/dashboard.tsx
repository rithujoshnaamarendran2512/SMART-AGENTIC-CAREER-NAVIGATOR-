import { useMemo } from 'react';
import { useAppData } from '@/hooks/useappdata';
import { runFullPipeline } from '@/agents/orchestration-agent';
import { Card, ProgressBar, Badge, SectionTitle } from '@/components/ui';
import {
  LayoutDashboard,
  Briefcase,
  Target,
  TrendingUp,
  GraduationCap,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import type { PageKey } from '@/components/appshell';

export function DashboardPage({ onNavigate }: { onNavigate: (p: PageKey) => void }) {
  const {
    loading,
    error,
    profile,
    careers,
    careerSkillsByCareer,
    trends,
    learningResources,
    userSkills,
    projects,
    certifications,
    progress,
  } = useAppData();

  const result = useMemo(() => {
    if (!profile || careers.length === 0) return null;
    return runFullPipeline(
      {
        profile,
        userSkills,
        projects,
        certifications,
        careers,
        careerSkillsByCareer,
        trends,
        learningResources,
        progress,
      },
      profile.target_career_id,
    );
  }, [profile, careers, careerSkillsByCareer, trends, learningResources, userSkills, projects, certifications, progress]);

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-slate-400">Loading your dashboard...</div>;
  }
  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 text-rose-600">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </Card>
    );
  }

  if (!profile || !profile.full_name) {
    return (
      <Card className="p-8 text-center">
        <Target className="w-12 h-12 text-teal-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Welcome! Let's set up your profile.</h2>
        <p className="text-slate-500 mb-6">
          Before the agents can analyze your career path, you need to tell us about your education,
          skills, experience, and interests.
        </p>
        <button
          onClick={() => onNavigate('profile')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-all"
        >
          Build My Profile <ArrowRight className="w-4 h-4" />
        </button>
      </Card>
    );
  }

  if (!result) return null;

  const topCareers = result.careerRecommendations.slice(0, 3);
  const targetCareer = result.targetCareer;
  const gapReport = result.skillGapReport;
  const progressSummary = result.progressSummary;

  const stats = [
    {
      label: 'Skills Tracked',
      value: userSkills.length,
      icon: Target,
      color: 'text-teal-600 bg-teal-50',
    },
    {
      label: 'Career Readiness',
      value: progressSummary ? `${progressSummary.career_readiness}%` : '—',
      icon: Sparkles,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Skills to Learn',
      value: gapReport ? gapReport.missing.length + gapReport.partial.length : '—',
      icon: GraduationCap,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Industry Trends',
      value: trends.length,
      icon: TrendingUp,
      color: 'text-rose-600 bg-rose-50',
    },
  ];

  return (
    <div>
      <SectionTitle
        title={`Welcome, ${profile.full_name}`}
        subtitle="Your personalized career navigation overview"
        icon={<LayoutDashboard className="w-5 h-5" />}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{s.value}</div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Target career + readiness */}
      {targetCareer && progressSummary && (
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-slate-500 mb-1">Target Career</div>
              <h3 className="text-xl font-bold text-slate-800">{targetCareer.name}</h3>
            </div>
            <Badge color="teal">{targetCareer.domain}</Badge>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <div className="text-sm text-slate-500 mb-1">Career Readiness</div>
              <div className="text-2xl font-bold text-teal-600">{progressSummary.career_readiness}%</div>
            </div>
            <div>
              <div className="text-sm text-slate-500 mb-1">Skills Completed</div>
              <div className="text-2xl font-bold text-slate-800">{progressSummary.completed}</div>
            </div>
            <div>
              <div className="text-sm text-slate-500 mb-1">In Progress</div>
              <div className="text-2xl font-bold text-slate-800">{progressSummary.in_progress}</div>
            </div>
          </div>
          <ProgressBar value={progressSummary.career_readiness} label="Overall readiness" showValue color="bg-teal-500" />
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top career recommendations */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-800">Top Career Matches</h3>
          </div>
          <div className="space-y-3">
            {topCareers.map((rec, i) => (
              <div key={rec.career.id} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <span className="font-medium text-slate-800 truncate">{rec.career.name}</span>
                    <span className="text-sm font-bold text-teal-600 ml-2">{Math.round(rec.compatibility_score)}%</span>
                  </div>
                  <ProgressBar value={rec.compatibility_score} color="bg-teal-400" />
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => onNavigate('careers')}
            className="mt-4 text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            View all recommendations <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Card>

        {/* Skill gap summary */}
        {gapReport && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-slate-800">Skill Gap Summary</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Acquired skills</span>
                <span className="font-semibold text-emerald-600">{gapReport.acquired.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Partially developed</span>
                <span className="font-semibold text-amber-600">{gapReport.partial.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Missing skills</span>
                <span className="font-semibold text-rose-600">{gapReport.missing.length}</span>
              </div>
              <div className="pt-2">
                <ProgressBar
                  value={100 - gapReport.overall_gap_percentage}
                  label="Overall skill coverage"
                  showValue
                  color="bg-emerald-500"
                />
              </div>
            </div>
            <button
              onClick={() => onNavigate('skills')}
              className="mt-4 text-sm font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              View detailed analysis <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Card>
        )}
      </div>

      {/* Agent pipeline status */}
      <Card className="p-6 mt-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-teal-600" />
          <h3 className="font-bold text-slate-800">Agent Pipeline Status</h3>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          All 8 agents ran successfully. Your recommendations are based on your current profile
          and the latest industry trend data.
        </p>
        <div className="flex flex-wrap gap-2">
          {['Profile Agent', 'Career Agent', 'Skill Agent', 'Gap Agent', 'Trend Agent', 'Learning Agent', 'Roadmap Agent', 'Progress Agent'].map(
            (name) => (
              <span
                key={name}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {name}
              </span>
            ),
          )}
        </div>
        {!result.trendReport.is_live && (
          <p className="text-xs text-amber-600 mt-3 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            Industry trend data is currently simulated (demo). A live job-market API can be integrated via the modular trend layer.
          </p>
        )}
      </Card>
    </div>
  );
}
