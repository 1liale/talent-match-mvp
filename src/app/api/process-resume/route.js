import { NextResponse } from "next/server";
import { UnstructuredClient } from "unstructured-client";
import { Strategy } from "unstructured-client/sdk/models/shared";
import { CohereClient } from "cohere-ai";
import mammoth from "mammoth";
import { createClient } from "@/utils/supabase/server";

// Initialize clients
const unstructured = new UnstructuredClient({
  serverURL: process.env.UNSTRUCTURED_API_URL,
  security: {
    apiKeyAuth: process.env.UNSTRUCTURED_API_KEY,
  }
});

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

/**
 * Process resume file, extract text, analyze with Cohere,
 * and return feedback with rating
 */
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const resumeId = formData.get("resumeId");
    
    if (!file || !resumeId) {
      return NextResponse.json(
        { error: "File and resumeId are required" },
        { status: 400 }
      );
    }

    // Extract text based on file type
    let resumeText = "";
    const fileName = file.name.toLowerCase();
    
    if (fileName.endsWith(".pdf")) {
      // Process PDF with Unstructured
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Call the unstructured API with HiRes strategy
      const response = await unstructured.general.partition({
        partitionParameters: {
          files: {
            content: buffer,
            fileName: fileName,
          },
          strategy: Strategy.HiRes,
          splitPdfPage: true,
          splitPdfAllowFailed: true,
          splitPdfConcurrencyLevel: 8
        }
      });
      
      // Extract text from response (handling both array and object formats)
      if (Array.isArray(response)) {
        resumeText = response.map(e => e.text).filter(Boolean).join("\n");
      } else if (response.elements) {
        resumeText = response.elements.map(e => e.text).filter(Boolean).join("\n");
      }
      
    } else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
      // Process DOCX with Mammoth
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({
        arrayBuffer: arrayBuffer
      });
      resumeText = result.value;
    } else {
      return NextResponse.json(
        { error: "Unsupported file format. Please upload PDF or DOCX files." },
        { status: 400 }
      );
    }

    // Validate that we have text content
    if (!resumeText || resumeText.trim() === "") {
      return NextResponse.json(
        { error: "Could not extract text from the resume" },
        { status: 400 }
      );
    }

    // Use Cohere to analyze the resume and generate feedback
    const response = await cohere.generate({
      prompt: `You are a professional resume analyst with years of experience in HR and recruiting. 
      Analyze the following resume and provide detailed feedback:
      
      1. Extract a list of skills mentioned (technical and soft skills)
      2. Extract work experience as a list of positions
      3. Extract education background
      4. Identify 4-5 strengths of this resume
      5. Identify 4-5 areas that need improvement
      6. Provide specific recommendations for improvement
      7. Give an overall rating from 0.0 to 10.0 (as a floating point number)
      
      Format your response as a valid JSON object with these keys: 
      "skills" (array), 
      "experience" (array), 
      "education" (array), 
      "strengths" (array), 
      "improvements" (array), 
      "recommendations" (string), 
      "overallScore" (number between 0-10 with one decimal precision)
      
      IMPORTANT: Return ONLY the JSON object without any additional text, markdown formatting, or code blocks.
      
      Resume text:
      ${resumeText}`,
      model: "command-r-plus",
      maxTokens: 2000,
      temperature: 0.3,
    });
    
    console.log("COHERE RESPONSE", response);
    
    // Parse the JSON response from Cohere, handling markdown code blocks if present
    let feedbackText = response.generations[0].text;
    
    // Extract JSON from markdown code blocks if present
    const jsonMatch = feedbackText.match(/```(?:json)?\s*({[\s\S]*?})\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      feedbackText = jsonMatch[1];
    }
    
    // Attempt to strip any remaining non-JSON text
    try {
      // Try to parse directly first
      const feedback = JSON.parse(feedbackText);
      
      // Save feedback to Supabase
      const supabase = await createClient();
      const { error } = await supabase
        .from("resumes")
        .update({
          feedback: feedback,
          feedback_updated_at: new Date().toISOString(),
        })
        .eq("id", resumeId);
      
      if (error) {
        console.error("Error saving feedback to database:", error);
        return NextResponse.json(
          { error: "Failed to save feedback" },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        feedback: feedback
      });
    } catch (jsonError) {
      console.error("Error parsing JSON from Cohere response:", jsonError);
      console.log("Raw response text:", feedbackText);
      return NextResponse.json(
        { error: "Failed to parse AI analysis. Please try again." },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error("Error processing resume:", error);
    return NextResponse.json(
      { error: "Failed to process resume: " + error.message },
      { status: 500 }
    );
  }
} 