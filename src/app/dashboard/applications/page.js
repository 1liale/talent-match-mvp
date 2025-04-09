"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  TypographyH2, 
  TypographyP 
} from "@/components/ui/typography";
import { toast } from "sonner";
import { Filter, GridIcon, ListIcon, SearchIcon, BriefcaseIcon } from "lucide-react";

import KanbanBoard from "@/components/applications/kanban-board";
import { createClient } from "@/utils/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/auth-context";

// Mock data for demonstration
const mockApplications = [
  {
    id: "job-1",
    name: "Frontend Developer",
    company: "Acme Inc.",
    companyLogo: "https://ui-avatars.com/api/?name=Acme&background=0D8ABC&color=fff",
    location: "San Francisco, CA",
    salary: "$120,000 - $150,000",
    posted: "2 days ago",
    status: "pending",
    appliedDate: "Yesterday",
    tags: ["React", "TypeScript", "Remote"],
    info: [
      { icon: "calendar", text: "Applied on June 1, 2023" }
    ]
  },
  {
    id: "job-2",
    name: "Senior Software Engineer",
    company: "TechCorp",
    companyLogo: "https://ui-avatars.com/api/?name=TC&background=6366F1&color=fff",
    location: "New York, NY",
    salary: "$150,000 - $180,000",
    posted: "5 days ago",
    status: "reviewing",
    appliedDate: "3 days ago",
    tags: ["Node.js", "AWS", "Hybrid"],
    info: [
      { icon: "calendar", text: "Screening call on June 5, 2023" }
    ]
  },
  {
    id: "job-3",
    name: "UX Designer",
    company: "DesignHub",
    companyLogo: "https://ui-avatars.com/api/?name=DH&background=10B981&color=fff",
    location: "Remote",
    salary: "$90,000 - $120,000",
    posted: "1 week ago",
    status: "approved",
    appliedDate: "5 days ago",
    tags: ["Figma", "UI/UX", "Remote"],
    info: [
      { icon: "calendar", text: "Interview scheduled for tomorrow" }
    ]
  },
  {
    id: "job-4",
    name: "Product Manager",
    company: "ProductLabs",
    companyLogo: "https://ui-avatars.com/api/?name=PL&background=F59E0B&color=fff",
    location: "Austin, TX",
    salary: "$130,000 - $160,000",
    posted: "2 weeks ago",
    status: "reviewing",
    appliedDate: "1 week ago",
    tags: ["Product", "Agile", "B2B"],
    info: [
      { icon: "notes", text: "Product case study submitted" }
    ]
  },
  {
    id: "job-5",
    name: "DevOps Engineer",
    company: "CloudSystems",
    companyLogo: "https://ui-avatars.com/api/?name=CS&background=EC4899&color=fff",
    location: "Seattle, WA",
    salary: "$140,000 - $170,000",
    posted: "3 weeks ago",
    status: "approved",
    appliedDate: "2 weeks ago",
    tags: ["Kubernetes", "Docker", "Hybrid"],
    info: [
      { icon: "mail", text: "Offer received via email" }
    ]
  },
  {
    id: "job-6",
    name: "Data Scientist",
    company: "DataCrunch",
    companyLogo: "https://ui-avatars.com/api/?name=DC&background=8B5CF6&color=fff",
    location: "Chicago, IL",
    salary: "$125,000 - $155,000",
    posted: "1 month ago",
    status: "rejected",
    appliedDate: "3 weeks ago",
    tags: ["Python", "ML", "AI"],
    info: [
      { icon: "notes", text: "Position filled internally" }
    ]
  }
];

// Simplified Kanban columns - only 3 columns
const kanbanColumns = [
  { id: "pending", title: "Applied" },
  { id: "reviewing", title: "In Progress" },
  { id: "approved", title: "Approved" }
];

// Custom job card for the Kanban board
const JobCard = ({ item }) => {
  return (
    <Card className="p-4 bg-card shadow-sm hover:shadow transition-shadow mb-2">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={item.companyLogo} alt={item.company} />
              <AvatarFallback>{item.company.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <TypographyP className="font-medium text-sm line-clamp-1">{item.name}</TypographyP>
              <span className="text-xs text-muted-foreground">{item.company}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-1">
          {item.tags && item.tags.map((tag, i) => (
            <Badge variant="secondary" key={i} className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
          <span>{item.location}</span>
          <span>{item.salary}</span>
        </div>
        
        {item.info && (
          <div className="mt-2 border-t pt-2 text-xs text-muted-foreground">
            {item.info.map((info, i) => (
              <div key={i} className="flex items-center gap-1">
                <span>{info.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default function ApplicationsPage() {
  const { user } = useAuth();
  const [view, setView] = useState("kanban");
  const [applications, setApplications] = useState(mockApplications);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  // In a real app, this would fetch from Supabase
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      // fetchApplications() implementation would go here
      setLoading(false);
    }, 600);
  }, [user]);

  // Handle kanban drag and drop (read-only for applicants)
  const handleDragEnd = (result) => {
    // In this view, the applicant shouldn't be able to change status
    // so we'll show a message instead
    toast.info("Only employers can update application status");
    return;
  };

  // Filter function
  const filteredApplications = filter
    ? applications.filter(app => 
        app.name.toLowerCase().includes(filter.toLowerCase()) ||
        app.company.toLowerCase().includes(filter.toLowerCase()) ||
        app.location.toLowerCase().includes(filter.toLowerCase())
      )
    : applications;

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2 bg-background border rounded-md p-1">
            <Button
              variant={view === "kanban" ? "default" : "ghost"}
              size="sm"
              className="h-8"
              onClick={() => setView("kanban")}
            >
              <GridIcon className="h-4 w-4 mr-2" />
              Kanban
            </Button>
          </div>
          
          <div className="relative">
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search jobs..." 
              className="w-[200px] pl-8"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
        
        <div>
          <TypographyP className="text-muted-foreground text-sm">
            Showing {filteredApplications.length} applications
          </TypographyP>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-pulse">
            Loading applications...
          </div>
        </div>
      ) : (
        <KanbanBoard 
          columns={kanbanColumns}
          items={filteredApplications}
          onDragEnd={handleDragEnd}
          renderItem={(item) => <JobCard item={item} />}
        />
      )}
    </div>
  );
} 