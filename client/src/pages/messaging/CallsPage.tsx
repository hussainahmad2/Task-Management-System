import React, { useState } from 'react';
import { Call } from '../../types/messaging';

const CallsPage: React.FC = () => {
  const [calls, setCalls] = useState<Call[]>([
    {
      id: '1',
      chatRoomId: '1',
      callerId: 'user1',
      calleeId: 'user2',
      callType: 'voice',
      status: 'ended',
      duration: 300, // 5 minutes
      startedAt: new Date(Date.now() - 86400000), // 1 day ago
      endedAt: new Date(Date.now() - 86400000 + 300000), // 5 minutes after start
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      id: '2',
      chatRoomId: '2',
      callerId: 'user3',
      calleeId: 'current-user',
      callType: 'video',
      status: 'missed',
      startedAt: new Date(Date.now() - 172800000), // 2 days ago
      createdAt: new Date(Date.now() - 172800000),
    },
    {
      id: '3',
      chatRoomId: '3',
      callerId: 'current-user',
      calleeId: 'user4',
      callType: 'voice',
      status: 'ended',
      duration: 120, // 2 minutes
      startedAt: new Date(Date.now() - 259200000), // 3 days ago
      endedAt: new Date(Date.now() - 259200000 + 120000), // 2 minutes after start
      createdAt: new Date(Date.now() - 259200000),
    },
  ]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number = 0) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = (status: string, callType: string) => {
    if (status === 'missed') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    } else if (callType === 'video') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      );
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 h-full overflow-y-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Calls</h1>
      
      <div className="space-y-4">
        {calls.map((call) => (
          <div key={call.id} className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="mr-4">
              {getStatusIcon(call.status, call.callType)}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {call.callerId === 'current-user' ? `To ${call.calleeId}` : `From ${call.callerId}`}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(call.startedAt!)}
                </span>
              </div>
              
              <div className="flex justify-between mt-1">
                <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {call.callType} • {call.status}
                </span>
                {call.duration && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDuration(call.duration)}
                  </span>
                )}
              </div>
            </div>
            
            <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CallsPage;