import { Link } from 'react-router-dom';
import { notices } from '@/data/mockData';
import PageHero from '@/components/shared/PageHero';
import { Calendar, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Notices = () => {
  return (
    <>
      <Helmet>
        <title>Notices | The Rising English Secondary Boarding School</title>
        <meta name="description" content="Stay updated with the latest notices, announcements, and news from The Rising English Secondary Boarding School." />
      </Helmet>

      <div>
        <PageHero 
          title="Notices & Announcements" 
          subtitle="Stay updated with the latest news and announcements from our school"
          breadcrumbs={[{ label: 'Notices' }]}
        />

        {/* Notices List */}
        <section className="section-padding">
          <div className="container-school">
            <div className="max-w-4xl mx-auto space-y-6">
              {notices.map((notice, index) => (
                <Link
                  key={notice.id}
                  to={`/notices/${notice.id}`}
                  className="block bg-card rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 group animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Image */}
                    {notice.image && (
                      <div className="w-full md:w-48 h-40 md:h-32 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={notice.image} 
                          alt={notice.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
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
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Notices;