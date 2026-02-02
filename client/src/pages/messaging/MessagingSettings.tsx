import React, { useState } from 'react';

interface NotificationsState {
  message: boolean;
  group: boolean;
  call: boolean;
  meeting: boolean;
}

interface PrivacyState {
  readReceipts: boolean;
  typingIndicators: boolean;
  profilePhoto: string;
  lastSeen: string;
}

interface MediaState {
  autoDownload: boolean;
  imageQuality: string;
  videoQuality: string;
}

const MessagingSettings: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationsState>({
    message: true,
    group: true,
    call: true,
    meeting: true,
  });
  
  const [privacy, setPrivacy] = useState<PrivacyState>({
    readReceipts: true,
    typingIndicators: true,
    profilePhoto: 'everyone',
    lastSeen: 'contacts',
  });
  
  const [media, setMedia] = useState<MediaState>({
    autoDownload: true,
    imageQuality: 'high',
    videoQuality: 'medium',
  });

  const handleNotificationChange = (setting: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handlePrivacyChange = (setting: keyof PrivacyState, value: PrivacyState[keyof PrivacyState]) => {
    setPrivacy(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleMediaChange = (setting: string, value: string | boolean) => {
    setMedia(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 h-full overflow-y-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Messaging Settings</h1>
      
      <div className="space-y-8">
        {/* Notifications Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Message notifications</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when you receive a message</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.message}
                  onChange={(e) => handleNotificationChange('message', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Group notifications</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when a group message is received</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.group}
                  onChange={(e) => handleNotificationChange('group', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Call notifications</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when you receive a call</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.call}
                  onChange={(e) => handleNotificationChange('call', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Meeting notifications</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Get notified about upcoming meetings</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.meeting}
                  onChange={(e) => handleNotificationChange('meeting', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        {/* Privacy Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Privacy</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Read receipts</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">If turned off, you won't send or receive read receipts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacy.readReceipts}
                  onChange={(e) => handlePrivacyChange('readReceipts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Typing indicators</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Show when you are typing and see when others are typing</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacy.typingIndicators}
                  onChange={(e) => handlePrivacyChange('typingIndicators', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Profile photo</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Who can see your profile photo</p>
              </div>
              <select
                value={privacy.profilePhoto}
                onChange={(e) => handlePrivacyChange('profilePhoto', e.target.value)}
                className="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="everyone">Everyone</option>
                <option value="contacts">My contacts</option>
                <option value="nobody">Nobody</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Last seen</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Who can see when you were last online</p>
              </div>
              <select
                value={privacy.lastSeen}
                onChange={(e) => handlePrivacyChange('lastSeen', e.target.value)}
                className="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="everyone">Everyone</option>
                <option value="contacts">My contacts</option>
                <option value="nobody">Nobody</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Media Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Media</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Auto-download media</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Automatically download images, videos, and documents</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={media.autoDownload}
                  onChange={(e) => handleMediaChange('autoDownload', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Image quality</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Quality of images sent and received</p>
              </div>
              <select
                value={media.imageQuality}
                onChange={(e) => handleMediaChange('imageQuality', e.target.value)}
                className="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Video quality</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Quality of videos sent and received</p>
              </div>
              <select
                value={media.videoQuality}
                onChange={(e) => handleMediaChange('videoQuality', e.target.value)}
                className="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Data and Storage */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Data and Storage</h2>
          
          <div className="space-y-4">
            <button className="w-full text-left p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300">
              Chat backup
            </button>
            <button className="w-full text-left p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300">
              Export chat
            </button>
            <button className="w-full text-left p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300">
              Clear chat history
            </button>
            <button className="w-full text-left p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-red-600 dark:text-red-400">
              Delete all messages
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingSettings;