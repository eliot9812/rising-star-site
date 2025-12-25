import { useParams, Link } from 'react-router-dom';
import { notices } from '@/data/mockData';
import PageHero from '@/components/shared/PageHero';
import NoticeAttachment from '@/components/shared/NoticeAttachment';
import { Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';

const NoticeDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Dynamic loading from data source - Backend ready with ID-based loading
  const notice = notices.find(n => n.id === id);

  if (!notice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">Notice Not Found</h1>
          <p className="text-muted-foreground mb-6">The notice you're looking for doesn't exist.</p>
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

                {/* Attachment (Image or PDF) */}
                {notice.attachment && (
                  <NoticeAttachment
                    attachment={notice.attachment}
                    attachmentType={notice.attachmentType}
                    attachmentName={notice.attachmentName}
                    title={notice.title}
                    variant="detail"
                  />
                )}

                {/* Title */}
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">
                  {notice.title}
                </h1>

                {/* Full Content */}
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  {notice.fullContent.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>

              {/* Navigation to other notices */}
              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Other Notices</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {notices
                    .filter(n => n.id !== notice.id)
                    .slice(0, 2)
                    .map(n => (
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
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default NoticeDetail;