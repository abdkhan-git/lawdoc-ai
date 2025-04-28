"use client"; // Indicates this is a client-side component in Next.js

import { uploadToS3 } from "@/lib/s3"; // Custom function to upload files to AWS S3
import { useMutation } from "@tanstack/react-query"; // For handling API mutations with caching
import { Inbox, Loader2 } from "lucide-react"; // Icons for the UI
import React from "react";
import { useDropzone } from "react-dropzone"; // Library for file drag-and-drop functionality
import axios from "axios"; // HTTP client for API requests
import toast from "react-hot-toast"; // Toast notifications for user feedback
import { useRouter } from "next/navigation"; // Next.js router for navigation

const FileUpload = () => {
  // Initialize router for navigation after upload
  const router = useRouter();

  // Local state to track file upload status
  const [uploading, setUploading] = React.useState(false);


  // Set up mutation for creating a new chat after file upload
  // This handles the API call to create a chat associated with the uploaded file
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string; // S3 key of the uploaded file
      file_name: string; // Original name of the file
    }) => {
      // Make POST request to create a new chat with the uploaded file
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      });
      return response.data;
    },
  });


  // Configure the dropzone for file uploads
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"], // Only accept PDF files
    },
    maxFiles: 1, // Limit to one file at a time
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      // Check if file is too large (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too large");
        return;
      }

      try {
        // Set uploading state to show loading indicator
        setUploading(true); 
        
        // Upload the file to S3 using the custom function
        const data = await uploadToS3(file);
        
        // Validate the response from S3 upload
        if (!data?.file_key || !data.file_name) {
          toast.error("Something went wrong");
          return;
        }
        
        // Create a new chat with the uploaded file
        mutate(data, {
          onSuccess: ({ chat_id }) => {
            toast.success("Chat created!"); // Show success notification
            router.push(`/chat/${chat_id}`); // Navigate to the new chat
          },
          onError: (err) => {
            toast.error("Error creating chat"); // Show error notification
          },
        });
      } catch (error) {
        console.error(error);
      } 
      finally {
        // Reset uploading state regardless of outcome
        setUploading(false); 
      }
    },
  });


  // Determine if we're in a loading state (either uploading or API is pending)
  const loading = uploading || isPending;

  
  return (
    // Main container with white background and rounded corners
    <div className="p-2 bg-white rounded-xl">
      {/* Dropzone area for styling and handlers from useDropzone */}
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
        })}
      >
        {/* Hidden file input handled by react-dropzone */}
        <input {...getInputProps()} />
        
        {/* Conditional rendering based on loading state */}
        {loading ? (
          // Show loading spinner and message when uploading
          <>
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">
              Spilling Tea to LawDoc AI...
            </p>
          </>
        ) : (
          // Show upload icon and instruction when ready for upload
          <>
            <Inbox className="w-10 h-10 text-blue-500" />
            <p className="mt-2 text-sm text-slate-400">Drop PDF Here</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;