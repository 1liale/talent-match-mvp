import { OpenAI } from 'openai';
import { createClient } from '@/utils/supabase/server';
import { generateResumeEmbedding } from '@/utils/cohere/embeddings';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const supabase = await createClient();
    
    // Get user authentication data
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get resume ID from request
    const { resumeId } = await request.json();
    if (!resumeId) {
      return Response.json({ error: 'Resume ID is required' }, { status: 400 });
    }

    // Get resume data
    const { data: resume, error: resumeError } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .eq('user_id', user.id)
      .single();

    if (resumeError || !resume) {
      return Response.json({ error: 'Resume not found' }, { status: 404 });
    }

    // Generate embedding if not already present
    if (!resume.embedding) {
      const embedding = await generateResumeEmbedding(resume.file_url);
      
      const { error: updateError } = await supabase
        .from('resumes')
        .update({ embedding })
        .eq('id', resumeId);

      if (updateError) {
        console.error('Error updating resume embedding:', updateError);
      }
    }

    // Find similar jobs based on resume embedding
    const { data: similarJobs } = await supabase.rpc('match_jobs', {
      query_embedding: resume.embedding,
      match_threshold: 0.7,
      match_count: 5
    });

    // Get resume text
    const response = await fetch(resume.file_url);
    const resumeText = await response.text();

    // Generate feedback using GPT-4
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are an expert resume reviewer and career coach. Analyze the resume and provide detailed, constructive feedback. Focus on:
          1. Overall impression and impact
          2. Key strengths
          3. Areas for improvement
          4. Alignment with target roles (based on similar jobs)
          5. Specific recommendations for enhancement
          
          Format the response as a JSON object with the following structure:
          {
            "overallScore": number (0-100),
            "strengths": string[],
            "improvements": string[],
            "skills": string[],
            "experience": string[],
            "education": string[],
            "recommendations": string
          }`
        },
        {
          role: "user",
          content: `Resume text: ${resumeText}\n\nSimilar jobs: ${JSON.stringify(similarJobs)}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const feedback = JSON.parse(completion.choices[0].message.content);

    // Update resume with feedback
    const { error: feedbackError } = await supabase
      .from('resumes')
      .update({
        feedback,
        feedback_updated_at: new Date().toISOString()
      })
      .eq('id', resumeId);

    if (feedbackError) {
      console.error('Error saving feedback:', feedbackError);
    }

    return Response.json(feedback);
  } catch (error) {
    console.error('Error generating resume feedback:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
} 