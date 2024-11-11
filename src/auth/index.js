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
  basePath: "/auth",
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ account, user }) {
      // 신규 가입자 체크
      if (account && user) {
        user.isNew = true;
      }
      return true;
    },
    async jwt({ token, account, user, profile, session, trigger }) {
      if (user) {
        Object.assign(token, user);
      }

      if (trigger === "update" && session) {
        Object.assign(token, session.user);
        token.isNew = session.user?.isNew;
      }
      return token;
    },
    async session({ session, token, newSession, user, trigger }) {
      if (token?.accessToken) session.accessToken = token.accessToken;
      session.user.isNew = token.isNew;
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});
