import type {
  StructuredProfile,
  Career,
  CareerSkill,
  IndustryTrend,
  CareerRecommendation,
} from '@/library/types';
/**
 * Career Recommendation Agent
 *
 * Analyzes the structured profile and recommends suitable career roles.
 * Uses a transparent, weighted scoring mechanism:
 *
 *   Career Compatibility Score =
 *     w1 * Skill Match + w2 * Interest Match + w3 * Education Match
 *     + w4 * Experience Match + w5 * Industry Demand
 *
 * Weights: skill=0.40, interest=0.20, education=0.15, experience=0.15, demand=0.10
 *
 * Each sub-score is normalized to 0-100, and the final score is also 0-100.
 */
const WEIGHTS = {
  skill: 0.4,
  interest: 0.2,
  education: 0.15,
  experience: 0.15,
  demand: 0.1,
};
function calculateSkillMatch( profile: StructuredProfile,
  careerSkills: CareerSkill[],
): number {
  if (careerSkills.length === 0) return 0;
  let totalWeight = 0;
  let achieved = 0;
  for (const cs of careerSkills) {
    const priorityWeight = cs.priority === 'high' ? 1.5 : cs.priority === 'medium' ? 1.0 : 0.5;
    const userSkill = profile.skills.find(
      (s) => s.name.toLowerCase() === (cs.skill?.name ?? '').toLowerCase(),
    );
    const userLevel = userSkill?.level ?? 0;
    const ratio = Math.min(userLevel / cs.required_level, 1);
    totalWeight += priorityWeight;
    achieved += ratio * priorityWeight;
  }
  return totalWeight > 0 ? (achieved / totalWeight) * 100 : 0;
}
function calculateInterestMatch(
  profile: StructuredProfile,
  career: Career,
  careerSkills: CareerSkill[],
): number {
  const careerText = `${career.name} ${career.domain} ${careerSkills
    .map((cs) => cs.skill?.name ?? '')
    .join(' ')}`.toLowerCase();
  if (profile.interests.length === 0) return 50;
  let matches = 0;
  for (const interest of profile.interests) {
    if (careerText.includes(interest.toLowerCase())) matches++;
  }
  return (matches / profile.interests.length) * 100;
}
function calculateEducationMatch(
  profile: StructuredProfile,
  career: Career,
): number {
  const edu = (profile.education + ' ' + profile.education_field).toLowerCase();
  const domain = career.domain.toLowerCase();
  const name = career.name.toLowerCase();
  if (edu.includes('computer') || edu.includes('software') || edu.includes('it')) {
    if (domain.includes('software') || domain.includes('dev') || name.includes('developer'))
      return 90;
    if (domain.includes('data') || domain.includes('ai')) return 75;
    if (domain.includes('devops')) return 65;
    return 60;
  }
  if (edu.includes('data') || edu.includes('statistics') || edu.includes('math')) {
    if (domain.includes('data') || domain.includes('ai')) return 90;
    return 60;
  }
  if (edu.length > 0) return 55;
  return 40;
}
function calculateExperienceMatch(
  profile: StructuredProfile,
): number {
  if (profile.experience_years >= 3) return 90;
  if (profile.experience_years >= 1) return 70;
  if (profile.experience_summary && profile.experience_summary.length > 20) return 55;
  return 40;
}
function calculateIndustryDemand(
  career: Career,
  careerSkills: CareerSkill[],
  trends: IndustryTrend[],
): number {
  if (trends.length === 0) return 50;
  let totalScore = 0;
  let count = 0;
  for (const cs of careerSkills) {
    const skillName = cs.skill?.name ?? '';
    const trend = trends.find(
      (t) => t.skill_name.toLowerCase() === skillName.toLowerCase(),
    );
    if (trend) {
      totalScore += Number(trend.trend_score);
      count++;
    }
  }
  if (count === 0) {
    // Use career domain as fallback signal
    const domainTrend = trends.find((t) =>
      t.skill_name.toLowerCase().includes(career.domain.toLowerCase().split(' ')[0]),
    );
    return domainTrend ? Number(domainTrend.trend_score) : 50;
  }
  return totalScore / count;
}
function buildExplanation(
  career: Career,
  skillMatch: number,
  interestMatch: number,
  educationMatch: number,
  experienceMatch: number,
  industryDemand: number,
): string {
  const factors: string[] = [];
  if (skillMatch >= 75) factors.push(`strong skill overlap (${Math.round(skillMatch)}%)`);
  else if (skillMatch >= 50) factors.push(`moderate skill match (${Math.round(skillMatch)}%)`);
  else factors.push(`significant skill gaps remain (${Math.round(skillMatch)}%)`);
  if (interestMatch >= 70) factors.push(`aligned with your stated interests (${Math.round(interestMatch)}%)`);
  if (educationMatch >= 75) factors.push(`your education fits this path (${Math.round(educationMatch)}%)`);
  if (experienceMatch >= 70) factors.push(`relevant experience (${Math.round(experienceMatch)}%)`);
  if (industryDemand >= 75) factors.push(`high market demand (${Math.round(industryDemand)}%)`);
  return `${career.name} is recommended because of ${factors.join(', ')}.`;
}
export function recommendCareers(
  profile: StructuredProfile,
  careers: Career[],
  careerSkillsByCareer: Record<string, CareerSkill[]>,
  trends: IndustryTrend[],
): CareerRecommendation[] {
  const recommendations: CareerRecommendation[] = careers.map((career) => {
    const careerSkills = careerSkillsByCareer[career.id] ?? [];
    const skillMatch = calculateSkillMatch(profile, careerSkills);
    const interestMatch = calculateInterestMatch(profile, career, careerSkills);
    const educationMatch = calculateEducationMatch(profile, career);
    const experienceMatch = calculateExperienceMatch(profile);
    const industryDemand = calculateIndustryDemand(career, careerSkills, trends);
    const compatibility_score =
      WEIGHTS.skill * skillMatch +
      WEIGHTS.interest * interestMatch +
      WEIGHTS.education * educationMatch +
      WEIGHTS.experience * experienceMatch +
      WEIGHTS.demand * industryDemand;
    return {
      career,
      compatibility_score: Math.round(compatibility_score * 10) / 10,
      skill_match: Math.round(skillMatch),
      interest_match: Math.round(interestMatch),
      education_match: Math.round(educationMatch),
      experience_match: Math.round(experienceMatch),
      industry_demand: Math.round(industryDemand),
      explanation: buildExplanation(
        career,
        skillMatch,
        interestMatch,
        educationMatch,
        experienceMatch,
        industryDemand,
      ),
    };
  });
  return recommendations.sort((a, b) => b.compatibility_score - a.compatibility_score);
}
