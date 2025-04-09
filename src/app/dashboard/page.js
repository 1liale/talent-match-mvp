"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  TypographyH1,
  TypographyH2,
  TypographyLead
} from "@/components/ui/typography";
import { 
  StatsCard,
  ApplicationCard,
  JobCard,
  CandidateCard,
} from "@/components/base/card";
import { PrimaryBadge } from "@/components/base/badge";
import { ChevronRight, Users, Briefcase, Star, Calendar, CheckCircle, Plus, Clipboard, Search } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { createClient } from "@/utils/supabase/client";

// Mock data
const mockApplications = [
  {
    id: 1,
    company: "TechCorp Inc.",
    position: "Senior Frontend Developer",
    status: "Interview",
    logo: "/company-logos/techcorp.png",
    matchScore: 92,
    date: "2 days ago",
  },
  {
    id: 2,
    company: "Global Systems",
    position: "Full Stack Engineer",
    status: "Application Review",
    logo: "/company-logos/globalsys.png",
    matchScore: 87,
    date: "5 days ago",
  },
  {
    id: 3,
    company: "InnovateTech",
    position: "UI/UX Designer",
    status: "Skills Assessment",
    logo: "/company-logos/innovatetech.png",
    matchScore: 90,
    date: "1 week ago",
  },
];

const mockJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "Remote, Worldwide",
    salary: "$120,000 - $150,000",
    matchScore: 95,
    postDate: "2 days ago",
    logo: "/company-logos/techcorp.png"
  },
  {
    id: 2,
    title: "Full Stack Engineer",
    company: "Global Systems",
    location: "San Francisco, CA",
    salary: "$130,000 - $160,000",
    matchScore: 87,
    postDate: "5 days ago",
    logo: "/company-logos/globalsys.png"
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "InnovateTech",
    location: "New York, NY",
    salary: "$90,000 - $110,000",
    matchScore: 82,
    postDate: "1 week ago",
    logo: "/company-logos/innovatetech.png"
  },
];

const mockCandidates = [
  {
    id: 1,
    name: "Alex Johnson",
    position: "Senior Frontend Developer",
    location: "San Francisco, CA",
    experience: "7 years",
    skills: ["React", "TypeScript", "Node.js"],
    matchScore: 95,
    avatar: "https://ui-avatars.com/api/?name=Alex+Johnson&background=0D8ABC&color=fff"
  },
  {
    id: 2,
    name: "Samantha Lee",
    position: "Full Stack Engineer",
    location: "Remote",
    experience: "5 years",
    skills: ["Python", "React", "AWS"],
    matchScore: 89,
    avatar: "https://ui-avatars.com/api/?name=Samantha+Lee&background=10B981&color=fff"
  },
  {
    id: 3,
    name: "Marcus Chen",
    position: "UI/UX Designer",
    location: "New York, NY",
    experience: "4 years",
    skills: ["Figma", "Adobe XD", "HTML/CSS"],
    matchScore: 92,
    avatar: "https://ui-avatars.com/api/?name=Marcus+Chen&background=6366F1&color=fff"
  },
];

// Dashboard component
export default function DashboardPage() {
  // In a real app, this would come from authentication state
  const [userType, setUserType] = useState("candidate");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user: authUser } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    async function fetchUserProfile() {
      if (!authUser) return;
      
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
          // Set basic user info from auth
          setUser({
            email: authUser.email,
          });
          setLoading(false);
          return;
        }
        
        // Set full user info from profile
        setUser({
          email: authUser.email,
          username: data.username,
          name: data.full_name,
          role: data.job_title || data.user_type,
          avatarUrl: data.avatar_url,
        });
        
        // Set user type based on user_type if available
        if (data.user_type) {
          setUserType(data.user_type === 'applicant' ? 'candidate' : 'employer');
        }
            
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserProfile();
  }, [authUser, supabase]);


  if (loading) {
    return null;
  }

  // Toggle for demonstration purposes
  const toggleUserType = () => {
    setUserType(userType === "candidate" ? "employer" : "candidate");
  };

  return (
    <div className="p-6">
      {/* Dashboard content */}
      {userType === "candidate" ? (
        <CandidateDashboard />
      ) : (
        <EmployerDashboard />
      )}
    </div>
  );
}

// Candidate Dashboard
const CandidateDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 md:p-8">
        <div className="max-w-3xl">
          <TypographyH1 className="text-2xl md:text-3xl mb-2">Welcome back, John! 👋</TypographyH1>
          <TypographyLead className="text-muted-foreground mb-6">
            Your profile has been viewed by 12 recruiters this week. Update your skills to improve your match score.
          </TypographyLead>
          <div className="flex flex-wrap gap-3">
            <Button className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Complete Profile
            </Button>
            <Button variant="outline" className="gap-2">
              <Search className="h-4 w-4" />
              Browse Jobs
            </Button>
          </div>
        </div>
      </div>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          icon={<Clipboard className="h-5 w-5 text-primary" />}
          label="Applications"
          value="12"
          note="3 new this week"
        />
        
        <StatsCard 
          icon={<Calendar className="h-5 w-5 text-primary" />}
          label="Interviews"
          value="3"
          note="1 scheduled tomorrow"
        />
        
        <StatsCard 
          icon={<Users className="h-5 w-5 text-primary" />}
          label="Profile Views"
          value="47"
          note="+12% from last month"
        />
        
        <StatsCard 
          icon={<Star className="h-5 w-5 text-primary" />}
          label="Match Score"
          value="85%"
          note="Above average"
          noteColor="text-blue-600"
        />
      </div>
      
      {/* Active applications */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <TypographyH2 className="text-xl">My Applications</TypographyH2>
          <Button variant="ghost" size="sm" className="gap-1" asChild>
            <Link href="/applications">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockApplications.map(application => (
            <ApplicationCard 
              key={application.id} 
              application={application}
              detailsUrl={`/applications/${application.id}`}
            />
          ))}
        </div>
      </div>
      
      {/* Recommended jobs */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <TypographyH2 className="text-xl">Recommended Jobs</TypographyH2>
          <Button variant="ghost" size="sm" className="gap-1" asChild>
            <Link href="/jobs">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockJobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job}
              applyUrl={`/jobs/${job.id}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Employer Dashboard
const EmployerDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 md:p-8">
        <div className="max-w-3xl">
          <PrimaryBadge className="mb-4">Dashboard</PrimaryBadge>
          <TypographyH1 className="text-2xl md:text-3xl mb-2">Welcome back, TechCorp! 👋</TypographyH1>
          <TypographyLead className="text-muted-foreground mb-6">
            You have 24 active job postings and 57 new applications this week. Review them to find your perfect match.
          </TypographyLead>
          <div className="flex flex-wrap gap-3">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Post New Job
            </Button>
            <Button variant="outline" className="gap-2">
              <Search className="h-4 w-4" />
              Search Talent
            </Button>
          </div>
        </div>
      </div>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          icon={<Briefcase className="h-5 w-5 text-primary" />}
          label="Active Jobs"
          value="24"
          note="3 expiring soon"
          noteColor="text-blue-600"
        />
        
        <StatsCard 
          icon={<Clipboard className="h-5 w-5 text-primary" />}
          label="Applications"
          value="57"
          note="12 new today"
        />
        
        <StatsCard 
          icon={<Calendar className="h-5 w-5 text-primary" />}
          label="Interviews"
          value="15"
          note="4 scheduled tomorrow"
        />
        
        <StatsCard 
          icon={<CheckCircle className="h-5 w-5 text-primary" />}
          label="Hired"
          value="8"
          note="3 this month"
        />
      </div>
      
      {/* Top candidates */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <TypographyH2 className="text-xl">Top Matching Candidates</TypographyH2>
          <Button variant="ghost" size="sm" className="gap-1" asChild>
            <Link href="/talent-search">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockCandidates.map(candidate => (
            <CandidateCard 
              key={candidate.id} 
              candidate={candidate}
              profileUrl={`/candidates/${candidate.id}`}
            />
          ))}
        </div>
      </div>
      
      {/* Recent Applications */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <TypographyH2 className="text-xl">Recent Applications</TypographyH2>
          <Button variant="ghost" size="sm" className="gap-1" asChild>
            <Link href="dashboard/applicants">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}; 