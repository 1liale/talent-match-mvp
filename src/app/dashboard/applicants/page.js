"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  TypographyP 
} from "@/components/ui/typography";
import { toast } from "sonner";
import { Filter, GridIcon, ListIcon, SearchIcon } from "lucide-react";

import KanbanBoard from "@/components/applications/kanban-board";
import ApplicantsTable from "@/components/applications/applicants-table";
import { createClient } from "@/utils/supabase/client";

// Mock data for demonstration
const mockApplicants = [
  {
    id: "app-1",
    name: "Sonia Hoppe",
    email: "sonia@example.com",
    phone: "+1 (555) 123-4567",
    title: "Frontend Developer",
    avatar: "https://i.pravatar.cc/150?img=1",
    status: "pending",
    appliedDate: "3 days ago",
    jobPosition: "Senior Frontend Developer",
    tags: ["React", "Typescript"],
    resume: "#",
    info: [
      { icon: "calendar", text: "Applied on May 12, 2023" },
      { icon: "notes", text: "Referred by John Doe" }
    ]
  },
  {
    id: "app-2",
    name: "Wilbur Hackett",
    email: "wilbur@example.com",
    phone: "+1 (555) 234-5678",
    title: "UI/UX Designer",
    avatar: "https://i.pravatar.cc/150?img=2",
    status: "reviewing",
    appliedDate: "5 days ago",
    jobPosition: "UI/UX Designer",
    tags: ["Figma", "Adobe XD"],
    resume: "#",
    info: [
      { icon: "calendar", text: "Screening call scheduled for tomorrow" }
    ]
  },
  {
    id: "app-3",
    name: "Annette Dickinson",
    email: "annette@example.com",
    phone: "+1 (555) 345-6789",
    title: "Software Engineer",
    avatar: "https://i.pravatar.cc/150?img=3",
    status: "approved",
    appliedDate: "1 week ago",
    jobPosition: "Backend Engineer",
    tags: ["Node.js", "Python"],
    resume: "#",
    info: [
      { icon: "calendar", text: "Interview on June 5, 2023" },
      { icon: "notes", text: "Passed coding challenge" }
    ]
  },
  {
    id: "app-4",
    name: "Keith Hirthe",
    email: "keith@example.com",
    phone: "+1 (555) 456-7890",
    title: "DevOps Engineer",
    avatar: "https://i.pravatar.cc/150?img=4",
    status: "reviewing",
    appliedDate: "2 weeks ago",
    jobPosition: "DevOps Engineer",
    tags: ["AWS", "Kubernetes"],
    resume: "#",
    info: [
      { icon: "notes", text: "Technical assessment sent" }
    ]
  },
  {
    id: "app-5",
    name: "Angela Von",
    email: "angela@example.com",
    phone: "+1 (555) 567-8901",
    title: "Product Manager",
    avatar: "https://i.pravatar.cc/150?img=5",
    status: "approved",
    appliedDate: "3 weeks ago",
    jobPosition: "Senior Product Manager",
    tags: ["Agile", "Scrum"],
    resume: "#",
    info: [
      { icon: "calendar", text: "Offer sent on June 1, 2023" }
    ]
  },
  {
    id: "app-6",
    name: "Lisa Harvey",
    email: "lisa@example.com",
    phone: "+1 (555) 678-9012",
    title: "Data Scientist",
    avatar: "https://i.pravatar.cc/150?img=6",
    status: "approved",
    appliedDate: "1 month ago",
    jobPosition: "Data Scientist",
    tags: ["Python", "ML"],
    resume: "#",
    info: [
      { icon: "calendar", text: "Starting on July 1, 2023" }
    ]
  },
  {
    id: "app-7",
    name: "Gina Steuber",
    email: "gina@example.com",
    phone: "+1 (555) 789-0123",
    title: "Mobile Developer",
    avatar: "https://i.pravatar.cc/150?img=7",
    status: "rejected",
    appliedDate: "2 months ago",
    jobPosition: "iOS Developer",
    tags: ["Swift", "Mobile"],
    resume: "#",
    info: [
      { icon: "notes", text: "Not enough experience" }
    ]
  },
  {
    id: "app-8",
    name: "Caroline Stracke",
    email: "caroline@example.com",
    phone: "+1 (555) 890-1234",
    title: "QA Engineer",
    avatar: "https://i.pravatar.cc/150?img=8",
    status: "pending",
    appliedDate: "1 day ago",
    jobPosition: "QA Engineer",
    tags: ["Selenium", "Testing"],
    resume: "#",
    info: [
      { icon: "calendar", text: "Applied on June 2, 2023" }
    ]
  }
];

// Simplified Kanban columns - only 3 instead of 7
const kanbanColumns = [
  { id: "pending", title: "New Applicants" },
  { id: "reviewing", title: "In Review" },
  { id: "approved", title: "Approved" }
];

export default function ApplicantsPage() {
  const [view, setView] = useState("kanban");
  const [applicants, setApplicants] = useState(mockApplicants);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  // In a real app, this would fetch from Supabase
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      // Sample code for real implementation:
      // async function fetchApplicants() {
      //   const { data, error } = await supabase
      //     .from('applications')
      //     .select('*, profiles(*)');
      //   
      //   if (error) {
      //     console.error('Error fetching applicants:', error);
      //     return;
      //   }
      //   
      //   setApplicants(data);
      // }
      // 
      // fetchApplicants();
      
      setLoading(false);
    }, 600);
  }, []);

  // Handle kanban drag and drop
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Update applicant status
    const updatedApplicants = applicants.map(applicant => {
      if (applicant.id === draggableId) {
        return {
          ...applicant,
          status: destination.droppableId
        };
      }
      return applicant;
    });

    setApplicants(updatedApplicants);
    
    // In a real app, you would update the database here
    // Sample code for real implementation:
    // async function updateStatus() {
    //   const { error } = await supabase
    //     .from('applications')
    //     .update({ status: destination.droppableId })
    //     .eq('id', draggableId);
    //   
    //   if (error) {
    //     console.error('Error updating status:', error);
    //     toast.error("Failed to update applicant status");
    //   }
    // }
    // 
    // updateStatus();
    
    toast.success(`Moved applicant to ${destination.droppableId}`);
  };

  // Handle status change from the table view
  const handleStatusChange = (id, newStatus) => {
    const updatedApplicants = applicants.map(applicant => {
      if (applicant.id === id) {
        return {
          ...applicant,
          status: newStatus
        };
      }
      return applicant;
    });

    setApplicants(updatedApplicants);
    toast.success(`Updated applicant status to ${newStatus}`);
  };

  // Handle opening an applicant profile
  const handleRowClick = (applicant) => {
    // In a real app, this would navigate to the applicant's profile
    toast.info(`Viewing ${applicant.name}'s profile`);
  };

  // Filter function
  const filteredApplicants = filter
    ? applicants.filter(app => 
        app.name.toLowerCase().includes(filter.toLowerCase()) ||
        app.title.toLowerCase().includes(filter.toLowerCase()) ||
        app.email.toLowerCase().includes(filter.toLowerCase())
      )
    : applicants;

  // Main return structure
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
            <Button
              variant={view === "list" ? "default" : "ghost"}
              size="sm"
              className="h-8"
              onClick={() => setView("list")}
            >
              <ListIcon className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>
          
          <div className="relative">
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
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
            Showing {filteredApplicants.length} applicants
          </TypographyP>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-pulse">
            Loading applicants...
          </div>
        </div>
      ) : (
        <>
          {view === "kanban" ? (
            <KanbanBoard 
              columns={kanbanColumns}
              items={filteredApplicants}
              onDragEnd={handleDragEnd}
            />
          ) : (
            <ApplicantsTable 
              data={filteredApplicants}
              onRowClick={handleRowClick}
              onStatusChange={handleStatusChange}
            />
          )}
        </>
      )}
    </div>
  );
} 