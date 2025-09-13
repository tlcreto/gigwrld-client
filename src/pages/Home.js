import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeGigs: 0,
    freelancers: 0,
    clients: 0,
    satisfaction: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
        if (data.message && data.message.includes('demo')) {
          setError('Using demo data - platform is growing!');
        }
      } else {
        setStats(data.stats);
        setError(data.message || 'Using demo data');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Connection issue - using sample data');
      // Fallback demo values
      setStats({
        activeGigs: 1247,
        freelancers: 843,
        clients: 421,
        satisfaction: 97
      });
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const StatCard = ({ number, label, icon, color, index }) => (
    <div 
      className="animate-fade-in-up bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100"
      style={{ animationDelay: `${800 + index * 100}ms` }}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <div className={`text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent mb-2`}>
        {loading ? (
          <div className="h-8 bg-gray-200 rounded-lg animate-pulse"></div>
        ) : (
          number
        )}
      </div>
      <div className="text-gray-600 font-medium text-sm">{label}</div>
      
      {loading && (
        <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section with Image */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <img
              src="/images/claudio-schwarz-4H9xt2DNgNc-unsplash.jpg"
              alt="GigWrld Marketplace - Connecting Freelancers and Clients"
              className="w-full max-w-4xl rounded-2xl shadow-2xl object-cover h-64 md:h-96"
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 animate-fade-in-down">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              GigWrld
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto animate-fade-in-up">
            Connect with talented freelancers and find amazing gig opportunities in one place.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: "🚀",
              title: "Find Gigs",
              description: "Discover thousands of opportunities tailored to your skills"
            },
            {
              icon: "💼",
              title: "Hire Talent",
              description: "Connect with top freelancers for your projects"
            },
            {
              icon: "⭐",
              title: "Build Reputation",
              description: "Grow your career with reviews and ratings"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Growing Community
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <StatCard
              number={formatNumber(stats.activeGigs)}
              label="Active Gigs"
              icon="💼"
              color="from-blue-500 to-blue-600"
              index={0}
            />
            <StatCard
              number={formatNumber(stats.freelancers)}
              label="Freelancers"
              icon="👥"
              color="from-green-500 to-green-600"
              index={1}
            />
            <StatCard
              number={formatNumber(stats.clients)}
              label="Clients"
              icon="🤝"
              color="from-purple-500 to-purple-600"
              index={2}
            />
            <StatCard
              number={`${stats.satisfaction}%`}
              label="Satisfaction"
              icon="⭐"
              color="from-yellow-500 to-yellow-600"
              index={3}
            />
          </div>
        </div>

        {error && (
          <div className="text-center mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700 text-sm">
              ⚠️ {error}
            </p>
          </div>
        )}

        {/* Auth Section */}
        <div className="text-center mt-16 animate-fade-in-up" style={{ animationDelay: "600ms" }}>
          {user ? (
            <div className="space-y-6">
              <p className="text-xl text-green-600 font-semibold">
                Welcome back! Ready to explore gigs? 🎉
              </p>
              <Link 
                to="/dashboard" 
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Go to Dashboard →
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-x-4">
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Get Started
                </Link>
                <Link 
                  to="/browse-gigs" 
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Browse Gigs
                </Link>
              </div>
              <div className="pt-6">
                <p className="text-gray-600 mb-4">Already have an account?</p>
                <Link 
                  to="/login" 
                  className="text-blue-600 hover:text-blue-800 font-semibold text-lg border-b-2 border-blue-300 hover:border-blue-600 transition-all duration-300"
                >
                  Sign In
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Testimonials Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                text: "Found my dream gig in just 2 days! The platform is incredibly easy to use.",
                author: "Sarah T., Freelancer"
              },
              {
                text: "Hired an amazing developer for our project. The quality of talent here is outstanding.",
                author: "Mike L., Startup Founder"
              },
              {
                text: "Perfect platform to showcase my skills and build a solid client base.",
                author: "David K., Graphic Designer"
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg animate-fade-in-up"
                style={{ animationDelay: `${1000 + index * 200}ms` }}
              >
                <div className="text-yellow-400 text-2xl mb-4">★★★★★</div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <p className="text-gray-600 font-semibold">{testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-white/80 backdrop-blur-sm mt-20 py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600">
            © 2024 GigWrld. Connecting talent with opportunity.
          </p>
        </div>
      </footer>

      {/* Add CSS for animations */}
      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
};

export default Home;