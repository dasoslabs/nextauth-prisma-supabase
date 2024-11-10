"use server";

import { signIn } from "@/auth";
import { oauthProvider } from "@/constants";

export const signInWithProvider = async (provider = oauthProvider.google) => {
  await signIn(provider);
};

export const signOutWithForm = async () => {
  await signOut();
};
