import { Link, useNavigate } from 'react-router-dom';
import { notices } from '@/data/mockData';
import { Bell } from 'lucide-react';

const NewsTicker = () => {
  const navigate = useNavigate();
  // Duplicate notices for seamless loop
  const tickerContent = [...notices, ...notices];

  const handleNoticeClick = (noticeId: string) => {
    // Navigate to notices page with highlight parameter
    navigate(`/notices?highlight=${noticeId}`);
  };

  return (
    <div className="bg-secondary text-secondary-foreground overflow-hidden">
      <div className="container-school flex items-center">
        <Link 
          to="/notices"
          className="flex-shrink-0 bg-primary px-4 py-2 flex items-center gap-2 hover:bg-primary/90 transition-colors"
        >
          <Bell className="w-4 h-4 animate-bounce-soft" />
          <span className="font-semibold text-sm">Notices</span>
        </Link>
        <div className="overflow-hidden flex-1">
          <div className="animate-ticker flex whitespace-nowrap py-2">
            {tickerContent.map((notice, index) => (
              <button 
                key={`${notice.id}-${index}`} 
                onClick={() => handleNoticeClick(notice.id)}
                className="inline-flex items-center px-8 hover:text-primary-foreground hover:bg-secondary-foreground/10 transition-colors cursor-pointer group text-left"
              >
                <span className="text-sm group-hover:underline">
                  {notice.isNew && (
                    <span className="bg-school-gold text-school-dark text-xs font-bold px-2 py-0.5 rounded mr-2">
                      NEW
                    </span>
                  )}
                  {notice.title}
                </span>
                <span className="mx-8 text-secondary-foreground/50">•</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;