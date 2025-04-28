import { SignIn } from "@clerk/nextjs";

/**
 * @returns Clerk authentication sign in page form that allows users to sign back in with Google or user email
 */
export default function Page() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-r from-rose-100 to-teal-100">
      <SignIn />
    </div>
  );
}