import { createClient } from '@supabase/supabase-js';
import { generateJobEmbedding, generateApplicantEmbedding } from '../src/utils/ai/embeddings.js';
import jobs from './data/jobs.json';
import applicants from './data/applicants.json';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function importJobs() {
  console.log('Importing jobs...');
  
  for (const job of jobs) {
    try {
      // Generate embedding for job
      const embedding = await generateJobEmbedding(job);
      
      // Convert post_date string to Date
      const postDate = new Date(job.postDate);
      
      // Insert job with embedding
      const { error } = await supabase
        .from('jobs')
        .insert({
          title: job.title,
          company: job.company,
          location: job.location,
          work_arrangement: job.workArrangement,
          salary: job.salary,
          experience_level: job.experienceLevel,
          employment_type: job.employmentType,
          description: job.description,
          required_skills: job.requiredSkills,
          post_date: postDate,
          embedding
        });
      
      if (error) {
        console.error(`Error importing job ${job.title}:`, error);
      } else {
        console.log(`Imported job: ${job.title}`);
      }
    } catch (error) {
      console.error(`Error processing job ${job.title}:`, error);
    }
  }
}

async function importApplicants() {
  console.log('Importing applicants...');
  
  for (const applicant of applicants) {
    try {
      // Generate embedding for applicant
      const embedding = await generateApplicantEmbedding(applicant);
      
      // Insert applicant with embedding
      const { error } = await supabase
        .from('applicants')
        .insert({
          full_name: applicant.fullName,
          first_name: applicant.firstName,
          last_name: applicant.lastName,
          email: applicant.email,
          phone: applicant.phone,
          location: applicant.location,
          avatar_url: applicant.avatarUrl,
          job_title: applicant.jobTitle,
          experience_level: applicant.experienceLevel,
          years_of_experience: applicant.yearsOfExperience,
          current_employer: applicant.currentEmployer,
          bio: applicant.bio,
          skills: applicant.skills,
          education: applicant.education,
          social_links: applicant.socialLinks,
          salary_expectation: applicant.salaryExpectation,
          remote_preference: applicant.remotePreference,
          availability: applicant.availability,
          work_authorization: applicant.workAuthorization,
          created_at: new Date(applicant.createdAt),
          updated_at: new Date(applicant.updatedAt),
          embedding
        });
      
      if (error) {
        console.error(`Error importing applicant ${applicant.fullName}:`, error);
      } else {
        console.log(`Imported applicant: ${applicant.fullName}`);
      }
    } catch (error) {
      console.error(`Error processing applicant ${applicant.fullName}:`, error);
    }
  }
}

// Run imports
async function main() {
  try {
    await importJobs();
    await importApplicants();
    console.log('Import completed successfully');
  } catch (error) {
    console.error('Import failed:', error);
  }
}

main(); 