import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SESSION_COOKIE, accessMode, readSessionValue } from "@/lib/session";

const OPEN_PATHS = ["/login", "/auth", "/pending"];

function isOpen(path: string) {
  return OPEN_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
}

export async function middleware(request: NextRequest) {
  if (isSupabaseConfigured) return updateSession(request);

  const mode = accessMode();
  // Open mode: the whole site is readable without a session. Server actions still
  // check for a signed-in member before they write anything.
  if (mode === "open") return NextResponse.next();

  const path = request.nextUrl.pathname;
  // The landing page is public only once the site is open to the whole cohort.
  const publicPath = isOpen(path) || (path === "/" && mode === "cohort");
  if (publicPath) return NextResponse.next();

  const email = await readSessionValue(request.cookies.get(SESSION_COOKIE)?.value);
  if (email) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = path === "/" ? "" : `?next=${encodeURIComponent(path)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
