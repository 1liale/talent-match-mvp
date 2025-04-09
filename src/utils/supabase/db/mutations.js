import { createClient } from '@/utils/supabase/client';

/**
 * Create or update user profile with onboarding data
 * @param {string} userId - The user ID
 * @param {Object} formData - Profile data to save (includes userType)
 * @returns {Promise<Object>} Updated profile data
 */
export async function saveOnboardingProfile(userId, formData) {
  try {
    // Process form data for arrays before sending to API
    const processedFormData = { ...formData };
    
    // Convert comma-separated strings to arrays or ensure empty arrays for empty strings
    if (typeof processedFormData.skills === 'string') {
      processedFormData.skills = processedFormData.skills.trim() 
        ? processedFormData.skills.split(',').map(skill => skill.trim()) 
        : [];
    }
    
    if (typeof processedFormData.hiringRoles === 'string') {
      processedFormData.hiringRoles = processedFormData.hiringRoles.trim() 
        ? processedFormData.hiringRoles.split(',').map(role => role.trim()) 
        : [];
    }

    // Create Supabase client
    const supabase = createClient();
    
    const userType = processedFormData.userType;
    
    // Prepare data object based on common and role-specific fields
    const commonFields = {
      id: userId,
      user_type: userType,
      full_name: processedFormData.fullName,
      username: processedFormData.username,
      bio: processedFormData.bio,
      location: processedFormData.location,
      onboarding_completed: true,
    };
    
    // Add role-specific fields with validation for array fields
    let roleSpecificFields = {};
    
    if (userType === 'applicant') {
      roleSpecificFields = {
        job_title: processedFormData.title,
        skills: processedFormData.skills,
        experience_level: processedFormData.experience,
        education: processedFormData.education,
        portfolio_url: processedFormData.portfolioUrl,
        github_url: processedFormData.githubUrl,
        linkedin_url: processedFormData.linkedinUrl,
      };
    } else {
      roleSpecificFields = {
        employer_company_name: processedFormData.employerCompanyName,
        company_size: processedFormData.companySize,
        industry: processedFormData.industry,
        company_website: processedFormData.companyWebsite,
        hiring_roles: processedFormData.hiringRoles,
      };
    }
    
    const profileToSave = {
      ...commonFields,
      ...roleSpecificFields
    };
    
    // Save to database directly
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(profileToSave)
      .select()
      .single();
      
    if (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to save profile: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error saving onboarding profile:', error);
    throw error;
  }
}

/**
 * Upload a profile avatar image to Supabase storage
 * @param {string} userId - The user ID
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} The URL of the uploaded image
 */
export async function uploadAvatar(userId, file) {
  try {
    if (!userId || !file) {
      throw new Error('User ID and file are required');
    }

    // Create Supabase client
    const supabase = createClient();
    
    const BUCKET_NAME = 'profile-imgs';
    
    // Check if bucket exists, create it if it doesn't
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      const { error: createBucketError } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'],
        fileSizeLimit: 1024 * 1024 * 2, // 2MB
      });
      
      if (createBucketError) {
        console.error('Error creating bucket:', createBucketError);
        throw createBucketError;
      }
    }
    
    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload the file to the 'profile-imgs' bucket
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (error) {
      console.error('Storage upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);
      
    if (!urlData || !urlData.publicUrl) {
      throw new Error('Failed to get public URL for uploaded file');
    }

    const publicUrl = urlData.publicUrl;

    // Update user profile with new avatar URL
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId);

    if (updateError) {
      console.error('Profile update error:', updateError);
      throw updateError;
    }

    return publicUrl;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
} 