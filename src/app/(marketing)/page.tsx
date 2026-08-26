import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import {
  loadHelpRequests,
  loadOpportunities,
  loadPeople,
  loadResources,
} from "@/lib/data";
import { LandingNav } from "@/components/landing/LandingNav";
import { QueryDemo } from "@/components/landing/QueryDemo";
import { Reveal } from "@/components/landing/Reveal";
import { Counter } from "@/components/landing/Counter";
import { Marquee } from "@/components/landing/Marquee";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { RESOURCE_CATEGORIES } from "@/lib/taxonomy";

const QUERIES = [
  "Who has worked in FMCG?",
  "Who can review my consulting CV?",
  "Best LBO modelling course?",
  "Anyone at Google?",
  "Who knows about M&A?",
  "Looking for a case comp teammate",
  "Who is interested in AI?",
  "Term 3 corporate finance notes",
  "Who has raised a seed round?",
  "Product management interview prep",
];

const STEPS = [
  {
    n: "01",
    title: "Search",
    body: "One box across people, resources, opportunities and open requests. Type a skill, a company, an industry — or just a question.",
  },
  {
    n: "02",
    title: "Discover",
    body: "See who has actually done it: their background, their tags, and the exact thing they said they can help with.",
  },
  {
    n: "03",
    title: "Connect",
    body: "One tap reveals how they prefer to be reached. No internal inbox, no waiting, no cold LinkedIn roulette.",
  },
];

export default async function LandingPage() {
  const [user, people, resources, opportunities, helpRequests] = await Promise.all([
    getCurrentUser(),
    loadPeople(),
    loadResources(),
    loadOpportunities(),
    loadHelpRequests(),
  ]);

  const ctaHref = user ? "/home" : "/login";
  const ctaLabel = user ? "Enter the platform" : "Sign in";

  const categoryCounts = RESOURCE_CATEGORIES.map((category) => ({
    category,
    count: resources.filter((r) => r.category === category).length,
  }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);

  const skills = Array.from(new Set(people.flatMap((p) => p.skills))).slice(0, 14);

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950 text-ink-100">
      {/* ------------------------------------------------------- background */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(65%_50%_at_50%_-5%,rgba(255,180,32,.20),transparent_65%),radial-gradient(45%_45%_at_88%_18%,rgba(79,99,245,.22),transparent_70%),radial-gradient(50%_45%_at_8%_75%,rgba(255,203,74,.10),transparent_70%)]" />
        <div className="absolute inset-0 grid-lines opacity-[.35] mask-fade-b" />
        <div className="absolute inset-0 grain opacity-40" />
        <div className="absolute left-[12%] top-[22%] h-72 w-72 animate-drift rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute right-[8%] top-[48%] h-80 w-80 animate-float rounded-full bg-accent-500/10 blur-3xl" />
      </div>

      <LandingNav ctaHref={ctaHref} ctaLabel={ctaLabel} />

      {/* ------------------------------------------------------------ hero */}
      <section className="relative mx-auto max-w-6xl px-4 pb-16 pt-32 sm:pt-40">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <div className="inline-flex animate-fade-in items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] tracking-wide text-ink-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-amber-300" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-300" />
              </span>
              Private · invite-only · {people.length} members
            </div>

            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.03] tracking-tight text-ink-50 sm:text-6xl lg:text-7xl">
              Beer{" "}
              <span className="text-gradient-amber animate-shimmer bg-[length:200%_auto]">&amp;</span>{" "}
              Chill
            </h1>

            <p className="mt-3 font-display text-xl italic text-amber-200/90 sm:text-2xl">
              the cohort network that actually answers back.
            </p>

            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink-300">
              Everything your batch knows — the internships, the models, the case packs, the
              person who has already done the exact thing you're stuck on — is scattered across
              five WhatsApp groups and someone's Drive. This puts it in one search box.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href={ctaHref} className="btn-amber px-5 py-2.5 text-[15px]">
                {ctaLabel} <span aria-hidden>→</span>
              </Link>
              <a
                href="#how"
                className="btn border border-white/12 bg-white/[0.04] px-5 py-2.5 text-[15px] text-ink-100 hover:-translate-y-0.5 hover:bg-white/[0.08]"
              >
                See how it works
              </a>
            </div>

            <div className="mt-9 max-w-xl">
              <p className="text-[11px] uppercase tracking-[.18em] text-ink-500">
                Asked here this week
              </p>
              <Marquee items={QUERIES} />
            </div>
          </div>

          <div className="animate-fade-up lg:pl-4">
            <QueryDemo />
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- stats */}
      <section className="relative mx-auto max-w-6xl px-4 py-10">
        <Reveal>
          <div className="glass grid grid-cols-2 divide-x divide-white/[0.06] p-1 sm:grid-cols-4">
            {[
              { value: people.length, label: "Cohort members", suffix: "" },
              { value: resources.length, label: "Resources", suffix: "" },
              { value: opportunities.length, label: "Live opportunities", suffix: "" },
              {
                value: helpRequests.filter((h) => h.status === "open").length,
                label: "Open requests",
                suffix: "",
              },
            ].map((stat) => (
              <div key={stat.label} className="px-5 py-6 text-center">
                <p className="font-display text-3xl text-ink-50 sm:text-4xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[.16em] text-ink-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ------------------------------------------------------- how it works */}
      <section id="how" className="relative mx-auto max-w-6xl scroll-mt-24 px-4 py-20">
        <Reveal>
          <p className="section-title text-amber-300/80">The whole product</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl leading-tight text-ink-50">
            Search <span className="text-ink-500">→</span> Discover{" "}
            <span className="text-ink-500">→</span> Connect
          </h2>
          <p className="mt-3 max-w-xl text-sm text-ink-400">
            Under 30 seconds from question to a name and a way to reach them. That's the bar
            everything here is built against.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 120}>
              <div className="glass glass-hover group h-full p-6">
                <span className="font-display text-5xl text-white/[0.08] transition-colors duration-500 group-hover:text-amber-300/30">
                  {step.n}
                </span>
                <h3 className="mt-2 font-display text-xl text-ink-50">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-400">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- inside */}
      <section id="inside" className="relative mx-auto max-w-6xl scroll-mt-24 px-4 py-20">
        <Reveal>
          <p className="section-title text-amber-300/80">Inside</p>
          <h2 className="mt-3 font-display text-4xl text-ink-50">Five rooms, one door.</h2>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            {
              icon: "👥",
              eyebrow: "People",
              title: "The directory that knows who did what",
              body: "Every profile carries industries, functions, skills, interests and what they're looking for.",
              points: [
                "Filter by industry, function, skill, interest, location",
                "\"What I can help with\" is a first-class field",
                "Connect reveals their preferred contact method",
              ],
              href: "/people",
            },
            {
              icon: "📚",
              eyebrow: "Resources",
              title: "A library built for MBA terms",
              body: "Course notes, modelling templates, case packs, and the courses actually worth finishing.",
              points: [
                `${resources.length} resources across ${categoryCounts.length} categories`,
                "Every entry tagged, searchable and credited",
                "Anyone can add in fifteen seconds",
              ],
              href: "/resources",
            },
            {
              icon: "🚀",
              eyebrow: "Opportunities",
              title: "Referrals before they hit the portal",
              body: "Jobs, internships, projects, competitions and the referral someone in your batch can make today.",
              points: [
                "Deadline-aware — closing soon surfaces first",
                "Filter by type, industry and location",
                "Not a replacement for placement services",
              ],
              href: "/opportunities",
            },
            {
              icon: "🙋",
              eyebrow: "Ask the Cohort",
              title: "Put the question to 55 people at once",
              body: "The lightweight ask board: post what you need, mark it resolved when someone shows up.",
              points: [
                "Tagged so the right person finds it",
                "Open / resolved status, nothing heavier",
                "Respond straight to the person",
              ],
              href: "/ask",
            },
          ].map((feature, i) => (
            <Reveal key={feature.eyebrow} delay={i * 90}>
              <FeatureCard {...feature} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- library */}
      <section id="library" className="relative mx-auto max-w-6xl scroll-mt-24 px-4 py-20">
        <Reveal>
          <p className="section-title text-amber-300/80">The library</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl leading-tight text-ink-50">
            Tailored to the courses you're actually taking.
          </h2>
          <p className="mt-3 max-w-xl text-sm text-ink-400">
            Corporate finance, marketing management, operations, strategy, analytics — plus the
            recruiting stack: cases, modelling, product, and the interview banks.
          </p>
        </Reveal>

        <div className="mt-10 flex flex-wrap gap-2.5">
          {categoryCounts.map((item, i) => (
            <Reveal key={item.category} delay={i * 40} as="span">
              <Link
                href={`/resources?category=${encodeURIComponent(item.category)}`}
                className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-ink-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-300/40 hover:bg-amber-300/10 hover:text-white"
              >
                {item.category}
                <span className="rounded-full bg-white/10 px-1.5 text-[11px] text-ink-300 group-hover:bg-amber-300/20 group-hover:text-amber-100">
                  {item.count}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-10 glass p-6">
            <p className="text-[11px] uppercase tracking-[.16em] text-ink-500">
              What the cohort can help with right now
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-ink-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ------------------------------------------------------------- CTA */}
      <section className="relative mx-auto max-w-6xl px-4 py-24">
        <Reveal>
          <div className="glass relative overflow-hidden px-6 py-14 text-center sm:px-16">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-56 w-[70%] rounded-full bg-amber-400/15 blur-3xl"
            />
            <div className="relative">
              <p className="font-display text-3xl leading-snug text-ink-50 sm:text-4xl">
                More profiles → better discovery.
                <br className="hidden sm:block" /> More connections →{" "}
                <span className="text-gradient-amber">a cohort that compounds.</span>
              </p>
              <p className="mx-auto mt-4 max-w-lg text-sm text-ink-400">
                Beer &amp; Chill is private to our batch. Sign in with your cohort email — an
                admin adds you once and you're in for good.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href={ctaHref} className="btn-amber px-6 py-3 text-[15px]">
                  {ctaLabel} <span aria-hidden>→</span>
                </Link>
                <Link
                  href="/people"
                  className="btn border border-white/12 bg-white/[0.04] px-6 py-3 text-[15px] text-ink-100 hover:-translate-y-0.5 hover:bg-white/[0.08]"
                >
                  Peek at the directory
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="relative border-t border-white/[0.07]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-8 text-xs text-ink-500">
          <span className="font-display text-sm text-ink-300">
            Beer <span className="text-amber-300">&amp;</span> Chill
          </span>
          <span className="hidden sm:inline">·</span>
          <span>Built by the cohort, for the cohort.</span>
          <Link href={ctaHref} className="ml-auto text-ink-300 hover:text-white">
            {ctaLabel} →
          </Link>
        </div>
      </footer>
    </div>
  );
}
