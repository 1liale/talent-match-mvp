import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Star, Briefcase, Clock, User } from "lucide-react";
import { TypographyH3, TypographyP } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

// Primary Cards
const PrimaryCardLarge = ({ icon, title, description, className, ...props }) => {
  return (
    <Card className={cn("rounded-xl hover:shadow-primary transition-shadow duration-300 group", className)} {...props}>
      <CardContent className="p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
            {icon}
          </div>
        </div>
        <CardTitle className="text-xl mb-3 text-center">{title}</CardTitle>
        <CardDescription className="leading-relaxed text-center">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

const PrimaryCardMedium = ({ icon, title, description, className, ...props }) => {
  return (
    <Card className={cn("rounded-xl hover:shadow-sm transition-shadow duration-300 group", className)} {...props}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription className="leading-relaxed">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

const PrimaryCardSmall = ({ icon, title, className, ...props }) => {
  return (
    <Card className={cn("rounded-xl hover:shadow-sm transition-shadow duration-300 group", className)} {...props}>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
          {icon}
        </div>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardContent>
    </Card>
  );
};

/**
 * Status badge component for applications
 */
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

/**
 * Match score component
 */
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

/**
 * StatsCard component for displaying numerical stats with icons
 */
const StatsCard = ({ 
  icon, 
  label, 
  value, 
  note, 
  noteColor = "text-green-600", 
  className, 
  ...props 
}) => {
  return (
    <Card className={cn("p-4", className)} {...props}>
      <div className="flex justify-between items-start">
        <div>
          <TypographyP className="text-sm text-muted-foreground mb-1">{label}</TypographyP>
          <TypographyH3 className="text-2xl font-bold">{value}</TypographyH3>
        </div>
        <div className="bg-primary/10 p-2 rounded-lg">
          {icon}
        </div>
      </div>
      {note && (
        <TypographyP className={cn("text-xs mt-2", noteColor)}>{note}</TypographyP>
      )}
    </Card>
  );
};

/**
 * Application card component for displaying job applications
 */
const ApplicationCard = ({ 
  application, 
  detailsUrl, 
  className, 
  ...props 
}) => {
  const { id, company, position, status, logo, matchScore, date } = application;
  
  return (
    <Card key={id} className={cn("p-5 hover:shadow-md transition-shadow", className)} {...props}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
            {logo ? (
              <Image src={logo} alt={company} width={30} height={30} />
            ) : (
              <Building className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <div>
            <TypographyH3 className="font-medium">{position}</TypographyH3>
            <TypographyP className="text-sm text-muted-foreground">{company}</TypographyP>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <StatusBadge status={status} />
        <TypographyP className="text-xs text-muted-foreground">{date}</TypographyP>
      </div>
      
      <div className="flex justify-between items-center">
        <MatchScore score={matchScore} />
        <Button variant="ghost" size="sm" asChild>
          <Link href={detailsUrl || `/applications/${id}`}>
            Details
          </Link>
        </Button>
      </div>
    </Card>
  );
};

/**
 * Job card component for displaying job listings
 */
const JobCard = ({ 
  job, 
  applyUrl, 
  className, 
  ...props 
}) => {
  const { id, title, company, location, salary, matchScore, postDate, logo } = job;
  
  return (
    <Card key={id} className={cn("p-5 hover:shadow-md transition-shadow", className)} {...props}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
            {logo ? (
              <Image src={logo} alt={company} width={30} height={30} />
            ) : (
              <Building className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <div>
            <TypographyH3 className="font-medium">{title}</TypographyH3>
            <TypographyP className="text-sm text-muted-foreground">{company}</TypographyP>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-2 mb-3">
        <TypographyP className="text-sm flex items-center gap-1">
          <Briefcase className="h-4 w-4 text-muted-foreground" />
          {location}
        </TypographyP>
        <TypographyP className="text-sm flex items-center gap-1">
          <Clock className="h-4 w-4 text-muted-foreground" />
          {postDate}
        </TypographyP>
      </div>
      
      <div className="flex justify-between items-center">
        <MatchScore score={matchScore} />
        <Button variant="primary" size="sm" asChild>
          <Link href={applyUrl || `/jobs/${id}`}>
            Apply Now
          </Link>
        </Button>
      </div>
    </Card>
  );
};

/**
 * Candidate card component for displaying candidate profiles
 */
const CandidateCard = ({ 
  candidate, 
  profileUrl, 
  className, 
  ...props 
}) => {
  const { id, name, position, location, experience, skills, matchScore, avatar } = candidate;
  
  return (
    <Card key={id} className={cn("p-5 hover:shadow-md transition-shadow", className)} {...props}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3 items-start">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
            {avatar ? (
              <Image src={avatar} alt={name} width={40} height={40} />
            ) : (
              <User className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <div>
            <TypographyH3 className="font-medium">{name}</TypographyH3>
            <TypographyP className="text-sm text-muted-foreground">{position}</TypographyP>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-2 mb-3">
        <TypographyP className="text-sm flex items-center gap-1">
          <Briefcase className="h-4 w-4 text-muted-foreground" />
          {experience} experience
        </TypographyP>
        <div className="flex flex-wrap gap-1">
          {skills.map((skill, i) => (
            <span key={i} className="text-xs bg-muted px-2 py-1 rounded-full">
              {skill}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <MatchScore score={matchScore} />
        <Button variant="primary" size="sm" asChild>
          <Link href={profileUrl || `/candidates/${id}`}>
            View Profile
          </Link>
        </Button>
      </div>
    </Card>
  );
};

export { 
  PrimaryCardLarge, 
  PrimaryCardMedium, 
  PrimaryCardSmall,
  StatsCard,
  ApplicationCard,
  JobCard,
  CandidateCard,
  StatusBadge,
  MatchScore
}; 