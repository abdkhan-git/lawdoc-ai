import { SignUp } from "@clerk/nextjs";

/**
 * @returns Clerk authentication sign up page form that allows users to sign up with Google or user email
 */
export default function Page() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-rose-100 to-teal-100">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-xl"
          }
        }}
      />
    </div>
  );
}