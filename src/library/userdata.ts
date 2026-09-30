import { supabase } from '@/library/supabase';
import type {
  Profile,
  UserSkill,
  UserProject,
  UserCertification,
  ProgressRecord,
  Recommendation,
} from '@/library/types';

/**
 * User data access — fetches and persists user-owned data.
 * All queries are scoped by the authenticated session via RLS.
 */

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data as Profile | null;
}

export async function upsertProfile(
  userId: string,
  profile: Partial<Profile>,
): Promise<Profile> {
  const payload = { id: userId, ...profile, updated_at: new Date().toISOString() };
  const { data, error } = await supabase
    .from('profiles')
    .upsert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as Profile;
}

export async function fetchUserSkills(userId: string): Promise<UserSkill[]> {
  const { data, error } = await supabase
    .from('user_skills')
    .select('*, skill:skills(*)')
    .eq('user_id', userId);
  if (error) throw error;
  return data as UserSkill[];
}

export async function setUserSkill(userId: string, skillId: string, level: number): Promise<void> {
  const { error } = await supabase
    .from('user_skills')
    .upsert(
      { user_id: userId, skill_id: skillId, skill_level: level },
      { onConflict: 'user_id,skill_id' },
    );
  if (error) throw error;
}

export async function removeUserSkill(userId: string, skillId: string): Promise<void> {
  const { error } = await supabase
    .from('user_skills')
    .delete()
    .eq('user_id', userId)
    .eq('skill_id', skillId);
  if (error) throw error;
}

export async function fetchUserProjects(userId: string): Promise<UserProject[]> {
  const { data, error } = await supabase
    .from('user_projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as UserProject[];
}

export async function addUserProject(
  userId: string,
  project: Omit<UserProject, 'id' | 'user_id' | 'created_at'>,
): Promise<UserProject> {
  const { data, error } = await supabase
    .from('user_projects')
    .insert({ ...project, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data as UserProject;
}

export async function deleteUserProject(userId: string, projectId: string): Promise<void> {
  const { error } = await supabase
    .from('user_projects')
    .delete()
    .eq('id', projectId)
    .eq('user_id', userId);
  if (error) throw error;
}

export async function fetchUserCertifications(userId: string): Promise<UserCertification[]> {
  const { data, error } = await supabase
    .from('user_certifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as UserCertification[];
}

export async function addUserCertification(
  userId: string,
  cert: Omit<UserCertification, 'id' | 'user_id' | 'created_at'>,
): Promise<UserCertification> {
  const { data, error } = await supabase
    .from('user_certifications')
    .insert({ ...cert, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data as UserCertification;
}

export async function deleteUserCertification(
  userId: string,
  certId: string,
): Promise<void> {
  const { error } = await supabase
    .from('user_certifications')
    .delete()
    .eq('id', certId)
    .eq('user_id', userId);
  if (error) throw error;
}

export async function fetchProgress(userId: string): Promise<ProgressRecord[]> {
  const { data, error } = await supabase
    .from('progress')
    .select('*, skill:skills(*)')
    .eq('user_id', userId);
  if (error) throw error;
  return data as ProgressRecord[];
}

export async function setProgress(
  userId: string,
  skillId: string,
  percentage: number,
  status: 'not_started' | 'in_progress' | 'completed',
): Promise<void> {
  const { error } = await supabase
    .from('progress')
    .upsert(
      {
        user_id: userId,
        skill_id: skillId,
        progress_percentage: percentage,
        status,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,skill_id' },
    );
  if (error) throw error;
}
export async function fetchRecommendations(userId: string): Promise<Recommendation[]> {
  const { data, error } = await supabase
    .from('recommendations')
    .select('*, career:careers(*)')
    .eq('user_id', userId)
    .order('compatibility_score', { ascending: false });
  if (error) throw error;
  return data as Recommendation[];
}
export async function saveRecommendations(
  userId: string,
  recs: {
    career_id: string;
    compatibility_score: number;
    skill_match: number;
    interest_match: number;
    education_match: number;
    experience_match: number;
    industry_demand: number;
    explanation: string;
  }[],
): Promise<void> {
  // Clear old then insert new
  await supabase.from('recommendations').delete().eq('user_id', userId);
  if (recs.length === 0) return;
  const { error } = await supabase
    .from('recommendations')
    .insert(recs.map((r) => ({ ...r, user_id: userId })));
  if (error) throw error;
}
export async function setTargetCareer(userId: string, careerId: string | null): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ target_career_id: careerId, updated_at: new Date().toISOString() })
    .eq('id', userId);
  if (error) throw error;
}
