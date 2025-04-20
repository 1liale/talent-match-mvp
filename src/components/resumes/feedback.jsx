import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { 
  TypographyH3, 
  TypographyP, 
  TypographySmall 
} from "@/components/ui/typography";
import { Star, CheckCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const FeedbackArea = ({ feedback }) => {
  if (!feedback) return null;
  
  const renderScoreColor = (score) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Resume Feedback</span>
          <div className={`flex items-center gap-1 ${renderScoreColor(feedback.overallScore)}`}>
            <Star className="h-4 w-4 fill-current" />
            <span>{feedback.overallScore}/10</span>
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

export default FeedbackArea; 