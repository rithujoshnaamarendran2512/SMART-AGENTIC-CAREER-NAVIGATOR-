import { useMemo } from 'react';
import { useAppData } from '@/hooks/useappdata';
import { analyzeSkillGap } from '@/agents/gapagent';
import { prioritizeByTrends } from '@/agents/trend-agent';
import { Card, Badge, SectionTitle, ProgressBar, SkillLevelDots } from '@/components/ui';
import { BarChart3, AlertCircle, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export function SkillsPage() {
  const { loading, error, profile, careers, careerSkillsByCareer, userSkills, trends } = useAppData();

  const gapReport = useMemo(() => {
    if (!profile || !profile.target_career_id || careers.length === 0) return null;
    const career = careers.find((c) => c.id === profile.target_career_id);
    if (!career) return null;
    const careerSkills = careerSkillsByCareer[career.id] ?? [];
    const report = analyzeSkillGap(career, careerSkills, userSkills);
    return { ...report, rows: prioritizeByTrends(report.rows, trends) };
  }, [profile, careers, careerSkillsByCareer, userSkills, trends]);

  if (loading) return <div className="py-20 text-center text-slate-400">Loading...</div>;
  if (error) return <Card className="p-6 text-rose-600 flex items-center gap-2"><AlertCircle className="w-5 h-5" />{error}</Card>;
  if (!profile || !profile.full_name)
    return <Card className="p-8 text-center"><p className="text-slate-500">Please complete your profile first.</p></Card>;
  if (!profile.target_career_id)
    return <Card className="p-8 text-center"><p className="text-slate-500">Please select a target career from the Career Recommendations page first.</p></Card>;
  if (!gapReport) return null;

  const gapIcon = (cat: string) => {
    if (cat === 'none') return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (cat === 'low' || cat === 'medium') return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    return <XCircle className="w-4 h-4 text-rose-500" />;
  };

  const gapBadge = (cat: string) => {
    if (cat === 'none') return <Badge color="green">Acquired</Badge>;
    if (cat === 'low') return <Badge color="amber">Low Gap</Badge>;
    if (cat === 'medium') return <Badge color="amber">Medium Gap</Badge>;
    return <Badge color="rose">High Gap</Badge>;
  };

  return (
    <div>
      <SectionTitle
        title="Skill Gap Analysis"
        subtitle={`Comparing your skills against ${gapReport.career.name} requirements`}
        icon={<BarChart3 className="w-5 h-5" />}
      />

      {/* Overall gap */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-slate-500">Overall Skill Coverage</div>
            <div className="text-3xl font-bold text-slate-800">{100 - gapReport.overall_gap_percentage}%</div>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{gapReport.acquired.length}</div>
              <div className="text-xs text-slate-400">Acquired</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{gapReport.partial.length}</div>
              <div className="text-xs text-slate-400">Partial</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-rose-600">{gapReport.missing.length}</div>
              <div className="text-xs text-slate-400">Missing</div>
            </div>
          </div>
        </div>
        <ProgressBar value={100 - gapReport.overall_gap_percentage} color="bg-emerald-500" />
      </Card>

      {/* Detailed table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Detailed Skill Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Skill</th>
                <th className="px-6 py-3 text-left font-medium">Category</th>
                <th className="px-6 py-3 text-center font-medium">Your Level</th>
                <th className="px-6 py-3 text-center font-medium">Required</th>
                <th className="px-6 py-3 text-center font-medium">Gap</th>
                <th className="px-6 py-3 text-center font-medium">Priority</th>
                <th className="px-6 py-3 text-center font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {gapReport.rows.map((row) => (
                <tr key={row.skill.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 font-medium text-slate-800">{row.skill.name}</td>
                  <td className="px-6 py-3 text-slate-500">{row.skill.category}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <SkillLevelDots level={row.user_level} />
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <SkillLevelDots level={row.required_level} />
                    </div>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className={`font-semibold ${row.gap === 0 ? 'text-emerald-600' : row.gap <= 2 ? 'text-amber-600' : 'text-rose-600'}`}>
                      {row.gap === 0 ? 'None' : `+${row.gap}`}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <Badge color={row.priority === 'high' ? 'rose' : row.priority === 'medium' ? 'amber' : 'slate'}>
                      {row.priority}
                    </Badge>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-center gap-1.5">
                      {gapIcon(row.gap_category)}
                      {gapBadge(row.gap_category)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="text-xs text-slate-400 mt-4">
        Skills are prioritized by combining gap size with industry trend data — skills that are both
        missing and highly demanded appear first.
      </p>
    </div>
  );
}