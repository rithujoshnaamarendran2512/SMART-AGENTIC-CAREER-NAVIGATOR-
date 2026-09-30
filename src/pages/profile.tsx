import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAppData } from '@/hooks/useappdata';
import { upsertProfile, setUserSkill, removeUserSkill, addUserProject, deleteUserProject, addUserCertification, deleteUserCertification } from '@/library/userdata';
import { Card, Badge, SectionTitle, SkillLevelDots } from '@/components/ui';
import { UserCircle, Plus, Trash2, Check, X, Search } from 'lucide-react';

export function ProfilePage() {
  const { user } = useAuth();
  const { loading, skills, profile, userSkills, projects, certifications, reload } = useAppData();

  const [fullName, setFullName] = useState('');
  const [education, setEducation] = useState('');
  const [educationField, setEducationField] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);
  const [experienceSummary, setExperienceSummary] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const [skillSearch, setSkillSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [skillLevel, setSkillLevel] = useState(3);

  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projUrl, setProjUrl] = useState('');
  const [projTech, setProjTech] = useState('');

  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certDate, setCertDate] = useState('');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name);
      setEducation(profile.education);
      setEducationField(profile.education_field);
      setExperienceYears(profile.experience_years);
      setExperienceSummary(profile.experience_summary);
      setInterests(profile.interests ?? []);
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      await upsertProfile(user.id, {
        full_name: fullName,
        education,
        education_field: educationField,
        experience_years: experienceYears,
        experience_summary: experienceSummary,
        interests,
      });
      setSaveMsg('Profile saved successfully.');
      await reload();
      setTimeout(() => setSaveMsg(null), 3000);
    } catch {
      setSaveMsg('Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async () => {
    if (!user || !selectedSkill) return;
    await setUserSkill(user.id, selectedSkill, skillLevel);
    setSelectedSkill('');
    setSkillLevel(3);
    setSkillSearch('');
    await reload();
  };

  const handleRemoveSkill = async (skillId: string) => {
    if (!user) return;
    await removeUserSkill(user.id, skillId);
    await reload();
  };

  const handleAddProject = async () => {
    if (!user || !projTitle.trim()) return;
    await addUserProject(user.id, {
      title: projTitle,
      description: projDesc,
      url: projUrl,
      technologies: projTech.split(',').map((t) => t.trim()).filter(Boolean),
    });
    setProjTitle(''); setProjDesc(''); setProjUrl(''); setProjTech('');
    await reload();
  };

  const handleAddCert = async () => {
    if (!user || !certTitle.trim()) return;
    await addUserCertification(user.id, { title: certTitle, issuer: certIssuer, date: certDate });
    setCertTitle(''); setCertIssuer(''); setCertDate('');
    await reload();
  };

  if (loading) return <div className="py-20 text-center text-slate-400">Loading...</div>;

  const filteredSkills = skills
    .filter((s) => !userSkills.some((us) => us.skill_id === s.id))
    .filter((s) => s.name.toLowerCase().includes(skillSearch.toLowerCase()))
    .slice(0, 20);

  return (
    <div>
      <SectionTitle
        title="My Profile"
        subtitle="The Profile Analysis Agent uses this information to build your structured profile"
        icon={<UserCircle className="w-5 h-5" />}
      />

      <div className="space-y-6">
        {/* Basic info */}
        <Card className="p-6">
          <h3 className="font-bold text-slate-800 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Full Name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Education</label>
              <input
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                placeholder="e.g. B.Sc. Computer Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Field of Study</label>
              <input
                value={educationField}
                onChange={(e) => setEducationField(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                placeholder="e.g. Computer Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Years of Experience</label>
              <input
                type="number"
                min={0}
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Experience Summary</label>
            <textarea
              value={experienceSummary}
              onChange={(e) => setExperienceSummary(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
              placeholder="Briefly describe any internships, projects, or work experience..."
            />
          </div>

          {/* Interests */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Career Interests</label>
            <div className="flex gap-2 mb-2">
              <input
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && interestInput.trim()) {
                    e.preventDefault();
                    if (!interests.includes(interestInput.trim())) {
                      setInterests([...interests, interestInput.trim()]);
                    }
                    setInterestInput('');
                  }
                }}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                placeholder="e.g. Machine Learning, Data Science, Web Development"
              />
              <button
                onClick={() => {
                  if (interestInput.trim() && !interests.includes(interestInput.trim())) {
                    setInterests([...interests, interestInput.trim()]);
                    setInterestInput('');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-teal-50 text-teal-600 hover:bg-teal-100 transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <span
                  key={interest}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-sm border border-teal-100"
                >
                  {interest}
                  <button
                    onClick={() => setInterests(interests.filter((i) => i !== interest))}
                    className="text-teal-400 hover:text-teal-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? 'Saving...' : 'Save Profile'}
              {!saving && <Check className="w-4 h-4" />}
            </button>
            {saveMsg && <span className="text-sm text-emerald-600">{saveMsg}</span>}
          </div>
        </Card>

        {/* Skills */}
        <Card className="p-6">
          <h3 className="font-bold text-slate-800 mb-4">My Skills</h3>
          <div className="space-y-2 mb-4">
            {userSkills.length === 0 && (
              <p className="text-sm text-slate-400">No skills added yet. Search and add your skills below.</p>
            )}
            {userSkills.map((us) => (
              <div key={us.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-medium text-slate-800 text-sm">{us.skill?.name}</div>
                    <div className="text-xs text-slate-400">{us.skill?.category}</div>
                  </div>
                  <SkillLevelDots level={us.skill_level} />
                </div>
                <button
                  onClick={() => handleRemoveSkill(us.skill_id)}
                  className="text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add skill */}
          <div className="border-t border-slate-100 pt-4">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                placeholder="Search skills to add..."
              />
            </div>
            {skillSearch && filteredSkills.length > 0 && (
              <div className="mb-3 max-h-40 overflow-y-auto rounded-xl border border-slate-200 divide-y divide-slate-100">
                {filteredSkills.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSkill(s.id)}
                    className={`w-full text-left px-4 py-2.5 hover:bg-teal-50 transition-colors flex justify-between items-center ${
                      selectedSkill === s.id ? 'bg-teal-50' : ''
                    }`}
                  >
                    <span className="text-sm font-medium text-slate-700">{s.name}</span>
                    <Badge>{s.category}</Badge>
                  </button>
                ))}
              </div>
            )}
            {selectedSkill && (
              <div className="flex items-center gap-4 mb-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">Proficiency Level (1-5)</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setSkillLevel(lvl)}
                        className={`w-9 h-9 rounded-lg font-medium text-sm transition-all ${
                          skillLevel === lvl
                            ? 'bg-teal-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleAddSkill}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition-all flex items-center gap-2 self-end"
                >
                  <Plus className="w-4 h-4" /> Add Skill
                </button>
              </div>
            )}
          </div>
        </Card>

        {/* Projects */}
        <Card className="p-6">
          <h3 className="font-bold text-slate-800 mb-4">Projects</h3>
          <div className="space-y-2 mb-4">
            {projects.length === 0 && <p className="text-sm text-slate-400">No projects added yet.</p>}
            {projects.map((p) => (
              <div key={p.id} className="p-3 rounded-xl bg-slate-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-slate-800 text-sm">{p.title}</div>
                    {p.description && <div className="text-sm text-slate-500 mt-0.5">{p.description}</div>}
                    {p.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {p.technologies.map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded text-xs bg-slate-200 text-slate-600">{t}</span>
                        ))}
                      </div>
                    )}
                    {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-600 hover:underline mt-1 inline-block">{p.url}</a>}
                  </div>
                  <button onClick={() => deleteUserProject(user!.id, p.id).then(reload)} className="text-slate-400 hover:text-rose-500 ml-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 pt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={projTitle} onChange={(e) => setProjTitle(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none" placeholder="Project title" />
            <input value={projTech} onChange={(e) => setProjTech(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none" placeholder="Technologies (comma-separated)" />
            <input value={projUrl} onChange={(e) => setProjUrl(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none" placeholder="Project URL (optional)" />
            <input value={projDesc} onChange={(e) => setProjDesc(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none" placeholder="Short description" />
            <button onClick={handleAddProject} className="md:col-span-2 px-4 py-2.5 rounded-xl bg-teal-50 text-teal-600 font-medium hover:bg-teal-100 transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Project
            </button>
          </div>
        </Card>

        {/* Certifications */}
        <Card className="p-6">
          <h3 className="font-bold text-slate-800 mb-4">Certifications</h3>
          <div className="space-y-2 mb-4">
            {certifications.length === 0 && <p className="text-sm text-slate-400">No certifications added yet.</p>}
            {certifications.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div>
                  <div className="font-medium text-slate-800 text-sm">{c.title}</div>
                  <div className="text-xs text-slate-400">{c.issuer}{c.date ? ` · ${c.date}` : ''}</div>
                </div>
                <button onClick={() => deleteUserCertification(user!.id, c.id).then(reload)} className="text-slate-400 hover:text-rose-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 pt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <input value={certTitle} onChange={(e) => setCertTitle(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none" placeholder="Certification title" />
            <input value={certIssuer} onChange={(e) => setCertIssuer(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none" placeholder="Issuer" />
            <input value={certDate} onChange={(e) => setCertDate(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none" placeholder="Date" />
            <button onClick={handleAddCert} className="md:col-span-3 px-4 py-2.5 rounded-xl bg-teal-50 text-teal-600 font-medium hover:bg-teal-100 transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Certification
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}