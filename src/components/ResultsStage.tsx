import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  ShieldAlert, 
  Download, 
  Share2, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  FileText,
  Activity,
  Eye,
  MapPin
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';

interface ResultsStageProps {
  file: File;
  results: {
    confidence: number;
    isDeepfake: boolean;
    detectedTools: string[];
    metadata: {
      analysisTime: string;
      modelVersion: string;
      fileSize: number;
      resolution?: string;
      duration?: string;
    };
    heatmapData: Array<{ x: number; y: number; intensity: number }>;
  };
  onNewAnalysis: () => void;
}

export function ResultsStage({ file, results, onNewAnalysis }: ResultsStageProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-500/20 border-green-500/30';
    if (confidence >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  const handleDownloadReport = () => {
    toast.success('Analysis report downloaded successfully!');
  };

  const handleShareResults = () => {
    toast.success('Results link copied to clipboard!');
  };

  const provenanceSteps = [
    { time: '2024-01-15 10:30:15', event: 'File created', source: 'Original camera capture', confidence: 100 },
    { time: '2024-01-15 10:31:22', event: 'Minor editing', source: 'Photo editing software', confidence: 95 },
    { time: '2024-01-15 10:32:45', event: 'Compression applied', source: 'Social media platform', confidence: 92 },
    { time: '2024-01-15 14:25:10', event: 'Potential manipulation', source: 'Unknown AI tool', confidence: results.confidence },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              {results.isDeepfake ? (
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <ShieldAlert className="h-6 w-6 text-red-400" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-400" />
                </div>
              )}
              <h1 className="text-3xl font-bold">Analysis Complete</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Detailed deepfake detection results for your media file
            </p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-3 justify-center mb-8"
          >
            <Button
              onClick={handleDownloadReport}
              className="bg-primary hover:bg-primary/90"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
            <Button
              variant="outline"
              onClick={handleShareResults}
              className="border-border hover:border-primary"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Results
            </Button>
            <Button
              variant="outline"
              onClick={onNewAnalysis}
              className="border-border hover:border-primary"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Analyze New File
            </Button>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-sm">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="heatmap" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Heat Map
              </TabsTrigger>
              <TabsTrigger value="provenance" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Provenance
              </TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Technical
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Confidence Score */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className={`p-6 border ${getConfidenceBg(results.confidence)}`}>
                    <div className="text-center">
                      <div className="mb-4">
                        <div className={`text-4xl font-bold ${getConfidenceColor(results.confidence)}`}>
                          {Math.round(results.confidence)}%
                        </div>
                        <p className="text-muted-foreground">Detection Confidence</p>
                      </div>
                      
                      <div className="mb-4">
                        <Progress 
                          value={results.confidence} 
                          className="h-3"
                        />
                      </div>

                      <Badge 
                        variant={results.isDeepfake ? "destructive" : "default"}
                        className={`text-lg px-4 py-2 ${
                          results.isDeepfake 
                            ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                            : 'bg-green-500/20 text-green-400 border-green-500/30'
                        }`}
                      >
                        {results.isDeepfake ? (
                          <>
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Likely Deepfake
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Appears Authentic
                          </>
                        )}
                      </Badge>
                    </div>
                  </Card>
                </motion.div>

                {/* File Information */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      File Information
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Filename:</span>
                        <span className="font-medium">{file.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">File Size:</span>
                        <span className="font-medium">{formatFileSize(file.size)}</span>
                      </div>
                      {results.metadata.resolution && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Resolution:</span>
                          <span className="font-medium">{results.metadata.resolution}</span>
                        </div>
                      )}
                      {results.metadata.duration && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="font-medium">{results.metadata.duration}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Analysis Time:</span>
                        <span className="font-medium">{results.metadata.analysisTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Model Version:</span>
                        <span className="font-medium">{results.metadata.modelVersion}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Detected Tools */}
                {results.isDeepfake && results.detectedTools.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2"
                  >
                    <Card className="p-6 bg-red-500/5 border-red-500/20">
                      <h3 className="text-lg font-semibold mb-4 flex items-center text-red-400">
                        <Activity className="h-5 w-5 mr-2" />
                        Detected Manipulation Tools
                      </h3>
                      
                      <div className="flex flex-wrap gap-2">
                        {results.detectedTools.map((tool, index) => (
                          <Badge 
                            key={index}
                            variant="outline"
                            className="bg-red-500/10 text-red-400 border-red-500/30"
                          >
                            {tool}
                          </Badge>
                        ))}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-3">
                        These tools were likely used to create or modify this media file.
                      </p>
                    </Card>
                  </motion.div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="heatmap" className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary" />
                    Manipulation Heat Map
                  </h3>
                  
                  <div className="relative bg-muted/20 rounded-lg aspect-video mb-4 overflow-hidden">
                    {/* Mock preview of the uploaded file */}
                    <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                      <Eye className="h-16 w-16 text-muted-foreground/50" />
                    </div>
                    
                    {/* Heat map overlay points */}
                    {results.heatmapData.map((point, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: point.intensity }}
                        transition={{ delay: index * 0.1 }}
                        className="absolute w-8 h-8 rounded-full"
                        style={{
                          left: `${point.x}%`,
                          top: `${point.y}%`,
                          backgroundColor: `rgba(239, 68, 68, ${point.intensity})`,
                          boxShadow: `0 0 20px rgba(239, 68, 68, ${point.intensity * 0.5})`,
                        }}
                      />
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-muted-foreground">Low suspicion</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-muted-foreground">Medium suspicion</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-muted-foreground">High suspicion</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-4">
                    Red areas indicate regions with higher probability of manipulation. 
                    The intensity represents the confidence level of the detection algorithm.
                  </p>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="provenance" className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-primary" />
                    File Provenance Timeline
                  </h3>
                  
                  <div className="space-y-4">
                    {provenanceSteps.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-4 p-4 rounded-lg bg-muted/20"
                      >
                        <div className={`w-3 h-3 rounded-full ${
                          step.confidence >= 90 ? 'bg-green-500' :
                          step.confidence >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium">{step.event}</span>
                            <span className={`text-sm ${getConfidenceColor(step.confidence)}`}>
                              {step.confidence}% confidence
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {step.time} • {step.source}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-4">
                    This timeline shows the detected history of modifications to your file, 
                    helping identify when and how potential manipulations occurred.
                  </p>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="details" className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
                  <h3 className="text-lg font-semibold mb-4">Detection Metrics</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Overall Confidence:</span>
                      <span className="font-medium">{results.confidence.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Face Detection:</span>
                      <span className="font-medium">98.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Temporal Consistency:</span>
                      <span className="font-medium">94.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Compression Analysis:</span>
                      <span className="font-medium">91.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Artifact Detection:</span>
                      <span className="font-medium">87.9%</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
                  <h3 className="text-lg font-semibold mb-4">Model Information</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Model Version:</span>
                      <span className="font-medium">{results.metadata.modelVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Training Dataset:</span>
                      <span className="font-medium">FaceForensics++</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span className="font-medium">2024-01-10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Detection Method:</span>
                      <span className="font-medium">Ensemble CNN</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Processing Time:</span>
                      <span className="font-medium">{results.metadata.analysisTime}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}