import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Building, Clock, MapPin, BarChart, ArrowRight, Github, Linkedin, Globe } from "lucide-react";
import { createJobApplication } from "@/utils/supabase/db/mutations";
import { getApplicationRequiredFields } from "@/utils/supabase/db/queries";

export function JobApplicationModal({ job, open, onOpenChange, resumes = [], userId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState(resumes.length > 0 ? resumes[0].id : "");
  const [selectedResume, setSelectedResume] = useState(null);
  const [feedbackData, setFeedbackData] = useState(null);
  const [requiredFields, setRequiredFields] = useState({
    phone: true,
    resume: true,
    availability: true
  });
  
  const [formData, setFormData] = useState({
    phone: "",
    availability: "immediate",
    experience: "",
    skills: [],
    bio: "",
    socialLinks: {
      linkedin: "",
      github: "",
      portfolio: ""
    }
  });

  // Load required fields configuration
  // useEffect(() => {
  //   const loadRequiredFields = async () => {
  //     try {
  //       const fields = await getApplicationRequiredFields();
  //       setRequiredFields(fields.required);
  //     } catch (error) {
  //       console.error("Error loading required fields:", error);
  //     }
  //   };
    
  //   loadRequiredFields();
  // }, []);

  // Update selected resume when changed
  useEffect(() => {
    if (!selectedResumeId || selectedResumeId === "") {
      setSelectedResume(null);
      setFeedbackData(null);
      return;
    }

    const resume = resumes.find(r => r.id.toString() === selectedResumeId.toString());
    setSelectedResume(resume || null);
    
    // Extract feedback data if available
    if (resume && resume.feedback) {
      setFeedbackData(resume.feedback);
      
      // Pre-populate form with resume data
      const newFormData = { ...formData };
      
      if (resume.feedback.skills) {
        newFormData.skills = resume.feedback.skills;
      }
      
      if (resume.feedback.bio) {
        newFormData.bio = resume.feedback.bio;
      }
      
      if (resume.feedback.experience) {
        newFormData.experience = resume.feedback.experience;
      }
      
      if (resume.feedback.social_links) {
        newFormData.socialLinks = {
          linkedin: resume.feedback.social_links.linkedin || "",
          github: resume.feedback.social_links.github || "",
          portfolio: resume.feedback.social_links.portfolio || ""
        };
      }
      
      setFormData(newFormData);
    }
  }, [selectedResumeId, resumes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSocialLinkChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };
  
  const handleSkillsChange = (e) => {
    const skillsText = e.target.value;
    // Convert comma-separated string to array
    const skillsArray = skillsText ? 
      skillsText.split(',').map(skill => skill.trim()).filter(Boolean) : 
      [];
    
    setFormData(prev => ({
      ...prev,
      skills: skillsArray
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (requiredFields.resume && !selectedResumeId) {
      alert("Please select a resume to apply");
      return;
    }
    
    if (requiredFields.phone && !formData.phone) {
      alert("Please provide a phone number");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format skills for submission if provided as string
      const skillsToSubmit = 
        typeof formData.skills === 'string' ? 
        formData.skills.split(',').map(s => s.trim()).filter(Boolean) : 
        formData.skills;
      
      // Create application using the mutation function
      await createJobApplication({
        jobId: job.id,
        userId: userId,
        resumeId: selectedResumeId || null,
        coverLetter: formData.coverLetter || "",
        phone: formData.phone,
        availability: formData.availability,
        skills: skillsToSubmit,
        experience: formData.experience,
        socialLinks: formData.socialLinks,
        bio: formData.bio
      });
      
      // Close modal and show success
      onOpenChange(false);
      alert("Your application has been submitted successfully!");
      
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("There was an error submitting your application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format skills array to comma-separated string for input display
  const skillsAsString = Array.isArray(formData.skills) ? formData.skills.join(', ') : formData.skills;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-[#f5eed9]/95 job-application-context"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#5c4b23]">Apply for Position</DialogTitle>
          <DialogDescription className="text-[#7a673c]">
            Complete the form below to apply for this position
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Job Summary */}
          <div className="space-y-3 rounded-lg pb-4">
            <h3 className="text-xl font-semibold text-[#5c4b23]">{job.title}</h3>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#7a673c]">
              <div className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
              {job.salary && (
                <div className="font-medium">
                  {job.salary}
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {job.type && (
                <Badge variant="outline" className="bg-[#e8dfbe] text-[#5c4b23] font-normal border-[#c2b795]">
                  {job.type}
                </Badge>
              )}
              {job.experience && (
                <Badge variant="outline" className="bg-[#e8dfbe] text-[#5c4b23] font-normal border-[#c2b795]">
                  {job.experience}
                </Badge>
              )}
              {job.postDate && (
                <Badge variant="outline" className="text-xs text-[#7a673c] bg-transparent border-[#c2b795]">
                  {job.postDate}
                </Badge>
              )}
            </div>
          </div>
          
          {/* Job Description */}
          {job.description && (
            <div className="space-y-2">
              <Label className="text-sm text-[#7a673c] font-medium">Job Description</Label>
              <div className="max-h-[100px] overflow-y-auto p-3 bg-[#e8dfbe]/60 rounded-md border border-[#c2b795] text-[#5c4b23]">
                {job.description}
              </div>
            </div>
          )}
          
          {/* Resume selection */}
          <div className="space-y-2 pt-2">
            <Label htmlFor="resume" className="text-[#5c4b23] font-medium">
              Select Resume {requiredFields.resume && <span className="text-red-500">*</span>}
            </Label>
            {resumes.length > 0 ? (
              <Select 
                value={selectedResumeId} 
                onValueChange={(value) => setSelectedResumeId(value)}
                required={requiredFields.resume}
              >
                <SelectTrigger id="resume" className="bg-[#e8dfbe]/60 border-[#c2b795] text-[#5c4b23]">
                  <SelectValue placeholder="Select a resume" />
                </SelectTrigger>
                <SelectContent className="bg-[#f5eed9] border-[#c2b795]">
                  <SelectItem value="none" className="text-[#7a673c]">None (enter details manually)</SelectItem>
                  {resumes.map(resume => (
                    <SelectItem key={resume.id} value={resume.id.toString()} className="text-[#5c4b23]">
                      {resume.title || resume.file_name || "Untitled Resume"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-sm text-[#7a673c] border border-[#c2b795] p-3 rounded-md bg-[#e8dfbe]/30">
                You don't have any resumes uploaded. Please enter your details manually below.
              </div>
            )}
          </div>
          
          {/* Phone number */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-[#5c4b23] font-medium">
              Phone Number {requiredFields.phone && <span className="text-red-500">*</span>}
            </Label>
            <Input 
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              type="tel"
              required={requiredFields.phone}
              className="bg-[#e8dfbe]/60 border-[#c2b795] text-[#5c4b23]"
            />
          </div>
          
          {/* Availability */}
          <div className="space-y-2">
            <Label htmlFor="availability" className="text-[#5c4b23] font-medium">
              Availability {requiredFields.availability && <span className="text-red-500">*</span>}
            </Label>
            <Select 
              value={formData.availability} 
              onValueChange={(value) => handleSelectChange("availability", value)}
              required={requiredFields.availability}
            >
              <SelectTrigger id="availability" className="bg-[#e8dfbe]/60 border-[#c2b795] text-[#5c4b23]">
                <SelectValue placeholder="When can you start?" />
              </SelectTrigger>
              <SelectContent className="bg-[#f5eed9] border-[#c2b795]">
                <SelectItem value="immediate" className="text-[#5c4b23]">Immediately</SelectItem>
                <SelectItem value="two_weeks" className="text-[#5c4b23]">2 weeks notice</SelectItem>
                <SelectItem value="month" className="text-[#5c4b23]">1 month notice</SelectItem>
                <SelectItem value="custom" className="text-[#5c4b23]">Other (specify in cover letter)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Skills */}
          <div className="space-y-2">
            <Label htmlFor="skills" className="text-[#5c4b23] font-medium">
              Skills {requiredFields.skills && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="skills"
              name="skills"
              value={skillsAsString}
              onChange={handleSkillsChange}
              placeholder="Enter skills separated by commas (e.g., JavaScript, React, CSS)"
              required={requiredFields.skills}
              className="bg-[#e8dfbe]/60 border-[#c2b795] text-[#5c4b23]"
            />
          </div>

          {/* Relevant experience */}
          <div className="space-y-2">
            <Label htmlFor="experience" className="text-[#5c4b23] font-medium">
              Relevant Experience {requiredFields.experience && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="E.g., 3 years in software development"
              required={requiredFields.experience}
              className="bg-[#e8dfbe]/60 border-[#c2b795] text-[#5c4b23]"
            />
          </div>
          
          {/* Social Links */}
          <div className="space-y-3">
            <Label className="text-[#5c4b23] font-medium">
              Social Links {requiredFields.socialLinks && <span className="text-red-500">*</span>}
            </Label>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Linkedin className="h-5 w-5 text-[#5c4b23]" />
                <Input
                  placeholder="LinkedIn profile URL"
                  value={formData.socialLinks.linkedin}
                  onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                  className="bg-[#e8dfbe]/60 border-[#c2b795] text-[#5c4b23]"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Github className="h-5 w-5 text-[#5c4b23]" />
                <Input
                  placeholder="GitHub profile URL"
                  value={formData.socialLinks.github}
                  onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                  className="bg-[#e8dfbe]/60 border-[#c2b795] text-[#5c4b23]"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#5c4b23]" />
                <Input
                  placeholder="Portfolio website URL"
                  value={formData.socialLinks.portfolio}
                  onChange={(e) => handleSocialLinkChange('portfolio', e.target.value)}
                  className="bg-[#e8dfbe]/60 border-[#c2b795] text-[#5c4b23]"
                />
              </div>
            </div>
          </div>
          
          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-[#5c4b23] font-medium">
              Bio {requiredFields.bio && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="A brief introduction about yourself..."
              required={requiredFields.bio}
              className="min-h-[80px] bg-[#e8dfbe]/60 border-[#c2b795] text-[#5c4b23]"
            />
          </div>
          
          {/* Cover letter */}
          <div className="space-y-2">
            <Label htmlFor="coverLetter" className="text-[#5c4b23] font-medium">Cover Letter (optional)</Label>
            <Textarea
              id="coverLetter"
              name="coverLetter" 
              value={formData.coverLetter || ""}
              onChange={handleChange}
              placeholder="Tell the employer why you're a great fit for this role..."
              className="min-h-[120px] bg-[#e8dfbe]/60 border-[#c2b795] text-[#5c4b23]"
            />
          </div>
          
          <DialogFooter className="pt-5">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              type="button"
              disabled={isSubmitting}
              className="border-[#c2b795] text-[#7a673c] hover:text-[#5c4b23] hover:bg-[#e8dfbe]/60"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="gap-1 bg-[#a89e82] text-white hover:bg-[#7a673c]"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 