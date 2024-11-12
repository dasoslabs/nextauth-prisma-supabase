import { prisma } from "@/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
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
  adapter: PrismaAdapter(prisma),
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
      if (user) {
        Object.assign(token, user);
        token.id = user.id;
      }

      if (trigger === "update" && session) {
        Object.assign(token, session.user);
      }
      return token;
    },
    async session({ session, token, newSession, user, trigger }) {
      if (token?.accessToken) session.accessToken = token.accessToken;
      if (token?.id) {
        session.user.id = token.id;
      }

      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  events: {
    async signIn({ isNewUser }) {
      return true;
    },
  },
  secret: !!process.env.AUTH_SECRET,
});
