import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { PrimaryBadge } from "@/components/base/badge";
import { TypographyP } from "@/components/ui/typography";
import { Filter, Search, X, ExternalLink, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Job types and experience levels for filters
export const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];
export const experienceLevels = ["Entry level", "Junior", "Mid-level", "Senior", "Lead", "Executive"];
export const locations = ["Remote", "San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX", "Los Angeles, CA"];

/**
 * Search bar component with filter toggle
 */
export const JobSearch = ({
  searchTerm,
  setSearchTerm,
  isFilterOpen,
  setIsFilterOpen,
  activeFilterCount = 0
}) => {
  return (
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
  );
};

/**
 * Resume selector component
 */
export const ResumeSelector = ({
  resumes,
  selectedResumeId,
  setSelectedResumeId
}) => {
  
  if (!resumes || resumes.length === 0) {
    return (
      <div className="mb-2">
        <Select value={selectedResumeId || "none"} onValueChange={setSelectedResumeId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a resume" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None (default)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground mt-2">
          No resumes found. Create a resume to enable matching.
        </p>
      </div>
    );
  }
  
  const handleViewResume = () => {
    if (!selectedResumeId || selectedResumeId === "none") return;
    
    const selectedResume = resumes.find(resume => resume.id.toString() === selectedResumeId.toString());
    
    if (selectedResume && selectedResume.file_url) {
      window.open(selectedResume.file_url, '_blank');
    } 
  };
  
  return (
    <div className="mb-2">
      <div className="flex items-center gap-2">
        {/* <div className="flex-1"> */}
          <Select value={selectedResumeId || "none"} onValueChange={setSelectedResumeId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a resume" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None (default)</SelectItem>
              {resumes.map(resume => (
                <SelectItem key={resume.id} value={resume.id.toString()}>
                  {resume.title || resume.file_name || "Untitled Resume"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        {/* </div> */}
        {selectedResumeId && selectedResumeId !== "none" && (
          <Button 
            variant="outline" 
            size="icon"
            className="h-9 w-9"
            onClick={handleViewResume}
            title="View resume in new tab"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

/**
 * Filter panel component
 */
export const JobFilterPanel = ({
  isFilterOpen,
  filters,
  toggleFilter,
  clearFilter,
  clearAllFilters,
  setFilters,
  resumes,
  selectedResumeId,
  setSelectedResumeId
}) => {
  if (!isFilterOpen) return null;

  return (
    <div className="space-y-6">
      {/* Resume Selector */}
      <div>
        <TypographyP className="font-medium mb-3">Resume</TypographyP>
        <ResumeSelector
          resumes={resumes}
          selectedResumeId={selectedResumeId}
          setSelectedResumeId={setSelectedResumeId}
        />
      </div>

      {/* Job Type Filter */}
      <div>
        <TypographyP className="font-medium mb-3">Job Type</TypographyP>
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
        <TypographyP className="font-medium mb-3">Experience</TypographyP>
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
        <TypographyP className="font-medium mb-3">Location</TypographyP>
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

      {/* Filter actions */}
      <div className="pt-2">
        <Button variant="outline" onClick={clearAllFilters} className="w-full">
          Clear All Filters
        </Button>
      </div>
    </div>
  );
};

/**
 * Active filters display
 */
export const ActiveFilters = ({
  filters,
  toggleFilter,
  clearAllFilters,
  setFilters
}) => {
  // Count total active filters
  const activeFilterCount = 
    filters.jobType.length + 
    filters.experienceLevel.length + 
    filters.location.length;
    
  if (activeFilterCount === 0) return null;
  
  // Create a consolidated array of all active filters with their type
  const activeFilters = [
    ...filters.jobType.map(value => ({ type: 'jobType', value })),
    ...filters.experienceLevel.map(value => ({ type: 'experienceLevel', value })),
    ...filters.location.map(value => ({ type: 'location', value }))
  ];
  
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm text-muted-foreground">Active filters:</span>
      
      {activeFilters.map((filter, index) => (
        <PrimaryBadge key={`filter-${index}`} className="gap-1 px-2 py-1">
          {filter.value}
        </PrimaryBadge>
      ))}
      
      <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-7">
        Clear all
      </Button>
    </div>
  );
};

/**
 * Sort selector component
 */
export const SortSelector = ({ sortBy, setSortBy }) => {
  return (
    <div className="flex items-center gap-2 ml-auto">
      <span className="text-sm text-muted-foreground">Sort by:</span>
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recommended">Recommended</SelectItem>
          <SelectItem value="newest">Newest</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}; 