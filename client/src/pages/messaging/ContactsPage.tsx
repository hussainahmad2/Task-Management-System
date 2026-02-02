import React, { useState } from 'react';
import { UserContact } from '../../types/messaging';

const ContactsPage: React.FC = () => {
  const [contacts, setContacts] = useState<UserContact[]>([
    {
      id: '1',
      userId: 'current-user',
      contactId: 'user1',
      nickname: 'John Smith',
      isBlocked: false,
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      id: '2',
      userId: 'current-user',
      contactId: 'user2',
      nickname: 'Sarah Johnson',
      isBlocked: false,
      createdAt: new Date(Date.now() - 172800000),
    },
    {
      id: '3',
      userId: 'current-user',
      contactId: 'user3',
      nickname: 'Michael Brown',
      isBlocked: false,
      createdAt: new Date(Date.now() - 259200000),
    },
    {
      id: '4',
      userId: 'current-user',
      contactId: 'user4',
      nickname: 'Emily Davis',
      isBlocked: false,
      createdAt: new Date(Date.now() - 345600000),
    },
    {
      id: '5',
      userId: 'current-user',
      contactId: 'user5',
      nickname: 'David Wilson',
      isBlocked: true, // Blocked contact
      createdAt: new Date(Date.now() - 432000000),
    },
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);

  const filteredContacts = contacts.filter(contact => 
    contact.nickname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.contactId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBlockContact = (contactId: string) => {
    setContacts(contacts.map(contact => 
      contact.id === contactId 
        ? { ...contact, isBlocked: !contact.isBlocked } 
        : contact
    ));
  };

  const handleDeleteContact = (contactId: string) => {
    setContacts(contacts.filter(contact => contact.id !== contactId));
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contacts</h1>
        <button
          onClick={() => setShowAddContact(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Add Contact
        </button>
      </div>
      
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search contacts..."
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
      
      <div className="space-y-3">
        {filteredContacts.map((contact) => (
          <div key={contact.id} className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold mr-4">
              {contact.nickname?.charAt(0).toUpperCase() || contact.contactId.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {contact.nickname || contact.contactId}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {contact.contactId}
              </p>
            </div>
            
            <div className="flex space-x-2">
              {contact.isBlocked ? (
                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Blocked</span>
              ) : null}
              
              <button
                onClick={() => handleBlockContact(contact.id)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"
              >
                {contact.isBlocked ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </button>
              
              <button
                onClick={() => handleDeleteContact(contact.id)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
        
        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No contacts</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No contacts match your search' : 'Get started by adding a new contact'}
            </p>
          </div>
        )}
      </div>
      
      {showAddContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Add Contact
                </h2>
                <button
                  onClick={() => setShowAddContact(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <label htmlFor="contactId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact ID or Username
                </label>
                <input
                  type="text"
                  id="contactId"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter contact ID or username"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nickname (Optional)
                </label>
                <input
                  type="text"
                  id="nickname"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter a nickname"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddContact(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsPage;