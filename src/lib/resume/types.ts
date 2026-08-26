export const MAX_RESUME_BYTES = 5 * 1024 * 1024;

/** File types the upload input accepts. Client-safe — no parser imports here. */
export const ACCEPTED_RESUME_TYPES = ".pdf,.docx,.txt,.md";

export type ResumeExperience = {
  company: string;
  industry: string;
  function: string;
  years: number;
};

/** What we offer to pre-fill on the profile form. The member always reviews it. */
export type ResumeDraft = {
  currentRole: string;
  group: string;
  location: string;
  bio: string;
  linkedinUrl: string | null;
  experience: ResumeExperience[];
  skills: string[];
  interests: string[];
  lookingFor: string[];
};

export type ResumeParseResult = {
  draft: ResumeDraft;
  /** "claude" when the API key is configured, "keywords" for the offline fallback. */
  source: "claude" | "keywords";
};

export const EMPTY_DRAFT: ResumeDraft = {
  currentRole: "",
  group: "",
  location: "",
  bio: "",
  linkedinUrl: null,
  experience: [],
  skills: [],
  interests: [],
  lookingFor: [],
};
