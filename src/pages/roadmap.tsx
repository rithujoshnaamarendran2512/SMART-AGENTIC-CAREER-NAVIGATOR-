import { useMemo } from 'react';
import { useAppData } from '@/hooks/useappdata';
import { analyzeSkillGap } from '@/agents/gapagent';
import { generateRoadmap } from '@/agents/roadmap-agent';
import { recommendLearning } from '@/agents/learningagent';
import { Card, Badge, SectionTitle } from '@/components/ui';
import { Map, AlertCircle, Flag, CheckCircle } from 'lucide-react';

const phaseColors = [
  'border-teal-200 bg-teal-50/50',
  'border-blue-200 bg-blue-50/50',
  'border-emerald-200 bg-emerald-50/50',
  'border-purple-200 bg-purple-50/50',
  'border-amber-200 bg-amber-50/50',
  'border-rose-200 bg-rose-50/50',
  'border-slate-300 bg-slate-50',
];

export function RoadmapPage() {
  const { loading, error, profile, careers, careerSkillsByCareer, userSkills, learningResources } = useAppData();

  const roadmap = useMemo(() => {
    if (!profile || !profile.target_career_id || careers.length === 0) return null;
    const career = careers.find((c) => c.id === profile.target_career_id);
    if (!career) return null;
    const careerSkills = careerSkillsByCareer[career.id] ?? [];
    const gapReport = analyzeSkillGap(career, careerSkills, userSkills);
    const recs = recommendLearning(gapReport, learningResources);
    return generateRoadmap(career, gapReport, recs);
  }, [profile, careers, careerSkillsByCareer, userSkills, learningResources]);

  if (loading) return <div className="py-20 text-center text-slate-400">Loading...</div>;
  if (error) return <Card className="p-6 text-rose-600 flex items-center gap-2"><AlertCircle className="w-5 h-5" />{error}</Card>;
  if (!profile || !profile.full_name)
    return <Card className="p-8 text-center"><p className="text-slate-500">Please complete your profile first.</p></Card>;
  if (!profile.target_career_id)
    return <Card className="p-8 text-center"><p className="text-slate-500">Please select a target career first.</p></Card>;
  if (!roadmap) return null;

  return (
    <div>
      <SectionTitle
        title="Career Roadmap"
        subtitle={`Your personalized 7-phase plan to become a ${roadmap.career.name}`}
        icon={<Map className="w-5 h-5" />}
      />

      <Card className="p-5 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">Estimated Duration</div>
            <div className="text-2xl font-bold text-slate-800">{roadmap.total_weeks} weeks</div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Flag className="w-4 h-4 text-teal-500" />
            Goal: {roadmap.career.name}
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {roadmap.phases.map((phase, i) => (
          <div key={phase.phase} className="relative">
            {/* Connector line */}
            {i < roadmap.phases.length - 1 && (
              <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-slate-200" style={{ height: 'calc(100% + 1rem)' }} />
            )}
            <Card className={`p-5 border-2 ${phaseColors[i] ?? phaseColors[0]} relative`}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center font-bold text-slate-700 shadow-sm">
                  {phase.phase}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-slate-800">{phase.title}</h3>
                    <Badge color="slate">{phase.estimated_weeks} weeks</Badge>
                  </div>
                  <p className="text-sm text-slate-500 mb-3">{phase.description}</p>
                  <ul className="space-y-1.5">
                    {phase.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  {phase.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {phase.skills.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded text-xs bg-white text-slate-600 border border-slate-200">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}