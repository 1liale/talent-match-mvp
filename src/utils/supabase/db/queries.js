import { createClient } from '@/utils/supabase/client';

/**
 * Get user profile details
 * @returns {Promise<Object>} User profile data
 */
export async function getUserProfile() {
  try {
    // Create Supabase client
    const supabase = createClient();
    
    // Get user authentication data
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }
    
    // Get user profile directly
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) {
      console.error('Database error:', error);
      throw new Error('Failed to fetch profile');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

/**
 * Check if user has completed onboarding
 * @returns {Promise<boolean>} Whether onboarding is completed
 */
export async function hasCompletedOnboarding() {
  try {
    // Create Supabase client
    const supabase = createClient();
    
    // Get user authentication data
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }
    
    // Check if onboarding is completed directly
    const { data, error } = await supabase
      .from('user_profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" code
      console.error('Database error:', error);
      throw new Error('Failed to check onboarding status');
    }
    
    return !!(data?.onboarding_completed);
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    throw error;
  }
}

/**
 * Get all resumes for a user
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} List of user's resumes
 */
export async function getUserResumes(userId) {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    // Create Supabase client
    const supabase = createClient();
    
    // Get user's resumes
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .order('uploaded_at', { ascending: false });
      
    if (error) {
      console.error('Database error:', error);
      throw new Error('Failed to fetch resumes');
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching user resumes:', error);
    throw error;
  }
}

/**
 * Get jobs from Supabase
 * @param {Object} options - Options for filtering jobs
 * @param {string} options.sortBy - Sort jobs by 'newest' or 'recommended'
 * @param {number} options.limit - Limit the number of jobs returned
 * @returns {Promise<Array>} List of jobs
 */
export async function getJobs(options = {}) {
  try {
    const { sortBy = 'newest', limit = 10 } = options;
    
    // Create Supabase client
    const supabase = createClient();
    
    // Build query
    let query = supabase
      .from('jobs')
      .select('*');
    
    // Apply sorting
    if (sortBy === 'newest') {
      query = query.order('post_date', { ascending: false });
    }
    
    // Apply limit
    if (limit > 0) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Database error:', error);
      throw new Error('Failed to fetch jobs');
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
}

/**
 * Get required fields for job applications
 * @returns {Promise<Object>} Required fields configuration
 */
export async function getApplicationRequiredFields() {
  try {
    // Create Supabase client
    const supabase = createClient();
    
    // Query the configuration table or use hardcoded values
    // Note: In a real implementation, this might come from a settings/config table
    
    // For now, return hardcoded required fields
    return {
      required: {
        phone: true,
        resume: true,
        availability: true,
        experience: false, // Optional
        skills: false,     // Optional
        bio: false,        // Optional
        socialLinks: false // Optional
      }
    };
  } catch (error) {
    console.error('Error fetching application required fields:', error);
    throw error;
  }
} 