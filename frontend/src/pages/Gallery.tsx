import { useState, useEffect } from 'react';
import { GalleryEvent, GalleryEventPhoto } from '@/data/mockData';
import { X, ChevronLeft, ChevronRight, Calendar, Images, Loader2 } from 'lucide-react';
import PageHero from '@/components/shared/PageHero';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get full URL for gallery images
const getFullUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('/uploads')) {
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}${url}`;
  }
  return url;
};

const Gallery = () => {
  const [galleryEvents, setGalleryEvents] = useState<GalleryEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<GalleryEvent | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryEventPhoto | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);

  // Fetch gallery events from API
  useEffect(() => {
    const fetchGalleryEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/gallery`);
        const data = await response.json();
        if (data.success) {
          setGalleryEvents(data.data);
        } else {
          setError('Failed to load gallery');
        }
      } catch (err) {
        console.error('Error fetching gallery events:', err);
        setError('Failed to connect to server');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGalleryEvents();
  }, []);

  const openEventModal = (event: GalleryEvent) => {
    setSelectedEvent(event);
    setSelectedPhoto(null);
  };

  const closeEventModal = () => {
    setSelectedEvent(null);
    setSelectedPhoto(null);
    setCurrentPhotoIndex(0);
  };

  const openPhotoLightbox = (photo: GalleryEventPhoto, index: number) => {
    setSelectedPhoto(photo);
    setCurrentPhotoIndex(index);
  };

  const closePhotoLightbox = () => {
    setSelectedPhoto(null);
  };

  const navigatePhoto = (direction: 'prev' | 'next') => {
    if (!selectedEvent) return;

    let newIndex: number;
    if (direction === 'prev') {
      newIndex = currentPhotoIndex === 0 ? selectedEvent.photos.length - 1 : currentPhotoIndex - 1;
    } else {
      newIndex = currentPhotoIndex === selectedEvent.photos.length - 1 ? 0 : currentPhotoIndex + 1;
    }

    setCurrentPhotoIndex(newIndex);
    setSelectedPhoto(selectedEvent.photos[newIndex]);
  };

  return (
    <div className="min-h-screen">
      <PageHero
        title="Photo Gallery"
        subtitle="Explore moments captured from our vibrant school events"
        breadcrumbs={[{ label: 'Gallery' }]}
      />

      {/* Events Grid */}
      <section className="section-padding">
        <div className="container-school">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
              Event Wise Photos
            </h2>
            <p className="text-muted-foreground">
              Click on an event to view all photos from that occasion
            </p>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading gallery...</span>
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

          {!isLoading && !error && galleryEvents.length === 0 && (
            <div className="text-center py-12">
              <Images className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No gallery events available yet.</p>
            </div>
          )}

          {!isLoading && !error && galleryEvents.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="group relative overflow-hidden rounded-xl cursor-pointer shadow-lg animate-scale-in hover:shadow-xl transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => openEventModal(event)}
                >
                  {/* Cover Image */}
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={getFullUrl(event.coverPhoto)}
                      alt={event.eventName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent flex flex-col justify-end p-4">
                    <h3 className="font-heading text-lg font-bold text-primary-foreground mb-1">
                      {event.eventName}
                    </h3>
                    <div className="flex items-center gap-4 text-primary-foreground/80 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Images className="w-4 h-4" />
                        {event.photos.length} Photos
                      </span>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      View Photos
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Event Modal - Shows all photos from the event */}
      {selectedEvent && !selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-foreground/95 backdrop-blur-sm overflow-y-auto animate-fade-in"
          onClick={closeEventModal}
        >
          <div className="min-h-screen py-8 px-4">
            {/* Close Button */}
            <button
              className="fixed top-4 right-4 z-60 w-12 h-12 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center hover:bg-card/40 transition-colors"
              onClick={closeEventModal}
            >
              <X className="w-6 h-6 text-primary-foreground" />
            </button>

            {/* Event Header */}
            <div className="max-w-6xl mx-auto mb-8 text-center" onClick={(e) => e.stopPropagation()}>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                {selectedEvent.eventName}
              </h2>
              <p className="text-primary-foreground/70 mb-2">{selectedEvent.description}</p>
              <div className="flex items-center justify-center gap-4 text-primary-foreground/60 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Images className="w-4 h-4" />
                  {selectedEvent.photos.length} Photos
                </span>
              </div>
            </div>

            {/* Photos Grid */}
            <div
              className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedEvent.photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer animate-scale-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => openPhotoLightbox(photo, index)}
                >
                  <img
                    src={getFullUrl(photo.src)}
                    alt={photo.alt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-all duration-300 flex items-end">
                    <div className="p-2 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full bg-gradient-to-t from-foreground/80 to-transparent">
                      <p className="text-sm truncate">{photo.alt}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Photo Lightbox - Full screen single photo view with navigation */}
      {selectedPhoto && selectedEvent && (
        <div
          className="fixed inset-0 z-[60] bg-foreground/95 flex items-center justify-center p-4 animate-fade-in"
          onClick={closePhotoLightbox}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 z-70 w-12 h-12 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center hover:bg-card/40 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              closePhotoLightbox();
            }}
          >
            <X className="w-6 h-6 text-primary-foreground" />
          </button>

          {/* Previous Button */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center hover:bg-card/40 transition-colors z-70"
            onClick={(e) => {
              e.stopPropagation();
              navigatePhoto('prev');
            }}
          >
            <ChevronLeft className="w-6 h-6 text-primary-foreground" />
          </button>

          {/* Next Button */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center hover:bg-card/40 transition-colors z-70"
            onClick={(e) => {
              e.stopPropagation();
              navigatePhoto('next');
            }}
          >
            <ChevronRight className="w-6 h-6 text-primary-foreground" />
          </button>

          {/* Image */}
          <div className="max-w-full max-h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={getFullUrl(selectedPhoto.src)}
              alt={selectedPhoto.alt}
              className="max-w-full max-h-[75vh] rounded-lg shadow-2xl animate-scale-in object-contain"
            />
            <div className="mt-4 text-center">
              <p className="text-primary-foreground font-medium">{selectedPhoto.alt}</p>
              <p className="text-primary-foreground/60 text-sm mt-1">
                {currentPhotoIndex + 1} of {selectedEvent.photos.length}
              </p>
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto pb-2 px-4"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedEvent.photos.map((photo, index) => (
              <button
                key={photo.id}
                className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${index === currentPhotoIndex
                  ? 'ring-2 ring-primary scale-110'
                  : 'opacity-60 hover:opacity-100'
                  }`}
                onClick={() => openPhotoLightbox(photo, index)}
              >
                <img
                  src={getFullUrl(photo.src)}
                  alt={photo.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
