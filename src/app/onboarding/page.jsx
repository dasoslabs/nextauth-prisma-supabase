import { executePrisma } from "@/server";
import Link from "next/link";

export default async function OnboardingPage() {
  const users = await executePrisma();

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="max-w-screen-md p-5 bg-stone-50 rounded-lg space-y-5">
        <p>회원 내역</p>
        <ul>
          {users.map((user, idx) => (
            <li key={`user-${idx}`}>
              <p>
                <b>이름</b>: {user.name}
              </p>
              <p>
                <b>이메일</b>: {user.email}
              </p>
            </li>
          ))}
        </ul>

        <Link
          href="/protected"
          className="block text-center bg-black rounded-lg py-2 px-5 text-white"
        >
          페이지 이동
        </Link>
      </div>
    </div>
  );
}
