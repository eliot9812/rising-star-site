import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { schoolInfo } from '@/data/mockData';

const FloatingCallButton = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Pulse Ring Effect */}
      <div className="absolute inset-0 rounded-full bg-primary animate-pulse-ring" />
      <div className="absolute inset-0 rounded-full bg-primary animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
      
      {/* Button */}
      <Button
        variant="call"
        size="iconLg"
        asChild
        className="relative shadow-glow"
      >
        <a href={`tel:${schoolInfo.phone}`} aria-label="Call us">
          <Phone className="w-6 h-6" />
        </a>
      </Button>
    </div>
  );
};

export default FloatingCallButton;
