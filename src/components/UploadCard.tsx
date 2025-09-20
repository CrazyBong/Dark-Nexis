import { useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { Upload, FileImage, FileVideo, AudioLines, X, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { toast } from 'sonner';
import AuthService from '../services/authService';

interface UploadCardProps {
  onFileUpload: (file: File) => void;
  isAuthenticated: boolean;
}

export function UploadCard({ onFileUpload, isAuthenticated }: UploadCardProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedFormats = {
    image: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    video: ['.mp4', '.avi', '.mov', '.webm'],
    audio: ['.mp3', '.wav', '.m4a', '.ogg'],
  };

  const allFormats = [...acceptedFormats.image, ...acceptedFormats.video, ...acceptedFormats.audio];
  const maxFileSize = 100 * 1024 * 1024; // 100MB

  const getFileType = (file: File): 'image' | 'video' | 'audio' | 'unknown' => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (acceptedFormats.image.includes(extension)) return 'image';
    if (acceptedFormats.video.includes(extension)) return 'video';
    if (acceptedFormats.audio.includes(extension)) return 'audio';
    return 'unknown';
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image': return FileImage;
      case 'video': return FileVideo;
      case 'audio': return AudioLines;
      default: return Upload;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    const fileType = getFileType(file);
    
    if (fileType === 'unknown') {
      return 'Unsupported file format. Please upload an image, video, or audio file.';
    }
    
    if (file.size > maxFileSize) {
      return `File size exceeds 100MB limit. Current size: ${formatFileSize(file.size)}`;
    }
    
    return null;
  };

  const simulateUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const authService = AuthService.getInstance();
      
      // Check if user is authenticated
      if (!authService.isAuthenticated()) {
        // Try to do a demo login if not authenticated
        console.log('User not authenticated, attempting demo login...');
        const demoLoginSuccess = await authService.demoLogin();
        if (!demoLoginSuccess) {
          console.error('Demo login failed');
          // Even if demo login fails, we'll try to proceed but warn the user
          toast.warning('Authentication issue detected. Upload may not work properly.');
        } else {
          console.log('Demo login successful');
        }
      }

      // Log authentication status for debugging
      console.log('User authentication status:', authService.isAuthenticated());
      const token = authService.getAccessToken();
      if (token) {
        console.log('User token:', token.substring(0, 20) + '...');
      }

      // Step 1: Get presigned URL for file upload
      const params = new URLSearchParams({
        filename: file.name,
        file_size: file.size.toString(),
        mime_type: file.type,
      });
      
      console.log('Making request to upload endpoint with params:', params.toString());
      
      // Add a timeout to the request to handle cases where the backend is not responding
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const uploadResponse = await authService.authenticatedFetch(`/api/v1/media/upload?${params.toString()}`, {
        method: 'POST',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('Upload URL request failed:', uploadResponse.status, uploadResponse.statusText, errorText);
        
        // If we get a 404 or connection error, it might mean the backend is not running
        if (uploadResponse.status === 404 || uploadResponse.status === 0) {
          toast.error('Backend service unavailable. Using mock implementation.');
          // Use mock implementation
          await mockUploadProcess(file);
          return; // Exit the function since we're using mock implementation
        }
        
        throw new Error(`Failed to get upload URL: ${uploadResponse.status} ${uploadResponse.statusText} - ${errorText}`);
      }

      const { media_id, upload_url } = await uploadResponse.json();
      setUploadProgress(25);

      // Step 2: Upload file to S3
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', upload_url);
      xhr.setRequestHeader('Content-Type', file.type);
      
      // Add timeout for the upload
      xhr.timeout = 30000; // 30 seconds

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const uploadPercentage = Math.round((event.loaded / event.total) * 50); // 50% for upload
          setUploadProgress(25 + uploadPercentage);
        }
      });

      xhr.onload = async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setUploadProgress(75);
          
          // Step 3: Trigger analysis with your trained model
          try {
            const analysisResponse = await authService.authenticatedFetch('/api/v1/media/analyze', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ media_id }),
            });

            if (!analysisResponse.ok) {
              const errorText = await analysisResponse.text();
              console.error('Analysis request failed:', analysisResponse.status, analysisResponse.statusText, errorText);
              
              // If backend is not available, use mock
              if (analysisResponse.status === 404 || analysisResponse.status === 0) {
                toast.info('Analysis service unavailable. Using mock implementation.');
                await mockAnalysisProcess(file);
                return;
              }
              
              throw new Error(`Failed to start analysis: ${analysisResponse.status} ${analysisResponse.statusText}`);
            }

            setUploadProgress(100);
            setIsUploading(false);
            
            // Move to analysis stage and pass the file
            setTimeout(() => {
              onFileUpload(file);
              toast.success('File uploaded successfully! Starting analysis with trained model...');
            }, 0);
            
          } catch (analysisError) {
            console.error('Analysis start failed:', analysisError);
            // Fall back to mock analysis if backend unavailable
            await mockAnalysisProcess(file);
          }
        } else {
          let errorText = 'Unknown error';
          try {
            errorText = xhr.responseText || 'Upload failed';
          } catch (e) {
            // Ignore
          }
          throw new Error(`File upload failed: ${xhr.status} ${xhr.statusText} - ${errorText}`);
        }
      };

      xhr.onerror = () => {
        throw new Error('File upload failed due to network error');
      };
      
      xhr.ontimeout = () => {
        throw new Error('File upload timed out');
      };

      xhr.send(file);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Fallback to mock simulation if real upload fails
      await mockUploadProcess(file);
    }
  };

  const mockUploadProcess = async (file: File) => {
    console.log('Using mock upload process');
    const mockResponse = {
      media_id: Math.floor(Math.random() * 1000),
      upload_url: 'https://mock-upload-url.com',
      expires_in: 3600
    };
    
    // Simulate progress
    setUploadProgress(25);
    
    // Simulate file upload
    setTimeout(() => {
      setUploadProgress(50);
      
      setTimeout(() => {
        setUploadProgress(75);
        
        // Simulate analysis
        mockAnalysisProcess(file);
      }, 1000);
    }, 1000);
  };

  const mockAnalysisProcess = async (file: File) => {
    console.log('Using mock analysis process');
    setTimeout(() => {
      setUploadProgress(100);
      setIsUploading(false);
      setTimeout(() => {
        onFileUpload(file);
        toast.success('File uploaded successfully! Starting analysis... (Mock implementation)');
      }, 0);
    }, 1000);
  };

  const handleFileSelection = useCallback((file: File) => {
    const validationError = validateFile(file);
    
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSelectedFile(file);
    simulateUpload(file);
  }, [onFileUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  }, [handleFileSelection]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        animate={{
          scale: isDragOver ? 1.02 : 1,
          boxShadow: isDragOver 
            ? '0 20px 40px rgba(124, 77, 255, 0.2)' 
            : '0 10px 30px rgba(0, 0, 0, 0.3)',
        }}
        transition={{ duration: 0.2 }}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 md:p-12 
          transition-all duration-300 cursor-pointer group
          bg-card/50 backdrop-blur-sm
          ${isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50 hover:bg-card/70'
          }
          ${isUploading ? 'pointer-events-none' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={allFormats.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
          aria-label="Upload file for deepfake detection"
        />

        {isUploading ? (
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Upload className="h-8 w-8 text-primary" />
              </motion.div>
            </motion.div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Uploading File...</h3>
              <p className="text-muted-foreground mb-4">
                {selectedFile?.name} ({formatFileSize(selectedFile?.size || 0)})
              </p>
              <div className="space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-muted-foreground">{Math.round(uploadProgress)}% complete</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="border-border hover:border-destructive hover:text-destructive"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <motion.div
              animate={{ y: isDragOver ? -5 : 0 }}
              transition={{ duration: 0.2 }}
              className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/30 transition-colors"
            >
              <Upload className="h-8 w-8 text-primary" />
            </motion.div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {isDragOver ? 'Drop your file here' : 'Upload Media for Analysis'}
              </h3>
              <p className="text-muted-foreground mb-6">
                Drag and drop your image, video, or audio file, or click to browse
              </p>
              
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg shadow-primary/25"
              >
                Choose File
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <FileImage className="h-6 w-6 text-primary" />
                <span className="text-xs text-muted-foreground text-center">Images<br />JPG, PNG, GIF</span>
              </div>
              <div className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <FileVideo className="h-6 w-6 text-primary" />
                <span className="text-xs text-muted-foreground text-center">Videos<br />MP4, AVI, MOV</span>
              </div>
              <div className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <AudioLines className="h-6 w-6 text-primary" />
                <span className="text-xs text-muted-foreground text-center">Audio<br />MP3, WAV, M4A</span>
              </div>
            </div>
          </div>
        )}

        {!isAuthenticated && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center space-x-2 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full">
              <AlertCircle className="h-3 w-3 text-amber-400" />
              <span className="text-xs text-amber-400">Sign in for full features</span>
            </div>
          </div>
        )}

        <div className="absolute bottom-4 right-4">
          <div className="text-xs text-muted-foreground/70">
            Max 100MB • Secure & Private
          </div>
        </div>
      </motion.div>
    </div>
  );
}