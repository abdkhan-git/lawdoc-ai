import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { LogIn, FileText, ArrowRight } from "lucide-react";
import FileUpload from "@/components/FileUpload";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;

  return (
    <div className="w-full min-h-screen bg-[#1c3e94] text-white overflow-x-hidden">
      {/* Navigation/Header */}
      <header className="w-full py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText className="w-8 h-8 text-blue-300" />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white">
            LawDocAI
          </span>
        </div>
        <div>
          {isAuth ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <Link href="/sign-in">
              <Button variant="outline" className="border-blue-400 text-blue-200 hover:bg-blue-800/40">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 py-8 md:py-12 flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full text-center">
          {/* Hero Section - Fixed typography with gradient text */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold leading-[1.3] mb-0 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white inline-block">
              Legal Documents,
            </h1>
            <h1 className="text-5xl md:text-6xl font-bold leading-[1.2] mt-2 mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white inline-block">
              Simplified
            </h1>
            
            <p className="text-lg md:text-xl text-blue-100 mx-auto leading-relaxed max-w-2xl">
              Join thousands of professionals using{" "}
              <span className="font-bold text-white">LawDocAI</span> to instantly understand legal documents, 
              contracts, and policies — no law degree needed.
            </p>
          </div>

          {/* Feature highlights with gradient accents */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 my-10">
            <div className="bg-blue-800/30 p-4 md:p-6 rounded-xl backdrop-blur-sm border border-blue-700/50">
              <h3 className="text-lg md:text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white inline-block">Ask Questions</h3>
              <p className="text-blue-100 text-sm md:text-base">Get instant answers to your questions about any legal document.</p>
            </div>
            <div className="bg-blue-800/30 p-4 md:p-6 rounded-xl backdrop-blur-sm border border-blue-700/50">
              <h3 className="text-lg md:text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white inline-block">Generate Summaries</h3>
              <p className="text-blue-100 text-sm md:text-base">Create comprehensive cheat sheets with a single click.</p>
            </div>
            <div className="bg-blue-800/30 p-4 md:p-6 rounded-xl backdrop-blur-sm border border-blue-700/50">
              <h3 className="text-lg md:text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white inline-block">Save Time</h3>
              <p className="text-blue-100 text-sm md:text-base">Process documents in seconds instead of hours of manual review.</p>
            </div>
          </div>

          {/* Call to Action with gradient button */}
          <div className="py-6 md:py-8">
            {isAuth ? (
              <div className="space-y-6">
                <Link href="/chat">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-xl shadow-lg shadow-blue-900/50 transition-all hover:shadow-xl">
                    Go to Your Chats <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                  </Button>
                </Link>
                <div className="mt-8 md:mt-12 pt-4 border-t border-blue-800/50">
                  <h3 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white inline-block">Upload a New Document</h3>
                  <div className="max-w-md mx-auto">
                    <FileUpload />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                <Link href="/sign-in">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-xl shadow-lg shadow-blue-900/50 transition-all hover:shadow-xl">
                    Get Started <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                  </Button>
                </Link>
                <p className="text-blue-200 text-sm mt-2">
                  Create a free account to start analyzing documents
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 md:py-6 px-4 border-t border-blue-800/50 text-center text-blue-300 mt-auto">
        <p className="text-sm">© {new Date().getFullYear()} LawDocAI. All rights reserved.</p>
      </footer>
    </div>
  );
}