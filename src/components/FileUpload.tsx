'use client';

import { useState, useRef } from 'react';
import { Upload, X, Check, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Card, CardContent } from './ui/card';
import { toast } from 'sonner';

interface FileUploadProps {
  onUploadComplete: (fileId: number) => void;
  maxSizeMB?: number;
  allowedTypes?: string[];
}

interface UploadResponse {
  file_id: number;
  presigned_url: string;
  expires_in: number;
}

export function FileUpload({ 
  onUploadComplete, 
  maxSizeMB = 100, 
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'] 
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file size
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds the maximum allowed size of ${maxSizeMB}MB`);
      return;
    }

    // Validate file type
    if (!allowedTypes.includes(selectedFile.type)) {
      setError(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const uploadFile = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setProgress(0);

      // Step 1: Request presigned URL
      const presignedUrlResponse = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: file.name,
          file_size: file.size,
          mime_type: file.type,
          file_type: getFileType(file.type),
        }),
      });

      if (!presignedUrlResponse.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { file_id, presigned_url }: UploadResponse = await presignedUrlResponse.json();

      // Step 2: Upload file to S3 with progress tracking
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', presigned_url);
      xhr.setRequestHeader('Content-Type', file.type);

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setProgress(percentComplete);
        }
      });

      xhr.onload = async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          // Step 3: Notify backend that upload is complete and trigger analysis
          toast.success('File uploaded successfully!');
          onUploadComplete(file_id);
        } else {
          setError('Upload failed');
        }
        setUploading(false);
      };

      xhr.onerror = () => {
        setError('Upload failed');
        setUploading(false);
      };

      xhr.send(file);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setProgress(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Helper function to determine file type category
  const getFileType = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return 'IMAGE';
    if (mimeType.startsWith('video/')) return 'VIDEO';
    if (mimeType.startsWith('audio/')) return 'AUDIO';
    if (mimeType.includes('pdf') || mimeType.includes('document')) return 'DOCUMENT';
    return 'OTHER';
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {!file ? (
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary/50 transition-colors">
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-1">Drag and drop your file here or click to browse</p>
              <p className="text-xs text-muted-foreground mb-4">
                Max file size: {maxSizeMB}MB. Supported formats: {allowedTypes.join(', ')}
              </p>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                ref={fileInputRef}
                accept={allowedTypes.join(',')}
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2"
              >
                Select File
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetUpload}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {error && (
                <div className="flex items-center space-x-2 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  onClick={uploadFile}
                  disabled={uploading || !!error}
                  className="w-full"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}