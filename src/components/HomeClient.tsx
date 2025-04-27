"use client"; // VERY IMPORTANT

import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import FileUpload from "@/components/FileUpload";
import { UserButton } from "@clerk/nextjs";
import axios from "axios";

interface HomeClientProps {
  isAuth: boolean;
}

export default function HomeClient({ isAuth }: HomeClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoToChats = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/get-latest-chat");
      const { chatId } = response.data;

      if (chatId) {
        router.push(`/chat/${chatId}`);
      } else {
        router.push("/chat");
      }
    } catch (error) {
      console.error(error);
      router.push("/chat");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
          <Button size="lg" onClick={handleGoToChats} disabled={loading}>
            {loading ? "Loading..." : "Go to Chats"}
          </Button>
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
          <Link href="/sign-in">
            <Button size="lg" className="flex items-center gap-2">
              Login to get Started
              <LogIn className="w-5 h-5" />
            </Button>
          </Link>
        )}
      </div>
    </>
  );
}
