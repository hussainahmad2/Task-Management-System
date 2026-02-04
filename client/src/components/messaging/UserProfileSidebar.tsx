import React from 'react';
import { cn } from '@/lib/utils';

interface UserProfileSidebarProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    profileImageUrl?: string;
    role: string;
  };
  isVisible: boolean;
  onClose: () => void;
  className?: string;
}

export const UserProfileSidebar: React.FC<UserProfileSidebarProps> = ({
  user,
  isVisible,
  onClose,
  className
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div 
        className={cn(
          "absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out",
          isVisible ? "translate-x-0" : "translate-x-full",
          className
        )}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-primary/20"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-2xl mx-auto">
                {(user.firstName || user.username || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize bg-gray-100 dark:bg-gray-700 inline-block px-3 py-1 rounded-full mt-2">
              {user.role}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Contact Info</h4>
              <div className="mt-2 space-y-2">
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{user.email}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Quick Actions</h4>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-primary/10 dark:hover:bg-primary/10 text-center transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <span className="text-xs mt-1 block">Message</span>
                </button>
                <button className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-primary/10 dark:hover:bg-primary/10 text-center transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-xs mt-1 block">Call</span>
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">About</h4>
              <div className="mt-2">
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Member since {new Date().getFullYear()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};