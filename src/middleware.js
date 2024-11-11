import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { match } from "path-to-regexp";

const matchersForAuth = ["/protected", "/onboarding"];
const matchersForSignIn = ["/"];

export default auth(async function middleware(request) {
  const session = await auth();

  // 인증이 필요한 페이지 접근 제어
  if (isMatch(request.nextUrl.pathname, matchersForAuth)) {
    return session // 세션 정보 확인
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
