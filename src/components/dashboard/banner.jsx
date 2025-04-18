"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  TypographyH1,
  TypographyLead
} from "@/components/ui/typography";
import { CheckCircle, Plus, Search } from "lucide-react";

const CandidateBanner = ({ user }) => {
  return (
    <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 md:p-8">
      <div className="max-w-3xl">
        <TypographyH1 className="text-2xl md:text-3xl mb-2">
          Welcome back, {user?.username}! 👋
        </TypographyH1>
        <TypographyLead className="text-muted-foreground mb-6 mt-2">
          Keep your profile and resume updated to boost match score and attract more opportunities.
        </TypographyLead>
        <div className="flex flex-wrap gap-3">
          <Button className="gap-2" asChild>
            <Link href="/dashboard/profile">
              <CheckCircle className="h-4 w-4" />
              Update Profile
            </Link>
          </Button>
          <Button variant="outline" className="gap-2" asChild>
            <Link href="/dashboard/jobs">
              <Search className="h-4 w-4" />
              Browse Jobs
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

const EmployerBanner = ({ user }) => {
  return (
    <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 md:p-8">
      <div className="max-w-3xl">
        <TypographyH1 className="text-2xl md:text-3xl mb-2">
          Welcome back, {user?.name || 'there'}! 👋
        </TypographyH1>
        <TypographyLead className="text-muted-foreground mb-6">
          Manage your job postings and find qualified candidates that match your requirements.
        </TypographyLead>
        <div className="flex flex-wrap gap-3">
          <Button className="gap-2" asChild>
            <Link href="/dashboard/jobs/create">
              <Plus className="h-4 w-4" />
              Post New Job
            </Link>
          </Button>
          <Button variant="outline" className="gap-2" asChild>
            <Link href="/dashboard/talent-search">
              <Search className="h-4 w-4" />
              Search Talent
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}; 

export { CandidateBanner, EmployerBanner };