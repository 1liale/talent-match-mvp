import { CohereClient } from 'cohere-ai';

// Initialize Cohere client
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

/**
 * Generate embeddings for a text using Cohere's API
 * @param {string} text - The text to generate embeddings for
 * @returns {Promise<number[]>} The embedding vector
 */
export async function generateEmbedding(text) {
  try {
    const response = await cohere.embed({
      texts: [text],
      model: 'embed-english-v3.0',
      inputType: 'search_document',
    });

    return response.embeddings[0];
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Generate embeddings for a resume file
 * @param {string} fileUrl - The URL of the resume file
 * @returns {Promise<number[]>} The embedding vector
 */
export async function generateResumeEmbedding(fileUrl) {
  try {
    // Download and extract text from resume
    const response = await fetch(fileUrl);
    const text = await response.text();
    
    // Generate embedding for the text
    return await generateEmbedding(text);
  } catch (error) {
    console.error('Error generating resume embedding:', error);
    throw error;
  }
}

/**
 * Generate embeddings for job data
 * @param {Object} job - The job data
 * @returns {Promise<number[]>} The embedding vector
 */
export async function generateJobEmbedding(job) {
  try {
    // Combine relevant job fields into a single text
    const jobText = `
      ${job.title}
      ${job.company}
      ${job.description}
      ${job.required_skills.join(' ')}
      ${job.experience_level}
      ${job.employment_type}
    `.trim();
    
    return await generateEmbedding(jobText);
  } catch (error) {
    console.error('Error generating job embedding:', error);
    throw error;
  }
}

/**
 * Generate embeddings for applicant data
 * @param {Object} applicant - The applicant data
 * @returns {Promise<number[]>} The embedding vector
 */
export async function generateApplicantEmbedding(applicant) {
  try {
    // Combine relevant applicant fields into a single text
    const applicantText = `
      ${applicant.full_name}
      ${applicant.job_title}
      ${applicant.bio}
      ${applicant.skills.join(' ')}
      ${applicant.experience_level}
      ${applicant.current_employer}
    `.trim();
    
    return await generateEmbedding(applicantText);
  } catch (error) {
    console.error('Error generating applicant embedding:', error);
    throw error;
  }
} 