"use server";

import { signIn, signOut } from "@/auth";
import { oauthProvider } from "@/constants";

export const signInWithProvider = async (formData) => {
  const provider = formData.get("provider") ?? oauthProvider.google;
  await signIn(provider);
};

export const signOutWithForm = async () => {
  await signOut();
};
