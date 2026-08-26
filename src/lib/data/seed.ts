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
  // ------------------------------------------------------- Core Curriculum
  ["r1", "MIT Sloan — the full course catalogue on OCW", "Every Sloan course MIT has published: accounting, operations, system dynamics, organisational processes, entrepreneurship. Free lecture notes for anything you're behind on.", "Core Curriculum", "https://ocw.mit.edu/search/?d=Sloan%20School%20of%20Management", ["academics", "MIT", "lecture notes"], "", 45],
  ["r2", "NPTEL — Indian management course library", "IIT and IISc video courses in management, operations research and economics. Useful when you want the same topic explained a second way, in an Indian context.", "Core Curriculum", "https://nptel.ac.in/courses", ["academics", "India", "lectures"], "", 44],
  ["r3", "Wharton Business Foundations (Coursera)", "Wharton's core MBA sequence — accounting, marketing, operations, finance — auditable free. The fastest way to fill a weak spot in the core.", "Core Curriculum", "https://www.coursera.org/specializations/wharton-business-foundations", ["core", "Wharton", "courses"], "", 43],
  ["r4", "Corporate Finance Institute — free course collection", "CFI's free tier covers accounting fundamentals, Excel and an introduction to valuation. Certificates are optional; the templates are the real value.", "Core Curriculum", "https://corporatefinanceinstitute.com/collections/", ["templates", "finance", "Excel"], "", 42],
  ["r5", "ISB — faculty research and thought leadership", "What our own faculty publish, by area. Worth a scan before you pick electives or approach a professor about a project.", "Core Curriculum", "https://www.isb.edu/faculty-and-research", ["ISB", "research", "faculty"], "", 41],

  // ---------------------------------------------------- Financial Accounting
  ["r6", "MIT OCW 15.501 — Financial and Managerial Accounting", "The full MIT accounting core: lecture notes, problem sets and solutions. Covers accrual accounting, the three statements and how they link.", "Financial Accounting", "https://ocw.mit.edu/courses/15-501-introduction-to-financial-and-managerial-accounting-spring-2004/", ["accounting", "MIT", "core"], "", 40],
  ["r7", "AccountingCoach", "Plain-English explanations of every accounting concept, with practice quizzes. The place to go when a debit/credit still doesn't feel obvious.", "Financial Accounting", "https://www.accountingcoach.com/", ["accounting", "basics", "practice"], "", 39],
  ["r8", "Investopedia financial dictionary", "When a term shows up in a case and you have ninety seconds to understand it before you speak.", "Financial Accounting", "https://www.investopedia.com/financial-term-dictionary-4769738", ["glossary", "basics"], "", 38],

  // ------------------------------------------------------- Corporate Finance
  ["r9", "Damodaran Online — the full valuation course", "Aswath Damodaran's entire NYU Stern class: slides, lecture videos, spreadsheets and the industry datasets he updates every January. If you bookmark one finance site, this is it.", "Corporate Finance", "https://pages.stern.nyu.edu/~adamodar/", ["valuation", "NYU Stern", "core"], "", 37],
  ["r10", "Damodaran's updated industry datasets", "Betas, cost of capital, margins and multiples by sector and geography — the numbers you cite when a professor asks where your WACC came from.", "Corporate Finance", "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/data.html", ["data", "WACC", "valuation"], "", 36],
  ["r11", "MIT OCW 15.401 — Finance Theory I", "Full lecture notes and problem sets covering NPV, portfolio theory, CAPM and capital structure. Maps almost one-to-one onto the corporate finance core.", "Corporate Finance", "https://ocw.mit.edu/courses/15-401-finance-theory-i-fall-2008/", ["corporate finance", "MIT", "core"], "", 35],
  ["r12", "Musings on Markets — Damodaran's blog", "He values live situations as they happen: IPOs, takeovers, market panics. The best demonstration anywhere of finance theory meeting a real number.", "Corporate Finance", "https://aswathdamodaran.blogspot.com/", ["valuation", "markets", "writing"], "", 34],
  ["r13", "Macabacus — modelling and Excel best practice", "How bankers actually structure and format models: circularity, toggles, and the keyboard shortcuts that pay for themselves in week one.", "Corporate Finance", "https://macabacus.com/learn", ["Excel", "modelling", "formatting"], "", 33],
  ["r14", "A Simple Model — free financial modelling course", "Builds a three-statement model from a blank sheet across short videos, with downloadable Excel files at every stage.", "Corporate Finance", "https://www.asimplemodel.com/", ["modelling", "Excel", "three-statement"], "", 32],
  ["r15", "Aswath Damodaran on YouTube", "Full valuation and corporate finance lectures, plus running commentary on live deals. Watch at 1.5x.", "Corporate Finance", "https://www.youtube.com/@AswathDamodaranonValuation", ["valuation", "lectures", "video"], "", 31],

  // ---------------------------------------------------- Managerial Economics
  ["r16", "MIT OCW 14.01 — Principles of Microeconomics", "Jonathan Gruber's course with video lectures, problem sets and past exams. Supply and demand through to externalities and welfare.", "Managerial Economics", "https://ocw.mit.edu/courses/14-01-principles-of-microeconomics-fall-2023/", ["microeconomics", "MIT", "core"], "", 30],
  ["r17", "Marginal Revolution University", "Short, sharp economics videos from Tyler Cowen and Alex Tabarrok. Best free explanation of pricing power, incentives and trade.", "Managerial Economics", "https://mru.org/", ["economics", "video", "pricing"], "", 29],

  // ---------------------------------------------------------------- Marketing
  ["r18", "MIT OCW 15.810 — Marketing Management", "Segmentation, positioning, pricing and channel strategy, with the case list and analytics assignments. Good companion reading before marketing sessions.", "Marketing", "https://ocw.mit.edu/courses/15-810-marketing-management-analytics-frameworks-and-applications-fall-2015/", ["marketing", "MIT", "core"], "", 28],
  ["r19", "Seth Godin's blog", "A decade of short posts on positioning and permission marketing. Read ten at random; at least three will change how you write.", "Marketing", "https://seths.blog/", ["positioning", "writing", "brand"], "", 27],
  ["r20", "Reforge blog — growth frameworks", "Retention, growth loops and monetisation frameworks written by operators. Strong for anyone recruiting into growth or D2C.", "Marketing", "https://www.reforge.com/blog", ["growth", "retention", "loops"], "", 26],

  // ------------------------------------------------- Operations & Supply Chain
  ["r21", "MIT OCW 15.761 — Introduction to Operations Management", "Process analysis, inventory, queueing and the bullwhip effect, with the problem sets. The operations core in one page.", "Operations & Supply Chain", "https://ocw.mit.edu/courses/15-761-introduction-to-operations-management-spring-2013/", ["operations", "MIT", "core"], "", 25],
  ["r22", "MITx supply chain courses on edX", "MIT CTL's supply chain analytics and fundamentals courses — audit free. The best structured operations content online.", "Operations & Supply Chain", "https://www.edx.org/school/mitx", ["supply chain", "analytics", "courses"], "", 24],

  // ----------------------------------------------------------------- Strategy
  ["r23", "Porter — The Five Competitive Forces (HBR)", "The original article, not the textbook summary. Twenty minutes, and it reframes every industry-attractiveness question you'll be asked.", "Strategy", "https://hbr.org/2008/01/the-five-competitive-forces-that-shape-strategy", ["frameworks", "HBR", "industry"], "", 23],
  ["r24", "HBS Working Knowledge", "Harvard Business School's research digest — short, readable write-ups of new faculty research across strategy, finance and organisations.", "Strategy", "https://www.library.hbs.edu/working-knowledge", ["research", "HBS"], "", 22],
  ["r25", "Stratechery archive", "Ben Thompson on platform strategy and aggregation theory. The clearest writing anywhere on why technology businesses win.", "Strategy", "https://stratechery.com/", ["tech strategy", "platforms", "writing"], "", 21],
  ["r26", "McKinsey — Featured Insights", "Free industry reports and the McKinsey Quarterly archive. Two of these on your target sector before an interview is a cheat code.", "Strategy", "https://www.mckinsey.com/featured-insights", ["research", "industry", "MBB"], "", 20],
  ["r27", "BCG Publications", "BCG's public research library, strongest on climate, technology adoption and consumer sentiment surveys.", "Strategy", "https://www.bcg.com/publications", ["research", "industry", "MBB"], "", 19],
  ["r28", "Bain Insights", "Bain's reports, including the annual Global Private Equity Report and the India consumer studies.", "Strategy", "https://www.bain.com/insights/", ["research", "PE", "consumer"], "", 18],

  // --------------------------------------------------------- Leadership & People
  ["r29", "HBR — Leadership", "HBR's leadership archive: feedback, managing up, running teams, and the transition from doing the work to leading it.", "Leadership & People", "https://hbr.org/topic/subject/leadership", ["leadership", "management", "HBR"], "", 17],
  ["r30", "Harvard Program on Negotiation", "Daily articles from the people who wrote Getting to Yes. Negotiation is the one core skill that pays off in salary talks the same week you learn it.", "Leadership & People", "https://www.pon.harvard.edu/", ["negotiation", "Harvard", "influence"], "", 16],
  ["r31", "HBR — Negotiation strategies", "Case-based pieces on anchoring, BATNA and multi-party deals. Pairs well with the PON material above.", "Leadership & People", "https://hbr.org/topic/subject/negotiation-strategies", ["negotiation", "HBR"], "", 15],
  ["r32", "Radical Candor", "Kim Scott's framework for feedback that is neither brutal nor useless. Immediately applicable to study groups, not just teams you manage later.", "Leadership & People", "https://www.radicalcandor.com/", ["feedback", "management", "teams"], "", 14],
  ["r33", "Farnam Street", "Mental models and decision-making, well written and free. Good antidote to framework-shaped thinking.", "Leadership & People", "https://fs.blog/", ["decisions", "mental models", "writing"], "", 13],

  // ------------------------------------------------ Analytics & Decision Sciences
  ["r34", "MIT OCW 15.075 — Statistical Thinking and Data Analysis", "The statistics core done properly: hypothesis testing, regression and design of experiments, with problem sets and solutions.", "Analytics & Decision Sciences", "https://ocw.mit.edu/courses/15-075j-statistical-thinking-and-data-analysis-fall-2011/", ["statistics", "regression", "MIT"], "", 12],
  ["r35", "StatQuest with Josh Starmer", "If regression output still feels like magic, this fixes it. Every concept explained visually in under fifteen minutes.", "Analytics & Decision Sciences", "https://www.youtube.com/@statquest", ["statistics", "video", "basics"], "", 11],
  ["r36", "Khan Academy — Statistics and Probability", "The refresher to run before the quant methods midterm. Free, structured, with practice problems.", "Analytics & Decision Sciences", "https://www.khanacademy.org/math/statistics-probability", ["statistics", "basics", "practice"], "", 10],
  ["r37", "The SQL Tutorial (ThoughtSpot, formerly Mode)", "From SELECT to window functions in a live query editor on real datasets. Two evenings gets you interview-ready SQL.", "Analytics & Decision Sciences", "https://www.thoughtspot.com/sql-tutorial", ["SQL", "data", "hands-on"], "", 9],
  ["r38", "Kaggle Learn — micro-courses", "Two-hour hands-on courses in pandas, data visualisation and intro ML. Practical, no maths gatekeeping.", "Analytics & Decision Sciences", "https://www.kaggle.com/learn", ["pandas", "data", "ML"], "", 8],
  ["r39", "Google Data Analytics Professional Certificate", "The most cited analytics certificate on Indian CVs. Long, but genuinely covers spreadsheets, SQL, R and dashboards.", "Analytics & Decision Sciences", "https://www.coursera.org/professional-certificates/google-data-analytics", ["certificate", "analytics", "courses"], "", 7],
  ["r40", "ExcelJet — formulas and shortcuts", "Every function explained in one screen with a worked example. The fastest Excel reference on the internet.", "Analytics & Decision Sciences", "https://exceljet.net/", ["Excel", "formulas", "productivity"], "", 6],

  // ------------------------------------------------------------ Technology & AI
  ["r41", "Harvard CS50x", "Still the best introduction to computer science. Take it if you want to genuinely understand what your engineers do. Free.", "Technology & AI", "https://cs50.harvard.edu/x/", ["CS", "programming", "courses"], "", 33],
  ["r42", "Practical Deep Learning for Coders (fast.ai)", "Top-down, code-first deep learning. You build a working model in lesson one and learn the theory afterwards.", "Technology & AI", "https://course.fast.ai/", ["AI", "deep learning", "courses"], "", 32],
  ["r43", "Neural Networks: Zero to Hero — Karpathy", "Builds a language model from scratch, line by line. The clearest explanation of how LLMs actually work.", "Technology & AI", "https://karpathy.ai/zero-to-hero.html", ["AI", "LLM", "video"], "", 31],
  ["r44", "DeepLearning.AI courses", "Short, free courses on RAG, agents, evaluation and prompting — built with the labs shipping the tools.", "Technology & AI", "https://www.deeplearning.ai/courses", ["AI", "LLM", "courses"], "", 30],
  ["r45", "Claude — prompt engineering guide", "The practical documentation on getting reliable output from an LLM. Immediately useful for research, summarisation and analysis work.", "Technology & AI", "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview", ["AI", "prompting", "productivity"], "", 29],

  // ------------------------------------------------------- Entrepreneurship & VC
  ["r46", "Y Combinator Startup School", "Free, structured curriculum on going from idea to launch, with the library of YC founder talks attached.", "Entrepreneurship & VC", "https://www.startupschool.org/", ["startups", "founders", "YC"], "", 28],
  ["r47", "Paul Graham's essays", "Twenty years of writing on startups, ideas and doing ambitious work. Start with 'Do Things That Don't Scale'.", "Entrepreneurship & VC", "https://paulgraham.com/articles.html", ["startups", "essays"], "", 27],
  ["r48", "Sequoia — writing a business plan", "The pitch deck outline most Indian seed investors still expect, straight from the source.", "Entrepreneurship & VC", "https://sequoiacap.com/article/writing-a-business-plan", ["fundraising", "pitch deck", "VC"], "", 26],
  ["r49", "First Round Review", "Long-form operator interviews on hiring, pricing and scaling. The closest thing to a free operating manual.", "Entrepreneurship & VC", "https://review.firstround.com/", ["operations", "hiring", "startups"], "", 25],
  ["r50", "a16z — insights and podcasts", "Sector theses on AI, fintech and consumer. Useful for framing why a market is interesting in a VC interview.", "Entrepreneurship & VC", "https://a16z.com/", ["VC", "theses", "tech"], "", 24],
  ["r51", "Inc42 — Indian startup ecosystem", "Funding news, sector reports and DataLabs research on Indian startups.", "Entrepreneurship & VC", "https://inc42.com/", ["India", "startups", "funding"], "", 23],

  // -------------------------------------------------------- Investments & Markets
  ["r52", "Zerodha Varsity", "The best free Indian markets curriculum: equities, futures, options, and a genuinely good module on reading annual reports.", "Investments & Markets", "https://zerodha.com/varsity/", ["India", "markets", "equities"], "", 22],
  ["r53", "CFA Program — curriculum overview", "What the charter actually covers and what it costs in hours. Worth reading before you commit to Level I alongside term exams.", "Investments & Markets", "https://www.cfainstitute.org/programs/cfa-program", ["CFA", "certification", "investing"], "", 21],
  ["r54", "Finshots — three-minute business news", "Daily Indian business explainers. The cheapest way to sound informed in a networking call.", "Investments & Markets", "https://finshots.in/", ["India", "news", "business"], "", 20],
  ["r55", "The Ken", "Long-form Indian business journalism. One properly reported story a day — good for industry prep on Indian firms.", "Investments & Markets", "https://the-ken.com/", ["India", "journalism", "industry"], "", 19],

  // ------------------------------------------------------------- Consulting Prep
  ["r56", "PrepLounge case library", "220+ practice cases from coaches and partner firms, with a partner-matching tool so you always have someone to practise with.", "Consulting Prep", "https://www.preplounge.com/en/management-consulting-cases", ["cases", "practice", "partners"], "", 18],
  ["r57", "McKinsey — official interview prep", "How the firm describes its own process, plus the Solve assessment and sample cases. Read this before any mock.", "Consulting Prep", "https://www.mckinsey.com/careers/interviewing", ["MBB", "interviews", "Solve"], "", 17],
  ["r58", "BCG — case interview preparation", "BCG's interactive case library and guided practice cases, including the chatbot case.", "Consulting Prep", "https://careers.bcg.com/global/en/case-interview-preparation", ["MBB", "interviews", "cases"], "", 16],
  ["r59", "Bain — case interview preparation", "Bain's practice cases with written walkthroughs, including the coffee shop and FashionCo. classics.", "Consulting Prep", "https://www.bain.com/careers/hiring-process/case-interview/", ["MBB", "interviews", "cases"], "", 15],
  ["r60", "Victor Cheng — Case Interview Secrets", "The classic structure resource. Skim the free videos, steal the issue-tree habit, and drop the rigid frameworks.", "Consulting Prep", "https://caseinterview.com/", ["cases", "frameworks", "structure"], "", 14],
  ["r61", "RocketBlocks — consulting drills", "Drill-based prep: market sizing, chart reading, mental maths. Fifteen minutes a day beats one panicked weekend.", "Consulting Prep", "https://www.rocketblocks.me/", ["drills", "market sizing", "practice"], "", 13],
  ["r62", "think-cell — video tutorials", "How consultants build waterfall, Marimekko and Gantt charts fast. Even without the licence, the chart grammar is worth learning.", "Consulting Prep", "https://www.think-cell.com/en/resources/videos", ["decks", "charts", "PowerPoint"], "", 12],

  // ---------------------------------------------------------------- Finance Prep
  ["r63", "Wall Street Prep — free resources", "Hundreds of short explainers on accounting, LBO mechanics, comps and precedent transactions. The de facto glossary for finance recruiting.", "Finance Prep", "https://www.wallstreetprep.com/free-resources/", ["IB", "modelling", "technicals"], "", 11],
  ["r64", "Mergers & Inquisitions", "Brutally honest guides to IB, PE and hedge fund recruiting: what the job is, what the interview asks, and what the exit actually looks like.", "Finance Prep", "https://mergersandinquisitions.com/", ["IB", "recruiting", "careers"], "", 10],
  ["r65", "Wall Street Oasis", "The forums, company reviews and interview question banks. Read it for the question archive, not the tone.", "Finance Prep", "https://www.wallstreetoasis.com/", ["IB", "interviews", "forums"], "", 9],

  // ----------------------------------------------------------- Product Management
  ["r66", "Lenny's Newsletter", "The default reading for product people: growth, PM career paths, and hiring loops at real companies.", "Product Management", "https://www.lennysnewsletter.com/", ["product", "growth", "careers"], "", 8],
  ["r67", "SVPG — Marty Cagan's articles", "Product discovery, empowered teams, and why feature factories fail. Read 'Product vs Feature Teams' first.", "Product Management", "https://www.svpg.com/articles/", ["product", "discovery", "teams"], "", 7],
  ["r68", "Exponent — PM interview course", "Product sense, execution, analytics and behavioural rounds, with recorded mocks from people who got the offer.", "Product Management", "https://www.tryexponent.com/courses/pm", ["interviews", "mocks", "product"], "", 6],
  ["r69", "Cracking the PM Interview — companion site", "Gayle McDowell and Jackie Bavaro's material: role definitions, estimation, and the answer structures that work.", "Product Management", "https://www.crackingthepminterview.com/", ["interviews", "product", "books"], "", 5],

  // -------------------------------------------------------- Careers & Networking
  ["r70", "Levels.fyi — compensation data", "Real, verified pay bands by company, level and city. Use it before you negotiate anything.", "Careers & Networking", "https://www.levels.fyi/", ["compensation", "negotiation"], "", 4],
  ["r71", "Ask a Manager", "Twenty years of workplace questions answered well. Unreasonably useful for internships and first-job politics.", "Careers & Networking", "https://www.askamanager.org/", ["workplace", "advice"], "", 3],

  // ------------------------------------------------------------------ Case Studies
  ["r72", "Harvard Business Publishing Education", "Where most of the cases we're assigned come from. Student pricing, and the free preview pages are often enough for context.", "Case Studies", "https://hbsp.harvard.edu/home/", ["HBS", "cases", "academics"], "", 5],
  ["r73", "The Case Centre", "The world's largest case collection — search by company or topic when you want extra practice on an industry you don't know.", "Case Studies", "https://www.thecasecentre.org/", ["cases", "research"], "", 4],
  ["r74", "Ivey Publishing", "The other major case publisher, with much stronger coverage of Indian and emerging-market companies than HBP.", "Case Studies", "https://www.iveypublishing.ca/s/", ["cases", "India", "emerging markets"], "", 3],

  // ------------------------------------------------------------------------ Books
  ["r75", "The Personal MBA — reading list", "Josh Kaufman's list of the business books actually worth the hours, ranked and summarised.", "Books", "https://personalmba.com/best-business-books/", ["reading list"], "", 3],
  ["r76", "Thinking, Fast and Slow", "Kahneman on judgement under uncertainty. Shows up in behavioural finance, marketing and negotiation alike.", "Books", "https://www.goodreads.com/book/show/11468377-thinking-fast-and-slow", ["behavioural", "decisions"], "", 2],
  ["r77", "The Goal — Goldratt", "A novel about a factory that teaches the theory of constraints better than any operations textbook. Read it before the operations core.", "Books", "https://www.goodreads.com/book/show/113934.The_Goal", ["operations", "constraints"], "", 2],
  ["r78", "Competitive Strategy — Porter", "The source text behind half the strategy syllabus. Skim the first four chapters and you'll follow every session.", "Books", "https://www.goodreads.com/book/show/40646.Competitive_Strategy", ["strategy", "Porter"], "", 2],
  ["r79", "Good Strategy Bad Strategy — Rumelt", "The best book on why most 'strategy' documents are goals with adjectives. Useful the week before any strategy submission.", "Books", "https://www.goodreads.com/book/show/11721966-good-strategy-bad-strategy", ["strategy", "diagnosis"], "", 1],
  ["r80", "A Random Walk Down Wall Street", "Malkiel on markets, indexing and why most active management underperforms. The counterweight to a term of stock pitches.", "Books", "https://www.goodreads.com/book/show/900892.A_Random_Walk_Down_Wall_Street", ["investing", "markets"], "", 1],
  ["r81", "Zero to One — Thiel", "Contrarian, arguable and short. Useful as a foil in any entrepreneurship discussion.", "Books", "https://www.goodreads.com/book/show/18050143-zero-to-one", ["startups", "strategy"], "", 1],
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
