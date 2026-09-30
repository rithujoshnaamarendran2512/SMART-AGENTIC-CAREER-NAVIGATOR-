import { useMemo } from 'react';
import { useAppData } from '@/hooks/useappdata';
import { analyzeTrends } from '@/agents/trend-agent';
import { Card, Badge, SectionTitle, ProgressBar } from '@/components/ui';
import { TrendingUp, AlertCircle, ArrowUpRight, ArrowDownRight, Minus, Info } from 'lucide-react';

export function TrendsPage() {
  const { loading, error, trends } = useAppData();

  const report = useMemo(() => analyzeTrends(trends), [trends]);

  if (loading) return <div className="py-20 text-center text-slate-400">Loading trends...</div>;
  if (error) return <Card className="p-6 text-rose-600 flex items-center gap-2"><AlertCircle className="w-5 h-5" />{error}</Card>;

  const demandIcon = (level: string) => {
    if (level === 'high') return <ArrowUpRight className="w-4 h-4 text-emerald-500" />;
    if (level === 'declining' || level === 'low') return <ArrowDownRight className="w-4 h-4 text-rose-500" />;
    return <Minus className="w-4 h-4 text-amber-500" />;
  };

  const demandBadge = (level: string) => {
    if (level === 'high') return <Badge color="green">High Demand</Badge>;
    if (level === 'medium') return <Badge color="amber">Medium</Badge>;
    if (level === 'low') return <Badge color="rose">Low</Badge>;
    return <Badge color="rose">Declining</Badge>;
  };

  return (
    <div>
      <SectionTitle
        title="Industry Trends"
        subtitle="The Industry Trend Agent monitors skill demand across the job market"
        icon={<TrendingUp className="w-5 h-5" />}
      />

      {/* Data source notice */}
      <Card className={`p-4 mb-6 ${report.is_live ? 'bg-emerald-50/50 border-emerald-100' : 'bg-amber-50/50 border-amber-100'}`}>
        <div className="flex items-start gap-3">
          <Info className={`w-5 h-5 flex-shrink-0 mt-0.5 ${report.is_live ? 'text-emerald-600' : 'text-amber-600'}`} />
          <div className="text-sm text-slate-600">
            <strong className={report.is_live ? 'text-emerald-700' : 'text-amber-700'}>
              {report.is_live ? 'Live Data' : 'Demo/Simulated Data'}
            </strong>
            {' — '}
            {report.is_live
              ? 'Trend data is sourced from a live job-market API.'
              : 'Trend data is currently simulated for demonstration. The modular trend layer supports connecting a real job-market API (e.g. a job board or labor statistics API) — trend rows would then be stored with source=\'live\'.'}
            <div className="text-xs text-slate-400 mt-1">Last updated: {new Date(report.last_updated).toLocaleString()}</div>
          </div>
        </div>
      </Card>

      {/* Emerging & declining summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <ArrowUpRight className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-800">Emerging Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {report.emerging.map((t) => (
              <span key={t.id} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-100">
                {t.skill_name}
              </span>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <ArrowDownRight className="w-5 h-5 text-rose-600" />
            <h3 className="font-bold text-slate-800">Declining Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {report.declining.length > 0 ? report.declining.map((t) => (
              <span key={t.id} className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 text-sm font-medium border border-rose-100">
                {t.skill_name}
              </span>
            )) : <span className="text-sm text-slate-400">None identified</span>}
          </div>
        </Card>
      </div>

      {/* Full trend table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">All Tracked Skills</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {report.trends.map((t) => (
            <div key={t.id} className="px-6 py-4 hover:bg-slate-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {demandIcon(t.demand_level)}
                  <span className="font-medium text-slate-800">{t.skill_name}</span>
                  {demandBadge(t.demand_level)}
                </div>
                <span className="text-sm font-bold text-slate-700">{Math.round(Number(t.trend_score))}/100</span>
              </div>
              <ProgressBar value={Number(t.trend_score)} color={Number(t.trend_score) >= 75 ? 'bg-emerald-500' : Number(t.trend_score) >= 50 ? 'bg-amber-500' : 'bg-rose-400'} />
              {t.notes && <p className="text-xs text-slate-400 mt-1.5">{t.notes}</p>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
