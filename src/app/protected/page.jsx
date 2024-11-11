import { auth } from "@/auth";
import { signOutWithForm } from "@/server";
import Image from "next/image";

export default async function ListPage() {
  const session = await auth();

  return (
    <div className="flex flex-col justify-center items-center p-5 gap-5">
      <form action={signOutWithForm}>
        <button className="bg-black rounded-lg py-2 px-5 text-white">
          로그아웃
        </button>
      </form>
      <div className="bg-stone-100 px-4 py-6 rounded-lg max-w-screen-md w-full max-h-80 h-full">
        {session.user?.image ? (
          <Image
            src={session.user.image}
            alt="프로필 사진"
            width={40}
            height={40}
            className="rounded-full m-auto"
          />
        ) : (
          <div className="flex justify-center items-center">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" fill="#ccc" />
              <path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"
                fill="#fff"
              />
              <path
                d="M12 14c-3.33 0-6 2.67-6 6h12c0-3.33-2.67-6-6-6z"
                fill="#fff"
              />
            </svg>
          </div>
        )}
        <pre className="whitespace-pre-wrap break-all">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
}
