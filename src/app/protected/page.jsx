import { auth } from "@/auth";
import { signOutWithForm } from "@/server";

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
        <pre className="whitespace-pre-wrap break-all">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
}
