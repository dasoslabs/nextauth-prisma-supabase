Next auth로 OAuth를 처리하고, prisma orm을 supabase에 얹어서 사용하는 예시입니다.

supabase에서 네이버 로그인을 지원하지 않아 supabase auth 사용을 포기하고 next-auth를 선택했습니다.

# next-auth v5

## 설치

```
npm install next-auth@beta

// 시크릿 키 생성
npx auth secret
```

## 기본 세팅

`src/auth/index.js`

```jsx
import NextAuth from "next-auth";
import "next-auth/jwt";

import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import Naver from "next-auth/providers/naver";

export const {
  handlers,
  signIn,
  signOut,
  auth,
  unstable_update: update, // beta
} = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
        },
      },
    }),
    Naver,
    Kakao,
  ],
  basePath: "/auth", // 기본값: api/auth | basePath를 지정해 경로 변경 가능
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ account, user }) {
      if (error) {
        return `/error?message=${encodeURIComponent("<ERROR_MESSAGE>")}`;
      }
      return true;
    },
    async jwt({ token, account, user, profile, session, trigger }) {
      if (user) {
        Object.assign(token, user);
      }

      if (trigger === "update" && session) {
        Object.assign(token, session.user);
      }
      return token;
    },
    async session({ session, token, newSession, user, trigger }) {
      if (token?.accessToken) session.accessToken = token.accessToken;
      return session;
    },
    async authorized() {}, // middleware 사용시 실행 안됨
    async redirec() {}, // signIn의 redirectTo 옵션이 있을 경우 실행 안됨
    async signOut() {},
  },
  pages: {
    signIn: "/",
  },
  secret: !!process.env.AUTH_SECRET,
});
```

`src/app/auth/[...nextauth]/route.js`

```jsx
import { handlers } from "@/auth";
export const { GET, POST } = handlers;
```

`src/app/middleware.js`

```jsx
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { match } from "path-to-regexp";

const matchersForAuth = ["/protected", "/onboarding"];
const matchersForSignIn = ["/"];

export default auth(async function middleware(request) {
  const session = await auth();

  // 인증이 필요한 페이지 접근 제어
  if (isMatch(request.nextUrl.pathname, matchersForAuth)) {
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
```

`src/server/index.js` : 사용 예시

```jsx
"use server";

import { signIn, signOut } from "@/auth";
import { oauthProvider } from "@/constants";

export const signInWithProvider = async (formData) => {
  const provider = formData.get("provider") ?? oauthProvider.google;

  await signIn(provider, { redirectTo: "/protected" });
};

export const signOutWithForm = async () => {
  await signOut({ redirectTo: "/" });
};
```

## 콜백 호출 순서

- 사용자가 로그인(회원가입) => `signIn` => (`redirect`) => `jwt` => `session`
- 세션 업데이트 => `jwt` => `session`
- 세션 확인 => `session`

## OAuth 콜백 경로

기본 경로는 /api/auth/callback/{provider} 이지만, basePath를 /auth로 줬으므로 아래와 같이 콜백을 지정해야 한다.

```
/auth/callback/{provider}

google: /auth/callback/google
naver : /auth/callback/naver
kakao : /auth/callback/kakao
```

## 환경변수

```
# 이 형태로 관리하면 자동으로 환경변수가 주입
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""

AUTH_NAVER_ID=""
AUTH_NAVER_SECRET=""

AUTH_KAKAO_ID=""
AUTH_KAKAO_SECRET=""

# 배포시 반드시 지정해줘야하는 경로
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

## 참고자료

[Auth.js | Installation](https://authjs.dev/getting-started/installation)

[Auth.js(NextAuth.js) 핵심 정리](https://www.heropy.dev/p/MI1Khc)

[[Next.js14] NextAuth v5로 인증 구현하기 (1) - 로그인/로그아웃](https://velog.io/@youngjun625/Next.js14-NextAuth-v5%EB%A1%9C-%EC%9D%B8%EC%A6%9D-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-1-%EB%A1%9C%EA%B7%B8%EC%9D%B8%EB%A1%9C%EA%B7%B8%EC%95%84%EC%9B%83)

# prisma + supabase

## 설치

```
npm i -D prisma
npm i @prisma/client @auth/prisma-adapter

# 초기화: prisma파일과 .env 파일 생성
npx prisma init
```

## 스키마 수정

`prisma/schema.prisma`

```sql
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Account {
  id                 String  @id @default(cuid())
  userId             String  @map("user_id")
  type               String
  provider           String
  providerAccountId  String  @map("provider_account_id")
  refresh_token      String? @db.Text
  access_token       String? @db.Text
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String? @db.Text
  session_state      String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique @map("session_token")
  userId       String   @map("user_id")
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime? @map("email_verified")
  image         String?
  accounts      Account[]
  sessions      Session[]

  @@map("users")
}

model VerificationToken {
  identifier String
  token      String
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}
```

## 환경변수

```
DATABASE_URL="postgresql://postgres.qqvcwodnxifrydddznsu:[YOUR-PASSWORD]@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.qqvcwodnxifrydddznsu:[YOUR-PASSWORD]@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres"
```

## 스키마 마이그레이션

```
npm exec prisma migrate dev
```

- `prisma/migrations` 폴더에 새 마이그레이션 파일을 생성하고, 데이터베이스에 스키마를 적용
- 스키마에 변경이 생길때마다 마이그레이션 진행해야 함

prisma client 수동 생성

```
npm exec prisma generate
```

## 참고

[Auth.js | Prisma](https://authjs.dev/getting-started/adapters/prisma)

[Supabase Database, Prisma로 빠르게 시작하기 w. Next.js](https://www.heropy.dev/p/bCffI2)

[[NextJS] Next-auth(v5)(AuthJS) + Prisma + Supabase 를 이용한 소셜 로그인](https://velog.io/@blcklamb/NextJS-Next-authv5AuthJS-Prisma-Supabase-%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-%EC%86%8C%EC%85%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8#4-%EC%86%8C%EC%85%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8-prismaclient-%EC%84%A4%EC%A0%95)

# prisma + next-auth

## 어뎁터 설치

```
@auth/prisma-adapter
```

## prisma 어뎁터 사용

`src/auth/index.js`

```jsx
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
	...기존 옵션
})
```

# 환경 변수

```
AUTH_SECRET=

AUTH_NAVER_ID=
AUTH_NAVER_SECRET=

AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

AUTH_KAKAO_ID=
AUTH_KAKAO_SECRET=

DATABASE_URL=
DIRECT_URL=

NEXTAUTH_URL=
NEXT_PUBLIC_API_URL=
```
