import { auth } from "@clerk/nextjs/server";
import HomeClient from "@/components/HomeClient";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;

  return <HomeClient isAuth={isAuth} />;
}