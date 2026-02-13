import { Link, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Notice } from '@/data/mockData';
import PageHero from '@/components/shared/PageHero';
import NoticeAttachment from '@/components/shared/NoticeAttachment';
import { Calendar, ArrowRight, Loader2 } from 'lucide-react';
import SEO from '@/components/shared/SEO';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Notices = () => {
  const location = useLocation();
  const noticeRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch notices from API
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/notices`);
        const data = await response.json();
        if (data.success) {
          setNotices(data.data);
        } else {
          setError('Failed to load notices');
        }
      } catch (err) {
        console.error('Error fetching notices:', err);
        setError('Failed to connect to server');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotices();
  }, []);

  // Scroll to and highlight specific notice if navigated from slider
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const highlightId = params.get('highlight');

    if (highlightId && noticeRefs.current[highlightId]) {
      // Scroll to the notice with a slight delay for page load
      setTimeout(() => {
        noticeRefs.current[highlightId]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        // Add highlight effect
        noticeRefs.current[highlightId]?.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
        // Remove highlight after 3 seconds
        setTimeout(() => {
          noticeRefs.current[highlightId]?.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
        }, 3000);
      }, 300);
    }
  }, [location.search]);

  return (
    <>
      <SEO
        title="Notices & Announcements | School in Sundarharaincha"
        description="Latest notices, announcements, and news from The Rising English Boarding School, Sundarharaincha-10, Morang. Stay updated with exam schedules, events, and admissions."
        keywords="school notices sundarharaincha, school announcements biratchowk, TRESBS news, school events morang"
        url="https://therisingenglishschool.com/notices"
      />

      <div className="min-h-screen">
        <PageHero
          title="Notices & Announcements"
          subtitle="Stay updated with the latest news and announcements from our school"
          breadcrumbs={[{ label: 'Notices' }]}
        />

        {/* Notices List */}
        <section className="section-padding">
          <div className="container-school">
            <div className="max-w-4xl mx-auto space-y-6">
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Loading notices...</span>
                </div>
              )}

              {error && !isLoading && (
                <div className="text-center py-12">
                  <p className="text-destructive">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 text-primary underline"
                  >
                    Try again
                  </button>
                </div>
              )}

              {!isLoading && !error && notices.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No notices available at the moment.</p>
                </div>
              )}

              {!isLoading && !error && notices.map((notice, index) => (
                <div
                  key={notice.id}
                  ref={(el) => { noticeRefs.current[notice.id] = el; }}
                  className="transition-all duration-300"
                >
                  <Link
                    to={`/notices/${notice.id}`}
                    className="block bg-card rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 group animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Attachment (Image or PDF) */}
                      {notice.attachment && (
                        <NoticeAttachment
                          attachment={notice.attachment}
                          attachmentType={notice.attachmentType}
                          attachmentName={notice.attachmentName}
                          title={notice.title}
                          variant="list"
                        />
                      )}

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            {notice.isNew && (
                              <span className="px-2 py-0.5 bg-school-gold text-school-dark text-xs font-bold rounded">
                                NEW
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              {new Date(notice.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>

                        <h2 className="font-heading text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {notice.title}
                        </h2>

                        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                          {notice.description}
                        </p>

                        <span className="inline-flex items-center gap-1 text-primary font-medium text-sm group-hover:gap-2 transition-all">
                          Read More <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Notices;