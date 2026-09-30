import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  fetchSkills,
  fetchCareers,
  fetchCareerSkills,
  fetchLearningResources,
  fetchIndustryTrends,
  groupCareerSkills,
} from '@/library/catalog';
import {
  fetchProfile,
  fetchUserSkills,
  fetchUserProjects,
  fetchUserCertifications,
  fetchProgress,
  fetchRecommendations,
} from '@/library/userdata';
import type {
  Skill,
  Career,
  CareerSkill,
  LearningResource,
  IndustryTrend,
  Profile,
  UserSkill,
  UserProject,
  UserCertification,
  ProgressRecord,
  Recommendation,
} from '@/library/types';

interface AppDataState {
  loading: boolean;
  error: string | null;
  skills: Skill[];
  careers: Career[];
  careerSkills: CareerSkill[];
  careerSkillsByCareer: Record<string, CareerSkill[]>;
  learningResources: LearningResource[];
  trends: IndustryTrend[];
  profile: Profile | null;
  userSkills: UserSkill[];
  projects: UserProject[];
  certifications: UserCertification[];
  progress: ProgressRecord[];
  recommendations: Recommendation[];
  reload: () => Promise<void>;
}

export function useAppData(): AppDataState {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [careerSkills, setCareerSkills] = useState<CareerSkill[]>([]);
  const [careerSkillsByCareer, setCareerSkillsByCareer] = useState<Record<string, CareerSkill[]>>({});
  const [learningResources, setLearningResources] = useState<LearningResource[]>([]);
  const [trends, setTrends] = useState<IndustryTrend[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [certifications, setCertifications] = useState<UserCertification[]>([]);
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const load = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Catalog data (doesn't depend on user)
      const [sk, ca, cs, lr, it] = await Promise.all([
        fetchSkills(),
        fetchCareers(),
        fetchCareerSkills(),
        fetchLearningResources(),
        fetchIndustryTrends(),
      ]);
      setSkills(sk);
      setCareers(ca);
      setCareerSkills(cs);
      setCareerSkillsByCareer(groupCareerSkills(cs));
      setLearningResources(lr);
      setTrends(it);

      // User data
      const [p, us, up, uc, pg, recs] = await Promise.all([
        fetchProfile(user.id),
        fetchUserSkills(user.id),
        fetchUserProjects(user.id),
        fetchUserCertifications(user.id),
        fetchProgress(user.id),
        fetchRecommendations(user.id),
      ]);
      setProfile(p);
      setUserSkills(us);
      setProjects(up);
      setCertifications(uc);
      setProgress(pg);
      setRecommendations(recs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    loading,
    error,
    skills,
    careers,
    careerSkills,
    careerSkillsByCareer,
    learningResources,
    trends,
    profile,
    userSkills,
    projects,
    certifications,
    progress,
    recommendations,
    reload: load,
  };
}