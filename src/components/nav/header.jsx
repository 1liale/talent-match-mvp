import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/base/logo";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, signOut } = useAuth();
  const router = useRouter();
  
  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      router.push('/');
    }
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
                <Link href="/auth/signin">Log in</Link>
              </Button>
              <Button className="shadow-primary rounded-xl px-6" asChild>
                <Link href="/auth/signup">Get Started</Link>
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
                  <Link href="/auth/signin">Log in</Link>
                </Button>
                <Button 
                  className="w-full shadow-primary rounded-xl"
                  onClick={() => setMobileMenuOpen(false)}
                  asChild
                >
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 