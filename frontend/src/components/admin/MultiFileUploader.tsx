import { useState, useCallback } from 'react';
import { X, FileText, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NoticeAttachmentData } from '@/data/mockData';

interface FileWithPreview {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'pdf';
  name: string;
}

interface MultiFileUploaderProps {
  files: FileWithPreview[];
  onChange: (files: FileWithPreview[]) => void;
  existingAttachments?: NoticeAttachmentData[];
  onRemoveExisting?: (id: string) => void;
  label?: string;
}

/**
 * Multi-file uploader component for notice attachments
 * Supports multiple images and PDFs with previews
 * Backend-ready: generates Object URLs for frontend, ready for storage integration
 * 
 * TODO: Backend Integration
 * - Replace Object URLs with actual upload API calls
 * - Handle upload progress
 * - Implement file validation on server
 */
const MultiFileUploader = ({
  files,
  onChange,
  existingAttachments = [],
  onRemoveExisting,
  label = 'Attachments (Images & PDFs)'
}: MultiFileUploaderProps) => {
  
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    const validFiles: FileWithPreview[] = [];
    
    selectedFiles.forEach(file => {
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';
      
      // Only accept images and PDFs
      if (isImage || isPdf) {
        validFiles.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          preview: URL.createObjectURL(file),
          type: isPdf ? 'pdf' : 'image',
          name: file.name
        });
      }
    });
    
    if (validFiles.length > 0) {
      onChange([...files, ...validFiles]);
    }
    
    // Reset input to allow selecting same files again
    e.target.value = '';
  }, [files, onChange]);

  const removeFile = useCallback((id: string) => {
    const fileToRemove = files.find(f => f.id === id);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    onChange(files.filter(f => f.id !== id));
  }, [files, onChange]);

  const totalCount = files.length + existingAttachments.length;

  return (
    <div className="space-y-4">
      <Label className="block">{label}</Label>
      
      {/* File Input */}
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
        <Input
          type="file"
          accept="image/jpeg,image/png,image/webp,.pdf"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="multi-file-upload"
        />
        <label 
          htmlFor="multi-file-upload" 
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <Upload className="w-8 h-8 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Click to upload files</span>
          <span className="text-xs text-muted-foreground">
            JPG, PNG, WEBP, PDF • Multiple files allowed
          </span>
        </label>
      </div>

      {/* File Count */}
      {totalCount > 0 && (
        <p className="text-sm text-muted-foreground">
          {totalCount} file{totalCount !== 1 ? 's' : ''} selected
        </p>
      )}

      {/* Existing Attachments (Edit mode) */}
      {existingAttachments.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Current Attachments
          </p>
          <div className="grid gap-2">
            {existingAttachments.map((attachment) => (
              <div 
                key={attachment.id}
                className="relative flex items-center gap-3 p-3 bg-muted rounded-lg border border-border"
              >
                {attachment.type === 'image' ? (
                  <img 
                    src={attachment.url} 
                    alt={attachment.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-destructive/10 rounded flex items-center justify-center">
                    <FileText className="w-6 h-6 text-destructive" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{attachment.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{attachment.type}</p>
                </div>
                {onRemoveExisting && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => onRemoveExisting(attachment.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Files Preview */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            New Files
          </p>
          <div className="grid gap-2">
            {files.map((file) => (
              <div 
                key={file.id}
                className="relative flex items-center gap-3 p-3 bg-muted rounded-lg border border-border"
              >
                {file.type === 'image' ? (
                  <img 
                    src={file.preview} 
                    alt={file.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-destructive/10 rounded flex items-center justify-center">
                    <FileText className="w-6 h-6 text-destructive" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{file.type}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => removeFile(file.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Backend integration comment */}
      {/* TODO: Backend Integration Points:
        * 1. On form submit, upload each file to storage (e.g., Supabase Storage)
        * 2. Get permanent URLs for each uploaded file
        * 3. Save URLs in the notice.attachments array
        * 4. Handle upload progress for better UX
        * 5. Implement server-side file validation
        */}
    </div>
  );
};

export default MultiFileUploader;

// Helper type for external use
export type { FileWithPreview };