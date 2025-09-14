import { motion } from 'motion/react';
import { Check, Zap, Crown, Building } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

export function PricingSection() {
  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'Perfect for trying out our deepfake detection',
      icon: Zap,
      features: [
        '5 analyses per month',
        'Basic detection models',
        'Image and video support',
        'Standard confidence scores',
        'Email support',
      ],
      buttonText: 'Get Started',
      buttonVariant: 'outline' as const,
      popular: false,
    },
    {
      name: 'Pro',
      price: '$29',
      description: 'For professionals and content creators',
      icon: Crown,
      features: [
        '100 analyses per month',
        'Advanced AI models',
        'All file types supported',
        'Detailed heatmaps',
        'Provenance timeline',
        'Priority support',
        'API access',
        'Custom reports',
      ],
      buttonText: 'Start Pro Trial',
      buttonVariant: 'default' as const,
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For organizations and high-volume users',
      icon: Building,
      features: [
        'Unlimited analyses',
        'Custom model training',
        'Dedicated infrastructure',
        'Advanced analytics',
        'Team management',
        '24/7 phone support',
        'On-premise deployment',
        'Custom integrations',
        'SLA guarantee',
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline' as const,
      popular: false,
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
              Choose Your <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Plan</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Start with our free tier or upgrade to unlock advanced features and higher limits. 
              All plans include our core deepfake detection technology.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${plan.popular ? 'scale-105' : ''}`}
              >

                
                <Card className={`p-8 h-full bg-card/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 flex flex-col ${
                  plan.popular 
                    ? 'border-primary shadow-lg shadow-primary/20' 
                    : 'border-border hover:border-primary/30'
                }`}>
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 ${plan.popular ? 'bg-primary/20' : 'bg-muted/20'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <plan.icon className={`h-8 w-8 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground mb-4">{plan.description}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.price !== 'Free' && plan.price !== 'Custom' && (
                        <span className="text-muted-foreground">/month</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 mb-8 flex-grow">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={`w-full mt-auto ${
                      plan.buttonVariant === 'default'
                        ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white'
                        : 'border-border hover:border-primary hover:text-primary'
                    }`}
                    variant={plan.buttonVariant}
                  >
                    {plan.buttonText}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold mb-8">Frequently Asked Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {[
                {
                  question: 'How accurate is the deepfake detection?',
                  answer: 'Our system achieves 99.7% accuracy on standard benchmarks, with continuous improvements through model updates.',
                },
                {
                  question: 'What file formats are supported?',
                  answer: 'We support images (JPG, PNG, GIF, WebP), videos (MP4, AVI, MOV, WebM), and audio files (MP3, WAV, M4A, OGG).',
                },
                {
                  question: 'Are my files stored on your servers?',
                  answer: 'No, we process files securely and delete them immediately after analysis. We never store your uploaded content.',
                },
                {
                  question: 'Can I cancel my subscription anytime?',
                  answer: 'Yes, you can cancel your subscription at any time. You\'ll retain access until the end of your billing period.',
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 bg-card/30 backdrop-blur-sm border-border">
                    <h4 className="font-semibold mb-2">{faq.question}</h4>
                    <p className="text-muted-foreground text-sm">{faq.answer}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}