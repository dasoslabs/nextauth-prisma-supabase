import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { match } from "path-to-regexp";

const matchersForAuth = ["/protected", "/onboarding"];
const matchersForSignIn = ["/"];

export default auth(async function middleware(request) {
  const session = await auth();

  // 인증이 필요한 페이지 접근 제어
  if (isMatch(request.nextUrl.pathname, matchersForAuth)) {
    // 신규 가입자는 온보딩 페이지로 이동
    if (session?.user?.isNew) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    return session
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/", request.url));
  }
  // 인증 후 로그인 페이지 접근 제어
  if (isMatch(request.nextUrl.pathname, matchersForSignIn)) {
    return session
      ? NextResponse.redirect(new URL("/protected", request.url))
      : NextResponse.next();
  }
  return NextResponse.next();
});

function isMatch(pathname, urls) {
  return urls.some((url) => !!match(url)(pathname));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
