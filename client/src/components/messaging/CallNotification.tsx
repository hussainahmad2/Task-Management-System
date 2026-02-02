import React, { useEffect } from 'react';
import { Call } from '../../types/messaging';

interface CallNotificationProps {
  call: Call;
  onAccept: () => void;
  onReject: () => void;
}

export const CallNotification: React.FC<CallNotificationProps> = ({
  call,
  onAccept,
  onReject,
}) => {
  // Auto-hide notification after 30 seconds if not answered
  useEffect(() => {
    const timer = setTimeout(() => {
      if (call.status === 'ringing') {
        onReject();
      }
    }, 30000);
    
    return () => clearTimeout(timer);
  }, [call.status, onReject]);

  return (
    <div className="fixed top-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50 w-80">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
            {call.callerId.charAt(0).toUpperCase()}
          </div>
        </div>
        
        <div className="ml-3 flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {call.callType === 'voice' ? 'Voice Call' : 'Video Call'} from {call.callerId}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {call.status === 'ringing' ? 'Incoming call...' : `Call ${call.status}`}
          </p>
        </div>
        
        {call.status === 'ringing' && (
          <div className="flex space-x-2 ml-2">
            <button
              onClick={onReject}
              className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button
              onClick={onAccept}
              className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white hover:bg-green-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};