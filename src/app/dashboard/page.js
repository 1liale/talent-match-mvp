"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyP,
  TypographyLead
} from "@/components/ui/typography";
import Sidebar from "@/components/nav/sidebar";
import { PrimaryCardMedium, PrimaryCardSmall } from "@/components/base/card";
import { PrimaryBadge } from "@/components/base/badge";
import { Bell, ChevronRight, Users, Briefcase, Star, Clock, Calendar, CheckCircle, Plus, Clipboard, Search, Building } from "lucide-react";

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
    avatar: "/avatars/alex.jpg"
  },
  {
    id: 2,
    name: "Samantha Lee",
    position: "Full Stack Engineer",
    location: "Remote",
    experience: "5 years",
    skills: ["Python", "React", "AWS"],
    matchScore: 89,
    avatar: "/avatars/samantha.jpg"
  },
  {
    id: 3,
    name: "Marcus Chen",
    position: "UI/UX Designer",
    location: "New York, NY",
    experience: "4 years",
    skills: ["Figma", "Adobe XD", "HTML/CSS"],
    matchScore: 92,
    avatar: "/avatars/marcus.jpg"
  },
];

// Status badge component
const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Interview":
        return "bg-green-100 text-green-800";
      case "Application Review":
        return "bg-blue-100 text-blue-800";
      case "Skills Assessment":
        return "bg-purple-100 text-purple-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

// Match score component
const MatchScore = ({ score }) => {
  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    return "text-orange-600";
  };

  return (
    <div className="flex items-center gap-1">
      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
      <span className={`text-sm font-medium ${getScoreColor(score)}`}>{score}% match</span>
    </div>
  );
};

// Dashboard component
export default function DashboardPage() {
  // In a real app, this would come from authentication state
  const [userType, setUserType] = useState("candidate");

  // Toggle for demonstration purposes
  const toggleUserType = () => {
    setUserType(userType === "candidate" ? "employer" : "candidate");
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userType={userType} />
      
      <div className="flex-1 overflow-auto">
        {/* Top navigation */}
        <div className="border-b border-border h-[70px] px-6 flex items-center justify-between sticky top-0 bg-background z-10">
          <TypographyH2 className="text-xl">Dashboard</TypographyH2>
          
          <div className="flex items-center gap-4">
            {/* Toggle user type button - for demo only */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleUserType}
              className="hidden md:flex"
            >
              Switch to {userType === "candidate" ? "Employer" : "Candidate"} View
            </Button>
            
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                {userType === "candidate" ? "JD" : "TC"}
              </div>
              <div className="hidden md:block">
                <TypographyP className="text-sm font-medium">
                  {userType === "candidate" ? "John Doe" : "TechCorp Inc."}
                </TypographyP>
                <TypographyP className="text-xs text-muted-foreground">
                  {userType === "candidate" ? "Full Stack Developer" : "HR Manager"}
                </TypographyP>
              </div>
            </div>
          </div>
        </div>
        
        {/* Dashboard content */}
        <div className="p-6">
          {userType === "candidate" ? (
            <CandidateDashboard />
          ) : (
            <EmployerDashboard />
          )}
        </div>
      </div>
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
          <PrimaryBadge className="mb-4">Dashboard</PrimaryBadge>
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
        <Card className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <TypographyP className="text-sm text-muted-foreground mb-1">Applications</TypographyP>
              <TypographyH3 className="text-2xl font-bold">12</TypographyH3>
            </div>
            <div className="bg-primary/10 p-2 rounded-lg">
              <Clipboard className="h-5 w-5 text-primary" />
            </div>
          </div>
          <TypographyP className="text-xs text-green-600 mt-2">3 new this week</TypographyP>
        </Card>
        
        <Card className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <TypographyP className="text-sm text-muted-foreground mb-1">Interviews</TypographyP>
              <TypographyH3 className="text-2xl font-bold">3</TypographyH3>
            </div>
            <div className="bg-primary/10 p-2 rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
          </div>
          <TypographyP className="text-xs text-green-600 mt-2">1 scheduled tomorrow</TypographyP>
        </Card>
        
        <Card className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <TypographyP className="text-sm text-muted-foreground mb-1">Profile Views</TypographyP>
              <TypographyH3 className="text-2xl font-bold">47</TypographyH3>
            </div>
            <div className="bg-primary/10 p-2 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </div>
          <TypographyP className="text-xs text-green-600 mt-2">+12% from last month</TypographyP>
        </Card>
        
        <Card className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <TypographyP className="text-sm text-muted-foreground mb-1">Match Score</TypographyP>
              <TypographyH3 className="text-2xl font-bold">85%</TypographyH3>
            </div>
            <div className="bg-primary/10 p-2 rounded-lg">
              <Star className="h-5 w-5 text-primary" />
            </div>
          </div>
          <TypographyP className="text-xs text-blue-600 mt-2">Above average</TypographyP>
        </Card>
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
          {mockApplications.map(app => (
            <Card key={app.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                    {app.logo ? (
                      <Image src={app.logo} alt={app.company} width={30} height={30} />
                    ) : (
                      <Building className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <TypographyH3 className="font-medium">{app.position}</TypographyH3>
                    <TypographyP className="text-sm text-muted-foreground">{app.company}</TypographyP>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-3">
                <StatusBadge status={app.status} />
                <TypographyP className="text-xs text-muted-foreground">{app.date}</TypographyP>
              </div>
              
              <div className="flex justify-between items-center">
                <MatchScore score={app.matchScore} />
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/applications/${app.id}`}>
                    Details
                  </Link>
                </Button>
              </div>
            </Card>
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
            <Card key={job.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                    {job.logo ? (
                      <Image src={job.logo} alt={job.company} width={30} height={30} />
                    ) : (
                      <Building className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <TypographyH3 className="font-medium">{job.title}</TypographyH3>
                    <TypographyP className="text-sm text-muted-foreground">{job.company}</TypographyP>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 mb-3">
                <TypographyP className="text-sm flex items-center gap-1">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  {job.location}
                </TypographyP>
                <TypographyP className="text-sm flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {job.postDate}
                </TypographyP>
              </div>
              
              <div className="flex justify-between items-center">
                <MatchScore score={job.matchScore} />
                <Button variant="primary" size="sm" asChild>
                  <Link href={`/jobs/${job.id}`}>
                    Apply Now
                  </Link>
                </Button>
              </div>
            </Card>
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
        <Card className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <TypographyP className="text-sm text-muted-foreground mb-1">Active Jobs</TypographyP>
              <TypographyH3 className="text-2xl font-bold">24</TypographyH3>
            </div>
            <div className="bg-primary/10 p-2 rounded-lg">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
          </div>
          <TypographyP className="text-xs text-blue-600 mt-2">3 expiring soon</TypographyP>
        </Card>
        
        <Card className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <TypographyP className="text-sm text-muted-foreground mb-1">Applications</TypographyP>
              <TypographyH3 className="text-2xl font-bold">57</TypographyH3>
            </div>
            <div className="bg-primary/10 p-2 rounded-lg">
              <Clipboard className="h-5 w-5 text-primary" />
            </div>
          </div>
          <TypographyP className="text-xs text-green-600 mt-2">12 new today</TypographyP>
        </Card>
        
        <Card className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <TypographyP className="text-sm text-muted-foreground mb-1">Interviews</TypographyP>
              <TypographyH3 className="text-2xl font-bold">15</TypographyH3>
            </div>
            <div className="bg-primary/10 p-2 rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
          </div>
          <TypographyP className="text-xs text-green-600 mt-2">4 scheduled tomorrow</TypographyP>
        </Card>
        
        <Card className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <TypographyP className="text-sm text-muted-foreground mb-1">Hired</TypographyP>
              <TypographyH3 className="text-2xl font-bold">8</TypographyH3>
            </div>
            <div className="bg-primary/10 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
          </div>
          <TypographyP className="text-xs text-green-600 mt-2">3 this month</TypographyP>
        </Card>
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
            <Card key={candidate.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                    {candidate.avatar ? (
                      <Image src={candidate.avatar} alt={candidate.name} width={40} height={40} />
                    ) : (
                      <User className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <TypographyH3 className="font-medium">{candidate.name}</TypographyH3>
                    <TypographyP className="text-sm text-muted-foreground">{candidate.position}</TypographyP>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 mb-3">
                <TypographyP className="text-sm flex items-center gap-1">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  {candidate.experience} experience
                </TypographyP>
                <div className="flex flex-wrap gap-1">
                  {candidate.skills.map((skill, i) => (
                    <span key={i} className="text-xs bg-muted px-2 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <MatchScore score={candidate.matchScore} />
                <Button variant="primary" size="sm" asChild>
                  <Link href={`/candidates/${candidate.id}`}>
                    View Profile
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Recent Applications */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <TypographyH2 className="text-xl">Recent Applications</TypographyH2>
          <Button variant="ghost" size="sm" className="gap-1" asChild>
            <Link href="/manage-applications">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 text-muted-foreground font-medium text-sm">Candidate</th>
                  <th className="text-left p-4 text-muted-foreground font-medium text-sm">Position</th>
                  <th className="text-left p-4 text-muted-foreground font-medium text-sm">Match</th>
                  <th className="text-left p-4 text-muted-foreground font-medium text-sm">Date</th>
                  <th className="text-left p-4 text-muted-foreground font-medium text-sm">Status</th>
                  <th className="text-left p-4 text-muted-foreground font-medium text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockCandidates.map((candidate, index) => (
                  <tr key={candidate.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                          {candidate.avatar ? (
                            <Image src={candidate.avatar} alt={candidate.name} width={32} height={32} />
                          ) : (
                            <User className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <span>{candidate.name}</span>
                      </div>
                    </td>
                    <td className="p-4">{mockJobs[index % mockJobs.length].title}</td>
                    <td className="p-4">
                      <MatchScore score={candidate.matchScore} />
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{mockJobs[index % mockJobs.length].postDate}</td>
                    <td className="p-4">
                      <StatusBadge status={mockApplications[index % mockApplications.length].status} />
                    </td>
                    <td className="p-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/manage-applications/${candidate.id}`}>
                          Review
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}; 