"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { 
  TypographyH1, 
  TypographyH2, 
  TypographyH3,
  TypographyH4,
  TypographyP,
  TypographySmall
} from "@/components/ui/typography";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import { 
  MapPin, 
  Briefcase, 
  Linkedin, 
  Github, 
  Globe, 
  Building, 
  Users,
  GraduationCap, 
  Mail,
  Phone,
  Edit,
  Download,
  Upload,
  Trash2,
  Save,
  Check,
  X
} from "lucide-react";

import { getUserProfile } from "@/utils/supabase/db/queries";
import { uploadAvatar } from "@/utils/supabase/db/mutations";
import { createClient } from "@/utils/supabase/client";

// Avatar Upload Component
const AvatarUploadSection = ({ profile, setProfile, setEditedProfile, uploading, setUploading }) => {
  const fileInputRef = useRef(null);
  const supabase = createClient();

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !profile.id) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size exceeds 2MB limit. Please choose a smaller image.");
      return;
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please use JPEG, PNG, GIF, WebP, or SVG.");
      return;
    }
    
    setUploading(true);
    try {
      const avatarUrl = await uploadAvatar(profile.id, file);
      if (!avatarUrl) {
        throw new Error('Failed to get avatar URL');
      }
      
      setProfile(prev => ({ ...prev, avatar_url: avatarUrl }));
      setEditedProfile(prev => ({ ...prev, avatar_url: avatarUrl }));
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error(error.message || "Failed to upload profile picture");
    } finally {
      setUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleDeleteAvatar = async () => {
    if (!profile.id) return;
    
    setUploading(true);
    try {
      const BUCKET_NAME = 'profile-imgs';
      
      // Get current avatar path from URL
      if (profile.avatar_url) {
        const avatarPath = profile.avatar_url.split('/').pop();
        if (avatarPath) {
          // Remove from storage
          const { error: removeError } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([avatarPath]);
            
          if (removeError) {
            console.error('Error removing file from storage:', removeError);
            // Continue anyway to update the profile
          }
        }
      }
      
      // Update profile with no avatar
      const { error } = await supabase
        .from('user_profiles')
        .update({ avatar_url: null })
        .eq('id', profile.id);
        
      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
      
      setProfile(prev => ({ ...prev, avatar_url: null }));
      setEditedProfile(prev => ({ ...prev, avatar_url: null }));
      toast.success("Profile picture removed");
    } catch (error) {
      console.error('Error removing avatar:', error);
      toast.error("Failed to remove profile picture");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 border-b">
      <div className="mb-6">
        <TypographyH4>Profile Picture</TypographyH4>
      </div>
      
      <div className="flex items-center gap-5">
        <div className="relative group">
          <Avatar className="w-24 h-24 rounded-full border">
            <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
              {profile.full_name ? profile.full_name.substring(0, 2).toUpperCase() : '?'}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleAvatarClick}
            disabled={uploading}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden" 
              accept="image/*" 
            />
            Change picture
          </Button>
          
          {profile.avatar_url && (
            <Button 
              variant="outline" 
              size="sm"
              className="text-destructive"
              onClick={handleDeleteAvatar}
              disabled={uploading}
            >
              Delete picture
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Personal Information Component
const PersonalInfoSection = ({ profile, editedProfile, handleInputChange, isEditing, user }) => {
  return (
    <div className="p-6 border-b">
      <div className="mb-6">
        <TypographyH4>Personal Information</TypographyH4>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            {isEditing ? (
              <Input 
                id="fullName"
                value={editedProfile.full_name || ''}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                className="mt-1"
              />
            ) : (
              <TypographyP>{profile.full_name}</TypographyP>
            )}
          </div>
          
          <div>
            <Label htmlFor="username">Username</Label>
            {isEditing ? (
              <Input 
                id="username"
                value={editedProfile.username || ''}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="mt-1"
              />
            ) : (
              <TypographyP>{profile.username || 'Not set'}</TypographyP>
            )}
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <TypographyP>{user?.email}</TypographyP>
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            {isEditing ? (
              <Input 
                id="location"
                value={editedProfile.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="mt-1"
              />
            ) : (
              <TypographyP>{profile.location || 'Not set'}</TypographyP>
            )}
          </div>
          
          <div>
            <Label htmlFor="bio">About</Label>
            {isEditing ? (
              <Textarea 
                id="bio"
                value={editedProfile.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="mt-1"
                rows={4}
              />
            ) : (
              <TypographyP>{profile.bio || 'No bio added yet'}</TypographyP>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Professional Information Component for Applicants
const ApplicantProfessionalSection = ({ profile, editedProfile, handleInputChange, handleSkillChange, isEditing }) => {
  return (
    <>
      <div className="p-6 border-b">
        <div className="mb-6">
          <TypographyH4>Professional Information</TypographyH4>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="jobTitle">Job Title</Label>
            {isEditing ? (
              <Input 
                id="jobTitle"
                value={editedProfile.job_title || ''}
                onChange={(e) => handleInputChange('job_title', e.target.value)}
                className="mt-1"
              />
            ) : (
              <TypographyP>{profile.job_title || 'Not set'}</TypographyP>
            )}
          </div>
          
          <div>
            <Label htmlFor="experience">Experience Level</Label>
            {isEditing ? (
              <Input 
                id="experience"
                value={editedProfile.experience_level || ''}
                onChange={(e) => handleInputChange('experience_level', e.target.value)}
                className="mt-1"
              />
            ) : (
              <TypographyP>{profile.experience_level || 'Not set'}</TypographyP>
            )}
          </div>
          
          <div>
            <Label htmlFor="education">Education</Label>
            {isEditing ? (
              <Input 
                id="education"
                value={editedProfile.education || ''}
                onChange={(e) => handleInputChange('education', e.target.value)}
                className="mt-1"
              />
            ) : (
              <TypographyP>{profile.education || 'Not set'}</TypographyP>
            )}
          </div>
          
          <div>
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            {isEditing ? (
              <Input 
                id="skills"
                value={(editedProfile.skills || []).join(', ')}
                onChange={(e) => handleSkillChange(e.target.value)}
                className="mt-1"
              />
            ) : (
              <div className="flex flex-wrap gap-2 mt-1">
                {profile.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <TypographyP>No skills added yet</TypographyP>
                )}
              </div>
            )}
          </div>
          
          <div>
            <Label htmlFor="jobStatus">Job Seeking Status</Label>
            {isEditing ? (
              <Input 
                id="jobStatus"
                value={editedProfile.job_seeking_status || ''}
                onChange={(e) => handleInputChange('job_seeking_status', e.target.value)}
                className="mt-1"
              />
            ) : (
              <TypographyP>{profile.job_seeking_status || 'Not set'}</TypographyP>
            )}
          </div>
          
          <div>
            <Label htmlFor="salaryExpectation">Salary Expectation</Label>
            {isEditing ? (
              <Input 
                id="salaryExpectation"
                type="number"
                value={editedProfile.salary_expectation || ''}
                onChange={(e) => handleInputChange('salary_expectation', e.target.value)}
                className="mt-1"
              />
            ) : (
              <TypographyP>
                {profile.salary_expectation 
                  ? `$${profile.salary_expectation.toLocaleString()}` 
                  : 'Not set'}
              </TypographyP>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// External Links Component for Applicants
const ApplicantExternalLinksSection = ({ profile, editedProfile, handleInputChange, isEditing }) => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <TypographyH4>External Links</TypographyH4>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
          {isEditing ? (
            <Input 
              id="linkedinUrl"
              value={editedProfile.linkedin_url || ''}
              onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
              className="mt-1"
            />
          ) : (
            <div className="flex items-center gap-2 mt-1">
              {profile.linkedin_url ? (
                <a 
                  href={profile.linkedin_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Linkedin size={16} />
                  {profile.linkedin_url}
                </a>
              ) : (
                <TypographyP>Not set</TypographyP>
              )}
            </div>
          )}
        </div>
        
        <div>
          <Label htmlFor="githubUrl">GitHub URL</Label>
          {isEditing ? (
            <Input 
              id="githubUrl"
              value={editedProfile.github_url || ''}
              onChange={(e) => handleInputChange('github_url', e.target.value)}
              className="mt-1"
            />
          ) : (
            <div className="flex items-center gap-2 mt-1">
              {profile.github_url ? (
                <a 
                  href={profile.github_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Github size={16} />
                  {profile.github_url}
                </a>
              ) : (
                <TypographyP>Not set</TypographyP>
              )}
            </div>
          )}
        </div>
        
        <div>
          <Label htmlFor="portfolioUrl">Portfolio URL</Label>
          {isEditing ? (
            <Input 
              id="portfolioUrl"
              value={editedProfile.portfolio_url || ''}
              onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
              className="mt-1"
            />
          ) : (
            <div className="flex items-center gap-2 mt-1">
              {profile.portfolio_url ? (
                <a 
                  href={profile.portfolio_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Globe size={16} />
                  {profile.portfolio_url}
                </a>
              ) : (
                <TypographyP>Not set</TypographyP>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Company Information Component for Recruiters
const RecruiterCompanySection = ({ profile, editedProfile, handleInputChange, handleHiringRolesChange, isEditing }) => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <TypographyH4>Company Information</TypographyH4>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="companyName">Company Name</Label>
          {isEditing ? (
            <Input 
              id="companyName"
              value={editedProfile.employer_company_name || ''}
              onChange={(e) => handleInputChange('employer_company_name', e.target.value)}
              className="mt-1"
            />
          ) : (
            <TypographyP>{profile.employer_company_name || 'Not set'}</TypographyP>
          )}
        </div>
        
        <div>
          <Label htmlFor="industry">Industry</Label>
          {isEditing ? (
            <Input 
              id="industry"
              value={editedProfile.industry || ''}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              className="mt-1"
            />
          ) : (
            <TypographyP>{profile.industry || 'Not set'}</TypographyP>
          )}
        </div>
        
        <div>
          <Label htmlFor="companySize">Company Size</Label>
          {isEditing ? (
            <Input 
              id="companySize"
              value={editedProfile.company_size || ''}
              onChange={(e) => handleInputChange('company_size', e.target.value)}
              className="mt-1"
            />
          ) : (
            <TypographyP>{profile.company_size ? `${profile.company_size} employees` : 'Not set'}</TypographyP>
          )}
        </div>
        
        <div>
          <Label htmlFor="companyWebsite">Company Website</Label>
          {isEditing ? (
            <Input 
              id="companyWebsite"
              value={editedProfile.company_website || ''}
              onChange={(e) => handleInputChange('company_website', e.target.value)}
              className="mt-1"
            />
          ) : (
            <div className="flex items-center gap-2 mt-1">
              {profile.company_website ? (
                <a 
                  href={profile.company_website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Globe size={16} />
                  {profile.company_website}
                </a>
              ) : (
                <TypographyP>Not set</TypographyP>
              )}
            </div>
          )}
        </div>
        
        <div>
          <Label htmlFor="hiringRoles">Hiring Roles (comma-separated)</Label>
          {isEditing ? (
            <Input 
              id="hiringRoles"
              value={(editedProfile.hiring_roles || []).join(', ')}
              onChange={(e) => handleHiringRolesChange(e.target.value)}
              className="mt-1"
            />
          ) : (
            <div className="flex flex-wrap gap-2 mt-1">
              {profile.hiring_roles && profile.hiring_roles.length > 0 ? (
                profile.hiring_roles.map((role, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                  >
                    {role}
                  </span>
                ))
              ) : (
                <TypographyP>No hiring roles added yet</TypographyP>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ProfileHeader Component
const ProfileHeader = ({ isEditing, setIsEditing, handleCancelEdit, handleSaveChanges, saving }) => {
  return (
    <div className="p-6 border-b flex justify-between items-center">
      <TypographyH3 className="font-medium">Profile Settings</TypographyH3>
      
      {!isEditing ? (
        <Button 
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(true)}
        >
          <Edit className="w-4 h-4 mr-2" /> Edit Profile
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={handleCancelEdit}
          >
            <X className="w-4 h-4 mr-1" /> Cancel
          </Button>
          <Button 
            variant="default"
            size="sm"
            onClick={handleSaveChanges}
            disabled={saving}
          >
            {saving ? (
              "Saving..."
            ) : (
              <>
                <Check className="w-4 h-4 mr-1" /> Save Changes
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default function ProfilePage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [profile, setProfile] = useState(null);
  const [editedProfile, setEditedProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      
      try {
        const profileData = await getUserProfile();
        setProfile(profileData);
        setEditedProfile(profileData);
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    }
    
    loadProfile();
  }, [user]);
  
  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSkillChange = (value) => {
    // Convert comma-separated string to array
    const skillsArray = value.split(',').map(skill => skill.trim()).filter(Boolean);
    setEditedProfile(prev => ({
      ...prev,
      skills: skillsArray
    }));
  };
  
  const handleHiringRolesChange = (value) => {
    // Convert comma-separated string to array
    const rolesArray = value.split(',').map(role => role.trim()).filter(Boolean);
    setEditedProfile(prev => ({
      ...prev,
      hiring_roles: rolesArray
    }));
  };
  
  const handleSaveChanges = async () => {
    if (!user || !editedProfile) return;
    
    setSaving(true);
    try {
      // Prepare the data to update
      const { id, created_at, updated_at, avatar_url, ...dataToUpdate } = editedProfile;
      
      // Update profile in the database
      const { error } = await supabase
        .from('user_profiles')
        .update(dataToUpdate)
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local state
      setProfile(editedProfile);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };
  
  const handleCancelEdit = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  // Loading state
  if (loading) {
    return null;
  }
  
  const isApplicant = profile.user_type === 'applicant';
  
  // Profile content
  const ProfileContent = () => (
    <Card className="max-w-5xl mx-auto">
      <CardContent className="p-0">
        <ProfileHeader 
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          handleCancelEdit={handleCancelEdit}
          handleSaveChanges={handleSaveChanges}
          saving={saving}
        />
        
        <AvatarUploadSection 
          profile={profile}
          setProfile={setProfile}
          setEditedProfile={setEditedProfile}
          uploading={uploading}
          setUploading={setUploading}
        />
        
        <PersonalInfoSection 
          profile={profile}
          editedProfile={editedProfile}
          handleInputChange={handleInputChange}
          isEditing={isEditing}
          user={user}
        />
        
        {isApplicant ? (
          // Applicant specific sections
          <>
            <ApplicantProfessionalSection 
              profile={profile}
              editedProfile={editedProfile}
              handleInputChange={handleInputChange}
              handleSkillChange={handleSkillChange}
              isEditing={isEditing}
            />
            
            <ApplicantExternalLinksSection 
              profile={profile}
              editedProfile={editedProfile}
              handleInputChange={handleInputChange}
              isEditing={isEditing}
            />
          </>
        ) : (
          // Recruiter specific section
          <RecruiterCompanySection 
            profile={profile}
            editedProfile={editedProfile}
            handleInputChange={handleInputChange}
            handleHiringRolesChange={handleHiringRolesChange}
            isEditing={isEditing}
          />
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <ProfileContent />
      </div>
    </div>
  );
} 