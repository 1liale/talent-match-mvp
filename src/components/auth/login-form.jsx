'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { login, signup, signInWithOAuth } from "@/utils/supabase/auth-actions";
import { UserTypeSwitcher } from "@/components/auth/user-type-switcher";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("applicant"); // Default to applicant
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    // Create FormData object
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    
    if (!isLogin) {
      formData.append('user_type', userType);
    }
    
    try {
      if (isLogin) {
        // Sign in using server action
        const result = await login(formData);
        if (result?.error) {
          setMessage(result.error);
        }
      } else {
        // Sign up using server action
        const result = await signup(formData);
        if (result?.error) {
          setMessage(result.error);
        } else if (result?.message) {
          setMessage(result.message);
        }
      }
    } catch (error) {
      setMessage(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider) => {
    setLoading(true);
    setMessage("");
    
    try {
      // Call signInWithOAuth directly with the provider string
      const { url } = await signInWithOAuth(provider);
      if (url) {
        // Redirect to the OAuth provider's login page
        window.location.href = url;
      }
    } catch (error) {
      console.error("OAuth error:", error);
      setMessage(error.message || "An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <>
      <UserTypeSwitcher userType={userType} setUserType={setUserType} />
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{isLogin ? "Login" : "Sign Up"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "Enter your credentials to access your account"
              : "Create a new account to get started"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* OAuth Providers */}
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => handleOAuthSignIn('google')}
              disabled={loading}
              className="flex items-center justify-center gap-2"
            >
              <Image 
                src="/google.svg" 
                alt="Google logo" 
                width={16} 
                height={16} 
              />
              Google
            </Button>
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => handleOAuthSignIn('github')}
              disabled={loading}
              className="flex items-center justify-center gap-2"
            >
              <Image 
                src="/github.svg" 
                alt="GitHub logo" 
                width={16} 
                height={16} 
              />
              GitHub
            </Button>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t-2 border-muted" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-4 py-1 text-foreground/70 font-serif rounded-full border-2 border-muted">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {message && <p className="text-sm text-red-500">{message}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Need an account? Sign Up" : "Already have an account? Login"}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
} 