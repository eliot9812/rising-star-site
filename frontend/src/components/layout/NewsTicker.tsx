import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Notice } from '@/data/mockData';
import { Bell } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

const NewsTicker = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/notices`);
        const data = await response.json();
        if (data.success) {
          setNotices(data.data);
        }
      } catch (error) {
        console.error('Error fetching notices for ticker:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotices();
  }, []);

  // Duplicate notices for seamless loop
  const tickerContent = [...notices, ...notices];

  const handleNoticeClick = (noticeId: string) => {
    // Navigate directly to notice detail page (same tab)
    navigate(`/notices/${noticeId}`);
  };

  // Don't render if no notices
  if (isLoading || notices.length === 0) {
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
          <div className="overflow-hidden flex-1 py-2 px-4">
            <span className="text-sm text-secondary-foreground/70">
              {isLoading ? 'Loading notices...' : 'No notices available'}
            </span>
          </div>
        </div>
      </div>
    );
  }

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
