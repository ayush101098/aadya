import Link from "next/link";
import { Avatar } from "./Avatar";
import { TagList } from "./Tag";
import { deadlineLabel, relativeTime } from "@/lib/format";
import { personFunctions, personIndustries } from "@/lib/data/filters";
import type { HelpRequest, Opportunity, Person, Resource } from "@/lib/types";

export function PersonCard({ person }: { person: Person }) {
  const industries = personIndustries(person);
  const functions = personFunctions(person);
  const company = person.experience[0]?.company;

  return (
    <Link href={`/people/${person.id}`} className="card card-hover group relative block overflow-hidden p-4">
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-amber-300 to-accent-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="flex items-start gap-3">
        <Avatar name={person.name} photo={person.photo} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="truncate text-sm font-semibold text-ink-950 transition-colors group-hover:text-accent-700">
              {person.name}
            </h3>
            <span className="shrink-0 text-[11px] text-ink-400">{person.location}</span>
          </div>
          <p className="truncate text-xs text-ink-600">
            {person.currentRole}
            {company ? ` · ${company}` : ""}
          </p>

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            {person.group && <span className="tag-amber">{person.group}</span>}
            <TagList items={[...industries, ...functions]} max={4} />
          </div>

          {person.skills.length > 0 && (
            <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-ink-500">
              <span className="font-semibold text-ink-700">Can help with:</span>{" "}
              {person.skills.join(" · ")}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export function ResourceCard({
  resource,
  uploader,
}: {
  resource: Resource;
  uploader?: Person;
}) {
  return (
    <article className="card card-hover group flex flex-col p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold leading-snug text-ink-950">
          <a href={resource.url} target="_blank" rel="noreferrer" className="hover:text-accent-700">
            {resource.title}
          </a>
        </h3>
        <span className="tag-accent shrink-0">{resource.category}</span>
      </div>
      <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-ink-600">
        {resource.description}
      </p>
      {resource.tags.length > 0 && (
        <div className="mt-3">
          <TagList items={resource.tags} hrefFor={(t) => `/search?q=${encodeURIComponent(t)}`} max={4} />
        </div>
      )}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-ink-100 pt-3 text-xs text-ink-400">
        <span className="truncate">
          {uploader ? (
            <Link href={`/people/${uploader.id}`} className="hover:text-ink-800">
              {uploader.name}
            </Link>
          ) : (
            "Cohort member"
          )}{" "}
          · {relativeTime(resource.createdAt)}
        </span>
        <a
          href={resource.url}
          target="_blank"
          rel="noreferrer"
          className="link-arrow shrink-0"
        >
          Open <span aria-hidden>→</span>
        </a>
      </div>
    </article>
  );
}

export function OpportunityCard({
  opportunity,
  poster,
}: {
  opportunity: Opportunity;
  poster?: Person;
}) {
  const deadline = deadlineLabel(opportunity.deadline);
  return (
    <article className="card card-hover group flex flex-col p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold leading-snug text-ink-950">{opportunity.title}</h3>
          <p className="text-xs text-ink-500">
            {[opportunity.company, opportunity.location].filter(Boolean).join(" · ")}
          </p>
        </div>
        <span className="tag-accent shrink-0">{opportunity.type}</span>
      </div>

      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-600">
        {opportunity.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {[opportunity.industry, opportunity.role].filter(Boolean).map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
        <span className={deadline.urgent ? "tag-amber" : "tag"} title={opportunity.deadline ?? undefined}>
          {deadline.text}
        </span>
        {opportunity.status === "closed" && (
          <span className="tag border-ink-300 bg-ink-100 text-ink-600">Closed</span>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-ink-100 pt-3 text-xs text-ink-400">
        <span className="truncate">
          Posted by{" "}
          {poster ? (
            <Link href={`/people/${poster.id}`} className="hover:text-ink-800">
              {poster.name}
            </Link>
          ) : (
            "a cohort member"
          )}{" "}
          · {relativeTime(opportunity.createdAt)}
        </span>
        <a href={opportunity.url} target="_blank" rel="noreferrer" className="link-arrow shrink-0">
          View <span aria-hidden>→</span>
        </a>
      </div>
    </article>
  );
}

export function HelpRequestCard({
  request,
  poster,
  actions,
}: {
  request: HelpRequest;
  poster?: Person;
  actions?: React.ReactNode;
}) {
  const resolved = request.status === "resolved";
  return (
    <article className="card card-hover group flex flex-col p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold leading-snug text-ink-950">{request.title}</h3>
        <span
          className={
            resolved
              ? "tag shrink-0 border-emerald-200 bg-emerald-50 text-emerald-700"
              : "tag-amber shrink-0"
          }
        >
          {resolved ? "Resolved" : "Open"}
        </span>
      </div>
      <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-ink-600">
        {request.description}
      </p>
      {request.tags.length > 0 && (
        <div className="mt-3">
          <TagList items={request.tags} hrefFor={(t) => `/search?q=${encodeURIComponent(t)}`} />
        </div>
      )}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-ink-100 pt-3 text-xs text-ink-400">
        <span>
          {poster ? (
            <Link href={`/people/${poster.id}`} className="hover:text-ink-800">
              {poster.name}
            </Link>
          ) : (
            "Cohort member"
          )}{" "}
          · {relativeTime(request.createdAt)}
        </span>
        <div className="flex items-center gap-3">
          {actions}
          {poster && (
            <Link href={`/people/${poster.id}`} className="link-arrow">
              Respond <span aria-hidden>→</span>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
