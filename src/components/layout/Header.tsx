import React, { useState } from 'react';
import { TrendingUp, User, LogOut, Settings, Wallet } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { AuthModal } from '../auth/AuthModal';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  return (
    <>
      <header className="bg-gray-900 border-b border-gray-700">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-blue-400" />
              <h1 className="text-xl font-bold text-white">CryptoEx</h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Markets</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Trade</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Futures</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Earn</a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <User className="w-5 h-5 text-gray-300" />
                  <span className="text-gray-300">{user.email}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg border border-gray-700 shadow-xl z-50">
                    <div className="py-2">
                      <a href="#" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors">
                        <Wallet className="w-4 h-4 mr-2" />
                        Portfolio
                      </a>
                      <a href="#" className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </a>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button
                onClick={() => setShowAuthModal(true)}
                variant="primary"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};