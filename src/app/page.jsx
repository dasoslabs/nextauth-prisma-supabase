import { oauthProvider } from "@/constants";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { RiKakaoTalkFill } from "react-icons/ri";
import { SiNaver } from "react-icons/si";

export default function Home() {
  const actionLogin = async (formData) => {
    "use server";
    // await loginInWithOauth(formData.get('provider'))
  };

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center space-y-5 bg-white px-content">
        <form
          action={actionLogin}
          className="m-auto flex w-full max-w-md flex-col gap-3 text-sm font-semibold"
        >
          <button
            type="submit"
            name="provider"
            value={oauthProvider.google}
            className="font-xs box-border flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-3"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full">
              <FcGoogle size={24} />
            </div>
            <p>구글 계정으로 계속하기</p>
            <span></span>
          </button>
          <button
            type="submit"
            name="provider"
            value={oauthProvider.naver}
            className="font-xs box-border flex w-full items-center justify-between rounded-lg border border-[#03C75A] bg-[#03C75A] p-3 text-white"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full">
              <SiNaver size={14} />
            </div>
            <p>네이버 계정으로 계속하기</p>
            <span></span>
          </button>
          <button
            type="submit"
            name="provider"
            value={oauthProvider.kakao}
            className="font-xs box-border flex w-full items-center justify-between rounded-lg border border-[#FAE11F] bg-[#FAE11F] p-3"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFE300]">
              <RiKakaoTalkFill color="#1E1E1E" size={24} />
            </div>
            <p>카카오 계정으로 계속하기</p>
            <span></span>
          </button>
        </form>
        <p className="text-center text-xs text-stone-400">
          계속 진행하면
          <Link href="#" className="text-stone-700">
            이용 약관
          </Link>
          에 동의하고{" "}
          <Link href="#" className="text-stone-700">
            개인정보처리방침
          </Link>
          을 읽었음을 인정하는 것으로 간주됩니다.
        </p>
      </main>
    </>
  );
}
