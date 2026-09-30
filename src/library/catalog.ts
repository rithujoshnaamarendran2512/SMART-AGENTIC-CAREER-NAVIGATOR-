import { supabase } from '@/library/supabase';
import type {
  Skill,
  Career,
  CareerSkill,
  LearningResource,
  IndustryTrend,
} from '@/library/types';

/**
 * Data access layer for catalog/reference tables.
 * These tables are read-only for authenticated users.
 */

export async function fetchSkills(): Promise<Skill[]> {
  const { data, error } = await supabase.from('skills').select('*').order('name');
  if (error) throw error;
  return data as Skill[];
}

export async function fetchCareers(): Promise<Career[]> {
  const { data, error } = await supabase.from('careers').select('*').order('name');
  if (error) throw error;
  return data as Career[];
}

export async function fetchCareerSkills(): Promise<CareerSkill[]> {
  const { data, error } = await supabase
    .from('career_skills')
    .select('*, skill:skills(*)')
    .order('priority');
  if (error) throw error;
  return data as CareerSkill[];
}

export async function fetchLearningResources(): Promise<LearningResource[]> {
  const { data, error } = await supabase
    .from('learning_resources')
    .select('*, skill:skills(*)')
    .order('title');
  if (error) throw error;
  return data as LearningResource[];
}

export async function fetchIndustryTrends(): Promise<IndustryTrend[]> {
  const { data, error } = await supabase
    .from('industry_trends')
    .select('*')
    .order('trend_score', { ascending: false });
  if (error) throw error;
  return data as IndustryTrend[];
}

export function groupCareerSkills(careerSkills: CareerSkill[]): Record<string, CareerSkill[]> {
  const map: Record<string, CareerSkill[]> = {};
  for (const cs of careerSkills) {
    if (!map[cs.career_id]) map[cs.career_id] = [];
    map[cs.career_id].push(cs);
  }
  return map;
}