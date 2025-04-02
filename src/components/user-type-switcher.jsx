"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth-context";

export const UserTypeSwitcher = () => {
  const { userType, setUserRole } = useAuth();

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <Tabs 
        defaultValue={userType} 
        onValueChange={setUserRole}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="applicant" className="font-serif">Applicant</TabsTrigger>
          <TabsTrigger value="hiring" className="font-serif">Hiring Manager</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
} 