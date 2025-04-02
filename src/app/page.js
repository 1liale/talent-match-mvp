"use client";

import { LoginForm } from "@/components/login-form";
import { UserTypeSwitcher } from "@/components/user-type-switcher";

const Home = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md text-center mb-8">
        <h1 className="text-4xl font-serif font-bold mb-2 text-[#6a6344]">Talent Match</h1>
        <p className="text-foreground/80">AI-Powered Talent Matching Platform</p>
      </div>
      
      <UserTypeSwitcher />
      <LoginForm />
      
      <div className="mt-12 text-center text-foreground/80 max-w-md">
        <h2 className="text-xl font-serif font-bold mb-3 text-[#6a6344]">Streamlined Hiring with AI</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-lg bg-card border shadow-sm">
            <h3 className="font-serif font-bold mb-1">For Hiring Managers</h3>
            <p>Post jobs and get AI-suggested candidate matches instantly</p>
          </div>
          <div className="p-4 rounded-lg bg-card border shadow-sm">
            <h3 className="font-serif font-bold mb-1">For Applicants</h3>
            <p>Find perfect job matches and get AI-powered application feedback</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
