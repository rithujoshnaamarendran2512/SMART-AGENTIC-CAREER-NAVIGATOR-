import type {
  StructuredProfile,
  Career,
  CareerSkill,
  IndustryTrend,
  LearningResource,
  UserSkill,
  UserProject,
  UserCertification,
  CareerRecommendation,
  SkillGapReport,
  TrendReport,
  LearningRecommendationItem,
  CareerRoadmap,
} from '@/library/types';
import { analyzeProfile } from '@/agents/profile-agent';
import { recommendCareers } from '@/agents/career-agent';
import { analyzeSkillGap } from '@/agents/gapagent';
import { analyzeTrends, prioritizeByTrends } from '@/agents/trend-agent';
import { recommendLearning } from '@/agents/learningagent';
import { generateRoadmap } from '@/agents/roadmap-agent';
import type { Profile, ProgressRecord } from '@/library/types';
import { trackProgress } from '@/agents/progress-agent';

/**
 * Agent Orchestrator
 *
 * Coordinates the 8 specialized agents in sequence, passing each agent's
 * output as input to the next. This mirrors the pipeline:
 *
 *   Profile → Career → Skill Req → Skill Gap → Trends →
 *   Learning → Roadmap → Progress → Re-evaluation
 *
 * Each step is individually callable so the UI can run partial pipelines
 * (e.g. just recompute career recommendations without re-running everything).
 */

export interface AgentInputs {
  profile: Profile;
  userSkills: UserSkill[];
  projects: UserProject[];
  certifications: UserCertification[];
  careers: Career[];
  careerSkillsByCareer: Record<string, CareerSkill[]>;
  trends: IndustryTrend[];
  learningResources: LearningResource[];
  progress: ProgressRecord[];
}

export interface OrchestratorResult {
  structuredProfile: StructuredProfile;
  careerRecommendations: CareerRecommendation[];
  trendReport: TrendReport;
  targetCareer: Career | null;
  skillGapReport: SkillGapReport | null;
  learningRecommendations: LearningRecommendationItem[];
  roadmap: CareerRoadmap | null;
  progressSummary: ReturnType<typeof trackProgress> | null;
}

export function runFullPipeline(
  inputs: AgentInputs,
  targetCareerId: string | null,
): OrchestratorResult {
  // Step 1: Profile Analysis Agent
  const structuredProfile = analyzeProfile(
    inputs.profile,
    inputs.userSkills,
    inputs.projects,
    inputs.certifications,
  );

  // Step 2: Career Recommendation Agent
  const careerRecommendations = recommendCareers(
    structuredProfile,
    inputs.careers,
    inputs.careerSkillsByCareer,
    inputs.trends,
  );

  // Step 3: Industry Trend Agent (runs in parallel conceptually)
  const trendReport = analyzeTrends(inputs.trends);

  // Determine target career — use the user's selected one, or the top recommendation
  const targetCareer =
    (targetCareerId && inputs.careers.find((c) => c.id === targetCareerId)) ||
    careerRecommendations[0]?.career ||
    null;

  // Step 4: Skill Requirement + Skill Gap Analysis Agent
  let skillGapReport: SkillGapReport | null = null;
  if (targetCareer) {
    const careerSkills = inputs.careerSkillsByCareer[targetCareer.id] ?? [];
    skillGapReport = analyzeSkillGap(targetCareer, careerSkills, inputs.userSkills);
  }

  // Step 5: Learning Recommendation Agent
  let learningRecommendations: LearningRecommendationItem[] = [];
  if (skillGapReport) {
    const prioritizedGaps = prioritizeByTrends(skillGapReport.rows, inputs.trends);
    const prioritizedReport: SkillGapReport = {
      ...skillGapReport,
      rows: prioritizedGaps,
      missing: prioritizedGaps.filter((g) => g.gap_category === 'high'),
      partial: prioritizedGaps.filter(
        (g) => g.gap_category === 'low' || g.gap_category === 'medium',
      ),
    };
    learningRecommendations = recommendLearning(prioritizedReport, inputs.learningResources);
  }

  // Step 6: Career Roadmap Agent
  let roadmap: CareerRoadmap | null = null;
  if (targetCareer && skillGapReport) {
    roadmap = generateRoadmap(targetCareer, skillGapReport, learningRecommendations);
  }

  // Step 7: Progress Tracking Agent
  let progressSummary: ReturnType<typeof trackProgress> | null = null;
  if (targetCareer) {
    const careerSkills = inputs.careerSkillsByCareer[targetCareer.id] ?? [];
    progressSummary = trackProgress(
      targetCareer,
      careerSkills,
      inputs.userSkills,
      inputs.progress,
    );
  }

  return {
    structuredProfile,
    careerRecommendations,
    trendReport,
    targetCareer,
    skillGapReport,
    learningRecommendations,
    roadmap,
    progressSummary,
  };
}
