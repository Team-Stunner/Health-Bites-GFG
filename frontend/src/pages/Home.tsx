import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Activity,
  Utensils,
  BarChart as ChartBar,
  Camera,
  CheckCircle2,
  Smartphone,
  Users,
  Shield,
  ArrowRight,
  PlayCircle,
  ChevronDown
} from 'lucide-react';

const features = [
  {
    icon: <Activity className="h-12 w-12 text-green-500" />,
    title: 'Track Your Progress',
    description: 'Monitor your daily calorie intake and nutritional goals with our intuitive tracking system',
    link: '/tracking'
  },
  {
    icon: <Utensils className="h-12 w-12 text-green-500" />,
    title: 'Meal Planning',
    description: 'Get personalized meal plans and recipe recommendations based on your preferences',
    link: '/meal-planning'
  },
  {
    icon: <ChartBar className="h-12 w-12 text-green-500" />,
    title: 'Exercise Tracking',
    description: 'Log your workouts and track your fitness progress with detailed analytics',
    link: '/exercise'
  },
  {
    icon: <Camera className="h-12 w-12 text-green-500" />,
    title: 'Food Recognition',
    description: 'Instantly identify foods and get nutritional information using AI technology',
    link: '/food-recognition'
  }
];

const howToSteps = [
  {
    icon: <Users className="h-8 w-8 text-green-500" />,
    title: 'Create Your Account',
    description: 'Sign up and set your personal health goals and preferences'
  },
  {
    icon: <Utensils className="h-8 w-8 text-green-500" />,
    title: 'Track Your Meals',
    description: 'Log your daily meals and snacks using our easy-to-use food tracker'
  },
  {
    icon: <Activity className="h-8 w-8 text-green-500" />,
    title: 'Monitor Progress',
    description: 'View detailed reports and track your progress towards your goals'
  },
  {
    icon: <CheckCircle2 className="h-8 w-8 text-green-500" />,
    title: 'Achieve Goals',
    description: 'Stay motivated and reach your health and fitness objectives'
  }
];

const benefits = [
  {
    title: 'Personalized Experience',
    description: 'Get customized meal plans and recommendations based on your preferences and goals',
    icon: <Smartphone className="h-16 w-16 text-green-500" />
  },
  {
    title: 'Expert Guidance',
    description: 'Access nutrition tips and advice from certified health professionals',
    icon: <Users className="h-16 w-16 text-green-500" />
  },
  {
    title: 'Data Security',
    description: 'Your health data is protected with enterprise-grade security measures',
    icon: <Shield className="h-16 w-16 text-green-500" />
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export const Home: React.FC = () => {
  const scrollToNextSection = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="min-h-[85vh] relative flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490818387583-1baba5e638af"
            alt="Healthy lifestyle"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-green-50/90 to-white/90" />
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Your Journey to a
                <span className="text-green-600 block">Healthier Life</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Track your meals, plan your nutrition, and achieve your health goals with our comprehensive health tracking platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/tracking"
                    className="inline-flex items-center bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors text-lg"
                  >
                    Start Tracking Now
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </Link>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center bg-white text-green-600 px-8 py-4 rounded-lg font-semibold border-2 border-green-600 hover:bg-green-50 transition-colors text-lg"
                >
                  Watch Demo
                  <PlayCircle className="ml-2 h-6 w-6" />
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative max-w-lg mx-auto"
            >
              <img
                src="https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Healthy food"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-green-600/20 to-transparent" />
            </motion.div>
          </div>
        </div>

        <motion.button
          onClick={scrollToNextSection}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-green-600"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <ChevronDown className="h-10 w-10" />
        </motion.button>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-white">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="container mx-auto"
        >
          <div className="text-center mb-16">
            <motion.h2 variants={itemVariants} className="text-4xl font-bold mb-6">
              Powerful Features
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to maintain a healthy lifestyle and achieve your fitness goals
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6 text-lg">{feature.description}</p>
                <Link
                  to={feature.link}
                  className="inline-flex items-center text-green-600 font-medium hover:text-green-700 transition-colors text-lg group"
                >
                  Learn more
                  <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How to Use Section */}
      <section className="py-24 px-4 bg-gray-50">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="container mx-auto"
        >
          <div className="text-center mb-16">
            <motion.h2 variants={itemVariants} className="text-4xl font-bold mb-6">
              How It Works
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started with Health Bite in just a few simple steps
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {howToSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative"
              >
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <div className="mb-6">{step.icon}</div>
                  <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-gray-600 text-lg">{step.description}</p>
                </div>
                {index < howToSteps.length - 1 && (
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="hidden lg:block absolute top-1/2 -right-6 h-0.5 bg-green-200"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4 bg-white">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="container mx-auto"
        >
          <div className="text-center mb-16">
            <motion.h2 variants={itemVariants} className="text-4xl font-bold mb-6">
              Why Choose Health Bite
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the benefits of our comprehensive health tracking platform
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="text-center p-8"
              >
                <div className="flex justify-center mb-8">{benefit.icon}</div>
                <h3 className="text-2xl font-semibold mb-4">{benefit.title}</h3>
                <p className="text-gray-600 text-lg">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-green-600 text-white">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="container mx-auto px-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            {[
              { number: '10k+', label: 'Active Users' },
              { number: '500+', label: 'Healthy Recipes' },
              { number: '95%', label: 'Success Rate' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-8"
              >
                <motion.h3
                  whileHover={{ scale: 1.1 }}
                  className="text-6xl font-bold mb-4"
                >
                  {stat.number}
                </motion.h3>
                <p className="text-xl text-green-100">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-gray-50">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="container mx-auto"
        >
          <div className="text-center mb-16">
            <motion.h2 variants={itemVariants} className="text-4xl font-bold mb-6">
              Frequently Asked Questions
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about Health Bite
            </motion.p>
          </div>
          <div className="max-w-4xl mx-auto space-y-8">
            {[
              {
                question: 'How do I get started?',
                answer: 'Simply create an account, set your health goals, and start tracking your meals and exercise.'
              },
              {
                question: 'Is my data secure?',
                answer: 'Yes, we use enterprise-grade encryption to protect your personal information and health data.'
              },
              {
                question: 'Can I customize my meal plans?',
                answer: 'Absolutely! Our meal plans are fully customizable based on your dietary preferences and restrictions.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <h3 className="text-2xl font-semibold mb-4">{faq.question}</h3>
                <p className="text-gray-600 text-lg">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-white">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="container mx-auto text-center"
        >
          <motion.h2 variants={itemVariants} className="text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </motion.h2>
          <motion.p variants={itemVariants} className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Join thousands of users who have transformed their lives with our comprehensive health tracking platform.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link
              to="/tracking"
              className="inline-flex items-center bg-green-600 text-white px-12 py-6 rounded-xl text-xl font-semibold hover:bg-green-700 transition-colors"
            >
              Get Started Today
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};