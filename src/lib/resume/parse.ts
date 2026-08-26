import Anthropic from "@anthropic-ai/sdk";
import {
  COHORT_GROUPS,
  FUNCTIONS,
  INDUSTRIES,
  INTERESTS,
  LOCATIONS,
  LOOKING_FOR,
  SKILLS,
} from "@/lib/taxonomy";
import { EMPTY_DRAFT, type ResumeDraft, type ResumeParseResult } from "./types";

const MODEL = "claude-opus-5";

const EXTRACT_TOOL: Anthropic.Tool = {
  name: "record_profile",
  description:
    "Record the profile fields found in the résumé. Only fill a field if the résumé supports it.",
  strict: true,
  input_schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      currentRole: {
        type: "string",
        description:
          "Current or most recent title and employer, e.g. 'Product Manager · Razorpay'. Empty string if unclear.",
      },
      group: {
        type: "string",
        enum: ["", ...COHORT_GROUPS],
        description: "Which cohort background group best describes this person.",
      },
      location: { type: "string", enum: ["", ...LOCATIONS] },
      bio: {
        type: "string",
        description:
          "Two or three sentences in the first person describing what they have done and what they know well. No invented detail.",
      },
      linkedinUrl: {
        type: "string",
        description: "LinkedIn URL if the résumé lists one, otherwise an empty string.",
      },
      experience: {
        type: "array",
        description: "One entry per role, most recent first, at most six.",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            company: { type: "string" },
            industry: { type: "string", enum: ["", ...INDUSTRIES] },
            function: { type: "string", enum: ["", ...FUNCTIONS] },
            years: { type: "number", description: "Years in that role, 0 if unclear." },
          },
          required: ["company", "industry", "function", "years"],
        },
      },
      skills: {
        type: "array",
        description:
          "What this person could credibly help a classmate with, drawn only from the allowed list.",
        items: { type: "string", enum: [...SKILLS] },
      },
      interests: {
        type: "array",
        description: "Professional and personal interests, drawn only from the allowed list.",
        items: { type: "string", enum: [...INTERESTS] },
      },
      lookingFor: {
        type: "array",
        description: "Only if the résumé states an objective. Usually empty.",
        items: { type: "string", enum: [...LOOKING_FOR] },
      },
    },
    required: [
      "currentRole",
      "group",
      "location",
      "bio",
      "linkedinUrl",
      "experience",
      "skills",
      "interests",
      "lookingFor",
    ],
  },
};

const SYSTEM = `You extract structured profile data from résumés for a private MBA cohort directory.

Rules:
- Only record what the résumé actually supports. Never invent an employer, a skill or a number of years.
- Prefer fewer, well-supported entries over a long speculative list.
- Every enum field must use one of the allowed values exactly, or the empty string / an empty array.
- The bio is written in the person's own voice, factual, no adjectives they did not earn.`;

function clean(draft: Partial<ResumeDraft>): ResumeDraft {
  const allowed = (values: unknown, list: readonly string[]) =>
    Array.isArray(values)
      ? Array.from(new Set(values.filter((v): v is string => typeof v === "string" && list.includes(v))))
      : [];

  return {
    ...EMPTY_DRAFT,
    currentRole: typeof draft.currentRole === "string" ? draft.currentRole.slice(0, 120) : "",
    group: COHORT_GROUPS.includes(draft.group as never) ? (draft.group as string) : "",
    location: LOCATIONS.includes(draft.location as never) ? (draft.location as string) : "",
    bio: typeof draft.bio === "string" ? draft.bio.slice(0, 600) : "",
    linkedinUrl:
      typeof draft.linkedinUrl === "string" && draft.linkedinUrl.includes("linkedin.com")
        ? draft.linkedinUrl
        : null,
    experience: Array.isArray(draft.experience)
      ? draft.experience.slice(0, 6).map((item) => ({
          company: String(item?.company ?? "").slice(0, 80),
          industry: INDUSTRIES.includes(item?.industry as never) ? String(item.industry) : "",
          function: FUNCTIONS.includes(item?.function as never) ? String(item.function) : "",
          years: Number.isFinite(Number(item?.years)) ? Math.max(0, Math.min(45, Number(item.years))) : 0,
        }))
      : [],
    skills: allowed(draft.skills, SKILLS),
    interests: allowed(draft.interests, INTERESTS),
    lookingFor: allowed(draft.lookingFor, LOOKING_FOR),
  };
}

async function parseWithClaude(text: string): Promise<ResumeDraft> {
  const client = new Anthropic();

  const request = {
    model: MODEL,
    max_tokens: 4000,
    system: SYSTEM,
    output_config: { effort: "low" as const },
    tools: [EXTRACT_TOOL],
    tool_choice: { type: "tool" as const, name: EXTRACT_TOOL.name },
    messages: [
      {
        role: "user" as const,
        content: `Extract the profile fields from this résumé.\n\n<resume>\n${text}\n</resume>`,
      },
    ],
  };

  let response: Anthropic.Message;
  try {
    // Server-side fallback keeps extraction working if the primary model declines.
    response = (await client.beta.messages.create({
      ...request,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
    } as never)) as unknown as Anthropic.Message;
  } catch {
    response = await client.messages.create(request);
  }

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
  );
  if (!toolUse) throw new Error("Claude did not return structured fields for this résumé.");

  return clean(toolUse.input as Partial<ResumeDraft>);
}

/* ----------------------------------------------------------- offline fallback */

const INDUSTRY_HINTS: Record<string, string[]> = {
  Finance: ["bank", "investment", "equity", "capital", "financial", "audit", "chartered accountant", "portfolio", "compliance"],
  Consulting: ["consult", "advisory", "mckinsey", "bain", "bcg", "deloitte", "kpmg", "ey ", "pwc", "zs associates"],
  Technology: ["software", "engineer", "developer", "saas", "platform", "api", "product manager"],
  FMCG: ["fmcg", "consumer goods", "unilever", "p&g", "procter", "nestle", "marico"],
  Manufacturing: ["manufactur", "plant", "factory", "production", "industrial"],
  Healthcare: ["health", "hospital", "clinic", "pharma", "medical", "dental", "patient"],
  Retail: ["retail", "d2c", "ecommerce", "e-commerce", "merchandis", "category manage"],
  Media: ["media", "content", "journalis", "communications", "editorial", "advertis"],
  "Crypto/Web3": ["crypto", "blockchain", "web3", "defi", "token"],
  Energy: ["energy", "power", "solar", "renewable", "utility", "oil", "gas"],
  Education: ["education", "teaching", "faculty", "school", "university"],
  Logistics: ["logistics", "supply chain", "shipping", "marine", "freight", "warehouse"],
  "Public Sector": ["government", "ministry", "public sector", "policy", "authority of india"],
  "Real Estate": ["real estate", "property", "construction"],
};

const FUNCTION_HINTS: Record<string, string[]> = {
  Product: ["product manager", "product owner", "roadmap", "product head"],
  Finance: ["financial model", "fp&a", "valuation", "accounting", "treasury", "audit"],
  Marketing: ["marketing", "brand", "campaign", "growth", "seo"],
  Sales: ["sales", "business development", "account executive", "gtm", "go-to-market"],
  Operations: ["operations", "supply chain", "process improvement", "program manager"],
  Strategy: ["strategy", "corporate development", "m&a", "market entry"],
  Engineering: ["software engineer", "developer", "backend", "frontend", "devops", "architect"],
  Data: ["data scien", "analytics", "machine learning", "sql", "dashboard"],
  Consulting: ["consultant", "engagement", "client delivery"],
  Design: ["design", "figma", "ux", "ui "],
  HR: ["human resources", "talent", "recruit", "hr business partner"],
  Entrepreneurship: ["founder", "co-founder", "founding team", "entrepreneur", "own venture"],
};

const SKILL_HINTS: Record<string, string[]> = {
  "Financial modelling": ["financial model", "three-statement", "lbo", "dcf"],
  Valuation: ["valuation", "comps", "dcf"],
  "M&A": ["m&a", "merger", "acquisition", "due diligence"],
  Python: ["python", "pandas"],
  SQL: ["sql", "postgres", "mysql", "bigquery"],
  Excel: ["excel", "vlookup", "pivot"],
  "Product management": ["product manager", "product management", "roadmap"],
  "Consulting cases": ["case interview", "case competition"],
  "Startup fundraising": ["fundrais", "seed round", "term sheet", "angel"],
  "Data analysis": ["data analysis", "analytics", "dashboard", "power bi", "tableau"],
  "Machine learning": ["machine learning", "deep learning", "ml model"],
  "Brand marketing": ["brand", "positioning"],
  "Growth marketing": ["growth marketing", "performance marketing", "retention"],
  "Supply chain": ["supply chain", "logistics", "procurement"],
  "Public speaking": ["public speaking", "keynote", "panel"],
  "Design / Figma": ["figma", "ux design", "ui design"],
};

const INTEREST_HINTS: Record<string, string[]> = {
  AI: ["artificial intelligence", " ai ", "llm", "genai"],
  Startups: ["startup", "founder", "venture"],
  Finance: ["investing", "markets", "equities"],
  "Venture Capital": ["venture capital", " vc "],
  "Private Equity": ["private equity"],
  Sustainability: ["sustainab", "esg", "climate"],
  Sports: ["sports", "athlete"],
  Cricket: ["cricket"],
  Football: ["football", "soccer"],
  Tennis: ["tennis"],
  Badminton: ["badminton"],
  F1: ["formula 1", "f1 "],
  Fitness: ["gym", "fitness", "running", "marathon"],
  Reading: ["reading", "books"],
  Travel: ["travel"],
  Music: ["music", "guitar", "drums", "piano"],
  Photography: ["photograph"],
  "Cooking & baking": ["cooking", "baking"],
  Writing: ["writing", "blog", "journal"],
};

function matchAll(text: string, hints: Record<string, string[]>, limit: number) {
  return Object.entries(hints)
    .filter(([, needles]) => needles.some((needle) => text.includes(needle)))
    .map(([label]) => label)
    .slice(0, limit);
}

/** Keyword pass used when no Anthropic key is configured. Deliberately conservative. */
function parseWithKeywords(text: string): ResumeDraft {
  const lower = text.toLowerCase();

  const firstLines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 12);
  const roleLine =
    firstLines.find((line) =>
      /manager|analyst|consultant|engineer|founder|director|associate|lead|head|officer|specialist/i.test(
        line,
      ),
    ) ?? "";

  const linkedin = text.match(/https?:\/\/(www\.)?linkedin\.com\/[^\s)]+/i)?.[0] ?? null;
  const location = LOCATIONS.find((city) => lower.includes(city.toLowerCase())) ?? "";
  const industry = matchAll(lower, INDUSTRY_HINTS, 1)[0] ?? "";
  const fn = matchAll(lower, FUNCTION_HINTS, 1)[0] ?? "";

  const company =
    text.match(/(?:at|@)\s+([A-Z][\w&.\- ]{2,40})/)?.[1]?.trim() ?? "";

  return {
    ...EMPTY_DRAFT,
    currentRole: roleLine.slice(0, 120),
    location,
    linkedinUrl: linkedin,
    experience: industry || fn || company ? [{ company, industry, function: fn, years: 0 }] : [],
    skills: matchAll(lower, SKILL_HINTS, 8),
    interests: matchAll(lower, INTEREST_HINTS, 8),
  };
}

export async function parseResume(text: string): Promise<ResumeParseResult> {
  const hasKey = Boolean(process.env.ANTHROPIC_API_KEY);
  if (!hasKey) return { draft: parseWithKeywords(text), source: "keywords" };

  try {
    return { draft: await parseWithClaude(text), source: "claude" };
  } catch (error) {
    console.error("Résumé extraction via Claude failed, falling back to keywords:", error);
    return { draft: parseWithKeywords(text), source: "keywords" };
  }
}
