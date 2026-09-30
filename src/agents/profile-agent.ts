import type {
  Profile,
  UserSkill,
  UserProject,
  UserCertification,
  StructuredProfile,
  Skill,
} from '@/library/types';

/**
 * Profile Analysis Agent
 *
 * Analyzes the user's education, skills, experience, projects,
 * certifications, and interests to produce a structured profile.
 * This is the first agent in the pipeline — its output feeds the
 * Career Recommendation Agent.
 */

export function analyzeProfile(
  profile: Profile,
  userSkills: UserSkill[],
  projects: UserProject[],
  certifications: UserCertification[],
): StructuredProfile {
  const skills = userSkills.map((us) => ({
    name: us.skill?.name ?? 'Unknown',
    level: us.skill_level,
    category: us.skill?.category ?? 'General',
  }));

  const avgLevel =
    skills.length > 0
      ? skills.reduce((sum, s) => sum + s.level, 0) / skills.length
      : 0;

  const current_skill_level: 'beginner' | 'intermediate' | 'advanced' =
    avgLevel >= 3.5 ? 'advanced' : avgLevel >= 2 ? 'intermediate' : 'beginner';

  return {
    full_name: profile.full_name,
    education: profile.education,
    education_field: profile.education_field,
    experience_years: profile.experience_years,
    experience_summary: profile.experience_summary,
    interests: profile.interests ?? [],
    skills,
    projects,
    certifications,
    current_skill_level,
  };
}

/**
 * Categorize skills by category for the profile display.
 */
export function groupSkillsByCategory(
  skills: { name: string; level: number; category: string }[],
): Record<string, { name: string; level: number }[]> {
  const groups: Record<string, { name: string; level: number }[]> = {};
  for (const s of skills) {
    if (!groups[s.category]) groups[s.category] = [];
    groups[s.category].push({ name: s.name, level: s.level });
  }
  return groups;
}