import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Download, 
  Calendar, 
  FileText, 
  Activity, 
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  MoreHorizontal
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { toast } from 'sonner';

interface AccountDashboardProps {
  onNavigate: (section: string) => void;
}

export function AccountDashboard({ onNavigate }: AccountDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  // Mock user data
  const userData = {
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    avatar: 'https://github.com/shadcn.png',
    joinDate: '2024-01-15',
    plan: 'Pro',
    analysesUsed: 47,
    analysesLimit: 100,
  };

  // Mock analysis history
  const analysisHistory = [
    {
      id: '1',
      filename: 'suspicious_video.mp4',
      type: 'video',
      result: 'deepfake',
      confidence: 94.2,
      timestamp: '2024-01-20T10:30:00Z',
      status: 'completed',
    },
    {
      id: '2',
      filename: 'profile_photo.jpg',
      type: 'image',
      result: 'authentic',
      confidence: 98.7,
      timestamp: '2024-01-19T15:45:00Z',
      status: 'completed',
    },
    {
      id: '3',
      filename: 'voice_recording.mp3',
      type: 'audio',
      result: 'authentic',
      confidence: 92.1,
      timestamp: '2024-01-18T09:22:00Z',
      status: 'completed',
    },
    {
      id: '4',
      filename: 'interview_clip.mp4',
      type: 'video',
      result: 'processing',
      confidence: 0,
      timestamp: '2024-01-20T14:15:00Z',
      status: 'processing',
    },
  ];

  const stats = [
    {
      title: 'Total Analyses',
      value: userData.analysesUsed,
      change: '+12%',
      icon: Activity,
      color: 'text-blue-400',
    },
    {
      title: 'Deepfakes Detected',
      value: 8,
      change: '+3%',
      icon: Shield,
      color: 'text-red-400',
    },
    {
      title: 'Authentic Media',
      value: 39,
      change: '+15%',
      icon: CheckCircle,
      color: 'text-green-400',
    },
    {
      title: 'Avg. Confidence',
      value: '96.3%',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'text-purple-400',
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getResultIcon = (result: string, status: string) => {
    if (status === 'processing') return Clock;
    if (result === 'deepfake') return AlertTriangle;
    return CheckCircle;
  };

  const getResultColor = (result: string, status: string) => {
    if (status === 'processing') return 'text-yellow-400';
    if (result === 'deepfake') return 'text-red-400';
    return 'text-green-400';
  };

  const getResultBadge = (result: string, status: string) => {
    if (status === 'processing') return 'Processing';
    if (result === 'deepfake') return 'Deepfake';
    return 'Authentic';
  };

  const downloadReport = (analysisId: string) => {
    toast.success('Analysis report downloaded successfully!');
  };

  const downloadAllReports = () => {
    toast.success('All reports downloaded as ZIP file!');
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback>
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold">Welcome back, {userData.name}</h1>
                  <p className="text-muted-foreground">
                    Member since {formatDate(userData.joinDate)} • {userData.plan} Plan
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="border-primary text-primary">
                  {userData.analysesUsed}/{userData.analysesLimit} analyses used
                </Badge>
                <Button
                  onClick={downloadAllReports}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download All Reports
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    <span className="text-sm font-medium text-green-400">{stat.change}</span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.title}</div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Usage Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Monthly Usage</h3>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">January 2024</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Analyses Used</span>
                  <span className="font-medium">{userData.analysesUsed} / {userData.analysesLimit}</span>
                </div>
                <div className="w-full bg-muted/20 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(userData.analysesUsed / userData.analysesLimit) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  You have {userData.analysesLimit - userData.analysesUsed} analyses remaining this month.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Analysis History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    Recent Analysis History
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate('home')}
                    className="border-border hover:border-primary"
                  >
                    New Analysis
                  </Button>
                </div>
              </div>
              
              <div className="p-6">
                {analysisHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <Activity className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h4 className="text-lg font-medium mb-2">No analyses yet</h4>
                    <p className="text-muted-foreground mb-4">
                      Upload your first file to start detecting deepfakes
                    </p>
                    <Button
                      onClick={() => onNavigate('home')}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Start Analysis
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analysisHistory.map((analysis, index) => (
                      <motion.div
                        key={analysis.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            analysis.status === 'processing' 
                              ? 'bg-yellow-500/20' 
                              : analysis.result === 'deepfake'
                              ? 'bg-red-500/20'
                              : 'bg-green-500/20'
                          }`}>
                            {React.createElement(getResultIcon(analysis.result, analysis.status), {
                              className: `h-5 w-5 ${getResultColor(analysis.result, analysis.status)}`
                            })}
                          </div>
                          
                          <div>
                            <div className="font-medium">{analysis.filename}</div>
                            <div className="text-sm text-muted-foreground flex items-center space-x-2">
                              <span className="capitalize">{analysis.type}</span>
                              <span>•</span>
                              <span>{formatDate(analysis.timestamp)}</span>
                              {analysis.status === 'completed' && (
                                <>
                                  <span>•</span>
                                  <span>{analysis.confidence.toFixed(1)}% confidence</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Badge 
                            variant={analysis.result === 'deepfake' ? 'destructive' : 'default'}
                            className={
                              analysis.status === 'processing'
                                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                : analysis.result === 'deepfake'
                                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                : 'bg-green-500/20 text-green-400 border-green-500/30'
                            }
                          >
                            {getResultBadge(analysis.result, analysis.status)}
                          </Badge>
                          
                          {analysis.status === 'completed' && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => downloadReport(analysis.id)}>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download Report
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}