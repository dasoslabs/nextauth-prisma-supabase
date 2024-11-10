"use server";

import { signIn, signOut } from "@/auth";
import { oauthProvider } from "@/constants";

export const signInWithProvider = async (formData) => {
  const provider = formData.get("provider") ?? oauthProvider.google;

  // redirect 콜백을 실행시키려면 redirectTo 옵션 제거
  await signIn(provider, { redirectTo: "/protected" });
};

export const signOutWithForm = async () => {
  await signOut();
};
