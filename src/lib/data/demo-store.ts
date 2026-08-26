import type { HelpRequest, Opportunity, Person, Resource } from "@/lib/types";
import {
  SEED_HELP_REQUESTS,
  SEED_OPPORTUNITIES,
  SEED_PEOPLE,
  SEED_RESOURCES,
} from "./seed";

type Store = {
  people: Person[];
  resources: Resource[];
  opportunities: Opportunity[];
  helpRequests: HelpRequest[];
};

// Kept on globalThis so edits survive Next.js hot reloads during development.
const globalRef = globalThis as unknown as { __cohortFirstStore?: Store };

export function demoStore(): Store {
  if (!globalRef.__cohortFirstStore) {
    globalRef.__cohortFirstStore = {
      people: structuredClone(SEED_PEOPLE),
      resources: structuredClone(SEED_RESOURCES),
      opportunities: structuredClone(SEED_OPPORTUNITIES),
      helpRequests: structuredClone(SEED_HELP_REQUESTS),
    };
  }
  return globalRef.__cohortFirstStore;
}

export function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
