export interface SkillItem {
  id: string;
  name: string;
  level: number; // 0-100
}

export interface ExperienceItem {
  id: string;
  title: string;
  organization: string;
  period: string;
  points: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institute: string;
  period: string;
  result: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  organization: string;
  year: string;
}

export interface AwardItem {
  id: string;
  title: string;
  organization: string;
  year: string;
}

export interface ReferenceItem {
  id: string;
  name: string;
  title: string;
  organization: string;
  email: string;
  phone: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  facebook?: string;
  twitter?: string;
  website?: string;
  youtube?: string;
}

export interface Profile {
  name: string;
  title: string;
  about: string;
  photo: string | null;
  phone: string;
  email: string;
  address: string;
  social: SocialLinks;
  skills: SkillItem[];
  softSkills: string[];
  languages: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  awards: AwardItem[];
  extracurricular: string[];
  references: ReferenceItem[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string | null;
  tags: string[];
  link: string;
  github: string;
  featured: boolean;
}

export type StudentStatus = "pending" | "approved" | "rejected";

export interface Student {
  id: string;
  name: string;
  image: string | null;
  address: string;
  currentJob: string;
  workArea: string;
  availability: string;
  bio: string;
  email: string;
  phone: string;
  status: StudentStatus;
  submittedAt: string;
}
