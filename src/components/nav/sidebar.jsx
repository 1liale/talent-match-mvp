import {
  Home,
  LogOut,
  HelpCircle,
  Briefcase,
  MessageSquare,
  Users,
  BookOpen,
  FileText,
  Search,
  Bell,
  Settings,
  Building,
  User
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { TypographyH3 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Logo from "@/components/base/logo";

const candidateMenuItems = [
  { title: "Dashboard", icon: Home, url: "/dashboard" },
  { title: "Profile", icon: User, url: "/profile" },
  { title: "Job Search", icon: Search, url: "/jobs" },
  { section: "Applications" },
  { title: "My Applications", icon: FileText, url: "/applications" },
  { title: "Saved Jobs", icon: Briefcase, url: "/saved-jobs" },
];

const employerMenuItems = [
  { title: "Dashboard", icon: Home, url: "/dashboard" },
  { title: "Company Profile", icon: Building, url: "/company" },
  { title: "Team", icon: Users, url: "/team" },
  { section: "Recruitment" },
  { title: "Post Jobs", icon: FileText, url: "/post-jobs" },
  { title: "Talent Search", icon: Search, url: "/talent-search" },
];

const Sidebar = ({ userType = "candidate" }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = userType === "employer" ? employerMenuItems : candidateMenuItems;

  useEffect(() => {
    setMounted(true);
    // Get the stored value after mounting
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sidebarOpen');
      setIsOpen(stored !== null ? stored === 'true' : true);
    }
  }, []);

  if (!mounted) {
    return null; // Return null on server-side and initial render
  }

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

  const handleLogout = async () => {
    // Replace with actual logout logic
    router.push("/");
  };

  return (
    <aside
      className={`relative h-screen border-r border-border flex-shrink-0 transition-all duration-300 ease-in-out cursor-pointer hidden md:block ${
        isOpen ? "w-[240px]" : "w-[60px]"
      }`}
      onClick={handleSidebarClick}
    >
      <div className="h-full flex flex-col bg-card border-border overflow-hidden">
        <div className="h-[70px] border-b border-border p-3 mb-2 flex items-center justify-between">
          {isOpen ? (
            <Logo />
          ) : (
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <span className="text-primary-foreground font-bold">TM</span>
            </div>
          )}
        </div>

        <div className="flex-1 p-2 flex flex-col justify-start gap-1 overflow-y-auto">
          {menuItems.map((item, index) => (
            <div key={index}>
              {isOpen && item.section && (
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2 mt-3">
                  {item.section}
                </div>
              )}
              {item.title && (
                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    "flex w-full items-center justify-start gap-3 px-3 py-2 rounded-lg",
                    {
                      "bg-muted": router.pathname === item.url,
                      "text-primary": router.pathname === item.url,
                    }
                  )}
                >
                  <Link href={item.url}>
                    {item.icon && (
                      <item.icon
                        className={cn("h-4 w-4", {
                          "text-primary": router.pathname === item.url,
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
              )}
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="p-2 border-t border-border flex flex-col gap-1">
          <Button
            asChild
            variant="ghost"
            className="flex w-full justify-start gap-3 px-3 py-2 text-muted-foreground hover:text-foreground rounded-lg"
          >
            <Link href="/settings">
              <Settings className="h-4 w-4 flex-shrink-0" />
              {isOpen && <span className="text-sm font-medium">Settings</span>}
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="flex w-full justify-start gap-3 px-3 py-2 text-muted-foreground hover:text-foreground rounded-lg"
          >
            <Link href="/help">
              <HelpCircle className="h-4 w-4 flex-shrink-0" />
              {isOpen && (
                <span className="text-sm font-medium">
                  Help Center
                </span>
              )}
            </Link>
          </Button>

          <Button
            className="flex w-full justify-start gap-3 px-3 py-2 text-muted-foreground hover:text-foreground rounded-lg"
            variant="ghost"
            onClick={handleLogout}
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