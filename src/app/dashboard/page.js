"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TypographyH1, TypographyH2, TypographyH3, TypographyP } from "@/components/ui/typography";

const Dashboard = () => {
  const router = useRouter();
  // Mock user data (replace with actual data fetching)
  const user = { email: "user@example.com" };
  const userType = "applicant";
  
  const signOut = () => {
    // Add sign out logic
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-8">
        <TypographyH1 className="text-2xl">Talent Match</TypographyH1>
        <div className="flex items-center gap-4">
          <TypographyP className="text-sm">
            Signed in as: {user.email}
          </TypographyP>
          <Button variant="outline" size="sm" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <TypographyH2 className="mb-6">
          {userType === "hiring"
            ? "Hiring Manager Dashboard"
            : "Applicant Dashboard"}
        </TypographyH2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userType === "hiring" ? (
            <>
              <Card>
                <CardHeader>
                  <TypographyH3>Post a Job</TypographyH3>
                </CardHeader>
                <CardContent>
                  <TypographyP className="mb-4">
                    Create a new job listing with requirements
                  </TypographyP>
                  <Button>Create Job Post</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <TypographyH3>Candidate Matches</TypographyH3>
                </CardHeader>
                <CardContent>
                  <TypographyP className="mb-4">
                    View AI-suggested candidate matches for your jobs
                  </TypographyP>
                  <Button variant="outline">View Matches</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <TypographyH3>Analytics</TypographyH3>
                </CardHeader>
                <CardContent>
                  <TypographyP className="mb-4">
                    Track job posting performance and candidate insights
                  </TypographyP>
                  <Button variant="outline">View Analytics</Button>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <TypographyH3>Find Jobs</TypographyH3>
                </CardHeader>
                <CardContent>
                  <TypographyP className="mb-4">
                    Browse and search for job opportunities
                  </TypographyP>
                  <Button>Search Jobs</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <TypographyH3>Job Matches</TypographyH3>
                </CardHeader>
                <CardContent>
                  <TypographyP className="mb-4">
                    View your AI-recommended job matches
                  </TypographyP>
                  <Button variant="outline">View Matches</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <TypographyH3>Profile</TypographyH3>
                </CardHeader>
                <CardContent>
                  <TypographyP className="mb-4">
                    Update your resume and skills profile
                  </TypographyP>
                  <Button variant="outline">Edit Profile</Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>

      {/* Placeholder for Cohere AI integration */}
      <div className="max-w-7xl mx-auto mt-12 p-6 bg-secondary rounded-lg border">
        <TypographyH3 className="mb-2">Cohere AI Integration</TypographyH3>
        <TypographyP className="mb-4">
          This section will integrate with Cohere API for enhanced matching and screening.
        </TypographyP>
        <div className="text-sm text-foreground/80 p-3 bg-card rounded border">
          Placeholder for Cohere API integration
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 