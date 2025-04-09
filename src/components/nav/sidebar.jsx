"use client";

import {
  Home,
  LogOut,
  HelpCircle,
  Users,
  FileText,
  Search,
  Settings,
  Building,
  User,
  File
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Logo from "@/components/base/logo";
import { useAuth } from "@/context/auth-context";

// Menu item configuration
const candidateMenuItems = [
  { title: "Dashboard", icon: Home, url: "/dashboard" },
  { title: "Profile", icon: User, url: "/dashboard/profile" },
  { section: "Applications" },
  { title: "Resumes", icon: FileText, url: "/dashboard/resumes" },
  { title: "Job Search", icon: Search, url: "/dashboard/jobs" },
  { title: "My Applications", icon: File, url: "/dashboard/applications" },
];

const employerMenuItems = [
  { title: "Dashboard", icon: Home, url: "/dashboard" },
  { title: "Company Profile", icon: Building, url: "/dashboard/profile" },
  { section: "Recruitment" },
  { title: "Job Posts", icon: FileText, url: "/dashboard/posts" },
  { title: "Applicants", icon: Users, url: "/dashboard/applicants" },
  { title: "Talent Discovery", icon: Search, url: "/dashboard/talent-discovery" },
];

// Footer menu items
const footerItems = [
  { title: "FAQs", icon: HelpCircle, url: "/help" },
];

// Function to check if a menu item is active
const isMenuItemActive = (pathname, itemUrl) => {
  // For exact URL matching
  if (pathname === itemUrl) return true;
  
  // For child routes (only if not the root dashboard)
  if (itemUrl !== "/dashboard" && pathname?.startsWith(itemUrl + "/")) return true;
  
  return false;
};

const Sidebar = ({ userProfile }) => {
  const { supabase } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(() => {
    // Only run in client-side
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sidebarOpen');
      return stored !== null ? stored === 'true' : true;
    }
    return true; // Default for server-side rendering
  });


  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Return null on server-side and initial render
  }

  // Determine user type from userProfile with null check
  const userType = userProfile.user_type;
  const menuItems = userType === "recruiter" ? employerMenuItems : candidateMenuItems;

  const handleSetIsOpen = (value) => {
    setIsOpen(value);
    localStorage.setItem('sidebarOpen', String(value));
  };

  const handleSidebarClick = (e) => {
    if (
      e.target instanceof Element &&
      !e.target.closest("button") &&
      !e.target.closest("a") &&
      !e.target.closest('[role="button"]')
    ) {
      handleSetIsOpen(!isOpen);
    }
  };

  const handleSignOut = async () => {
    // Sign out using the global Supabase client
    await supabase.auth.signOut();
    
    // Force a page refresh to ensure a clean state
    window.location.href = "/";
  };
  
  // Helper function to render a menu item (section or link)
  const renderMenuItem = (item, index, keyPrefix = "main") => {
    // Section header
    if (isOpen && item.section) {
      return (
        <div 
          key={`${keyPrefix}-section-${index}`} 
          className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2 mt-3"
        >
          {item.section}
        </div>
      );
    }
    
    // Menu item with link
    if (item.title) {
      const isActive = isMenuItemActive(pathname, item.url);
      
      return (
        <Button
          key={`${keyPrefix}-item-${index}`}
          asChild
          variant="ghost"
          className={cn(
            "flex w-full items-center justify-start gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 hover:text-primary relative overflow-hidden group",
            isActive && "text-primary font-bold bg-primary/10"
          )}
        >
          <Link href={item.url}>
            {isActive && (
              <div className="absolute left-0 top-0 w-[5px] h-full bg-primary" />
            )}
            {item.icon && (
              <item.icon
                className={cn("h-4 w-4", {
                  "text-primary": isActive,
                })}
              />
            )}
            {isOpen && (
              <span className="text-sm font-medium truncate">
                {item.title}
              </span>
            )}
          </Link>
        </Button>
      );
    }
    
    return null;
  };

  return (
    <aside
      className={`relative h-screen border-r border-border flex-shrink-0 transition-all duration-300 ease-in-out cursor-pointer hidden md:block ${
        isOpen ? "w-[240px]" : "w-[60px]"
      }`}
      onClick={handleSidebarClick}
    >
      <div className="h-full flex flex-col bg-card border-border overflow-hidden">
        {/* Header with logo */}
        <div className="h-[70px] border-b border-border p-3 mb-2 flex items-center justify-between">
          {isOpen ? (
            <Logo />
          ) : (
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <span className="text-primary-foreground font-bold">TM</span>
            </div>
          )}
        </div>

        {/* Main navigation items */}
        <div className="flex-1 p-2 flex flex-col justify-start gap-1 overflow-y-auto">
          {menuItems.map((item, index) => renderMenuItem(item, index))}
        </div>

        {/* Footer items */}
        <div className="p-2 border-t border-border flex flex-col gap-1">
          {footerItems.map((item, index) => renderMenuItem(item, index, "footer"))}
          
          {/* Logout button (special case since it's not a link) */}
          <Button
            className="flex w-full justify-start gap-3 px-3 py-2 text-muted-foreground hover:text-foreground rounded-lg"
            variant="ghost"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {isOpen && <span className="text-sm font-medium">Logout</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 