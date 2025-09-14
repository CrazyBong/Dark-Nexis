import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileImage, 
  FileVideo, 
  AudioLines, 
  Brain, 
  Search, 
  Zap, 
  Shield, 
  CheckCircle,
  Clock,
  Activity
} from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Button } from './ui/button';

interface AnalysisStageProps {
  file: File;
  onAnalysisComplete: (results: any) => void;
  onBack: () => void;
}

interface AnalysisStep {
  id: string;
  label: string;
  description: string;
  icon: any;
  status: 'pending' | 'active' | 'completed';
  progress: number;
}

export function AnalysisStage({ file, onAnalysisComplete, onBack }: AnalysisStageProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  
  const getFileType = (file: File): 'image' | 'video' | 'audio' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    return 'image'; // fallback
  };

  const fileType = getFileType(file);
  const fileIcon = fileType === 'image' ? FileImage : fileType === 'video' ? FileVideo : AudioLines;

  const analysisSteps: AnalysisStep[] = [
    {
      id: 'preprocessing',
      label: 'Preprocessing',
      description: 'Extracting and normalizing media data',
      icon: Search,
      status: 'pending',
      progress: 0,
    },
    {
      id: 'feature-extraction',
      label: 'Feature Extraction',
      description: 'Analyzing visual/audio patterns and artifacts',
      icon: Brain,
      status: 'pending',
      progress: 0,
    },
    {
      id: 'ai-analysis',
      label: 'AI Analysis',
      description: 'Running deepfake detection algorithms',
      icon: Zap,
      status: 'pending',
      progress: 0,
    },
    {
      id: 'verification',
      label: 'Verification',
      description: 'Cross-referencing with known patterns',
      icon: Shield,
      status: 'pending',
      progress: 0,
    },
  ];

  const [steps, setSteps] = useState(analysisSteps);

  useEffect(() => {
    if (!isAnalyzing) return;

    const stepDurations = [2000, 3000, 4000, 2000]; // Duration for each step in ms
    let totalTime = 0;

    const progressStep = (stepIndex: number) => {
      if (stepIndex >= steps.length) {
        setIsAnalyzing(false);
        // Generate mock results
        const mockResults = {
          confidence: Math.random() * 30 + 70, // 70-100% confidence
          isDeepfake: Math.random() > 0.7, // 30% chance of being deepfake
          detectedTools: ['FaceSwap', 'DeepFaceLab'],
          metadata: {
            analysisTime: '2.3s',
            modelVersion: 'v3.2.1',
            fileSize: file.size,
            resolution: fileType === 'image' ? '1920x1080' : undefined,
            duration: fileType !== 'image' ? '00:00:45' : undefined,
          },
          heatmapData: generateMockHeatmap(),
        };
        setTimeout(() => onAnalysisComplete(mockResults), 1000);
        return;
      }

      const stepDuration = stepDurations[stepIndex];
      totalTime += stepDuration;

      // Mark current step as active
      setSteps(prev => prev.map((step, i) => ({
        ...step,
        status: i < stepIndex ? 'completed' : i === stepIndex ? 'active' : 'pending',
      })));

      setCurrentStepIndex(stepIndex);

      // Animate step progress
      let stepProgress = 0;
      const stepInterval = setInterval(() => {
        stepProgress += Math.random() * 8 + 2; // 2-10% per interval
        if (stepProgress >= 100) {
          stepProgress = 100;
          clearInterval(stepInterval);
          
          // Mark step as completed
          setSteps(prev => prev.map((step, i) => ({
            ...step,
            status: i <= stepIndex ? 'completed' : 'pending',
            progress: i === stepIndex ? 100 : step.progress,
          })));

          // Move to next step
          setTimeout(() => progressStep(stepIndex + 1), 500);
        } else {
          setSteps(prev => prev.map((step, i) => ({
            ...step,
            progress: i === stepIndex ? stepProgress : step.progress,
          })));
        }

        // Update overall progress
        const completedSteps = stepIndex;
        const currentStepProgress = stepProgress / 100;
        const newOverallProgress = ((completedSteps + currentStepProgress) / steps.length) * 100;
        setOverallProgress(newOverallProgress);
      }, 100);
    };

    // Start analysis
    setTimeout(() => progressStep(0), 500);
  }, [isAnalyzing, file]);

  const generateMockHeatmap = () => {
    // Generate mock heatmap data for visualization
    const points = [];
    for (let i = 0; i < 20; i++) {
      points.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        intensity: Math.random(),
      });
    }
    return points;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center"
              >
                <Activity className="h-6 w-6 text-primary" />
              </motion.div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Analyzing Your Media
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Our AI is examining your file for signs of deepfake manipulation
            </p>
          </motion.div>

          {/* File Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  {React.createElement(fileIcon, { className: 'h-6 w-6 text-primary' })}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{file.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span className="capitalize">{fileType} file</span>
                    <span>•</span>
                    <span>Analysis in progress</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{Math.round(overallProgress)}%</div>
                  <div className="text-sm text-muted-foreground">Complete</div>
                </div>
              </div>
              
              <div className="mt-4">
                <Progress value={overallProgress} className="h-2" />
              </div>
            </Card>
          </motion.div>

          {/* Analysis Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
              <h3 className="text-lg font-semibold text-white mb-6">Analysis Pipeline</h3>
              
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`
                      flex items-center space-x-4 p-4 rounded-lg transition-all duration-300
                      ${step.status === 'active' 
                        ? 'bg-primary/10 border border-primary/30' 
                        : step.status === 'completed'
                        ? 'bg-green-500/10 border border-green-500/30'
                        : 'bg-muted/20 border border-border'
                      }
                    `}
                  >
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                      ${step.status === 'active' 
                        ? 'bg-primary/20 text-primary' 
                        : step.status === 'completed'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-muted text-muted-foreground'
                      }
                    `}>
                      <AnimatePresence mode="wait">
                        {step.status === 'completed' ? (
                          <motion.div
                            key="completed"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <CheckCircle className="h-5 w-5" />
                          </motion.div>
                        ) : step.status === 'active' ? (
                          <motion.div
                            key="active"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          >
                            <step.icon className="h-5 w-5" />
                          </motion.div>
                        ) : (
                          <motion.div key="pending">
                            <Clock className="h-5 w-5" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-medium transition-colors ${
                          step.status !== 'pending' ? 'text-white' : 'text-muted-foreground'
                        }`}>
                          {step.label}
                        </h4>
                        {step.status === 'active' && (
                          <span className="text-sm text-primary font-medium">
                            {Math.round(step.progress)}%
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                      
                      {step.status === 'active' && (
                        <div className="w-full">
                          <Progress value={step.progress} className="h-1" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Estimated Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-muted/20 rounded-full border border-border">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                Estimated time remaining: {Math.max(0, Math.round((100 - overallProgress) / 10))} seconds
              </span>
            </div>
            
            <div className="mt-6">
              <Button
                variant="outline"
                onClick={onBack}
                className="border-border hover:border-primary hover:text-primary"
              >
                Cancel Analysis
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}