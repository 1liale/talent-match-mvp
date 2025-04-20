"use client"

import Sidebar from "@/components/nav/sidebar";
import { AuthHeader } from "@/components/nav/header";
import { ProfileProvider } from "@/context/profile-context";
import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({ children }) {
  const { loading: authLoading } = useAuth();

  // Show a loading spinner while auth is being checked
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-sm">Loading...</span>
      </div>
    );
  }

  return (
    <ProfileProvider>
      <DashboardContent>{children}</DashboardContent>
    </ProfileProvider>
  );
}

// Separate component to access profile context
function DashboardContent({ children }) {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <span className="text-sm">Please log in to access the dashboard</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <AuthHeader />
        {children}
      </div>
    </div>
  );
} 