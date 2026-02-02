import React, { useState } from 'react';

interface Mail {
  id: string;
  sender: string;
  senderAvatar?: string;
  subject: string;
  preview: string;
  body: string;
  timestamp: Date;
  read: boolean;
  starred: boolean;
  attachments?: number;
  labels?: string[];
}

interface MailInboxProps {
  mails: Mail[];
  onSelectMail: (mail: Mail) => void;
  selectedMail?: Mail;
  onToggleStar?: (mailId: string) => void;
  onArchive?: (mailId: string) => void;
}

export const MailInbox: React.FC<MailInboxProps> = ({
  mails,
  onSelectMail,
  selectedMail,
  onToggleStar,
  onArchive,
}) => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'starred' | 'sent' | 'drafts'>('inbox');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMails = mails.filter(mail => {
    if (activeTab === 'starred' && !mail.starred) return false;
    return mail.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
           mail.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
           mail.preview.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex h-full bg-white dark:bg-gray-800">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Mail</h2>
        </div>
        
        <div className="p-2">
          <button className="w-full mb-1 p-2 rounded-md text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Inbox
          </button>
          <button className="w-full mb-1 p-2 rounded-md text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Starred
          </button>
          <button className="w-full mb-1 p-2 rounded-md text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Sent
          </button>
          <button className="w-full mb-1 p-2 rounded-md text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Drafts
          </button>
        </div>
        
        <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Compose
          </button>
        </div>
      </div>
      
      {/* Mail list */}
      <div className="flex-1 flex">
        <div className={`${selectedMail ? 'hidden md:block w-80' : 'w-full'} border-r border-gray-200 dark:border-gray-700 flex flex-col`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <input
                type="text"
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-3 top-2.5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredMails.map((mail) => (
              <div
                key={mail.id}
                onClick={() => onSelectMail(mail)}
                className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  selectedMail?.id === mail.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                } ${!mail.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold mr-3">
                    {mail.sender.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <h3 className={`font-medium truncate ${!mail.read ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-700 dark:text-gray-300'}`}>
                        {mail.sender}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(mail.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between mt-1">
                      <p className={`text-sm truncate ${!mail.read ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                        {mail.subject}
                      </p>
                      
                      <div className="flex space-x-1">
                        {mail.attachments && mail.attachments > 0 && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                        )}
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleStar?.(mail.id);
                          }}
                          className="focus:outline-none"
                        >
                          {mail.starred ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.677c.3.922 1.216 1.276 1.946.744l4.38-3.301c.929-.697 2.049.418 1.534 1.37l-2.59 4.482c-.35.606-.008 1.355.52 1.48l5.231 1.298c.9.223.9.543 0 .766l-5.231 1.298c-.528.125-.87.874-.52 1.48l2.59 4.482c.515.952-.605 1.668-1.534 1.37l-4.38-3.301c-.73-.532-1.646-.178-1.946.744l-1.519 4.677c-.3.921-1.603.921-1.902 0l-1.519-4.677c-.3-.922-1.216-1.276-1.946-.744l-4.38 3.301c-.929.697-2.049-.418-1.534-1.37l2.59-4.482c.35-.606.008-1.355-.52-1.48L1.534 8.72c-.9-.223-.9-.543 0-.766l5.231-1.298c.528-.125.87-.874.52-1.48l-2.59-4.482c-.515-.952.605-1.668 1.534-1.37l4.38 3.301c.73.532 1.646.178 1.946-.744l1.519-4.677z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                      {mail.preview}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mail content */}
        {selectedMail ? (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
              <button
                onClick={() => onSelectMail(null as any)} // Passing null as any to satisfy type
                className="md:hidden mr-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex-1">
                {selectedMail.subject}
              </h2>
              
              <div className="flex space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
                
                <button
                  onClick={() => onToggleStar?.(selectedMail.id)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                >
                  {selectedMail.starred ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.677c.3.922 1.216 1.276 1.946.744l4.38-3.301c.929-.697 2.049.418 1.534 1.37l-2.59 4.482c-.35.606-.008 1.355.52 1.48l5.231 1.298c.9.223.9.543 0 .766l-5.231 1.298c-.528.125-.87.874-.52 1.48l2.59 4.482c.515.952-.605 1.668-1.534 1.37l-4.38-3.301c-.73-.532-1.646-.178-1.946.744l-1.519 4.677c-.3.921-1.603.921-1.902 0l-1.519-4.677c-.3-.922-1.216-1.276-1.946-.744l-4.38 3.301c-.929.697-2.049-.418-1.534-1.37l2.59-4.482c.35-.606.008-1.355-.52-1.48L1.534 8.72c-.9-.223-.9-.543 0-.766l5.231-1.298c.528-.125.87-.874.52-1.48l-2.59-4.482c-.515-.952.605-1.668 1.534-1.37l4.38 3.301c.73.532 1.646.178 1.946-.744l1.519-4.677z" />
                    </svg>
                  )}
                </button>
                
                <button
                  onClick={() => onArchive?.(selectedMail.id)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex items-start mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold mr-3">
                  {selectedMail.sender.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-white">{selectedMail.sender}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">to me</p>
                </div>
                
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(selectedMail.timestamp).toLocaleString()}
                </div>
              </div>
              
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p>{selectedMail.body}</p>
              </div>
              
              {selectedMail.attachments && selectedMail.attachments > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Attachments ({selectedMail.attachments})</h4>
                  <div className="flex space-x-3">
                    {[...Array(selectedMail.attachments)].map((_, i) => (
                      <div key={i} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <span className="text-sm">attachment-{i+1}.pdf</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  Reply
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  Forward
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No message selected</h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Select a message from the list to read it here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};