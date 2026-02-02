import React from 'react';
import { ChatRoom } from '../../types/messaging';

interface GroupInfoProps {
  chatRoom: ChatRoom;
  isAdmin: boolean;
  onEditGroup?: () => void;
  onLeaveGroup?: () => void;
  onAddMembers?: () => void;
  onRemoveMember?: (userId: string) => void;
  onClose?: () => void;
}

export const GroupInfo: React.FC<GroupInfoProps> = ({
  chatRoom,
  isAdmin,
  onEditGroup,
  onLeaveGroup,
  onAddMembers,
  onRemoveMember,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Group Info
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="text-center mb-6">
            {chatRoom.avatarUrl ? (
              <img
                src={chatRoom.avatarUrl}
                alt={chatRoom.name}
                className="w-24 h-24 rounded-full object-cover mx-auto"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-semibold mx-auto">
                {chatRoom.name?.charAt(0).toUpperCase() || '#'}
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-3">
              {chatRoom.name}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {chatRoom.participants.length} members
            </p>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Description</h4>
            <p className="text-gray-600 dark:text-gray-300">
              {chatRoom.description || 'No description added'}
            </p>
          </div>
          
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Members</h4>
            <div className="space-y-2">
              {chatRoom.participants.map(participant => (
                <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium mr-3">
                      {participant.userId.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{participant.userId}</p>
                      {participant.role === 'admin' && (
                        <p className="text-xs text-blue-500">Admin</p>
                      )}
                    </div>
                  </div>
                  
                  {isAdmin && participant.role !== 'admin' && (
                    <button
                      onClick={() => onRemoveMember?.(participant.userId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            {isAdmin && (
              <button
                onClick={onEditGroup}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Group
              </button>
            )}
            
            {isAdmin && (
              <button
                onClick={onAddMembers}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Members
              </button>
            )}
            
            <button
              onClick={onLeaveGroup}
              className="w-full p-3 border border-red-300 dark:border-red-600 rounded-md text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-800/30 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Leave Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};