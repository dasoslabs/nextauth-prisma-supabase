"use server";

import { signIn, signOut } from "@/auth";
import { oauthProvider } from "@/constants";
import { prisma } from "@/prisma";

export const signInWithProvider = async (formData) => {
  const provider = formData.get("provider") ?? oauthProvider.google;

  await signIn(provider, { redirectTo: "/protected" });
};

export const signOutWithForm = async () => {
  await signOut({ redirectTo: "/" });
};

export const executePrisma = async () => await prisma.user.findMany();
