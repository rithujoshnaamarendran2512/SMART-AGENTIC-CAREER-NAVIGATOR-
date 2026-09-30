import type {
  Career,
  SkillGapReport,
  CareerRoadmap,
  RoadmapPhase,
  LearningRecommendationItem,
} from '@/library/types';

/**
 * Career Roadmap Agent
 *
 * Generates a personalized, adaptive 7-phase career roadmap based on the
 * user's skill gap report and learning recommendations. The roadmap is
 * NOT fixed — it adapts to which skills the user already has vs. which
 * are missing, and the phases are populated dynamically.
 */

export function generateRoadmap(
  career: Career,
  gapReport: SkillGapReport,
  learningRecs: LearningRecommendationItem[],
): CareerRoadmap {
  const missing = gapReport.missing;
  const partial = gapReport.partial;
  const acquired = gapReport.acquired;

  // Foundation: core concepts the user doesn't yet have at a basic level
  const foundationSkills = missing
    .filter((m) => m.priority === 'high')
    .slice(0, 4)
    .map((m) => m.skill.name);

  // Skill development: all remaining gaps
  const developmentSkills = [...missing, ...partial]
    .filter((m) => !foundationSkills.includes(m.skill.name))
    .map((m) => m.skill.name);

  // Practical application: projects from learning resources
  const projectRecs = learningRecs
    .filter((l) => l.resource.resource_type === 'project' || l.resource.resource_type === 'practice')
    .slice(0, 4)
    .map((l) => l.resource.title);

  // Advanced skills
  const advancedSkills = missing
    .filter((m) => m.skill.category === 'Machine Learning' || m.skill.category === 'Data Science')
    .map((m) => m.skill.name)
    .slice(0, 4);

  // Portfolio: highlight acquired + newly learned skills
  const portfolioSkills = [...acquired.map((a) => a.skill.name), ...foundationSkills].slice(0, 5);

  const phases: RoadmapPhase[] = [
    {
      phase: 1,
      title: 'Foundation',
      description: 'Learn the fundamental concepts needed for your target career.',
      items:
        foundationSkills.length > 0
          ? foundationSkills.map((s) => `Learn fundamentals of ${s}`)
          : ['Review core concepts relevant to your career path'],
      skills: foundationSkills,
      estimated_weeks: 4,
    },
    {
      phase: 2,
      title: 'Skill Development',
      description: 'Develop the technical skills required for your target role.',
      items: developmentSkills.map((s) => `Build proficiency in ${s}`),
      skills: developmentSkills.slice(0, 6),
      estimated_weeks: 8,
    },
    {
      phase: 3,
      title: 'Practical Application',
      description: 'Apply what you have learned through hands-on projects.',
      items:
        projectRecs.length > 0
          ? projectRecs.map((p) => `Complete: ${p}`)
          : ['Build a small project applying your new skills'],
      skills: developmentSkills.slice(0, 3),
      estimated_weeks: 4,
    },
    {
      phase: 4,
      title: 'Advanced Skills',
      description: 'Learn advanced technologies and deepen your expertise.',
      items:
        advancedSkills.length > 0
          ? advancedSkills.map((s) => `Master ${s}`)
          : ['Explore advanced topics in your domain'],
      skills: advancedSkills,
      estimated_weeks: 6,
    },
    {
      phase: 5,
      title: 'Portfolio',
      description: 'Build a GitHub portfolio showcasing your projects.',
      items: [
        `Create portfolio projects using: ${portfolioSkills.join(', ') || 'your core skills'}`,
        'Push all projects to GitHub with clean README files',
        'Document your learning journey',
      ],
      skills: portfolioSkills,
      estimated_weeks: 3,
    },
    {
      phase: 6,
      title: 'Interview Preparation',
      description: 'Prepare for technical and HR interviews.',
      items: [
        'Practice aptitude and logical reasoning questions',
        'Solve technical interview questions on LeetCode/HackerRank',
        'Practice coding problems in your primary language',
        'Prepare HR interview answers (strengths, projects, behavioral)',
        'Create a polished resume tailored to your target role',
      ],
      skills: [],
      estimated_weeks: 4,
    },
    {
      phase: 7,
      title: 'Job Readiness',
      description: 'Apply for suitable roles with a strategic approach.',
      items: [
        `Apply for ${career.name} positions`,
        'Network on LinkedIn and attend tech meetups',
        'Contribute to open-source projects',
        'Prepare a cover letter template',
      ],
      skills: [],
      estimated_weeks: 2,
    },
  ];

  const total_weeks = phases.reduce((sum, p) => sum + p.estimated_weeks, 0);

  return { career, phases, total_weeks };
}
