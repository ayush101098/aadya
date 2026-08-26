import type { HelpRequest, Opportunity, Person, Resource } from "@/lib/types";

const t = (daysAgo: number) =>
  new Date(Date.UTC(2026, 7, 26) - daysAgo * 86400000).toISOString();

/**
 * The PGP PRO 2027 cohort roster. Names and ISB addresses only — everything else on a
 * profile is filled in by the person it belongs to.
 *
 * Adding someone here (or through /admin once Supabase is connected) is what lets them
 * sign in: the email must be on this list before a magic link gets them past /pending.
 */
const COHORT_ROSTER: [name: string, email: string][] = [
  ["Aadya Singh Rathore", "AadyaSingh_Rathore_PGPPRO2027@isb.edu"],
  ["Aastha Aggarwal", "Aastha_Aggarwal_PGPPRO2027@isb.edu"],
  ["Abhilash Kumar", "Abhilash_Kumar_PGPPRO2027@isb.edu"],
  ["Aditya Nigam", "Aditya_Nigam_PGPPRO2027@isb.edu"],
  ["Ajinder Kaur", "Ajinder_Kaur_PGPPRO2027@isb.edu"],
  ["Ajinkya Karpe", "Ajinkya_Karpe_PGPPRO2027@isb.edu"],
  ["Akanksha Upadhyay", "Akanksha_Upadhyay_PGPPRO2027@isb.edu"],
  ["Anshul Rai", "Anshul_Rai_PGPPRO2027@isb.edu"],
  ["Anshuman Sharma", "Anshuman_Sharma_PGPPRO2027@isb.edu"],
  ["Aryan Srivastava", "Aryan_Srivastava_PGPPRO2027@isb.edu"],
  ["Ayush Dua", "Ayush_Dua_PGPPRO2027@isb.edu"],
  ["Ayushi Sharma", "Ayushi_Sharma_PGPPRO2027@isb.edu"],
  ["Bhawna Gupta", "Bhawna_Gupta_PGPPRO2027@isb.edu"],
  ["Devdutt Kumar", "Devdutt_Kumar_PGPPRO2027@isb.edu"],
  ["Devesh Puri", "Devesh_Puri_PGPPRO2027@isb.edu"],
  ["Devika Manghnani", "Devika_Manghnani_PGPPRO2027@isb.edu"],
  ["Devyani Saxena", "Devyani_Saxena_PGPPRO2027@isb.edu"],
  ["Dhruv Kapur", "Dhruv_Kapur_PGPPRO2027@isb.edu"],
  ["Gayatri Ganesh", "Gayatri_Ganesh_PGPPRO2027@isb.edu"],
  ["Harshit Prasad", "Harshit_Prasad_PGPPRO2027@isb.edu"],
  ["Harsukhraj Sandhu", "Harsukhraj_Sandhu_PGPPRO2027@isb.edu"],
  ["Karn Kedar", "Karn_Kedar_PGPPRO2027@isb.edu"],
  ["Kriti Anand", "Kriti_Anand_PGPPRO2027@isb.edu"],
  ["Manvi Kumar", "Manvi_Kumar_PGPPRO2027@isb.edu"],
  ["Niki Tripathy", "Niki_Tripathy_PGPPRO2027@isb.edu"],
  ["Nirjhar Kaushik", "Nirjhar_Kaushik_PGPPRO2027@isb.edu"],
  ["Nishant Chadha", "Nishant_Chadha_PGPPRO2027@isb.edu"],
  ["Nupur Gupta", "Nupur_Gupta_PGPPRO2027@isb.edu"],
  ["Prashant Sarbahi", "Prashant_Sarbahi_PGPPRO2027@isb.edu"],
  ["Priyanka Gambhir", "Priyanka_Gambhir_PGPPRO2027@isb.edu"],
  ["Purran Modi", "Purran_Modi_PGPPRO2027@isb.edu"],
  ["Rahul Krishnan", "Rahul_Krishnan_PGPPRO2027@isb.edu"],
  ["Ranjeet Tomar", "Ranjeet_Tomar_PGPPRO2027@isb.edu"],
  ["Rashi Jain", "Rashi_Jain_PGPPRO2027@isb.edu"],
  ["Rishabh Dureha", "Rishabh_Dureha_PGPPRO2027@isb.edu"],
  ["Rishi Garg", "Rishi_Garg_PGPPRO2027@isb.edu"],
  ["Rohan Bahl", "Rohan_Bahl_PGPPRO2027@isb.edu"],
  ["Sagar Vakharia", "Sagar_Vakharia_PGPPRO2027@isb.edu"],
  ["Sangeeta Purkayastha", "Sangeeta_Purkayastha_PGPPRO2027@isb.edu"],
  ["Sanjeeta Singh", "Sanjeeta_Singh_PGPPRO2027@isb.edu"],
  ["Saurabh Shukla", "Saurabh_Shukla_PGPPRO2027@isb.edu"],
  ["Shailendra Kumar", "Shailendra_Kumar_PGPPRO2027@isb.edu"],
  ["Shaleen Taneja", "Shaleen_Taneja_PGPPRO2027@isb.edu"],
  ["Shekhar Saini", "Shekhar_Saini_PGPPRO2027@isb.edu"],
  ["Shivani Chopra", "Shivani_Chopra_PGPPRO2027@isb.edu"],
  ["Shourya Raj Gupta", "ShouryaRaj_Gupta_PGPPRO2027@isb.edu"],
  ["Shrawani Kalita", "Shrawani_Kalita_PGPPRO2027@isb.edu"],
  ["Sidharth Mehta", "Sidharth_Mehta_PGPPRO2027@isb.edu"],
  ["Siddhant Gupta", "Siddhant_Gupta_PGPPRO2027@isb.edu"],
  ["Soumya Sinha", "Soumya_Sinha_PGPPRO2027@isb.edu"],
  ["Sunaina Kaila", "Sunaina_Kaila_PGPPRO2027@isb.edu"],
  ["Utsav Agarwal", "Utsav_Agarwal_PGPPRO2027@isb.edu"],
  ["Vandana Anand", "Vandana_Anand_PGPPRO2027@isb.edu"],
  ["Varun Goel", "Varun_Goel_PGPPRO2027@isb.edu"],
  ["Yash Saraswat", "Yash_Saraswat_PGPPRO2027@isb.edu"],
];

/** Emails that get the admin role. Edit this list, or promote from /admin. */
const ADMIN_EMAILS = ['aadyasingh_rathore_pgppro2027@isb.edu'];


/**
 * Profiles from the cohort's own introductions — role, years, group and interests as each
 * person described them. Everyone else starts blank until they fill their profile in;
 * nothing here is inferred.
 */
type ProfileSeed = {
  currentRole: string;
  company: string;
  group: string;
  industry: string;
  function: string;
  years: number;
  interests: string[];
};

const PROFILES: Record<string, ProfileSeed> = {
  "Aadya Singh Rathore": {
    currentRole: "ACA · Strategic Finance Lead",
    company: "Family manufacturing business",
    group: "Banking, Finance & Investment",
    industry: "Manufacturing",
    function: "Finance",
    years: 5,
    interests: ["F1", "Football", "Finance"],
  },
  "Akanksha Upadhyay": {
    currentRole: "Chartered Accountant",
    company: "",
    group: "Banking, Finance & Investment",
    industry: "Finance",
    function: "Finance",
    years: 0,
    interests: ["AI"],
  },
  "Ajinkya Karpe": {
    currentRole: "Asst. Director, Target Olympics Podium Scheme",
    company: "Sports Authority of India",
    group: "Other Specialized",
    industry: "Public Sector",
    function: "Operations",
    years: 7,
    interests: ["Tennis", "Cricket", "Sports"],
  },
  "Anshuman Sharma": {
    currentRole: "Management Consultant, Sales & GTM",
    company: "",
    group: "Management Consulting",
    industry: "Consulting",
    function: "Sales",
    years: 16,
    interests: ["Football", "MMA", "Mixology", "Travel"],
  },
  "Ayushi Sharma": {
    currentRole: "Founder",
    company: "Etehas (sustainable fashion)",
    group: "Startups & Entrepreneurship",
    industry: "Retail",
    function: "Entrepreneurship",
    years: 5,
    interests: ["Fitness", "Food & coffee", "Travel", "Sustainability"],
  },
  "Devika Manghnani": {
    currentRole: "Communications Manager",
    company: "Good Earth",
    group: "Media, Comms & Services",
    industry: "Media",
    function: "Marketing",
    years: 2,
    interests: ["Food & coffee", "Reading"],
  },
  "Dhruv Kapur": {
    currentRole: "Co-Founder & Product Head",
    company: "CardByte AI",
    group: "Startups & Entrepreneurship",
    industry: "Technology",
    function: "Entrepreneurship",
    years: 8,
    interests: ["Movies", "Cricket", "Football", "Tennis", "Mixology", "Travel"],
  },
  "Gayatri Ganesh": {
    currentRole: "Specialist Orthodontist (MDS) · moving into dental & medtech",
    company: "",
    group: "Other Specialized",
    industry: "Healthcare",
    function: "Operations",
    years: 0,
    interests: ["Travel", "Fitness"],
  },
  "Prashant Sarbahi": {
    currentRole: "Manager, Strategy Consulting",
    company: "Deloitte",
    group: "Management Consulting",
    industry: "Consulting",
    function: "Strategy",
    years: 0,
    interests: ["Cricket", "Badminton", "Tennis", "Reading"],
  },
  "Purran Modi": {
    currentRole: "Portfolio Compliance",
    company: "KKR (ex-Goldman Sachs, BlackRock, JPMorgan)",
    group: "Banking, Finance & Investment",
    industry: "Finance",
    function: "Operations",
    years: 0,
    interests: ["Badminton", "Travel", "Food & coffee"],
  },
  "Rishi Garg": {
    currentRole: "Software Developer",
    company: "Amazon",
    group: "Technology & Product",
    industry: "Technology",
    function: "Engineering",
    years: 0,
    interests: ["Sports", "Startups"],
  },
  "Rohan Bahl": {
    currentRole: "Marine Engineer",
    company: "Anglo-Eastern Ship Management",
    group: "Other Specialized",
    industry: "Logistics",
    function: "Operations",
    years: 10,
    interests: ["F1", "Tennis", "Football", "Food & coffee", "Fitness"],
  },
  "Sagar Vakharia": {
    currentRole: "Sr. Program Manager",
    company: "Ampyr Energy",
    group: "Energy & Infrastructure",
    industry: "Energy",
    function: "Operations",
    years: 0,
    interests: ["Reading", "Writing"],
  },
  "Shailendra Kumar": {
    currentRole: "AVP, Software Engineer III",
    company: "Bank of America",
    group: "Banking, Finance & Investment",
    industry: "Finance",
    function: "Engineering",
    years: 0,
    interests: ["Travel", "Music", "Food & coffee"],
  },
  "Shourya Raj Gupta": {
    currentRole: "Founding Team",
    company: "ThinkAnanta",
    group: "Startups & Entrepreneurship",
    industry: "Technology",
    function: "Entrepreneurship",
    years: 0,
    interests: ["Polo", "F1", "Sports"],
  },
  "Shrawani Kalita": {
    currentRole: "Energy Market Consultant",
    company: "Schneider Electric",
    group: "Energy & Infrastructure",
    industry: "Energy",
    function: "Consulting",
    years: 7.5,
    interests: ["Cooking & baking", "Badminton", "Swimming", "Movies"],
  },
  "Siddhant Gupta": {
    currentRole: "Business Head",
    company: "Vrddi (Money Club)",
    group: "Startups & Entrepreneurship",
    industry: "Finance",
    function: "Entrepreneurship",
    years: 5.5,
    interests: ["Music", "Reading", "Badminton", "Swimming"],
  },
  "Soumya Sinha": {
    currentRole: "Consultant",
    company: "ZS Associates",
    group: "Management Consulting",
    industry: "Consulting",
    function: "Consulting",
    years: 0,
    interests: ["Travel"],
  },
  "Vandana Anand": {
    currentRole: "Client Delivery",
    company: "Genpact (ex-journalism, law, marketing)",
    group: "Media, Comms & Services",
    industry: "Media",
    function: "Operations",
    years: 0,
    interests: ["Tennis", "Cricket", "Badminton", "Photography", "Yoga"],
  },
  "Varun Goel": {
    currentRole: "Product Manager",
    company: "Mitratech (ex-Moody's)",
    group: "Technology & Product",
    industry: "Technology",
    function: "Product",
    years: 0,
    interests: ["Reading", "Movies"],
  },
};

export const SEED_PEOPLE: Person[] = COHORT_ROSTER.map(([name, email], index) => {
  const profile = PROFILES[name];
  return {
    id: `p${index + 1}`,
    name,
    email,
    photo: null,
    bio: "",
    currentRole: profile?.currentRole ?? "PGP PRO 2027 · ISB",
    group: profile?.group ?? "",
    location: "",
    linkedinUrl: null,
    contactPreference: "Email",
    contactHandle: email,
    role: ADMIN_EMAILS.includes(email.toLowerCase()) ? "admin" : "student",
    experience: profile
      ? [
          {
            id: `e${index + 1}`,
            company: profile.company,
            industry: profile.industry,
            function: profile.function,
            years: profile.years,
          },
        ]
      : [],
    skills: [],
    interests: profile?.interests ?? [],
    lookingFor: [],
    createdAt: t(30),
  };
});

type ResourceSeed = [
  id: string,
  title: string,
  description: string,
  category: string,
  url: string,
  tags: string[],
  uploadedBy: string,
  daysAgo: number,
];

const RESOURCE_SEEDS: ResourceSeed[] = [
  // ------------------------------------------------------------- Academics
  ["r1", "Damodaran Online — the full valuation course", "Aswath Damodaran's entire NYU Stern valuation class: slides, lecture videos, spreadsheets and the industry datasets he updates every January. If you only bookmark one finance site, this is it.", "Academics", "https://pages.stern.nyu.edu/~adamodar/", ["valuation", "corporate finance", "NYU Stern"], "", 42],
  ["r2", "Damodaran's updated industry datasets", "Betas, cost of capital, margins and multiples by sector and geography — the numbers you cite when a professor asks where your WACC came from.", "Finance", "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/data.html", ["data", "WACC", "valuation"], "", 40],
  ["r3", "MIT OCW — Finance Theory I (15.401)", "Full lecture notes and problem sets covering NPV, portfolio theory, CAPM and capital structure. Maps almost one-to-one onto our Term 1 corporate finance syllabus.", "Academics", "https://ocw.mit.edu/courses/15-401-finance-theory-i-fall-2008/", ["academics", "corporate finance", "MIT"], "", 39],
  ["r4", "MIT OCW — Marketing Management (15.810)", "Segmentation, positioning, pricing and channel strategy with the case list. Good companion reading before marketing management sessions.", "Marketing", "https://ocw.mit.edu/courses/15-810-marketing-management-fall-2015/", ["academics", "marketing", "MIT"], "", 38],
  ["r5", "MIT OCW — full management course catalogue", "Every Sloan course MIT has published: operations, system dynamics, organisational processes, entrepreneurship. Free lecture notes for anything you are behind on.", "Academics", "https://ocw.mit.edu/search/?d=Sloan%20School%20of%20Management", ["academics", "operations", "MIT"], "", 37],
  ["r6", "NPTEL — management course library", "IIT/IISc video courses in management, operations research and economics. Useful when you want the same topic explained a second way, in an Indian context.", "Academics", "https://nptel.ac.in/course.html", ["academics", "India", "lectures"], "", 36],
  ["r7", "Term 1 Corporate Finance — consolidated cohort notes", "Chapter-wise notes with solved past-paper questions: capital structure, WACC, dividend policy, and the formula sheet the seniors circulated.", "Academics", "https://drive.google.com/drive/folders/cohort-first-corpfin", ["academics", "finance", "notes"], "", 9],
  ["r8", "Statistics & econometrics refresher — Khan Academy", "If regression output still feels like magic, this is the fastest way to fix it before the quant methods midterm.", "Analytics", "https://www.khanacademy.org/math/statistics-probability", ["statistics", "regression", "basics"], "", 34],

  // --------------------------------------------------------------- Finance
  ["r9", "Wall Street Prep — free finance knowledge base", "Hundreds of short explainers on accounting, LBO mechanics, comps and precedent transactions. The de facto glossary for finance recruiting.", "Finance", "https://www.wallstreetprep.com/knowledge/", ["IB", "modelling", "accounting"], "", 33],
  ["r10", "Macabacus — modelling and Excel best practice", "How bankers actually format and structure models: circularity, toggles, keyboard shortcuts and the shortcuts that pay for themselves in week one.", "Finance", "https://macabacus.com/learn", ["Excel", "modelling", "formatting"], "", 32],
  ["r11", "A Simple Model — free financial modelling course", "Builds a three-statement model from a blank sheet across short videos, with downloadable Excel files at every stage.", "Finance", "https://www.asimplemodel.com/", ["modelling", "Excel", "three-statement"], "", 31],
  ["r12", "Corporate Finance Institute — free course collection", "CFI's free tier covers accounting fundamentals, Excel, and an intro to valuation. Certificates are optional; the templates are the real value.", "Courses", "https://corporatefinanceinstitute.com/collections/", ["courses", "finance", "Excel"], "", 30],
  ["r13", "Three-statement model template (cohort build)", "Clean Excel template with linked IS/BS/CF, a working-capital schedule and a debt waterfall. Comments explain every driver so you can defend it in an interview.", "Finance", "https://drive.google.com/drive/folders/cohort-first-3sm", ["modelling", "Excel", "valuation"], "", 26],
  ["r14", "Zerodha Varsity — markets, from zero", "The best free Indian markets curriculum: equities, futures, options, and a genuinely good module on reading annual reports.", "Finance", "https://zerodha.com/varsity/", ["India", "markets", "equities"], "", 29],
  ["r15", "Investopedia financial dictionary", "When a term shows up in a case and you have ninety seconds to understand it before you speak.", "Finance", "https://www.investopedia.com/financial-term-dictionary-4769738", ["glossary", "basics"], "", 28],
  ["r16", "Aswath Damodaran on YouTube", "Full valuation and corporate finance lectures, plus his running commentary on live deals and market bubbles. Watch at 1.5x.", "Finance", "https://www.youtube.com/@AswathDamodaranonValuation", ["valuation", "lectures", "video"], "", 27],
  ["r17", "Private Equity deal diligence checklist", "The commercial diligence checklist from two healthcare deals, adapted so it works for any services business.", "Finance", "https://drive.google.com/drive/folders/cohort-first-pe-diligence", ["PE", "diligence", "deals"], "", 16],

  // ------------------------------------------------------ Interview prep
  ["r18", "Mergers & Inquisitions — finance recruiting bible", "Brutally honest guides to IB, PE and HF recruiting: what the job is, what the interview asks, and what the exit actually looks like.", "Interview Prep", "https://www.mergersandinquisitions.com/", ["IB", "recruiting", "careers"], "", 26],
  ["r19", "Investment banking technical question bank", "The 120-question technical set we drilled: accounting, enterprise value, DCF, LBO and merger maths, with worked answers.", "Interview Prep", "https://drive.google.com/drive/folders/cohort-first-ib-guide", ["IB", "interviews", "technicals"], "", 30],
  ["r20", "PrepLounge case library", "Hundreds of user-submitted and firm-published cases with a partner-matching tool so you always have someone to practise with.", "Interview Prep", "https://www.preplounge.com/en/case-interview", ["consulting", "cases", "practice"], "", 25],
  ["r21", "Victor Cheng — Case Interview Secrets", "The classic frameworks-and-structure resource. Skim the free videos, then steal the issue-tree habit and drop the rigid frameworks.", "Interview Prep", "https://www.caseinterview.com/", ["consulting", "cases", "frameworks"], "", 24],
  ["r22", "RocketBlocks — consulting drills", "Drill-based prep: market sizing, chart reading, mental maths. Fifteen minutes a day beats one panicked weekend.", "Interview Prep", "https://www.rocketblocks.me/", ["consulting", "drills", "market sizing"], "", 23],
  ["r23", "McKinsey — official interview prep", "How the firm describes its own process, plus the Solve assessment and sample cases. Read this before any mock.", "Interview Prep", "https://www.mckinsey.com/careers/interviewing", ["MBB", "consulting", "interviews"], "", 23],
  ["r24", "BCG — interview preparation hub", "Sample cases, the online chatbot case, and BCG's own guidance on what a strong structure looks like.", "Interview Prep", "https://www.bcg.com/careers/interview-prep", ["MBB", "consulting", "interviews"], "", 22],
  ["r25", "Bain — case interview practice", "Bain's practice cases with written walkthroughs, including the classic Coffee Shop Co. warm-up.", "Interview Prep", "https://www.bain.com/careers/interview-prep/case-interview/", ["MBB", "consulting", "cases"], "", 22],
  ["r26", "Consulting case practice pack (40 cases)", "Cohort-built pack sorted by case type — market sizing, profitability, M&A, market entry — with interviewer-side prompts.", "Consulting", "https://drive.google.com/drive/folders/cohort-first-case-pack", ["cases", "MBB", "interviews"], "", 28],
  ["r27", "Exponent — PM interview course", "Product sense, execution, analytics and behavioural rounds with recorded mock interviews from people who got the offer.", "Interview Prep", "https://www.tryexponent.com/courses/pm", ["product", "interviews", "mocks"], "", 21],
  ["r28", "Cracking the PM Interview — companion site", "Gayle McDowell and Jackie Bavaro's PM interview material: role definitions, estimation, and the answer structures that work.", "Interview Prep", "https://www.crackingthepminterview.com/", ["product", "interviews", "books"], "", 20],

  // ------------------------------------------------------------ Consulting
  ["r29", "McKinsey — Featured Insights", "Free industry reports and the McKinsey Quarterly archive. Two of these on your target sector before an interview is a cheat code.", "Consulting", "https://www.mckinsey.com/featured-insights", ["research", "industry", "MBB"], "", 20],
  ["r30", "BCG Publications", "BCG's public research library, strongest on climate, tech adoption and consumer sentiment surveys.", "Consulting", "https://www.bcg.com/publications", ["research", "industry", "MBB"], "", 19],
  ["r31", "Bain Insights", "Bain's reports, including the annual Global Private Equity Report and the India luxury/consumer studies.", "Consulting", "https://www.bain.com/insights/", ["research", "PE", "consumer"], "", 19],
  ["r32", "think-cell tutorials", "How consultants build waterfall, Marimekko and Gantt charts fast. Even without the licence, the chart grammar is worth learning.", "Consulting", "https://www.think-cell.com/en/resources/tutorials", ["decks", "charts", "PowerPoint"], "", 18],
  ["r33", "Consulting deck structure — cohort teardown", "A teardown of three real recommendation decks: the pyramid principle in practice, action titles, and how to land a message per slide.", "Consulting", "https://drive.google.com/drive/folders/cohort-first-deck-teardown", ["decks", "storytelling", "communication"], "", 12],

  // ------------------------------------------------------ Strategy & econ
  ["r34", "Porter — The Five Competitive Forces (HBR)", "The original article, not the textbook summary. Worth twenty minutes before any industry-attractiveness question.", "Strategy", "https://hbr.org/2008/01/the-five-competitive-forces-that-shape-strategy", ["strategy", "frameworks", "HBR"], "", 18],
  ["r35", "HBS Working Knowledge", "Harvard Business School's research digest — short, readable write-ups of new faculty research across strategy, finance and organisations.", "Strategy", "https://www.library.hbs.edu/working-knowledge", ["research", "HBS", "strategy"], "", 17],
  ["r36", "Stratechery archive", "Ben Thompson on platform strategy and aggregation theory. The clearest writing anywhere on why tech businesses win.", "Strategy", "https://stratechery.com/", ["tech strategy", "platforms", "writing"], "", 17],
  ["r37", "The Case Centre", "The world's largest case collection — search by company or topic when you want extra practice on an industry you don't know.", "Case Studies", "https://www.thecasecentre.org/", ["cases", "academics", "research"], "", 16],
  ["r38", "Harvard Business Publishing Education", "Where the cases we're assigned come from. Student pricing, and the free preview pages are often enough for context.", "Case Studies", "https://hbsp.harvard.edu/home/", ["cases", "HBS", "academics"], "", 15],
  ["r39", "FMCG go-to-market playbook (India)", "Distribution structures, trade margins and launch checklists from two national launches, with a pricing calculator attached.", "Case Studies", "https://drive.google.com/drive/folders/cohort-first-fmcg-gtm", ["FMCG", "GTM", "distribution"], "", 18],

  // ---------------------------------------------------- Marketing & brand
  ["r40", "Seth Godin's blog", "A decade of short posts on positioning and permission marketing. Read ten at random; at least three will change how you write.", "Marketing", "https://seths.blog/", ["marketing", "positioning", "writing"], "", 15],
  ["r41", "Reforge blog — growth frameworks", "Retention, growth loops and monetisation frameworks written by operators. Strong for anyone recruiting into growth or D2C.", "Marketing", "https://www.reforge.com/blog", ["growth", "retention", "loops"], "", 14],
  ["r42", "Brand positioning workshop template", "The one-page positioning canvas we used at P&G, plus two filled-in examples for a launch and a relaunch.", "Marketing", "https://drive.google.com/drive/folders/cohort-first-positioning", ["brand", "positioning", "template"], "", 13],

  // ---------------------------------------------- Operations & analytics
  ["r43", "MITx supply chain courses (edX)", "MIT CTL's supply chain analytics and fundamentals courses — audit free. The best structured ops content online.", "Operations", "https://www.edx.org/school/mitx", ["supply chain", "operations", "courses"], "", 14],
  ["r44", "Mode — the SQL tutorial", "From SELECT to window functions with a live query editor on real datasets. Two evenings gets you interview-ready SQL.", "Analytics", "https://mode.com/sql-tutorial/", ["SQL", "data", "analytics"], "", 13],
  ["r45", "Kaggle Learn — micro-courses", "Two-hour hands-on courses in pandas, data visualisation, and intro ML. Practical, no maths gatekeeping.", "Analytics", "https://www.kaggle.com/learn", ["pandas", "data", "ML"], "", 12],
  ["r46", "Google Data Analytics Professional Certificate", "The most cited analytics certificate on Indian CVs. Long, but genuinely covers spreadsheets, SQL, R and dashboards.", "Courses", "https://www.coursera.org/professional-certificates/google-data-analytics", ["courses", "analytics", "certificate"], "", 12],
  ["r47", "ExcelJet — formulas and shortcuts", "Every function explained in one screen with a worked example. The fastest Excel reference on the internet.", "Analytics", "https://exceljet.net/", ["Excel", "formulas", "productivity"], "", 11],
  ["r48", "Route-efficiency dashboard — worked example", "Cohort project files: the SQL, the model and the Power BI dashboard from a real logistics ops problem.", "Operations", "https://github.com/cohort-first/route-efficiency", ["SQL", "dashboards", "logistics"], "", 5],

  // ------------------------------------------------------ Product & tech
  ["r49", "Lenny's Newsletter", "The default reading for product people: growth, PM career paths, and hiring loops at real companies.", "Product", "https://www.lennysnewsletter.com/", ["product", "growth", "careers"], "", 11],
  ["r50", "SVPG — Marty Cagan's articles", "Product discovery, empowered teams, and why feature factories fail. Read 'Product vs Feature Teams' first.", "Product", "https://www.svpg.com/articles/", ["product", "discovery", "teams"], "", 10],
  ["r51", "PM interview prep — cohort notes", "Notes from 30 PM loops: product sense frameworks, metrics questions, execution rounds, and the questions actually asked.", "Product", "https://drive.google.com/drive/folders/cohort-first-pm-prep", ["product", "interviews", "frameworks"], "", 24],
  ["r52", "Harvard CS50x", "If you want to genuinely understand what engineers do, this is still the best introduction to computer science. Free.", "Technology", "https://cs50.harvard.edu/x/", ["CS", "programming", "courses"], "", 10],
  ["r53", "Python for business analytics — starter notebooks", "Six cohort-built Jupyter notebooks taking you from pandas basics to a working regression on real retail sales data.", "Technology", "https://github.com/cohort-first/python-starter", ["Python", "pandas", "analytics"], "", 22],

  // -------------------------------------------------------------- AI
  ["r54", "Practical Deep Learning for Coders (fast.ai)", "Top-down, code-first deep learning. You build a working model in lesson one and learn the theory afterwards.", "AI", "https://course.fast.ai/", ["AI", "deep learning", "courses"], "", 9],
  ["r55", "Neural Networks: Zero to Hero — Karpathy", "Builds a language model from scratch, line by line. The clearest explanation of how LLMs actually work.", "AI", "https://karpathy.ai/zero-to-hero.html", ["AI", "LLM", "video"], "", 9],
  ["r56", "DeepLearning.AI short courses", "One-hour, free courses on RAG, agents, evaluation and prompting — built with the labs shipping the tools.", "AI", "https://www.deeplearning.ai/short-courses/", ["AI", "LLM", "courses"], "", 8],
  ["r57", "Anthropic — prompt engineering guide", "The practical documentation on getting reliable output from an LLM. Immediately useful for research, summarisation and analysis work.", "AI", "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", ["AI", "prompting", "productivity"], "", 8],
  ["r58", "How to read an AI paper (and what to skip)", "A short cohort guide to getting through AI research quickly — what matters in the method section and what is usually noise.", "AI", "https://drive.google.com/drive/folders/cohort-first-ai-papers", ["AI", "research", "learning"], "", 20],

  // ------------------------------------------- Entrepreneurship & venture
  ["r59", "Y Combinator Startup School", "Free, structured curriculum on going from idea to launch, with the library of YC founder talks attached.", "Entrepreneurship", "https://www.startupschool.org/", ["startups", "founders", "YC"], "", 7],
  ["r60", "Paul Graham's essays", "Twenty years of writing on startups, ideas and doing ambitious work. Start with 'Do Things That Don't Scale'.", "Entrepreneurship", "https://paulgraham.com/articles.html", ["startups", "essays", "writing"], "", 7],
  ["r61", "Sequoia — writing a business plan", "The pitch deck outline most Indian seed investors still expect, straight from the source.", "Entrepreneurship", "https://www.sequoiacap.com/article/writing-a-business-plan/", ["fundraising", "pitch deck", "VC"], "", 6],
  ["r62", "First Round Review", "Long-form operator interviews on hiring, pricing and scaling. Closest thing to a free operating manual.", "Entrepreneurship", "https://review.firstround.com/", ["startups", "operations", "hiring"], "", 6],
  ["r63", "a16z — insights and podcasts", "Sector theses on AI, fintech and consumer. Useful for framing why a market is interesting in a VC interview.", "Entrepreneurship", "https://a16z.com/", ["VC", "theses", "tech"], "", 6],
  ["r64", "Seed fundraising: deck, data room, diligence", "What actually goes into a seed raise — the deck that worked, the data-room folder tree, and the questions investors asked.", "Entrepreneurship", "https://drive.google.com/drive/folders/cohort-first-seed-raise", ["fundraising", "startups", "VC"], "", 14],
  ["r65", "Term sheet vocabulary in plain English", "Liquidation preference, pro-rata, ratchets and ESOP maths explained without legalese, with worked numbers.", "Entrepreneurship", "https://drive.google.com/drive/folders/cohort-first-term-sheets", ["VC", "term sheets", "startups"], "", 12],

  // ----------------------------------------------------- Career & reading
  ["r66", "Levels.fyi — compensation data", "Real, verified pay bands by company, level and city. Use it before you negotiate anything.", "Career", "https://www.levels.fyi/", ["compensation", "negotiation", "careers"], "", 5],
  ["r67", "Ask a Manager", "Twenty years of workplace questions answered well. Unreasonably useful for internships and first-job politics.", "Career", "https://www.askamanager.org/", ["workplace", "careers", "advice"], "", 5],
  ["r68", "Finshots — three-minute business news", "Daily Indian business explainers. The cheapest way to sound informed in a networking call.", "Career", "https://finshots.in/", ["India", "news", "business"], "", 4],
  ["r69", "The Ken", "Long-form Indian business journalism. One story a day, properly reported — good for industry prep on Indian firms.", "Career", "https://the-ken.com/", ["India", "journalism", "industry"], "", 4],
  ["r70", "Inc42 — Indian startup ecosystem", "Funding news, sector reports and the DataLabs research on Indian startups.", "Career", "https://inc42.com/", ["India", "startups", "funding"], "", 4],
  ["r71", "CV and cover letter clinic — cohort templates", "Two CV templates (finance and consulting), the bullet formula that survived MBB screening, and ten before/after rewrites.", "Career", "https://drive.google.com/drive/folders/cohort-first-cv-clinic", ["CV", "career", "templates"], "", 3],
  ["r72", "Free courses worth actually finishing", "A curated shortlist — SQL, statistics, negotiation and design — with hours required and what each is genuinely good for.", "Courses", "https://drive.google.com/drive/folders/cohort-first-course-shortlist", ["courses", "learning", "career"], "", 6],
  ["r73", "Wharton Business Foundations (Coursera)", "Wharton's core MBA sequence — accounting, marketing, operations, finance — auditable free. Good for filling a weak core.", "Courses", "https://www.coursera.org/specializations/wharton-business-foundations", ["courses", "core", "Wharton"], "", 7],
  ["r74", "The Personal MBA — reading list", "Josh Kaufman's list of the business books that are actually worth the hours, ranked and summarised.", "Books", "https://personalmba.com/best-business-books/", ["books", "reading list"], "", 3],
  ["r75", "Thinking, Fast and Slow", "Kahneman on judgement under uncertainty. Shows up in behavioural finance, marketing and negotiation alike.", "Books", "https://www.goodreads.com/book/show/11468377-thinking-fast-and-slow", ["books", "behavioural", "decisions"], "", 3],
  ["r76", "The Goal — Goldratt", "A novel about a factory that teaches the theory of constraints better than any ops textbook. Read it before the operations core.", "Books", "https://www.goodreads.com/book/show/113934.The_Goal", ["books", "operations", "constraints"], "", 2],
  ["r77", "Competitive Strategy — Porter", "The source text behind half our strategy syllabus. Skim the first four chapters and you'll follow every session.", "Books", "https://www.goodreads.com/book/show/40646.Competitive_Strategy", ["books", "strategy", "Porter"], "", 2],
  ["r78", "Zero to One — Thiel", "Contrarian, arguable and short. Useful as a foil in any entrepreneurship discussion.", "Books", "https://www.goodreads.com/book/show/18050143-zero-to-one", ["books", "startups", "strategy"], "", 2],
];

export const SEED_RESOURCES: Resource[] = RESOURCE_SEEDS.map(
  ([id, title, description, category, url, tags, uploadedBy, daysAgo]) => ({
    id,
    title,
    description,
    category,
    url,
    tags,
    uploadedBy,
    createdAt: t(daysAgo),
  }),
);

export const SEED_OPPORTUNITIES: Opportunity[] = [];

export const SEED_HELP_REQUESTS: HelpRequest[] = [];
