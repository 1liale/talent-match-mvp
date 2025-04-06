import React from "react";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PrimaryCardLarge = ({ icon, title, description, className, ...props }) => {
  return (
    <Card className={cn("rounded-xl hover:shadow-primary transition-shadow duration-300 group", className)} {...props}>
      <CardContent className="p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
            {icon}
          </div>
        </div>
        <CardTitle className="text-xl mb-3 text-center">{title}</CardTitle>
        <CardDescription className="leading-relaxed text-center">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

const PrimaryCardMedium = ({ icon, title, description, className, ...props }) => {
  return (
    <Card className={cn("rounded-xl hover:shadow-sm transition-shadow duration-300 group", className)} {...props}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription className="leading-relaxed">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

const PrimaryCardSmall = ({ icon, title, className, ...props }) => {
  return (
    <Card className={cn("rounded-xl hover:shadow-sm transition-shadow duration-300 group", className)} {...props}>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
          {icon}
        </div>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardContent>
    </Card>
  );
};

export { PrimaryCardLarge, PrimaryCardMedium, PrimaryCardSmall }; 