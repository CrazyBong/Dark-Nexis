import { motion } from 'motion/react';
import { Upload, Brain, Shield, FileText, Zap, Eye } from 'lucide-react';
import { Card } from './ui/card';

export function HowItWorksSection() {
  const steps = [
    {
      icon: Upload,
      title: 'Upload Your Media',
      description: 'Drag and drop or select images, videos, or audio files up to 100MB.',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
    {
      icon: Brain,
      title: 'AI Analysis',
      description: 'Our advanced neural networks analyze your media for manipulation patterns.',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
    },
    {
      icon: Eye,
      title: 'Pattern Detection',
      description: 'Multiple detection algorithms identify inconsistencies and artifacts.',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
    },
    {
      icon: Shield,
      title: 'Get Results',
      description: 'Receive detailed analysis with confidence scores and manipulation heatmaps.',
      color: 'text-primary',
      bgColor: 'bg-primary/20',
    },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Get results in seconds with our optimized detection pipeline.',
    },
    {
      icon: Shield,
      title: 'Military-Grade Security',
      description: 'Your files are processed securely and never stored on our servers.',
    },
    {
      icon: Brain,
      title: 'Advanced AI',
      description: 'Powered by state-of-the-art machine learning models trained on millions of samples.',
    },
    {
      icon: FileText,
      title: 'Detailed Reports',
      description: 'Comprehensive analysis reports with technical details and confidence metrics.',
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              How <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Nexis</span> Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our cutting-edge deepfake detection system uses multiple AI models to analyze your media 
              and provide accurate, reliable results in real-time.
            </p>
          </motion.div>

          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`w-16 h-16 ${step.bgColor} rounded-full flex items-center justify-center mx-auto mb-6 relative`}>
                  <step.icon className={`h-8 w-8 ${step.color}`} />
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 left-full w-8 h-px bg-gradient-to-r from-primary/50 to-transparent transform -translate-y-1/2" />
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:border-primary/30 transition-all duration-300 group">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Technology Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 text-center"
          >
            <h3 className="text-2xl font-bold mb-8">Powered by Advanced Technology</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                'FaceForensics++',
                'ResNet-50',
                'Xception',
                'EfficientNet',
              ].map((tech, index) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="text-lg font-semibold text-primary">{tech}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}