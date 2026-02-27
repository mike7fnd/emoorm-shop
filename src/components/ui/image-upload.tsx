'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  /** Current image URL (for preview) */
  value?: string;
  /** Callback when image is selected (returns the File) */
  onFileSelected: (file: File) => void;
  /** Callback to clear the image */
  onClear?: () => void;
  /** Whether uploading is in progress */
  isUploading?: boolean;
  /** Shape of the preview: 'square' | 'circle' | 'banner' */
  shape?: 'square' | 'circle' | 'banner';
  /** Custom className for the container */
  className?: string;
  /** Label text */
  label?: string;
  /** Accepted file types */
  accept?: string;
  /** Max file size in MB */
  maxSizeMB?: number;
  /** Whether the component is disabled */
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onFileSelected,
  onClear,
  isUploading = false,
  shape = 'square',
  className,
  label,
  accept = 'image/jpeg,image/png,image/webp,image/gif',
  maxSizeMB = 5,
  disabled = false,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayUrl = preview || value;

  const handleFile = useCallback((file: File) => {
    setError(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Image must be smaller than ${maxSizeMB}MB`);
      return;
    }

    // Create preview
    const url = URL.createObjectURL(file);
    setPreview(url);
    onFileSelected(file);
  }, [maxSizeMB, onFileSelected]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleClear = () => {
    setPreview(null);
    setError(null);
    onClear?.();
  };

  const shapeClasses = {
    square: 'aspect-square rounded-xl',
    circle: 'aspect-square rounded-full',
    banner: 'aspect-[3/1] rounded-xl',
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && <p className="text-sm font-medium">{label}</p>}

      <div
        onClick={() => !disabled && !isUploading && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative overflow-hidden border-2 border-dashed cursor-pointer transition-colors',
          shapeClasses[shape],
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50',
          disabled && 'opacity-50 cursor-not-allowed',
          isUploading && 'pointer-events-none',
        )}
      >
        {displayUrl ? (
          <>
            <img
              src={displayUrl}
              alt="Preview"
              className={cn(
                'w-full h-full object-cover',
                shape === 'circle' && 'rounded-full',
              )}
            />
            {/* Overlay on hover */}
            {!isUploading && !disabled && (
              <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center group">
                <Upload className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
            {/* Clear button */}
            {onClear && !isUploading && !disabled && (
              <button
                type="button"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-muted-foreground">
            <ImageIcon className="h-8 w-8" />
            <p className="text-xs font-medium">Click or drag to upload</p>
            <p className="text-[10px]">JPG, PNG, WebP (max {maxSizeMB}MB)</p>
          </div>
        )}

        {/* Upload spinner */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          </div>
        )}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />
    </div>
  );
}
