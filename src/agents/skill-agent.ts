import type { Career, CareerSkill } from '@/library/types';

/**
 * Skill Requirement Agent
 *
 * For a given career, returns the structured list of required skills
 * (core technical skills, tools, soft skills) with required proficiency
 * and priority. This data comes from the career_skills catalog table.
 */

export interface SkillRequirement {
  skill_id: string;
  skill_name: string;
  category: string;
  required_level: number;
  priority: 'high' | 'medium' | 'low';
}

export function getRequiredSkills(
  career: Career,
  careerSkills: CareerSkill[],
): SkillRequirement[] {
  return careerSkills
    .map((cs) => ({
      skill_id: cs.skill_id,
      skill_name: cs.skill?.name ?? 'Unknown',
      category: cs.skill?.category ?? 'General',
      required_level: cs.required_level,
      priority: cs.priority,
    }))
    .sort((a, b) => {
      const prioOrder = { high: 0, medium: 1, low: 2 };
      if (prioOrder[a.priority] !== prioOrder[b.priority]) {
        return prioOrder[a.priority] - prioOrder[b.priority];
      }
      return b.required_level - a.required_level;
    });
}

export function groupRequirementsByCategory(
  reqs: SkillRequirement[],
): Record<string, SkillRequirement[]> {
  const groups: Record<string, SkillRequirement[]> = {};
  for (const r of reqs) {
    if (!groups[r.category]) groups[r.category] = [];
    groups[r.category].push(r);
  }
  return groups;
}