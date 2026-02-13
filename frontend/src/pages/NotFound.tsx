import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import SEO from "@/components/shared/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <SEO title="Page Not Found" />
      <div className="text-center max-w-md animate-fade-in">
        <h1 className="font-heading text-8xl font-bold text-primary mb-4">404</h1>
        <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <Button asChild>
          <Link to="/">
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
