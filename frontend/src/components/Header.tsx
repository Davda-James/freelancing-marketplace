import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';
import { Briefcase, Plus } from 'lucide-react';
// import { useApp } from '../context/AppContext';
import { WalletButton } from '@/components/WalletButton';
import { useApp } from '@/context/AppContext';

// Check if Clerk is enabled
const isClerkEnabled = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.startsWith('pk_');
console.log(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

export const Header: React.FC = () => {
    // wallet imported
  // const { user: appUser } = useApp();
    //   user import 
  const { isSignedIn } = isClerkEnabled ? useUser() : { isSignedIn: false };
  const { refreshJobs } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleBrowseJobsClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();    

    try {
      await refreshJobs();
    } catch (error) {
      console.error('Failed to refresh jobs:', error);
    }
    
    navigate('/marketplace');
  };

  const handleDashboardClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Refresh jobs first, then navigate
    try {
      await refreshJobs();
    } catch (error) {
      console.error('Failed to refresh jobs:', error);
    }
    
    navigate('/dashboard');
  };

  return (
    <header className="bg-gray-950/95 backdrop-blur-sm border-b border-gray-800/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link 
              to="/"
              className="flex items-center space-x-2 text-2xl font-bold text-white hover:text-blue-400 transition-colors duration-300"
            >
              <Briefcase className="w-8 h-8" />
              <span>FreelanceHub</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/marketplace"
              onClick={handleBrowseJobsClick}
              className={`text-gray-300 hover:text-blue-400 transition-colors font-medium ${
                isActive('/marketplace') ? 'text-blue-400 border-b-2 border-blue-400 pb-1' : ''
              }`}
            >
              Browse Jobs
            </Link>
            <Link
              to="/how-it-works"
              className={`text-gray-300 hover:text-blue-400 transition-colors font-medium ${
                isActive('/how-it-works') ? 'text-blue-400 border-b-2 border-blue-400 pb-1' : ''
              }`}
            >
              How It Works
            </Link>
            {isSignedIn && (
              <Link
                to="/dashboard"
                onClick={handleDashboardClick}
                className={`text-gray-300 hover:text-blue-400 transition-colors font-medium ${
                  isActive('/dashboard') ? 'text-blue-400 border-b-2 border-blue-400 pb-1' : ''
                }`}
              >
                Dashboard
              </Link>
            )}
            <Link
              to="/portfolio-search"
              className={`text-gray-300 hover:text-blue-400 transition-colors font-medium ${
                isActive('/portfolio-search') ? 'text-blue-400 border-b-2 border-blue-400 pb-1' : ''
              }`}
            >
              Find Freelancers
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <WalletButton />
                  <Link
                    to="/create-job"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-blue-500/25"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Post Job</span>
                  </Link>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                      userButtonPopoverCard: "bg-gray-800 border border-gray-700",
                      userButtonPopoverActionButton: "text-gray-300 hover:text-white hover:bg-gray-700"
                    }
                  }}
                />
              </>
            ) : (
              <div className="flex items-center space-x-3 ml-2">
                <WalletButton />
                {isClerkEnabled ? (
                  <>
                    <SignInButton mode="modal">
                      <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
                        Get Started
                      </button>
                    </SignUpButton>
                  </>
                ) : (
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
                    Demo Mode
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};