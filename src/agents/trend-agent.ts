import type { IndustryTrend, TrendReport, SkillGapRow } from '@/library/types';

/**
 * Industry Trend Agent
 *
 * Analyzes industry/job-market trend data and identifies emerging and
 * declining skills. The data source is labeled via the `source` field
 * on each trend record — 'demo' for simulated data, 'live' for real
 * API-sourced data. This agent does NOT fabricate live data.
 *
 * The architecture is modular: a real job-market API (e.g. a job board
 * or labor statistics API) can be connected later by writing trend rows
 * with source='live'. The agent logic stays the same.
 */

export function analyzeTrends(trends: IndustryTrend[]): TrendReport {
  const sorted = [...trends].sort((a, b) => Number(b.trend_score) - Number(a.trend_score));

  const emerging = sorted.filter(
    (t) => t.demand_level === 'high' && Number(t.trend_score) >= 75,
  );
  const declining = sorted.filter(
    (t) => t.demand_level === 'low' || t.demand_level === 'declining',
  );

  const hasLive = trends.some((t) => t.source === 'live');
  const lastUpdated =
    trends.length > 0
      ? trends.reduce((latest, t) =>
          new Date(t.updated_at) > new Date(latest.updated_at) ? t : latest,
        ).updated_at
      : new Date().toISOString();

  return {
    trends: sorted,
    emerging,
    declining,
    is_live: hasLive,
    last_updated: lastUpdated,
  };
}

/**
 * Cross-reference the skill gap report with industry trends to find
 * skills that are both missing AND highly demanded — these should be
 * prioritized in the learning roadmap.
 */
export function prioritizeByTrends(
  gaps: SkillGapRow[],
  trends: IndustryTrend[],
): SkillGapRow[] {
  return [...gaps].sort((a, b) => {
    const aTrend = trends.find(
      (t) => t.skill_name.toLowerCase() === a.skill.name.toLowerCase(),
    );
    const bTrend = trends.find(
      (t) => t.skill_name.toLowerCase() === b.skill.name.toLowerCase(),
    );
    const aScore = aTrend ? Number(aTrend.trend_score) : 50;
    const bScore = bTrend ? Number(bTrend.trend_score) : 50;
    // Higher trend score + larger gap = higher priority
    const aPriority = aScore + a.gap * 10;
    const bPriority = bScore + b.gap * 10;
    return bPriority - aPriority;
  });
}