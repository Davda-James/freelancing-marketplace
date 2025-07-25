import React from 'react';
import { Link } from 'react-router-dom';
import { User, Briefcase, Shield, DollarSign, Star, CheckCircle } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: User,
      title: 'Connect Your Wallet',
      description: 'Connect your crypto wallet to get started. Choose whether you\'re a client looking to hire or a freelancer ready to work.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Briefcase,
      title: 'Post or Browse Jobs',
      description: 'Clients post detailed job descriptions with budgets. Freelancers browse available opportunities that match their skills.',
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      icon: Shield,
      title: 'Secure with Stakes',
      description: 'Both parties put up stakes to ensure commitment. This creates trust and accountability in the system.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: CheckCircle,
      title: 'Complete the Work',
      description: 'Freelancers deliver quality work within deadlines. Clients review and approve completed projects.',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: DollarSign,
      title: 'Get Paid Securely',
      description: 'Smart contracts handle payments automatically. Freelancers get paid instantly upon job approval.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Star,
      title: 'Build Your Reputation',
      description: 'Both parties can leave reviews and ratings. Build your reputation for future opportunities.',
      color: 'bg-yellow-100 text-yellow-600'
    }
  ];

  const features = [
    {
      title: 'Decentralized & Trustless',
      description: 'No middlemen or centralized control. Smart contracts ensure fair and transparent transactions.',
      icon: Shield
    },
    {
      title: 'Stake-Based Security',
      description: 'Both clients and freelancers stake funds to ensure commitment and reduce disputes.',
      icon: DollarSign
    },
    {
      title: 'Instant Payments',
      description: 'Get paid immediately upon job completion through automated smart contract execution.',
      icon: CheckCircle
    },
    {
      title: 'Global Access',
      description: 'Work with anyone, anywhere in the world. No geographic restrictions or payment barriers.',
      icon: User
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="bg-gray-950 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center relative">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">How FreelanceHub Works</h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A simple, secure, and transparent way to hire freelancers and get work done using blockchain technology.
            </p>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Simple Process, Powerful Results</h2>
          <p className="text-lg text-gray-400">Follow these easy steps to get started on our platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 h-full group">
                  <div className={`${step.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-800 transform -translate-y-1/2 z-10" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose FreelanceHub?</h2>
            <p className="text-lg text-gray-400">Built on blockchain for maximum security and transparency</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stake System Explanation */}
      <div className="bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Understanding the Stake System</h2>
            <p className="text-lg text-gray-400">Our unique stake system ensures accountability and reduces disputes</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg flex-shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Client Stakes</h3>
                    <p className="text-gray-400">Clients put up a stake (typically 10% of budget) when posting a job. This shows serious intent and is returned when the job is completed successfully.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2 rounded-lg flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Freelancer Stakes</h3>
                    <p className="text-gray-400">Freelancers stake funds (typically 10% of budget) to accept a job. This ensures commitment to completing the work and is returned with payment.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-2 rounded-lg flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Dispute Protection</h3>
                    <p className="text-gray-400">If deadlines are missed or work isn't delivered, the system automatically handles fund distribution fairly based on smart contract rules.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800/50">
              <h3 className="text-xl font-semibold text-white mb-6 text-center">Example: 5 ETH Job</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-400">Job Budget</span>
                  <span className="font-medium text-white">5.0 ETH</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Client Stake (10%)</span>
                  <span className="text-orange-600">0.5 ETH</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Platform Fee (5%)</span>
                  <span className="text-purple-600">0.25 ETH</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Freelancer Stake (10%)</span>
                  <span className="text-blue-400">0.425 ETH*</span>
                </div>
                <div className="flex justify-between items-center py-2 font-semibold">
                  <span className="text-white">Freelancer Receives</span>
                  <span className="text-emerald-600">4.675 ETH</span>
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  * Freelancer stake is 10% of final budget (4.25 ETH)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-700 to-purple-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Join thousands of clients and freelancers using our secure, decentralized platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/create-job" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg text-center">
                Post a Job
              </Link>
              <Link to="/marketplace" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors backdrop-blur-sm text-center">
                Find Work
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};