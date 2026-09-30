import { useMemo } from 'react';
import { useAppData } from '@/hooks/useappdata';
import { analyzeSkillGap } from '@/agents/gapagent';
import { recommendLearning } from '@/agents/learningagent';
import { Card, Badge, SectionTitle } from '@/components/ui';
import { GraduationCap, AlertCircle, ExternalLink, Clock, BookOpen, Award, Wrench, FileText, Code2 } from 'lucide-react';

const resourceTypeIcon: Record<string, typeof BookOpen> = {
  course: BookOpen,
  tutorial: FileText,
  documentation: FileText,
  project: Code2,
  practice: Wrench,
  certification: Award,
};

export function LearningPage() {
  const { loading, error, profile, careers, careerSkillsByCareer, userSkills, learningResources } = useAppData();

  const recommendations = useMemo(() => {
    if (!profile || !profile.target_career_id || careers.length === 0) return [];
    const career = careers.find((c) => c.id === profile.target_career_id);
    if (!career) return [];
    const careerSkills = careerSkillsByCareer[career.id] ?? [];
    const gapReport = analyzeSkillGap(career, careerSkills, userSkills);
    return recommendLearning(gapReport, learningResources);
  }, [profile, careers, careerSkillsByCareer, userSkills, learningResources]);

  if (loading) return <div className="py-20 text-center text-slate-400">Loading...</div>;
  if (error) return <Card className="p-6 text-rose-600 flex items-center gap-2"><AlertCircle className="w-5 h-5" />{error}</Card>;
  if (!profile || !profile.full_name)
    return <Card className="p-8 text-center"><p className="text-slate-500">Please complete your profile first.</p></Card>;
  if (!profile.target_career_id)
    return <Card className="p-8 text-center"><p className="text-slate-500">Please select a target career first.</p></Card>;

  return (
    <div>
      <SectionTitle
        title="Learning Recommendations"
        subtitle="Personalized resources for your skill gaps, ordered by priority"
        icon={<GraduationCap className="w-5 h-5" />}
      />

      {/* Flow diagram */}
      <Card className="p-5 mb-6 bg-teal-50/50 border-teal-100">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <span className="font-medium">Learning Flow:</span>
          {['Skill Gap', 'Resource', 'Practice', 'Mini Project', 'Assessment', 'Skill Improvement'].map((step, i) => (
            <span key={step} className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-white text-teal-700 text-xs font-medium border border-teal-100">{step}</span>
              {i < 5 && <span className="text-teal-300">→</span>}
            </span>
          ))}
        </div>
      </Card>

      {recommendations.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-slate-500">No learning recommendations — you may have already acquired all required skills!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, i) => {
            const Icon = resourceTypeIcon[rec.resource.resource_type] ?? BookOpen;
            return (
              <Card key={`${rec.resource.id}-${i}`} className="p-5 hover:shadow-md transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 text-sm leading-tight">{rec.resource.title}</h3>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <Badge color="teal">{rec.skill.name}</Badge>
                      <Badge color={rec.priority === 'high' ? 'rose' : rec.priority === 'medium' ? 'amber' : 'slate'}>
                        {rec.priority} priority
                      </Badge>
                      <Badge>{rec.resource.difficulty}</Badge>
                      {rec.resource.is_free ? <Badge color="green">Free</Badge> : <Badge color="slate">Paid</Badge>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-500 ml-13">
                  <div className="flex items-center gap-3">
                    <span>{rec.resource.platform}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{rec.resource.duration_hours}h</span>
                  </div>
                  {rec.resource.url && (
                    <a
                      href={rec.resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-teal-600 font-medium hover:text-teal-700"
                    >
                      Open <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}