export type Role = "admin" | "student";

export type ExperienceItem = {
  id: string;
  company: string;
  industry: string;
  function: string;
  years: number;
};

export type Person = {
  id: string;
  name: string;
  email: string;
  photo: string | null;
  bio: string;
  currentRole: string;
  /** The cohort's own grouping of backgrounds, e.g. "Management Consulting". */
  group: string;
  location: string;
  linkedinUrl: string | null;
  contactPreference: string;
  contactHandle: string;
  role: Role;
  experience: ExperienceItem[];
  skills: string[];
  interests: string[];
  lookingFor: string[];
  createdAt: string;
};

export type Resource = {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  tags: string[];
  uploadedBy: string;
  createdAt: string;
};

export type Opportunity = {
  id: string;
  title: string;
  company: string;
  type: string;
  industry: string;
  role: string;
  location: string;
  deadline: string | null;
  description: string;
  url: string;
  postedBy: string;
  status: "open" | "closed";
  createdAt: string;
};

export type HelpRequest = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  postedBy: string;
  status: "open" | "resolved";
  createdAt: string;
};

export type PeopleFilters = {
  q?: string;
  group?: string;
  industry?: string;
  function?: string;
  skill?: string;
  interest?: string;
  location?: string;
  lookingFor?: string;
};

export type ResourceFilters = { q?: string; category?: string };
export type OpportunityFilters = { q?: string; type?: string; industry?: string; location?: string };
export type HelpFilters = { q?: string; status?: string };

export type SearchResults = {
  query: string;
  people: Person[];
  resources: Resource[];
  opportunities: Opportunity[];
  helpRequests: HelpRequest[];
};
