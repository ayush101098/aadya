import Link from "next/link";
import { requireUser } from "@/lib/auth";
import {
  loadHelpRequests,
  loadOpportunities,
  loadPeople,
  loadResources,
} from "@/lib/data";
import { byNewest } from "@/lib/data/filters";
import { SearchBar } from "@/components/SearchBar";
import { HelpRequestCard, OpportunityCard, ResourceCard } from "@/components/cards";
import { Avatar } from "@/components/Avatar";
import { deadlineLabel } from "@/lib/format";

const QUICK_ACTIONS = [
  {
    href: "/people",
    title: "Find someone",
    hint: "By industry, skill or interest",
    icon: "◉",
    tone: "from-accent-50 to-white border-accent-200/70",
  },
  {
    href: "/opportunities?new=1",
    title: "Post an opportunity",
    hint: "Jobs, referrals, projects",
    icon: "▲",
    tone: "from-emerald-50 to-white border-emerald-200/70",
  },
  {
    href: "/resources?new=1",
    title: "Share a resource",
    hint: "Notes, guides, templates",
    icon: "▤",
    tone: "from-amber-50 to-white border-amber-200/70",
  },
  {
    href: "/ask?new=1",
    title: "Ask for help",
    hint: "Put it to the cohort",
    icon: "✳",
    tone: "from-ink-100 to-white border-ink-200",
  },
];

const SUGGESTED = ["Consulting", "Product", "Startups", "Energy", "Finance", "F1"];

export default async function HomePage() {
  const user = await requireUser();
  const [people, resources, opportunities, helpRequests] = await Promise.all([
    loadPeople(),
    loadResources(),
    loadOpportunities(),
    loadHelpRequests(),
  ]);

  const latestResources = [...resources].sort(byNewest).slice(0, 4);
  const latestOpportunities = [...opportunities].sort(byNewest).slice(0, 3);
  const openAsks = helpRequests.filter((h) => h.status === "open").sort(byNewest).slice(0, 3);
  const byId = new Map(people.map((p) => [p.id, p]));

  const upcoming = opportunities
    .filter((o) => o.deadline && new Date(o.deadline).getTime() >= Date.now())
    .sort((a, b) => (a.deadline ?? "").localeCompare(b.deadline ?? ""))
    .slice(0, 5);

  const newestMembers = [...people].sort(byNewest).slice(0, 8);
  const profileGaps = [
    user.skills.length === 0 && "what you can help with",
    user.experience.length === 0 && "your experience",
    user.lookingFor.length === 0 && "what you're looking for",
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-10">
      {/* ------------------------------------------------------------ hero */}
      <section className="panel relative overflow-hidden p-6 sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-amber-200/30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 left-1/3 h-56 w-56 rounded-full bg-accent-200/25 blur-3xl"
        />
        <div className="relative">
          <p className="text-[11px] uppercase tracking-[.18em] text-ink-400">
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
          <h1 className="mt-1 font-display text-3xl tracking-tight text-ink-950 sm:text-4xl">
            Welcome back, <span className="text-gradient-ink">{user.name.split(" ")[0]}</span>.
          </h1>
          <p className="mt-2 max-w-xl text-sm text-ink-600">
            Ask the cohort anything — someone here has already done it.
          </p>

          <div className="mt-5 max-w-2xl">
            <SearchBar size="lg" />
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs text-ink-400">
              <span className="mr-1">Try</span>
              {SUGGESTED.map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="tag hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`group rounded-xl border bg-gradient-to-b ${action.tone} px-4 py-3 transition duration-300 hover:-translate-y-1 hover:shadow-lift`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/80 text-sm text-ink-700 shadow-soft transition-transform duration-300 group-hover:scale-110">
                    {action.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink-950">{action.title}</p>
                    <p className="truncate text-xs text-ink-500">{action.hint}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- stats */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Cohort members", value: people.length, href: "/people" },
          { label: "Resources", value: resources.length, href: "/resources" },
          { label: "Opportunities", value: opportunities.length, href: "/opportunities" },
          {
            label: "Open requests",
            value: helpRequests.filter((h) => h.status === "open").length,
            href: "/ask",
          },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href} className="card card-hover px-4 py-4">
            <p className="font-display text-3xl text-ink-950">{stat.value}</p>
            <p className="mt-0.5 text-[11px] uppercase tracking-[.14em] text-ink-500">
              {stat.label}
            </p>
          </Link>
        ))}
      </section>

      {profileGaps.length > 0 && (
        <section className="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white p-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-lg" aria-hidden>
              ✨
            </span>
            <p className="text-sm text-ink-700">
              Your profile is missing <span className="font-semibold">{profileGaps.join(", ")}</span>{" "}
              — that's exactly what people search for.
            </p>
            <Link href="/profile" className="btn-amber ml-auto py-1.5 text-xs">
              Complete profile
            </Link>
          </div>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="space-y-3">
            <div className="flex items-baseline justify-between">
              <h2 className="section-title">Latest opportunities</h2>
              <Link href="/opportunities" className="link-arrow">
                View all <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="space-y-3">
              {latestOpportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  poster={byId.get(opportunity.postedBy)}
                />
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-baseline justify-between">
              <h2 className="section-title">Latest resources</h2>
              <Link href="/resources" className="link-arrow">
                View all <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {latestResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  uploader={byId.get(resource.uploadedBy)}
                />
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-baseline justify-between">
              <h2 className="section-title">Ask the cohort</h2>
              <Link href="/ask" className="link-arrow">
                View all <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="space-y-3">
              {openAsks.map((request) => (
                <HelpRequestCard
                  key={request.id}
                  request={request}
                  poster={byId.get(request.postedBy)}
                />
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="card p-4">
            <h2 className="section-title">Closing soon</h2>
            <ul className="mt-3 space-y-3">
              {upcoming.length === 0 && (
                <li className="text-sm text-ink-500">Nothing with a deadline right now.</li>
              )}
              {upcoming.map((item) => {
                const deadline = deadlineLabel(item.deadline);
                return (
                  <li key={item.id} className="group flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href="/opportunities"
                        className="block truncate text-sm font-medium text-ink-900 group-hover:text-accent-700"
                      >
                        {item.title}
                      </Link>
                      <p className="truncate text-xs text-ink-500">{item.company}</p>
                    </div>
                    <span className={deadline.urgent ? "tag-amber shrink-0" : "tag shrink-0"}>
                      {deadline.text}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="card p-4">
            <div className="flex items-baseline justify-between">
              <h2 className="section-title">People</h2>
              <Link href="/people" className="link-arrow">
                Directory <span aria-hidden>→</span>
              </Link>
            </div>
            <ul className="mt-3 space-y-1">
              {newestMembers.map((person) => (
                <li key={person.id}>
                  <Link
                    href={`/people/${person.id}`}
                    className="flex items-center gap-2.5 rounded-lg p-1.5 transition-colors hover:bg-ink-50"
                  >
                    <Avatar name={person.name} photo={person.photo} size="sm" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-ink-900">
                        {person.name}
                      </span>
                      <span className="block truncate text-xs text-ink-500">
                        {person.currentRole}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

        </aside>
      </div>
    </div>
  );
}
