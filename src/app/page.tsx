import { auth } from "@clerk/nextjs/server";
import HomeClient from "@/components/HomeClient";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-rose-100 to-teal-100">
      <div className="container mx-auto px-4 h-screen flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full text-center">
          <HomeClient isAuth={isAuth} />
        </div>
      </div>
    </div>
  );
}
