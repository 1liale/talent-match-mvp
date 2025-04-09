"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  TypographyH1, 
  TypographyH2,
  TypographyLead,
  TypographyP 
} from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";
import { JobCard } from "@/components/base/card";
import { Search, Briefcase, MapPin, Filter, ChevronDown, X } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { createClient } from "@/utils/supabase/client";

// Mock data for jobs - would be replaced with real API call
const mockJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "Remote, Worldwide",
    salary: "$120,000 - $150,000",
    matchScore: 95,
    postDate: "2 days ago",
    logo: "/company-logos/techcorp.png",
    type: "Full-time",
    experience: "5+ years"
  },
  {
    id: 2,
    title: "Full Stack Engineer",
    company: "Global Systems",
    location: "San Francisco, CA",
    salary: "$130,000 - $160,000",
    matchScore: 87,
    postDate: "5 days ago",
    logo: "/company-logos/globalsys.png",
    type: "Full-time",
    experience: "3-5 years"
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "InnovateTech",
    location: "New York, NY",
    salary: "$90,000 - $110,000",
    matchScore: 82,
    postDate: "1 week ago",
    logo: "/company-logos/innovatetech.png",
    type: "Contract",
    experience: "2+ years"
  },
  {
    id: 4,
    title: "Backend Developer",
    company: "DataFlow Systems",
    location: "Remote, US Only",
    salary: "$110,000 - $140,000",
    matchScore: 91,
    postDate: "3 days ago",
    logo: "/company-logos/dataflow.png",
    type: "Full-time",
    experience: "4+ years"
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudTech Solutions",
    location: "Seattle, WA",
    salary: "$125,000 - $155,000",
    matchScore: 89,
    postDate: "6 days ago",
    logo: "/company-logos/cloudtech.png",
    type: "Full-time",
    experience: "3+ years"
  },
  {
    id: 6,
    title: "React Native Developer",
    company: "Mobile Innovations",
    location: "Austin, TX",
    salary: "$100,000 - $130,000",
    matchScore: 94,
    postDate: "4 days ago",
    logo: "/company-logos/mobileinno.png",
    type: "Contract",
    experience: "2-4 years"
  },
  {
    id: 7,
    title: "Product Designer",
    company: "CreativeWorks",
    location: "Los Angeles, CA",
    salary: "$95,000 - $120,000",
    matchScore: 86,
    postDate: "1 week ago",
    logo: "/company-logos/creativeworks.png",
    type: "Part-time",
    experience: "1-3 years"
  },
  {
    id: 8,
    title: "Machine Learning Engineer",
    company: "AI Innovations",
    location: "Remote, Worldwide",
    salary: "$140,000 - $180,000",
    matchScore: 90,
    postDate: "3 days ago",
    logo: "/company-logos/aiinnovations.png",
    type: "Full-time",
    experience: "5+ years"
  },
];

// Job types and experience levels for filters
const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];
const experienceLevels = ["Entry level", "1-3 years", "3-5 years", "5+ years"];
const locations = ["Remote", "San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX", "Los Angeles, CA"];

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    jobType: [],
    experienceLevel: [],
    location: [],
    minimumMatchScore: 70,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);

  // Apply filters and search
  useEffect(() => {
    let results = [...mockJobs];
    
    // Apply search term
    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter(job => 
        job.title.toLowerCase().includes(searchLower) || 
        job.company.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply job type filter
    if (filters.jobType.length > 0) {
      results = results.filter(job => filters.jobType.includes(job.type));
    }
    
    // Apply experience level filter
    if (filters.experienceLevel.length > 0) {
      results = results.filter(job => 
        filters.experienceLevel.some(level => job.experience.includes(level))
      );
    }
    
    // Apply location filter
    if (filters.location.length > 0) {
      results = results.filter(job => 
        filters.location.some(loc => job.location.includes(loc))
      );
    }
    
    // Apply match score filter
    results = results.filter(job => job.matchScore >= filters.minimumMatchScore);
    
    // Sort by match score (highest first)
    results.sort((a, b) => b.matchScore - a.matchScore);
    
    setFilteredJobs(results);
  }, [searchTerm, filters]);

  // Toggle filter for multi-select options
  const toggleFilter = (type, value) => {
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
  };

  // Clear a specific filter
  const clearFilter = (type) => {
    setFilters(prev => ({ ...prev, [type]: [] }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      jobType: [],
      experienceLevel: [],
      location: [],
      minimumMatchScore: 70,
    });
    setSearchTerm("");
  };

  // Count total active filters
  const activeFilterCount = 
    filters.jobType.length + 
    filters.experienceLevel.length + 
    filters.location.length + 
    (filters.minimumMatchScore > 70 ? 1 : 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <TypographyH1 className="mb-2">Find Your Perfect Job</TypographyH1>
        <TypographyLead>
          Browse and apply to jobs that match your skills and interests
        </TypographyLead>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search bar */}
        <div className="flex gap-3 flex-wrap md:flex-nowrap">
          <div className="relative flex-1 min-w-[70%] md:min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search jobs by title, company, or keyword" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button 
            variant="outline" 
            className="gap-2 relative" 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        {/* Filters panel */}
        {isFilterOpen && (
          <Card className="p-4">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Job Type Filter */}
                <div>
                  <div className="flex justify-between mb-2">
                    <TypographyP className="font-medium">Job Type</TypographyP>
                    {filters.jobType.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={() => clearFilter('jobType')} className="h-6 px-2">
                        Clear
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {jobTypes.map(type => (
                      <div key={type} className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id={`type-${type}`} 
                          checked={filters.jobType.includes(type)}
                          onChange={() => toggleFilter('jobType', type)}
                          className="rounded"
                        />
                        <label htmlFor={`type-${type}`} className="text-sm cursor-pointer">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experience Level Filter */}
                <div>
                  <div className="flex justify-between mb-2">
                    <TypographyP className="font-medium">Experience</TypographyP>
                    {filters.experienceLevel.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={() => clearFilter('experienceLevel')} className="h-6 px-2">
                        Clear
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {experienceLevels.map(level => (
                      <div key={level} className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id={`exp-${level}`} 
                          checked={filters.experienceLevel.includes(level)}
                          onChange={() => toggleFilter('experienceLevel', level)}
                          className="rounded"
                        />
                        <label htmlFor={`exp-${level}`} className="text-sm cursor-pointer">
                          {level}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location Filter */}
                <div>
                  <div className="flex justify-between mb-2">
                    <TypographyP className="font-medium">Location</TypographyP>
                    {filters.location.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={() => clearFilter('location')} className="h-6 px-2">
                        Clear
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {locations.map(loc => (
                      <div key={loc} className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id={`loc-${loc}`} 
                          checked={filters.location.includes(loc)}
                          onChange={() => toggleFilter('location', loc)}
                          className="rounded"
                        />
                        <label htmlFor={`loc-${loc}`} className="text-sm cursor-pointer">
                          {loc}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Match Score Slider */}
              <div className="mt-6">
                <div className="flex justify-between mb-2">
                  <TypographyP className="font-medium">Minimum Match Score</TypographyP>
                  {filters.minimumMatchScore > 70 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setFilters(prev => ({ ...prev, minimumMatchScore: 70 }))}
                      className="h-6 px-2"
                    >
                      Reset
                    </Button>
                  )}
                </div>
                <div className="px-2">
                  <Slider 
                    defaultValue={[70]} 
                    max={100} 
                    min={0}
                    step={5}
                    value={[filters.minimumMatchScore]}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, minimumMatchScore: value[0] }))}
                    className="my-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0%</span>
                    <span>{filters.minimumMatchScore}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* Filter actions */}
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline" onClick={clearAllFilters}>Clear All</Button>
                <Button onClick={() => setIsFilterOpen(false)}>Apply Filters</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active filters display */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            
            {filters.jobType.map(type => (
              <Badge key={`badge-${type}`} variant="secondary" className="gap-1 px-2 py-1">
                {type}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => toggleFilter('jobType', type)}
                />
              </Badge>
            ))}
            
            {filters.experienceLevel.map(level => (
              <Badge key={`badge-${level}`} variant="secondary" className="gap-1 px-2 py-1">
                {level}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => toggleFilter('experienceLevel', level)}
                />
              </Badge>
            ))}
            
            {filters.location.map(loc => (
              <Badge key={`badge-${loc}`} variant="secondary" className="gap-1 px-2 py-1">
                {loc}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => toggleFilter('location', loc)}
                />
              </Badge>
            ))}
            
            {filters.minimumMatchScore > 70 && (
              <Badge variant="secondary" className="gap-1 px-2 py-1">
                {`Match ≥ ${filters.minimumMatchScore}%`}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setFilters(prev => ({ ...prev, minimumMatchScore: 70 }))}
                />
              </Badge>
            )}
            
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-7">
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="mb-6">
        <TypographyP className="text-muted-foreground">
          Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
          {searchTerm && ` for "${searchTerm}"`}
        </TypographyP>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              applyUrl={`/dashboard/jobs/${job.id}`}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <TypographyH2 className="text-2xl mb-2">No jobs found</TypographyH2>
          <TypographyP className="text-muted-foreground">
            Try adjusting your search or filters to find more opportunities
          </TypographyP>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={clearAllFilters}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
} 