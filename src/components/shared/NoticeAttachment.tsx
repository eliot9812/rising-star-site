import { FileText, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
 */
const NoticeAttachment = ({ 
  attachment, 
  attachmentType = 'image', 
  attachmentName,
  title,
  variant = 'list'
}: NoticeAttachmentProps) => {
  if (!attachment) return null;

  // Determine if it's a PDF based on type or file extension
  const isPdf = attachmentType === 'pdf' || 
    attachment.toLowerCase().endsWith('.pdf') ||
    attachmentName?.toLowerCase().endsWith('.pdf');

  if (isPdf) {
    return (
      <div className={`
        flex items-center gap-3 p-4 bg-muted rounded-lg border border-border
        ${variant === 'detail' ? 'mb-8' : ''}
      `}>
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
          <Button
            variant="outline"
            size="sm"
            asChild
            className="gap-1"
          >
            <a href={attachment} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3 h-3" />
              <span className="hidden sm:inline">View</span>
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="gap-1"
          >
            <a href={attachment} download={attachmentName || 'document.pdf'}>
              <Download className="w-3 h-3" />
              <span className="hidden sm:inline">Download</span>
            </a>
          </Button>
        </div>
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

  // Detail view for images
  return (
    <div className="mb-8 rounded-xl overflow-hidden">
      <img 
        src={attachment} 
        alt={title}
        className="w-full h-auto max-h-96 object-cover"
        loading="lazy"
      />
    </div>
  );
};

export default NoticeAttachment;
