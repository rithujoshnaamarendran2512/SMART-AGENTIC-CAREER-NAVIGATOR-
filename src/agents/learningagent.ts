import type {
  SkillGapReport,
  LearningResource,
  LearningRecommendationItem,
} from '@/library/types';

/**
 * Learning Recommendation Agent
 *
 * After the Skill Gap Agent identifies missing/partial skills, this agent
 * recommends learning resources for each gap. Recommendations are ordered
 * by gap severity and skill priority, and filtered by the user's current
 * level so beginners aren't pushed to advanced resources.
 *
 * Flow: Skill Gap → Learning Resource → Practice → Mini Project → Assessment
 */

export function recommendLearning(
  gapReport: SkillGapReport,
  resources: LearningResource[],
): LearningRecommendationItem[] {
  const items: LearningRecommendationItem[] = [];

  // Combine missing + partial skills, sorted by gap size (missing first)
  const skillsToLearn = [...gapReport.missing, ...gapReport.partial];

  for (const row of skillsToLearn) {
    const skillResources = resources.filter(
      (r) => r.skill_id === row.skill.id,
    );

    // Pick difficulty appropriate to the user's current level
    const appropriateResources = skillResources.filter((r) => {
      if (row.user_level === 0) return r.difficulty === 'beginner';
      if (row.user_level <= 2) return r.difficulty !== 'advanced';
      return true;
    });

    const selected = appropriateResources.length > 0 ? appropriateResources : skillResources;

    for (const resource of selected) {
      items.push({
        resource,
        skill: row.skill,
        gap_category: row.gap_category,
        priority: row.priority,
        estimated_duration: resource.duration_hours,
      });
    }
  }

  return items;
}
