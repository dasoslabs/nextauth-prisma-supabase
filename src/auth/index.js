import NextAuth from "next-auth";
import "next-auth/jwt";

import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import Naver from "next-auth/providers/naver";

export const { handlers, signIn, signOut, auth } = NextAuth({
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
    async jwt({ token, account, user, profile, session, trigger }) {
      if (trigger === "update") token.name = session.user.name;
      return token;
    },
    async session({ session, token, newSession, user, trigger }) {
      if (token?.accessToken) session.accessToken = token.accessToken;

      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});
