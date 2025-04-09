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