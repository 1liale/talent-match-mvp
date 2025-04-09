"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/nav/sidebar";
import { AuthHeader } from "@/components/nav/header";
import { useAuth } from "@/context/auth-context";
import { getUserProfile } from "@/utils/supabase/db/queries";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({ children }) {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserProfile() {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const profileData = await getUserProfile();
        setUserProfile(profileData || { user_type: "candidate" });
      } catch (error) {
        console.error('Error loading user profile:', error);
        // Set a default profile in case of error
        setUserProfile({ user_type: "candidate" });
      } finally {
        setLoading(false);
      }
    }
    
    loadUserProfile();
  }, [user]);

  // Show a loading spinner while profile is being fetched
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-sm">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {userProfile && <Sidebar userProfile={userProfile} />}
      <div className="flex-1 overflow-auto">
        <AuthHeader userProfile={userProfile} />
        {children}
      </div>
    </div>
  );
} 