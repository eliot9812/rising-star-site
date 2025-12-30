import { FileText, Download, Eye, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import ImageModal from './ImageModal';

interface NoticeAttachmentProps {
  attachment: string;
  attachmentType?: 'image' | 'pdf';
  attachmentName?: string;
  title: string;
  variant?: 'list' | 'detail';
}

/**
 * Reusable component to display notice attachments (images or PDFs)
 * Backend-ready: supports both URL strings and object URLs
 * Images are clickable and open in a full-screen modal (same tab)
 * PDFs have embedded viewer option and download button
 */
const NoticeAttachment = ({ 
  attachment, 
  attachmentType = 'image', 
  attachmentName,
  title,
  variant = 'list'
}: NoticeAttachmentProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPdfEmbed, setShowPdfEmbed] = useState(false);

  if (!attachment) return null;

  // Determine if it's a PDF based on type or file extension
  const isPdf = attachmentType === 'pdf' || 
    attachment.toLowerCase().endsWith('.pdf') ||
    attachmentName?.toLowerCase().endsWith('.pdf');

  if (isPdf) {
    return (
      <div className={`${variant === 'detail' ? 'mb-8' : ''}`}>
        {/* PDF Info Card */}
        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg border border-border">
          <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-destructive" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate text-sm">
              {attachmentName || 'PDF Document'}
            </p>
            <p className="text-xs text-muted-foreground">PDF File</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {variant === 'detail' && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowPdfEmbed(!showPdfEmbed);
                }}
                className="gap-1"
              >
                <Eye className="w-3 h-3" />
                <span className="hidden sm:inline">{showPdfEmbed ? 'Hide' : 'View'}</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              asChild
              className="gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <a href={attachment} download={attachmentName || 'document.pdf'}>
                <Download className="w-3 h-3" />
                <span className="hidden sm:inline">Download</span>
              </a>
            </Button>
          </div>
        </div>

        {/* Embedded PDF Viewer (detail view only) */}
        {variant === 'detail' && showPdfEmbed && (
          <div className="mt-4 rounded-lg overflow-hidden border border-border bg-muted">
            <iframe
              src={`${attachment}#toolbar=1&navpanes=0`}
              className="w-full h-[70vh] min-h-[400px]"
              title={attachmentName || 'PDF Document'}
            />
          </div>
        )}
      </div>
    );
  }

  // Image attachment
  if (variant === 'list') {
    return (
      <div className="w-full md:w-48 h-40 md:h-32 rounded-lg overflow-hidden flex-shrink-0">
        <img 
          src={attachment} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
    );
  }

  // Detail view for images - clickable with zoom indicator
  return (
    <>
      <div 
        className="mb-8 rounded-xl overflow-hidden cursor-pointer group relative"
        onClick={() => setIsModalOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsModalOpen(true)}
        aria-label={`View ${title} in full screen`}
      >
        <img 
          src={attachment} 
          alt={title}
          className="w-full h-auto max-h-96 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />
        {/* Zoom overlay indicator */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3 shadow-lg">
            <ZoomIn className="w-6 h-6 text-foreground" />
          </div>
        </div>
        <p className="text-center text-muted-foreground text-sm mt-2">Click image to view full size</p>
      </div>

      {/* Full-screen image modal */}
      <ImageModal
        src={attachment}
        alt={title}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default NoticeAttachment;
