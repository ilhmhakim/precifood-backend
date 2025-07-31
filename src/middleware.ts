import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isTokenExpired(token: string): boolean {
  try {
    const payload = token.split(".")[1];
    const decodedPayload = atob(payload);
    const parsedPayload = JSON.parse(decodedPayload);

    return parsedPayload.exp < Date.now() / 1000;
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return true;
  }
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;

  if (!token || isTokenExpired(token)) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!login|register|_next|images).*)",
};
