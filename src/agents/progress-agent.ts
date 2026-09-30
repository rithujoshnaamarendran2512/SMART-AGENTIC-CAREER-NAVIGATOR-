import type {
  ProgressRecord,
  SkillGapReport,
  Career,
  CareerSkill,
  UserSkill,
  ProgressSummary,
  SkillGapRow,
} from '@/library/types';
import { analyzeSkillGap } from '@/agents/gapagent';

/**
 * Progress Tracking Agent
 *
 * Tracks the user's learning progress and recalculates skill gaps and
 * career readiness whenever progress changes. This is the core of the
 * "continuous skill evolution" feedback loop:
 *
 *   Progress changes → recalculate gaps → recalculate readiness →
 *   updated recommendations → updated roadmap
 */

export function trackProgress(
  career: Career,
  careerSkills: CareerSkill[],
  userSkills: UserSkill[],
  progressRecords: ProgressRecord[],
): ProgressSummary {
  const gapReport = analyzeSkillGap(career, careerSkills, userSkills);

  // Map progress by skill_id
  const progressBySkill: Record<string, ProgressRecord> = {};
  for (const p of progressRecords) {
    progressBySkill[p.skill_id] = p;
  }

  // Count progress across all skills relevant to the career
  const relevantSkillIds = careerSkills.map((cs) => cs.skill_id);
  let completed = 0;
  let inProgress = 0;
  let notStarted = 0;

  for (const skillId of relevantSkillIds) {
    const rec = progressBySkill[skillId];
    if (!rec || rec.status === 'not_started') {
      notStarted++;
    } else if (rec.status === 'in_progress') {
      inProgress++;
    } else if (rec.status === 'completed') {
      completed++;
    }
  }

  const totalSkills = relevantSkillIds.length;
  const overall_percentage =
    totalSkills > 0
      ? Math.round(
          ((completed + inProgress * 0.5) / totalSkills) * 100,
        )
      : 0;

  // Career readiness = inverse of overall gap + progress boost
  const gapReduction = overall_percentage / 100;
  const career_readiness = Math.round(
    Math.min((1 - gapReport.overall_gap_percentage / 100) * 100 * gapReduction + (1 - gapReduction) * (1 - gapReport.overall_gap_percentage / 100) * 100, 100),
  );

  const remaining_gaps: SkillGapRow[] = gapReport.rows.filter(
    (r) => r.gap_category !== 'none',
  );

  return {
    total_skills: totalSkills,
    completed,
    in_progress: inProgress,
    not_started: notStarted,
    overall_percentage,
    career_readiness,
    remaining_gaps,
  };
}