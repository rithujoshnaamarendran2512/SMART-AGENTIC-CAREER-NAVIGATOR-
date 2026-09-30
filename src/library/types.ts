export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  skill_level: number; // 1-5
  skill?: Skill;
}

export interface Career {
  id: string;
  name: string;
  description: string;
  domain: string;
}

export interface CareerSkill {
  id: string;
  career_id: string;
  skill_id: string;
  required_level: number; // 1-5
  priority: 'high' | 'medium' | 'low';
  skill?: Skill;
}

export interface LearningResource {
  id: string;
  skill_id: string;
  title: string;
  platform: string;
  resource_type: 'course' | 'tutorial' | 'documentation' | 'project' | 'practice' | 'certification';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  url: string;
  duration_hours: number;
  is_free: boolean;
  skill?: Skill;
}

export interface IndustryTrend {
  id: string;
  skill_name: string;
  demand_level: 'high' | 'medium' | 'low' | 'declining';
  trend_score: number; // 0-100
  source: 'demo' | 'live';
  notes: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  education: string;
  education_field: string;
  experience_years: number;
  experience_summary: string;
  interests: string[];
  target_career_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Recommendation {
  id: string;
  user_id: string;
  career_id: string;
  compatibility_score: number;
  skill_match: number;
  interest_match: number;
  education_match: number;
  experience_match: number;
  industry_demand: number;
  explanation: string;
  created_at: string;
  career?: Career;
}

export interface ProgressRecord {
  id: string;
  user_id: string;
  skill_id: string;
  progress_percentage: number; // 0-100
  status: 'not_started' | 'in_progress' | 'completed';
  updated_at: string;
  skill?: Skill;
}

export interface UserProject {
  id: string;
  user_id: string;
  title: string;
  description: string;
  url: string;
  technologies: string[];
  created_at: string;
}

export interface UserCertification {
  id: string;
  user_id: string;
  title: string;
  issuer: string;
  date: string;
  created_at: string;
}

// ===== Agent output types =====

export interface StructuredProfile {
  full_name: string;
  education: string;
  education_field: string;
  experience_years: number;
  experience_summary: string;
  interests: string[];
  skills: { name: string; level: number; category: string }[];
  projects: UserProject[];
  certifications: UserCertification[];
  current_skill_level: 'beginner' | 'intermediate' | 'advanced';
}

export interface CareerRecommendation {
  career: Career;
  compatibility_score: number;
  skill_match: number;
  interest_match: number;
  education_match: number;
  experience_match: number;
  industry_demand: number;
  explanation: string;
}

export interface SkillGapRow {
  skill: Skill;
  user_level: number;
  required_level: number;
  gap: number;
  gap_category: 'none' | 'low' | 'medium' | 'high';
  priority: 'high' | 'medium' | 'low';
}

export interface SkillGapReport {
  career: Career;
  rows: SkillGapRow[];
  acquired: SkillGapRow[];
  partial: SkillGapRow[];
  missing: SkillGapRow[];
  overall_gap_percentage: number;
}

export interface TrendReport {
  trends: IndustryTrend[];
  emerging: IndustryTrend[];
  declining: IndustryTrend[];
  is_live: boolean;
  last_updated: string;
}

export interface LearningRecommendationItem {
  resource: LearningResource;
  skill: Skill;
  gap_category: string;
  priority: 'high' | 'medium' | 'low';
  estimated_duration: number;
}

export interface RoadmapPhase {
  phase: number;
  title: string;
  description: string;
  items: string[];
  skills: string[];
  estimated_weeks: number;
}
export interface CareerRoadmap {
  career: Career;
  phases: RoadmapPhase[];
  total_weeks: number;
}

export interface ProgressSummary {
  total_skills: number;
  completed: number;
  in_progress: number;
  not_started: number;
  overall_percentage: number;
  career_readiness: number;
  remaining_gaps: SkillGapRow[];
}