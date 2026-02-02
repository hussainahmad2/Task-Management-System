import React, { useEffect } from 'react';
import { useRoute } from 'wouter';
import { useMessaging } from '../../contexts/MessagingContext';
import { useAuth } from '../../hooks/use-auth';

interface Props {
  children?: React.ReactNode;
}

const MessagingLayout: React.FC<Props> = ({ children }) => {
  const { actions, state } = useMessaging();
  const { user } = useAuth();

  // Initialize messaging when component mounts
  useEffect(() => {
    if (user?.id && !state.isInitialized) {
      actions.setCurrentUser(user.id);
      actions.initialize().catch(console.error);
    }
  }, [user?.id, state.isInitialized, actions]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MessagingLayout;