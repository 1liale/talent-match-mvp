"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const { user, loading, userType, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // This will redirect to the login page
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif font-bold text-[#6a6344]">Talent Match</h1>
        <div className="flex items-center gap-4">
          <p className="text-sm text-foreground/80">
            Signed in as: {user.email}
          </p>
          <Button variant="outline" size="sm" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <h2 className="text-xl font-serif font-bold mb-6 text-[#6a6344]">
          {userType === "hiring"
            ? "Hiring Manager Dashboard"
            : "Applicant Dashboard"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userType === "hiring" ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Post a Job</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 mb-4">
                    Create a new job listing with requirements
                  </p>
                  <Button>Create Job Post</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Candidate Matches</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 mb-4">
                    View AI-suggested candidate matches for your jobs
                  </p>
                  <Button variant="outline">View Matches</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 mb-4">
                    Track job posting performance and candidate insights
                  </p>
                  <Button variant="outline">View Analytics</Button>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Find Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 mb-4">
                    Browse and search for job opportunities
                  </p>
                  <Button>Search Jobs</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Job Matches</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 mb-4">
                    View your AI-recommended job matches
                  </p>
                  <Button variant="outline">View Matches</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 mb-4">
                    Update your resume and skills profile
                  </p>
                  <Button variant="outline">Edit Profile</Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>

      {/* Placeholder for Cohere AI integration */}
      <div className="max-w-7xl mx-auto mt-12 p-6 bg-secondary rounded-lg border">
        <h3 className="text-lg font-serif font-bold mb-2">Cohere AI Integration</h3>
        <p className="text-foreground/80 mb-4">
          This section will integrate with Cohere API for enhanced matching and screening.
        </p>
        <div className="text-sm text-foreground/80 p-3 bg-card rounded border">
          Placeholder for Cohere API integration
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 