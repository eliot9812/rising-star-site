import { notices } from '@/data/mockData';
import { Bell } from 'lucide-react';

const NewsTicker = () => {
  // Duplicate notices for seamless loop
  const tickerContent = [...notices, ...notices];

  return (
    <div className="bg-secondary text-secondary-foreground overflow-hidden">
      <div className="container-school flex items-center">
        <div className="flex-shrink-0 bg-primary px-4 py-2 flex items-center gap-2">
          <Bell className="w-4 h-4 animate-bounce-soft" />
          <span className="font-semibold text-sm">Notices</span>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="animate-ticker flex whitespace-nowrap py-2">
            {tickerContent.map((notice, index) => (
              <span key={`${notice.id}-${index}`} className="inline-flex items-center px-8">
                <span className="text-sm">
                  {notice.isNew && (
                    <span className="bg-school-gold text-school-dark text-xs font-bold px-2 py-0.5 rounded mr-2">
                      NEW
                    </span>
                  )}
                  {notice.title}
                </span>
                <span className="mx-8 text-secondary-foreground/50">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
