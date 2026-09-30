import { useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAppData } from '@/hooks/useappdata';
import { trackProgress } from '@/agents/progress-agent';
import { setProgress } from '@/library/userdata';
import { Card, Badge, SectionTitle, ProgressBar, SkillLevelDots } from '@/components/ui';
import { LineChart, AlertCircle, RefreshCw, CheckCircle2, Clock, Circle, TrendingUp } from 'lucide-react';

export function ProgressPage() {
  const { user } = useAuth();
  const { loading, error, profile, careers, careerSkillsByCareer, userSkills, progress, reload } = useAppData();
  const [updating, setUpdating] = useState(false);

  const summary = useMemo(() => {
    if (!profile || !profile.target_career_id || careers.length === 0) return null;
    const career = careers.find((c) => c.id === profile.target_career_id);
    if (!career) return null;
    const careerSkills = careerSkillsByCareer[career.id] ?? [];
    return trackProgress(career, careerSkills, userSkills, progress);
  }, [profile, careers, careerSkillsByCareer, userSkills, progress]);

  const handleUpdateProgress = async (skillId: string, percentage: number, status: 'not_started' | 'in_progress' | 'completed') => {
    if (!user) return;
    setUpdating(true);
    try {
      await setProgress(user.id, skillId, percentage, status);
      await reload();
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="py-20 text-center text-slate-400">Loading...</div>;
  if (error) return <Card className="p-6 text-rose-600 flex items-center gap-2"><AlertCircle className="w-5 h-5" />{error}</Card>;
  if (!profile || !profile.full_name)
    return <Card className="p-8 text-center"><p className="text-slate-500">Please complete your profile first.</p></Card>;
  if (!profile.target_career_id)
    return <Card className="p-8 text-center"><p className="text-slate-500">Please select a target career first.</p></Card>;
  if (!summary) return null;

  const targetCareer = careers.find((c) => c.id === profile.target_career_id);
  const careerSkills = targetCareer ? careerSkillsByCareer[targetCareer.id] ?? [] : [];

  const progressBySkill: Record<string, typeof progress[number]> = {};
  for (const p of progress) progressBySkill[p.skill_id] = p;

  return (
    <div>
      <SectionTitle
        title="Progress Tracking"
        subtitle="The Progress Agent continuously re-evaluates your career readiness"
        icon={<LineChart className="w-5 h-5" />}
      />

      {/* Re-evaluation notice */}
      <Card className="p-4 mb-6 bg-teal-50/50 border-teal-100">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-teal-600 flex-shrink-0" />
          <p className="text-sm text-slate-600">
            <strong className="text-slate-800">Continuous Skill Evolution:</strong> When you update your progress,
            the system recalculates your skill gaps, career readiness, and recommended next steps automatically.
          </p>
        </div>
      </Card>

      {/* Overview stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-5 text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-800">{summary.completed}</div>
          <div className="text-sm text-slate-500">Completed</div>
        </Card>
        <Card className="p-5 text-center">
          <Clock className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-800">{summary.in_progress}</div>
          <div className="text-sm text-slate-500">In Progress</div>
        </Card>
        <Card className="p-5 text-center">
          <Circle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-800">{summary.not_started}</div>
          <div className="text-sm text-slate-500">Not Started</div>
        </Card>
        <Card className="p-5 text-center">
          <TrendingUp className="w-8 h-8 text-teal-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-teal-600">{summary.career_readiness}%</div>
          <div className="text-sm text-slate-500">Career Readiness</div>
        </Card>
      </div>

      {/* Overall progress bar */}
      <Card className="p-6 mb-6">
        <ProgressBar value={summary.overall_percentage} label="Overall learning progress" showValue color="bg-teal-500" />
        <ProgressBar value={summary.career_readiness} label="Career readiness score" showValue color="bg-emerald-500" />
      </Card>

      {/* Skill-by-skill progress */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Skill Progress Tracker</h3>
          <p className="text-sm text-slate-400 mt-0.5">Update your progress for each skill required by your target career</p>
        </div>
        <div className="divide-y divide-slate-100">
          {careerSkills.map((cs) => {
            const rec = progressBySkill[cs.skill_id];
            const status = rec?.status ?? 'not_started';
            const pct = rec?.progress_percentage ?? 0;
            return (
              <div key={cs.skill_id} className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-800 text-sm">{cs.skill?.name}</span>
                    <Badge color={cs.priority === 'high' ? 'rose' : cs.priority === 'medium' ? 'amber' : 'slate'}>
                      {cs.priority}
                    </Badge>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-400">Required:</span>
                      <SkillLevelDots level={cs.required_level} />
                    </div>
                  </div>
                  <Badge color={status === 'completed' ? 'green' : status === 'in_progress' ? 'amber' : 'slate'}>
                    {status === 'completed' ? 'Completed' : status === 'in_progress' ? 'In Progress' : 'Not Started'}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <ProgressBar value={pct} color={status === 'completed' ? 'bg-emerald-500' : 'bg-teal-400'} />
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleUpdateProgress(cs.skill_id, 0, 'not_started')}
                      disabled={updating}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                    >
                      0%
                    </button>
                    <button
                      onClick={() => handleUpdateProgress(cs.skill_id, 25, 'in_progress')}
                      disabled={updating}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all"
                    >
                      25%
                    </button>
                    <button
                      onClick={() => handleUpdateProgress(cs.skill_id, 50, 'in_progress')}
                      disabled={updating}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all"
                    >
                      50%
                    </button>
                    <button
                      onClick={() => handleUpdateProgress(cs.skill_id, 75, 'in_progress')}
                      disabled={updating}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-teal-50 text-teal-600 hover:bg-teal-100 transition-all"
                    >
                      75%
                    </button>
                    <button
                      onClick={() => handleUpdateProgress(cs.skill_id, 100, 'completed')}
                      disabled={updating}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Remaining gaps */}
      {summary.remaining_gaps.length > 0 && (
        <Card className="p-6 mt-6">
          <h3 className="font-bold text-slate-800 mb-3">Remaining Skill Gaps</h3>
          <div className="flex flex-wrap gap-2">
            {summary.remaining_gaps.map((g) => (
              <span
                key={g.skill.id}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                  g.gap_category === 'high'
                    ? 'bg-rose-50 text-rose-600 border-rose-100'
                    : 'bg-amber-50 text-amber-600 border-amber-100'
                }`}
              >
                {g.skill.name} (+{g.gap})
              </span>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}