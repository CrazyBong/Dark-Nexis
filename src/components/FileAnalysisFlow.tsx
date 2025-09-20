'use client';

import { useState, useEffect } from 'react';
import { FileUpload } from './FileUpload';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Loader2, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface AnalysisResult {
  analysis_id: number | null;
  file_id: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message?: string;
  deepfake_score?: number;
  confidence?: number;
  model_version?: string;
  processing_time?: number;
  results?: any;
  error_message?: string;
}

export function FileAnalysisFlow() {
  const [fileId, setFileId] = useState<number | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [polling, setPolling] = useState(false);
  const [analysisId, setAnalysisId] = useState<number | null>(null);

  // Handle file upload completion
  const handleUploadComplete = (uploadedFileId: number) => {
    setFileId(uploadedFileId);
    startAnalysis(uploadedFileId);
  };

  // Start file analysis
  const startAnalysis = async (fileId: number) => {
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file_id: fileId }),
      });

      if (!response.ok) {
        throw new Error('Failed to start analysis');
      }

      const result: AnalysisResult = await response.json();
      setAnalysisResult(result);
      
      if (result.analysis_id) {
        setAnalysisId(result.analysis_id);
      }
      
      // Start polling if analysis is pending or processing
      if (result.status === 'pending' || result.status === 'processing') {
        setPolling(true);
      }
    } catch (error) {
      console.error('Error starting analysis:', error);
      toast.error('Failed to start analysis');
    }
  };

  // Poll for analysis status
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (polling && analysisId) {
      intervalId = setInterval(async () => {
        try {
          const response = await fetch(`/api/analyses/${analysisId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch analysis status');
          }

          const result: AnalysisResult = await response.json();
          setAnalysisResult(result);

          // Stop polling if analysis is completed or failed
          if (result.status === 'completed' || result.status === 'failed') {
            setPolling(false);
            if (result.status === 'completed') {
              toast.success('Analysis completed successfully!');
            } else {
              toast.error(`Analysis failed: ${result.error_message || 'Unknown error'}`);
            }
          }
        } catch (error) {
          console.error('Error polling analysis status:', error);
          setPolling(false);
          toast.error('Failed to get analysis status');
        }
      }, 2000); // Poll every 2 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [polling, analysisId]);

  // Download analysis report
  const downloadReport = async () => {
    if (!fileId) return;

    try {
      const response = await fetch(`/api/files/${fileId}/download`);
      if (!response.ok) {
        throw new Error('Failed to generate download URL');
      }

      const { presigned_url } = await response.json();
      
      // Open the download URL in a new tab
      window.open(presigned_url, '_blank');
      toast.success('Download started');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  // Reset the flow
  const resetFlow = () => {
    setFileId(null);
    setAnalysisResult(null);
    setPolling(false);
    setAnalysisId(null);
  };

  // Render deepfake score with color coding
  const renderDeepfakeScore = (score?: number) => {
    if (score === undefined) return null;
    
    let color = 'text-green-500';
    let risk = 'Low Risk';
    
    if (score >= 0.7) {
      color = 'text-red-500';
      risk = 'High Risk';
    } else if (score >= 0.4) {
      color = 'text-yellow-500';
      risk = 'Medium Risk';
    }
    
    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium">Deepfake Score</h3>
        <div className="flex items-center mt-1">
          <div className="w-full bg-secondary rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${score >= 0.7 ? 'bg-red-500' : score >= 0.4 ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: `${score * 100}%` }}
            ></div>
          </div>
          <span className={`ml-2 text-sm font-medium ${color}`}>
            {(score * 100).toFixed(1)}%
          </span>
        </div>
        <p className={`text-xs mt-1 ${color}`}>{risk}</p>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {!fileId ? (
        <Card>
          <CardHeader>
            <CardTitle>Upload Media for Analysis</CardTitle>
            <CardDescription>
              Upload an image or video to analyze for potential deepfake manipulation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUpload onUploadComplete={handleUploadComplete} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {analysisResult?.status === 'completed' ? 'Analysis Results' : 'Processing Analysis'}
            </CardTitle>
            <CardDescription>
              {analysisResult?.status === 'pending' && 'Your file is queued for analysis...'}
              {analysisResult?.status === 'processing' && 'Your file is being analyzed...'}
              {analysisResult?.status === 'completed' && 'Analysis completed successfully'}
              {analysisResult?.status === 'failed' && 'Analysis failed'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Status indicator */}
              <div className="flex items-center space-x-2">
                {analysisResult?.status === 'pending' && (
                  <>
                    <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                    <span className="text-sm text-muted-foreground">Queued for analysis</span>
                  </>
                )}
                {analysisResult?.status === 'processing' && (
                  <>
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    <span className="text-sm">Processing your file</span>
                  </>
                )}
                {analysisResult?.status === 'completed' && (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-green-500">Analysis completed</span>
                  </>
                )}
                {analysisResult?.status === 'failed' && (
                  <>
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    <span className="text-sm text-destructive">
                      {analysisResult.error_message || 'Analysis failed'}
                    </span>
                  </>
                )}
              </div>

              {/* Progress indicator for processing */}
              {(analysisResult?.status === 'pending' || analysisResult?.status === 'processing') && (
                <Progress 
                  value={analysisResult?.status === 'processing' ? 50 : 10} 
                  className="h-2"
                />
              )}

              {/* Results display */}
              {analysisResult?.status === 'completed' && (
                <div className="space-y-4 mt-4">
                  {renderDeepfakeScore(analysisResult.deepfake_score)}
                  
                  {analysisResult.confidence && (
                    <div className="mt-2">
                      <h3 className="text-sm font-medium">Confidence</h3>
                      <p className="text-sm">{(analysisResult.confidence * 100).toFixed(1)}%</p>
                    </div>
                  )}
                  
                  {analysisResult.model_version && (
                    <div className="mt-2">
                      <h3 className="text-sm font-medium">Model Version</h3>
                      <p className="text-sm">{analysisResult.model_version}</p>
                    </div>
                  )}
                  
                  {analysisResult.processing_time && (
                    <div className="mt-2">
                      <h3 className="text-sm font-medium">Processing Time</h3>
                      <p className="text-sm">{analysisResult.processing_time.toFixed(2)} seconds</p>
                    </div>
                  )}
                  
                  <div className="flex space-x-2 mt-6">
                    <Button 
                      onClick={downloadReport}
                      className="flex items-center space-x-1"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Download Report</span>
                    </Button>
                    <Button variant="outline" onClick={resetFlow}>New Analysis</Button>
                  </div>
                </div>
              )}
              
              {/* Error state */}
              {analysisResult?.status === 'failed' && (
                <div className="mt-4">
                  <Button variant="outline" onClick={resetFlow}>Try Again</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}