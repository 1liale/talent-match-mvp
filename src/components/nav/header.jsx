import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/base/logo";
import { Menu, X, BriefcaseIcon, CalendarClock, PlusCircle } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { TypographyH2, TypographyP } from "@/components/ui/typography";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";

const AuthHeader = ({ userProfile }) => {
  const { user: authUser } = useAuth();
  const pathname = usePathname();
  const activePage = pathname.split("/").pop();
  
  // Get the current page title based on the pathname
  const pageTitles = {
    dashboard: "Dashboard",
    jobs: "Find Jobs",
    applications: "My Applications",
    applicants: "Applicants",
    profile: "Profile"
  };
  
  // Render page-specific action buttons based on the current path
  const renderActionButton = () => {
    switch (activePage) {
      case "jobs":
        return (
          <Button asChild>
            <Link href="/dashboard/applications">
              <CalendarClock className="h-4 w-4 mr-2" />
              My Applications
            </Link>
          </Button>
        );
      case "applications":
        return (
          <Button asChild>
            <Link href="/dashboard/jobs">
              <BriefcaseIcon className="h-4 w-4 mr-2" />
              Browse Jobs
            </Link>
          </Button>
        );
      case "applicants":
        return (
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Applicant
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="border-b border-border h-[70px] px-6 flex items-center justify-between sticky top-0 bg-background z-10">
      <TypographyH2 className="text-xl">{pageTitles[activePage]}</TypographyH2>
      
      <div className="flex items-center gap-4">
        {/* Page-specific action button */}
        {renderActionButton()}
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userProfile?.avatar_url || authUser?.user_metadata?.avatar_url} alt={userProfile?.full_name || authUser?.user_metadata?.full_name} />
            <AvatarFallback>
              {userProfile?.full_name ? userProfile.full_name.charAt(0).toUpperCase() : authUser?.email ? authUser.email.charAt(0).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <TypographyP className="text-sm font-medium">
              {userProfile?.full_name || authUser?.user_metadata?.full_name || authUser?.email || 'User'}
            </TypographyP>
            {(userProfile?.job_title || authUser?.user_metadata?.user_name) && (
              <TypographyP className="text-xs text-muted-foreground">
                {userProfile?.job_title || authUser?.user_metadata?.user_name}
              </TypographyP>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


const UnauthHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, supabase } = useAuth();
  
  const handleSignOut = async () => {
    // Sign out using the global Supabase client
    await supabase.auth.signOut();
    
    // Force a page refresh to ensure a clean state
    window.location.href = "/";
  };
  
  return (
    <header className="py-5 px-4 md:px-6 lg:px-8 border-b border-muted/60">
      <div className="container mx-auto flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-8">
          <Button variant="link" className="text-foreground/70 hover:text-foreground hover:underline decoration-primary decoration-2 underline-offset-8 transition-all duration-200" asChild>
            <Link href="#how-it-works">How it Works</Link>
          </Button>
          <Button variant="link" className="text-foreground/70 hover:text-foreground hover:underline decoration-primary decoration-2 underline-offset-8 transition-all duration-200" asChild>
            <Link href="/companies">For Companies</Link>
          </Button>
          <Button variant="link" className="text-foreground/70 hover:text-foreground hover:underline decoration-primary decoration-2 underline-offset-8 transition-all duration-200" asChild>
            <Link href="/candidates">For Talents</Link>
          </Button>
        </nav>
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Button variant="link" className="text-foreground/70 hover:text-foreground" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button 
                onClick={handleSignOut} 
                className="shadow-primary rounded-xl px-6"
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button variant="link" className="text-foreground/70 hover:text-foreground" asChild>
                <Link href="/signin">Log in</Link>
              </Button>
              <Button className="shadow-primary rounded-xl px-6" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
        
        {/* Mobile menu button */}
        <Button 
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden py-6 px-4 border-t border-muted/60 animate-in fade-in slide-in-from-top-1 duration-200">
          <nav className="flex flex-col gap-5 mb-8">
            <Button 
              variant="link" 
              className="text-foreground/70 hover:text-foreground transition-colors py-1 justify-start"
              onClick={() => setMobileMenuOpen(false)}
              asChild
            >
              <Link href="#how-it-works">How it Works</Link>
            </Button>
            <Button 
              variant="link" 
              className="text-foreground/70 hover:text-foreground transition-colors py-1 justify-start"
              onClick={() => setMobileMenuOpen(false)}
              asChild
            >
              <Link href="/companies">For Companies</Link>
            </Button>
            <Button 
              variant="link" 
              className="text-foreground/70 hover:text-foreground transition-colors py-1 justify-start"
              onClick={() => setMobileMenuOpen(false)}
              asChild
            >
              <Link href="/candidates">For Talents</Link>
            </Button>
            <Button 
              variant="link" 
              className="text-foreground/70 hover:text-foreground transition-colors py-1 justify-start"
              onClick={() => setMobileMenuOpen(false)}
              asChild
            >
              <Link href="/blog">Resources</Link>
            </Button>
          </nav>
          <div className="flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <Button 
                  variant="link" 
                  className="text-foreground/70 hover:text-foreground w-full text-center py-2"
                  onClick={() => setMobileMenuOpen(false)}
                  asChild
                >
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button 
                  className="w-full shadow-primary rounded-xl"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="link" 
                  className="text-foreground/70 hover:text-foreground w-full text-center py-2"
                  onClick={() => setMobileMenuOpen(false)}
                  asChild
                >
                  <Link href="/signin">Log in</Link>
                </Button>
                <Button 
                  className="w-full shadow-primary rounded-xl"
                  onClick={() => setMobileMenuOpen(false)}
                  asChild
                >
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export { UnauthHeader, AuthHeader }; 