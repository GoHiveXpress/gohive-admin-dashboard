import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_ROUTES = new Set(["/login", "/login-verify"]);
const SESSION_COOKIE_NAMES = [
	"next-auth.session-token",
	"__Secure-next-auth.session-token",
	"authjs.session-token",
	"__Secure-authjs.session-token",
];

function isAuthRoute(pathname: string): boolean {
	return AUTH_ROUTES.has(pathname);
}

function hasSessionCookie(req: NextRequest): boolean {
	return SESSION_COOKIE_NAMES.some((name) => !!req.cookies.get(name)?.value);
}

export async function middleware(req: NextRequest) {
	const { pathname, search } = req.nextUrl;
	const sessionCookieExists = hasSessionCookie(req);

	if (pathname === "/") {
		return NextResponse.redirect(
			new URL(sessionCookieExists ? "/dashboard" : "/login", req.url),
		);
	}

	if (!sessionCookieExists && !isAuthRoute(pathname)) {
		const loginUrl = new URL("/login", req.url);
		loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
		return NextResponse.redirect(loginUrl);
	}

	const token = sessionCookieExists
		? await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
		: null;

	if (sessionCookieExists && !token && !isAuthRoute(pathname)) {
		const loginUrl = new URL("/login", req.url);
		loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
		return NextResponse.redirect(loginUrl);
	}

	if (isAuthRoute(pathname)) {
		if (sessionCookieExists && token) {
			return NextResponse.redirect(new URL("/dashboard", req.url));
		}
		return NextResponse.next();
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets|fonts|.*\\..*).*)"],
};
