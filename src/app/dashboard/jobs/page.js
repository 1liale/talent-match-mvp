"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { 
  TypographyH1, 
  TypographyH2,
  TypographyP 
} from "@/components/ui/typography";
import { JobCard } from "@/components/base/card";
import { useAuth } from "@/context/auth-context";
import { useJobApplication } from "@/context/job-application-context";
import { getJobs } from "@/utils/supabase/db/queries";
import { 
  JobFilterPanel, 
  ActiveFilters, 
  SortSelector,
} from "@/components/jobs/search-filter.jsx";
import { Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { calculateTimeAgo } from "@/utils/date";

export default function JobsPage() {
  const { user } = useAuth();
  const { openApplicationModal } = useJobApplication();
  
  // State for search, filters, and jobs
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    jobType: [],
    experienceLevel: [],
    location: [],
  });
  const [sortBy, setSortBy] = useState("newest");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedResumeId, setSelectedResumeId] = useState("none");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Calculate active filter count
  const activeFilterCount = 
    filters.jobType.length + 
    filters.experienceLevel.length + 
    filters.location.length;

  // Fetch jobs function
  const fetchJobs = useCallback(async (searchParams = {}) => {
    try {
      const fetchedJobs = await getJobs({ 
        sortBy: searchParams.sortBy || "newest", 
        limit: 10 
      });
      
      setJobs(fetchedJobs);
      return fetchedJobs;
    } catch (error) {
      console.error("Error fetching jobs:", error);
      return [];
    }
  }, []);

  // Fetch recommended jobs based on search term and filters
  const fetchRecommendedJobs = useCallback(async () => {
    try {
      // Skip API call if there's no searchTerm and no active filters
      // This prevents the 400 error when sending empty queries
      if (!searchTerm.trim() && activeFilterCount === 0 && (!selectedResumeId || selectedResumeId === "none")) {
        return await fetchJobs({ sortBy });
      }
      
      // Call API endpoint for job recommendations
      const response = await fetch("/api/recommend-jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          searchTerm,
          filters,
          resumeId: selectedResumeId === "none" ? null : selectedResumeId
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setJobs(data.jobs);
      return data.jobs;
    } catch (error) {
      console.error("Error fetching job recommendations:", error);
      return [];
    }
  }, [searchTerm, filters, selectedResumeId, sortBy, activeFilterCount, fetchJobs]);

  // Main useEffect - handles initial data loading when user is available
  useEffect(() => {
    if (!user) return;
    
    const initializeData = async () => {
      try {
        setLoading(true);
        
        // Fetch initial jobs
        await fetchJobs();
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    };
    
    initializeData();
  }, [user, fetchJobs]);

  // Handle search and filter changes
  useEffect(() => {
    // Skip during initial load
    if (isInitialLoad) return;
    
    let isMounted = true;
    
    // Debounce the API call to avoid too many requests
    const debounceTimeout = setTimeout(async () => {
      setLoading(true);
      await fetchRecommendedJobs();
      if (isMounted) {
        setLoading(false);
      }
    }, 500);
    
    return () => {
      isMounted = false;
      clearTimeout(debounceTimeout);
    };
  }, [searchTerm, filters, selectedResumeId, sortBy, fetchRecommendedJobs, isInitialLoad]);

  // Filter helpers
  const toggleFilter = useCallback((type, value) => {
    setFilters(prev => {
      const current = [...prev[type]];
      const index = current.indexOf(value);
      
      if (index === -1) {
        current.push(value);
      } else {
        current.splice(index, 1);
      }
      
      return { ...prev, [type]: current };
    });
  }, []);

  const clearFilter = useCallback((type) => {
    setFilters(prev => ({ ...prev, [type]: [] }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      jobType: [],
      experienceLevel: [],
      location: [],
    });
    setSearchTerm("");
    setSelectedResumeId("none");
  }, []);

  return (
    <div className="flex flex-col max-w-7xl mx-auto gap-4 md:gap-6 p-4 md:p-6">
      {/* Top search bar */}
      <div className="relative w-full max-w-5xl mx-auto mb-2 md:mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Search jobs by title, company, or keyword" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Left sidebar (filters) - Visible on md and larger */}
        <div className="hidden md:block md:w-1/4 space-y-6">
            <TypographyH2 className="text-lg md:text-xl font-medium mb-4">Filters</TypographyH2>
            {/* Static Filters panel for larger screens */}
            <JobFilterPanel 
              isFilterOpen={true}
              filters={filters}
              toggleFilter={toggleFilter}
              clearFilter={clearFilter}
              clearAllFilters={clearAllFilters}
              setFilters={setFilters}
              resumes={[]}
              selectedResumeId={selectedResumeId}
              setSelectedResumeId={setSelectedResumeId}
            />
        </div>
        
        {/* Main content (job listings) */}
        <div className="w-full md:w-3/4">
          {/* Header with sorting and Mobile Filter Trigger */}
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center gap-3 md:gap-4">
              {/* Mobile Filter Trigger Button */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="outline" size="icon" className="relative">
                    <Menu className="h-5 w-5" />
                     {activeFilterCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px] p-4 overflow-y-auto">
                  <SheetHeader className="mb-4">
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  {/* Filters panel inside the Sheet */}
                   <JobFilterPanel 
                      isFilterOpen={true}
                      filters={filters}
                      toggleFilter={toggleFilter}
                      clearFilter={clearFilter}
                      clearAllFilters={() => {
                        clearAllFilters();
                        setIsMobileMenuOpen(false);
                      }}
                      setFilters={setFilters}
                      resumes={[]}
                      selectedResumeId={selectedResumeId}
                      setSelectedResumeId={setSelectedResumeId}
                    />
                    <SheetClose asChild className="mt-4 w-full">
                       <Button variant="outline">Done</Button>
                    </SheetClose>
                </SheetContent>
              </Sheet>
              
              {/* Showing X Jobs text */}
              <div>
                <TypographyH1 className="text-lg md:text-xl font-bold">
                  {loading && !jobs.length ? (
                    "Loading Jobs..."
                  ) : (
                    `Showing: ${jobs.length} Jobs`
                  )}
                </TypographyH1>
              </div>
            </div>
            
            <SortSelector sortBy={sortBy} setSortBy={setSortBy} />
          </div>
          
          {/* Active filters */}
          <div className="mb-4 md:mb-6">
            <ActiveFilters 
              filters={filters}
              toggleFilter={toggleFilter}
              clearAllFilters={clearAllFilters}
              setFilters={setFilters}
            />
          </div>
          
          {/* Jobs grid */}
          {loading && !jobs.length ? (
            <div className="text-center py-8 md:py-12 border rounded-lg bg-card">
              <TypographyP className="text-muted-foreground">
                Loading jobs...
              </TypographyP>
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              {jobs.map(job => (
                <JobCard 
                  key={job.id} 
                  job={{
                    id: job.id,
                    title: job.title,
                    company: job.company,
                    location: job.location,
                    salary: job.salary,
                    postDate: calculateTimeAgo(job.post_date),
                    type: job.employment_type,
                    experience: job.experience_level,
                    description: job.description
                  }}
                  onApplyClick={() => openApplicationModal(job)}
                  compact={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 md:py-12 border rounded-lg bg-card">
              <TypographyH2 className="text-xl md:text-2xl mb-2">No jobs found</TypographyH2>
              <TypographyP className="text-muted-foreground mb-4 md:mb-6">
                Try adjusting your search or filters to find more opportunities
              </TypographyP>
              <Button 
                variant="outline" 
                onClick={clearAllFilters}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}