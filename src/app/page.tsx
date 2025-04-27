import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { LogIn } from "lucide-react";
import FileUpload from "@/components/FileUpload"; // ✅ Add this import

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-rose-100 to-teal-100">
      <div className="container mx-auto px-4 h-screen flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full text-center">
          {/* Header Section */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <h1 className="text-5xl font-semibold">Chat with any</h1>
            <div className="absolute right-4 top-4">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>

          <h1 className="text-5xl font-semibold mb-8">LawDocument</h1>

          {/* Go to Chats Button */}
          {isAuth && (
            <div className="mb-8">
              <Link href="/chat">
                <Button size="lg">Go to Chats</Button>
              </Link>
            </div>
          )}

          {/* Description Text */}
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students, professionals, and everyday readers using{" "}
            <strong>Legal Doc AI</strong> to instantly understand legal documents, contracts,
            and policies — no law degree needed.
          </p>

          {/* File Upload or Login */}
          <div className="mt-8">
            {isAuth ? (
              <FileUpload />
            ) : (
              <div className="mt-8 flex justify-center">
                <Link href="/sign-in">
                  <Button size="lg" className="flex items-center gap-2">
                    Login to get Started
                    <LogIn className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}