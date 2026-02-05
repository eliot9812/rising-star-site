import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Notice } from '@/data/mockData';
import PageHero from '@/components/shared/PageHero';
import NoticeAttachment from '@/components/shared/NoticeAttachment';
import AttachmentsGallery from '@/components/shared/AttachmentsGallery';
import { Calendar, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const NoticeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [otherNotices, setOtherNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch the specific notice
        const response = await fetch(`${API_BASE_URL}/notices/${id}`);
        const data = await response.json();

        if (data.success) {
          setNotice(data.data);
        } else {
          setError('Notice not found');
        }

        // Fetch all notices for "Other Notices" section
        const allResponse = await fetch(`${API_BASE_URL}/notices`);
        const allData = await allResponse.json();
        if (allData.success) {
          setOtherNotices(allData.data.filter((n: Notice) => n.id !== id).slice(0, 2));
        }
      } catch (err) {
        console.error('Error fetching notice:', err);
        setError('Failed to load notice');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchNotice();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 mx-auto text-primary animate-spin" />
          <p className="text-muted-foreground mt-4">Loading notice...</p>
        </div>
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">Notice Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || "The notice you're looking for doesn't exist."}</p>
          <Link to="/notices">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Notices
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{notice.title} | The Rising English Secondary Boarding School</title>
        <meta name="description" content={notice.description} />
        <meta property="og:title" content={notice.title} />
        <meta property="og:description" content={notice.description} />
        {notice.attachment && notice.attachmentType === 'image' && (
          <meta property="og:image" content={notice.attachment} />
        )}
      </Helmet>

      <div>
        <PageHero
          title={notice.title}
          breadcrumbs={[
            { label: 'Notices', path: '/notices' },
            { label: 'Notice Details' }
          ]}
        />

        {/* Notice Content */}
        <section className="section-padding">
          <div className="container-school">
            <div className="max-w-3xl mx-auto">
              {/* Back Link */}
              <Link
                to="/notices"
                className="inline-flex items-center gap-2 text-primary hover:underline mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to All Notices
              </Link>

              <article className="bg-card rounded-xl p-8 shadow-school">
                {/* Meta Info */}
                <div className="flex items-center gap-4 mb-6 flex-wrap">
                  {notice.isNew && (
                    <span className="px-3 py-1 bg-school-gold text-school-dark text-sm font-bold rounded">
                      NEW
                    </span>
                  )}
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-5 h-5" />
                    {new Date(notice.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                {/* Multiple Attachments Gallery (Images & PDFs) */}
                {notice.attachments && notice.attachments.length > 0 ? (
                  <AttachmentsGallery
                    attachments={notice.attachments}
                    title={notice.title}
                  />
                ) : notice.attachment ? (
                  /* Legacy single attachment support */
                  <NoticeAttachment
                    attachment={notice.attachment}
                    attachmentType={notice.attachmentType}
                    attachmentName={notice.attachmentName}
                    title={notice.title}
                    variant="detail"
                  />
                ) : null}

                {/* Title */}
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">
                  {notice.title}
                </h1>

                {/* Full Content */}
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  {notice.fullContent?.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>

              {/* Navigation to other notices */}
              {otherNotices.length > 0 && (
                <div className="mt-8 pt-8 border-t border-border">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Other Notices</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {otherNotices.map(n => (
                      <Link
                        key={n.id}
                        to={`/notices/${n.id}`}
                        className="bg-muted p-4 rounded-lg hover:bg-accent transition-colors"
                      >
                        <p className="font-medium text-foreground line-clamp-2">{n.title}</p>
                        <span className="text-sm text-muted-foreground mt-1 block">{n.date}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default NoticeDetail;
