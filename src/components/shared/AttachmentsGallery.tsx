import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, FileText, Download, Eye, ZoomIn, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NoticeAttachmentData } from '@/data/mockData';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';

interface AttachmentsGalleryProps {
  attachments: NoticeAttachmentData[];
  title: string;
}

/**
 * Gallery/Carousel component for displaying multiple notice attachments
 * Supports images and PDFs with swipe gestures and navigation
 * Backend-ready: works with any URL-based attachment system
 */
const AttachmentsGallery = ({ attachments, title }: AttachmentsGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [showPdfEmbed, setShowPdfEmbed] = useState<string | null>(null);

  // Filter images for modal navigation
  const imageAttachments = attachments.filter(a => a.type === 'image');

  // Handle keyboard navigation in modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isImageModalOpen) return;
      
      if (e.key === 'Escape') {
        setIsImageModalOpen(false);
      } else if (e.key === 'ArrowRight') {
        setModalImageIndex((prev) => (prev + 1) % imageAttachments.length);
      } else if (e.key === 'ArrowLeft') {
        setModalImageIndex((prev) => (prev - 1 + imageAttachments.length) % imageAttachments.length);
      }
    };

    if (isImageModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isImageModalOpen, imageAttachments.length]);

  const openImageModal = useCallback((attachmentId: string) => {
    const index = imageAttachments.findIndex(a => a.id === attachmentId);
    if (index !== -1) {
      setModalImageIndex(index);
      setIsImageModalOpen(true);
    }
  }, [imageAttachments]);

  if (!attachments || attachments.length === 0) return null;

  // Single attachment - simplified view
  if (attachments.length === 1) {
    const attachment = attachments[0];
    
    if (attachment.type === 'pdf') {
      return (
        <div className="mb-8">
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg border border-border">
            <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-destructive" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate text-sm">{attachment.name}</p>
              <p className="text-xs text-muted-foreground">PDF File</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPdfEmbed(showPdfEmbed === attachment.id ? null : attachment.id)}
                className="gap-1"
              >
                <Eye className="w-3 h-3" />
                <span className="hidden sm:inline">{showPdfEmbed === attachment.id ? 'Hide' : 'View'}</span>
              </Button>
              <Button variant="outline" size="sm" asChild className="gap-1">
                <a href={attachment.url} download={attachment.name}>
                  <Download className="w-3 h-3" />
                  <span className="hidden sm:inline">Download</span>
                </a>
              </Button>
            </div>
          </div>
          {showPdfEmbed === attachment.id && (
            <div className="mt-4 rounded-lg overflow-hidden border border-border bg-muted">
              <iframe
                src={`${attachment.url}#toolbar=1&navpanes=0`}
                className="w-full h-[70vh] min-h-[400px]"
                title={attachment.name}
              />
            </div>
          )}
        </div>
      );
    }

    // Single image
    return (
      <>
        <div 
          className="mb-8 rounded-xl overflow-hidden cursor-pointer group relative"
          onClick={() => openImageModal(attachment.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && openImageModal(attachment.id)}
          aria-label={`View ${title} in full screen`}
        >
          <img 
            src={attachment.url} 
            alt={title}
            className="w-full h-auto max-h-96 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3 shadow-lg">
              <ZoomIn className="w-6 h-6 text-foreground" />
            </div>
          </div>
          <p className="text-center text-muted-foreground text-sm mt-2">Click image to view full size</p>
        </div>

        {/* Image Modal */}
        {isImageModalOpen && imageAttachments[modalImageIndex] && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsImageModalOpen(false)}
          >
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close image"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative max-w-[95vw] max-h-[95vh] p-4" onClick={(e) => e.stopPropagation()}>
              <img
                src={imageAttachments[modalImageIndex].url}
                alt={title}
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />
            </div>
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              Click anywhere or press Escape to close
            </p>
          </div>
        )}
      </>
    );
  }

  // Multiple attachments - carousel view
  return (
    <>
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{attachments.length} attachments</p>
        </div>
        
        <Carousel className="w-full">
          <CarouselContent>
            {attachments.map((attachment, index) => (
              <CarouselItem key={attachment.id}>
                {attachment.type === 'pdf' ? (
                  <div className="p-1">
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg border border-border">
                      <div className="w-16 h-16 bg-destructive/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-8 h-8 text-destructive" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{attachment.name}</p>
                        <p className="text-sm text-muted-foreground">PDF File</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowPdfEmbed(showPdfEmbed === attachment.id ? null : attachment.id)}
                          className="gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          {showPdfEmbed === attachment.id ? 'Hide' : 'View'}
                        </Button>
                        <Button variant="outline" size="sm" asChild className="gap-1">
                          <a href={attachment.url} download={attachment.name}>
                            <Download className="w-3 h-3" />
                            Download
                          </a>
                        </Button>
                      </div>
                    </div>
                    {showPdfEmbed === attachment.id && (
                      <div className="mt-4 rounded-lg overflow-hidden border border-border bg-muted">
                        <iframe
                          src={`${attachment.url}#toolbar=1&navpanes=0`}
                          className="w-full h-[60vh] min-h-[350px]"
                          title={attachment.name}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div 
                    className="p-1 cursor-pointer group relative rounded-xl overflow-hidden"
                    onClick={() => openImageModal(attachment.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && openImageModal(attachment.id)}
                  >
                    <img 
                      src={attachment.url} 
                      alt={`${title} - ${index + 1}`}
                      className="w-full h-64 sm:h-80 object-cover rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                    <div className="absolute inset-1 rounded-lg bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3 shadow-lg">
                        <ZoomIn className="w-6 h-6 text-foreground" />
                      </div>
                    </div>
                  </div>
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {attachments.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === activeIndex ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        <p className="text-center text-muted-foreground text-xs mt-2">
          Swipe or use arrows to navigate • Click images to view full size
        </p>
      </div>

      {/* Full-screen image modal with navigation */}
      {isImageModalOpen && imageAttachments[modalImageIndex] && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsImageModalOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close image"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation arrows */}
          {imageAttachments.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setModalImageIndex((prev) => (prev - 1 + imageAttachments.length) % imageAttachments.length);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setModalImageIndex((prev) => (prev + 1) % imageAttachments.length);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Image */}
          <div 
            className="relative max-w-[95vw] max-h-[95vh] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageAttachments[modalImageIndex].url}
              alt={`${title} - ${modalImageIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            {/* Image counter */}
            <p className="text-center text-white/80 mt-4 text-sm">
              {modalImageIndex + 1} / {imageAttachments.length}
            </p>
          </div>

          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            Use arrow keys to navigate • Press Escape to close
          </p>
        </div>
      )}
    </>
  );
};

export default AttachmentsGallery;