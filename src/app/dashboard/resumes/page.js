"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TypographyH1, 
  TypographyH2, 
  TypographyH3, 
  TypographyP, 
  TypographyLead,
  TypographySmall
} from "@/components/ui/typography";
import { useAuth } from "@/context/auth-context";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { 
  Upload, 
  ArrowRight, 
  Trash2, 
  File, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Star,
  ArrowUpRight,
  Download
} from "lucide-react";

// File Upload Component
const FileUploadArea = ({ onFileSelected, isUploading }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) validateAndUpload(file);
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) validateAndUpload(file);
  };
  
  const validateAndUpload = (file) => {
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit. Please choose a smaller file.");
      return;
    }
    
    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please use PDF or Word (.docx) format.");
      return;
    }
    
    onFileSelected(file);
  };
  
  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
      }`}
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden" 
        accept=".pdf,.doc,.docx" 
        disabled={isUploading}
      />
      
      <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
      
      <TypographyH3 className="mb-2">Upload your resume</TypographyH3>
      
      <TypographyP className="text-muted-foreground mb-4">
        Drag and drop your file here, or click to browse
      </TypographyP>
      
      <TypographySmall className="text-muted-foreground">
        Supported formats: PDF, DOC, DOCX (max 5MB)
      </TypographySmall>
      
      {isUploading && (
        <div className="mt-4">
          <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '100%' }}></div>
          </div>
          <TypographySmall className="text-muted-foreground mt-2">
            Uploading and processing...
          </TypographySmall>
        </div>
      )}
    </div>
  );
};

// Resume Card Component
const ResumeCard = ({ resume, onDelete, onReview, isReviewing }) => {
  const fileTypeIcon = resume.fileType === 'pdf' ? (
    <FileText className="h-6 w-6 text-red-500" />
  ) : (
    <FileText className="h-6 w-6 text-blue-500" />
  );
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-gray-100 rounded-md">
            {fileTypeIcon}
          </div>
          
          <div className="flex-1 min-w-0">
            <TypographyH3 className="text-base font-medium truncate" title={resume.name}>
              {resume.name}
            </TypographyH3>
            <div className="flex items-center gap-2 mt-1">
              <TypographySmall className="text-muted-foreground">
                Uploaded {formatDate(resume.uploadedAt)}
              </TypographySmall>
              <span className="text-muted-foreground">•</span>
              <TypographySmall className="text-muted-foreground">
                {resume.size}
              </TypographySmall>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => window.open(resume.url, '_blank')}
              title="Download"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-destructive hover:text-destructive" 
              onClick={() => onDelete(resume.id)}
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div>
            {resume.reviewed ? (
              <Badge variant="secondary" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Reviewed
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                Not Reviewed
              </Badge>
            )}
          </div>
          
          <Button 
            size="sm"
            variant={resume.reviewed ? "outline" : "default"}
            onClick={() => onReview(resume)}
            disabled={isReviewing}
          >
            {isReviewing ? 'Analyzing...' : (resume.reviewed ? 'View Feedback' : 'Get AI Feedback')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// AI Feedback Component
const AIFeedback = ({ feedback }) => {
  if (!feedback) return null;
  
  const renderScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Resume Feedback</span>
          <div className={`flex items-center gap-1 ${renderScoreColor(feedback.overallScore)}`}>
            <Star className="h-4 w-4 fill-current" />
            <span>{feedback.overallScore}/100</span>
          </div>
        </CardTitle>
        <CardDescription>
          AI-powered analysis of your resume
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Strengths */}
        <div>
          <TypographyH3 className="text-sm font-medium mb-2 text-green-600">Strengths</TypographyH3>
          <ul className="space-y-2">
            {feedback.strengths.map((strength, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Areas for Improvement */}
        <div>
          <TypographyH3 className="text-sm font-medium mb-2 text-amber-600">Areas for Improvement</TypographyH3>
          <ul className="space-y-2">
            {feedback.improvements.map((improvement, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Extracted Information */}
        <div>
          <TypographyH3 className="text-sm font-medium mb-2">Key Information Extracted</TypographyH3>
          <div className="space-y-3">
            {feedback.skills.length > 0 && (
              <div>
                <TypographySmall className="font-medium">Skills</TypographySmall>
                <div className="flex flex-wrap gap-1 mt-1">
                  {feedback.skills.map((skill, i) => (
                    <Badge key={i} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {feedback.experience.length > 0 && (
              <div>
                <TypographySmall className="font-medium">Experience</TypographySmall>
                <ul className="mt-1 space-y-1">
                  {feedback.experience.map((exp, i) => (
                    <li key={i} className="text-sm">{exp}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {feedback.education.length > 0 && (
              <div>
                <TypographySmall className="font-medium">Education</TypographySmall>
                <ul className="mt-1 space-y-1">
                  {feedback.education.map((edu, i) => (
                    <li key={i} className="text-sm">{edu}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {/* Recommendations */}
        <div>
          <TypographyH3 className="text-sm font-medium mb-2 text-primary">Recommendations</TypographyH3>
          <TypographyP className="text-sm">{feedback.recommendations}</TypographyP>
        </div>
      </CardContent>
    </Card>
  );
};

// Mock data for demonstration purposes
const mockResumes = [
  {
    id: '1',
    name: 'Professional_Resume_2023.pdf',
    url: '#',
    fileType: 'pdf',
    size: '420 KB',
    uploadedAt: '2023-10-15T14:32:10Z',
    reviewed: true
  },
  {
    id: '2',
    name: 'Technical_CV_Frontend.docx',
    url: '#',
    fileType: 'docx',
    size: '380 KB',
    uploadedAt: '2023-08-22T09:14:27Z',
    reviewed: false
  }
];

// Mock AI feedback data
const mockFeedback = {
  overallScore: 78,
  strengths: [
    "Clear and concise work experience descriptions",
    "Good use of action verbs and quantifiable achievements",
    "Well-organized information and consistent formatting",
    "Includes relevant technical skills that match industry needs"
  ],
  improvements: [
    "Resume lacks a strong professional summary",
    "Some technical skills could be organized by proficiency level",
    "Employment gaps not addressed",
    "Consider adding links to portfolio or relevant projects"
  ],
  skills: [
    "React", "JavaScript", "TypeScript", "HTML/CSS", "Node.js", "Express", 
    "GraphQL", "REST APIs", "Tailwind CSS", "Git", "Agile/Scrum"
  ],
  experience: [
    "Frontend Developer at TechCorp (2020-2023)",
    "Web Developer at Digital Solutions (2018-2020)",
    "Junior Developer at StartupXYZ (2017-2018)"
  ],
  education: [
    "B.S. Computer Science, University of Technology (2013-2017)"
  ],
  recommendations: 
    "Focus on adding a compelling professional summary highlighting your unique value proposition. Consider restructuring your skills section to showcase proficiency levels. Add links to relevant projects or your portfolio to provide concrete examples of your work."
};

export default function ResumesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  
  const [resumes, setResumes] = useState(mockResumes);
  const [selectedResume, setSelectedResume] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  // Handle file upload
  const handleFileUpload = async (file) => {
    if (!user) {
      toast.error("Please sign in to upload your resume");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // In a real implementation, this would upload to Supabase storage
      // const fileName = `${Date.now()}_${file.name}`;
      // const filePath = `${user.id}/${fileName}`;
      // 
      // const { data, error } = await supabase.storage
      //   .from('resumes')
      //   .upload(filePath, file, {
      //     cacheControl: '3600',
      //     upsert: false
      //   });
      // 
      // if (error) throw error;
      // 
      // const { data: urlData } = supabase.storage
      //   .from('resumes')
      //   .getPublicUrl(filePath);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a new resume object (mock implementation)
      const newResume = {
        id: String(Date.now()),
        name: file.name,
        url: URL.createObjectURL(file),
        fileType: file.name.split('.').pop().toLowerCase(),
        size: `${Math.round(file.size / 1024)} KB`,
        uploadedAt: new Date().toISOString(),
        reviewed: false
      };
      
      setResumes(prev => [newResume, ...prev]);
      toast.success("Resume uploaded successfully");
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error("Failed to upload resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  
  // Handle resume deletion
  const handleDeleteResume = async (resumeId) => {
    try {
      // In a real implementation, delete from Supabase storage
      // const resumeToDelete = resumes.find(r => r.id === resumeId);
      // 
      // if (resumeToDelete) {
      //   // Parse the file path from the URL
      //   const { error } = await supabase.storage
      //     .from('resumes')
      //     .remove([`${user.id}/${resumeToDelete.name}`]);
      //   
      //   if (error) throw error;
      // }
      
      // Update state
      setResumes(prev => prev.filter(resume => resume.id !== resumeId));
      
      // Clear feedback if the deleted resume was selected
      if (selectedResume && selectedResume.id === resumeId) {
        setSelectedResume(null);
        setFeedback(null);
      }
      
      toast.success("Resume deleted successfully");
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast.error("Failed to delete resume. Please try again.");
    }
  };
  
  // Get AI review for resume
  const handleReviewResume = async (resume) => {
    setSelectedResume(resume);
    
    if (resume.reviewed) {
      // If already reviewed, just show the existing feedback
      setFeedback(mockFeedback);
      return;
    }
    
    setIsReviewing(true);
    
    try {
      // In a real implementation, this would call the Cohere rerank API
      // const resumeText = await extractTextFromResume(resume.url);
      // 
      // const response = await fetch('/api/analyze-resume', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ resumeText }),
      // });
      // 
      // if (!response.ok) throw new Error('Failed to analyze resume');
      // const feedbackData = await response.json();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Use mock feedback for demonstration
      setFeedback(mockFeedback);
      
      // Mark resume as reviewed
      setResumes(prev => 
        prev.map(r => 
          r.id === resume.id ? { ...r, reviewed: true } : r
        )
      );
      
      toast.success("Resume analysis complete");
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast.error("Failed to analyze resume. Please try again.");
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <TypographyH1 className="mb-2">Manage Your Resumes</TypographyH1>
        <TypographyLead>
          Upload, analyze, and improve your resume with AI-powered feedback
        </TypographyLead>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column: Upload and resumes list */}
        <div className="space-y-6">
          {/* Upload area */}
          <FileUploadArea 
            onFileSelected={handleFileUpload}
            isUploading={isUploading}
          />
          
          {/* Resumes list */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <TypographyH2 className="text-xl">Your Resumes</TypographyH2>
              <TypographySmall className="text-muted-foreground">
                {resumes.length} {resumes.length === 1 ? 'resume' : 'resumes'}
              </TypographySmall>
            </div>
            
            {resumes.length > 0 ? (
              <div className="space-y-4">
                {resumes.map(resume => (
                  <ResumeCard 
                    key={resume.id} 
                    resume={resume}
                    onDelete={handleDeleteResume}
                    onReview={handleReviewResume}
                    isReviewing={isReviewing && selectedResume?.id === resume.id}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <TypographyH3 className="text-lg mb-2">No resumes yet</TypographyH3>
                <TypographyP className="text-muted-foreground mb-4">
                  Upload your first resume to get AI-powered feedback
                </TypographyP>
              </Card>
            )}
          </div>
        </div>
        
        {/* Right column: AI feedback */}
        <div>
          {selectedResume ? (
            <AIFeedback feedback={feedback} />
          ) : (
            <Card className="p-8 h-full flex flex-col items-center justify-center text-center border-dashed">
              <ArrowUpRight className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <TypographyH3 className="text-lg mb-2">Select a resume for feedback</TypographyH3>
              <TypographyP className="text-muted-foreground max-w-md">
                Choose one of your resumes to get detailed AI analysis and improvement suggestions
              </TypographyP>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 