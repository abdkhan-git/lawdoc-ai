"use client";
import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

/**
 * Define the props type for the Providers component
 * This component expects children elements to wrap
 */
type Props = {
  children: React.ReactNode;
};

// Create a single instance of QueryClient
// This is created outside the component to persist across re-renders
const queryClient = new QueryClient();


// Providers component that wraps the application with necessary context providers
const Providers = ({ children }: Props) => {
  return (
    // Wrap children with QueryClientProvider to enable React Query throughout the app
    // This provides data fetching, caching, and state management capabilities
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default Providers;
