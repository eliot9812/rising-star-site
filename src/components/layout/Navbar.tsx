import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Academics', path: '/academics' },
  { name: 'Notices', path: '/notices' },
  { name: 'Admission', path: '/admission' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-card/95 backdrop-blur-md shadow-lg'
          : 'bg-primary'
      )}
    >
      <div className="container-school">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className={cn(
              
              'w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300',
              isScrolled ? 'bg-secondary' : 'bg-secondary-foreground/20'
            )}>
              <img src="/images/logo1.png" alt="Logo" />
              
              {/* <GraduationCap className={cn(
                'w-6 h-6 md:w-7 md:h-7 transition-colors',
                isScrolled ? 'text-primary-foreground' : 'text-primary-foreground'
              )} /> */}
            </div>
            <div className="hidden sm:block">
              <h1 className={cn(
                'font-heading font-bold text-lg md:text-xl leading-tight transition-colors',
                isScrolled ? 'text-foreground' : 'text-primary-foreground'
              )}>
                The Rising
              </h1>
              <p className={cn(
                'text-xs transition-colors',
                isScrolled ? 'text-muted-foreground' : 'text-primary-foreground/80'
              )}>
                English Secondary Boarding School
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-4 py-2 rounded-md font-medium transition-all duration-300',
                  location.pathname === link.path
                    ? isScrolled
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-primary-foreground/20 text-primary-foreground'
                    : isScrolled
                      ? 'text-foreground hover:bg-muted'
                      : 'text-primary-foreground/90 hover:bg-primary-foreground/10 hover:text-primary-foreground'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'lg:hidden',
              isScrolled ? 'text-foreground hover:bg-muted' : 'text-primary-foreground hover:bg-primary-foreground/10'
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'lg:hidden overflow-hidden transition-all duration-300',
            isOpen ? 'max-h-96 pb-4' : 'max-h-0'
          )}
        >
          <div className="flex flex-col gap-2 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-4 py-3 rounded-md font-medium transition-all duration-300',
                  location.pathname === link.path
                    ? isScrolled
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-primary-foreground/20 text-primary-foreground'
                    : isScrolled
                      ? 'text-foreground hover:bg-muted'
                      : 'text-primary-foreground/90 hover:bg-primary-foreground/10'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
