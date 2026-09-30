import type {
  Career,
  CareerSkill,
  UserSkill,
  Skill,
  SkillGapRow,
  SkillGapReport,
} from '@/library/types';

/**
 * Skill Gap Analysis Agent
 *
 * Compares the user's existing skills against the skills required for a
 * target career. Categorizes each skill as:
 *   - acquired (gap = none)
 *   - partial  (gap = low/medium)
 *   - missing  (gap = high, user_level = 0)
 *
 * Produces a prioritized skill-gap report.
 */

function gapCategory(userLevel: number, requiredLevel: number): SkillGapRow['gap_category'] {
  const diff = requiredLevel - userLevel;
  if (diff <= 0) return 'none';
  if (diff === 1) return 'low';
  if (diff === 2) return 'medium';
  return 'high';
}

export function analyzeSkillGap(
  career: Career,
  careerSkills: CareerSkill[],
  userSkills: UserSkill[],
): SkillGapReport {
  const rows: SkillGapRow[] = careerSkills.map((cs) => {
    const userSkill = userSkills.find(
      (us) => us.skill_id === cs.skill_id,
    );
    const userLevel = userSkill?.skill_level ?? 0;
    const gap = Math.max(cs.required_level - userLevel, 0);
    return {
      skill: cs.skill as Skill,
      user_level: userLevel,
      required_level: cs.required_level,
      gap,
      gap_category: gapCategory(userLevel, cs.required_level),
      priority: cs.priority,
    };
  });

  const acquired = rows.filter((r) => r.gap_category === 'none');
  const partial = rows.filter((r) => r.gap_category === 'low' || r.gap_category === 'medium');
  const missing = rows.filter((r) => r.gap_category === 'high');

  const totalRequired = rows.length;
  const totalAchieved = rows.reduce(
    (sum, r) => sum + Math.min(r.user_level / r.required_level, 1),
    0,
  );
  const overall_gap_percentage =
    totalRequired > 0 ? Math.round((1 - totalAchieved / totalRequired) * 100) : 0;

  return {
    career,
    rows: rows.sort((a, b) => b.gap - a.gap),
    acquired,
    partial,
    missing,
    overall_gap_percentage,
  };
}
