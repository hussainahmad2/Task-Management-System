import React, { useState } from 'react';
import { Meeting } from '../../types/messaging';
import { MeetingScheduler } from '../../components/messaging/MeetingScheduler';

const MeetingsPage: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'Team Sync',
      description: 'Weekly team sync meeting',
      chatRoomId: '1',
      organizerId: 'user1',
      scheduledFor: new Date(Date.now() + 86400000), // Tomorrow
      duration: 60, // 1 hour
      status: 'scheduled',
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 86400000),
    },
    {
      id: '2',
      title: 'Project Review',
      description: 'Review project milestones',
      chatRoomId: '2',
      organizerId: 'user2',
      scheduledFor: new Date(Date.now() + 172800000), // In 2 days
      duration: 45, // 45 minutes
      status: 'scheduled',
      createdAt: new Date(Date.now() - 172800000),
      updatedAt: new Date(Date.now() - 172800000),
    },
    {
      id: '3',
      title: 'Completed Meeting',
      description: 'Previous meeting',
      chatRoomId: '3',
      organizerId: 'user3',
      scheduledFor: new Date(Date.now() - 86400000), // Yesterday
      duration: 30, // 30 minutes
      status: 'completed',
      createdAt: new Date(Date.now() - 172800000),
      updatedAt: new Date(Date.now() - 86400000),
    },
  ]);
  
  const [showScheduler, setShowScheduler] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);

  const handleScheduleMeeting = (meetingData: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newMeeting: Meeting = {
      ...meetingData,
      id: `meeting-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    if (editingMeeting) {
      setMeetings(meetings.map(m => m.id === editingMeeting.id ? { ...newMeeting, id: editingMeeting.id } : m));
      setEditingMeeting(null);
    } else {
      setMeetings([newMeeting, ...meetings]);
    }
    
    setShowScheduler(false);
  };

  const handleEditMeeting = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setShowScheduler(true);
  };

  const handleDeleteMeeting = (id: string) => {
    setMeetings(meetings.filter(m => m.id !== id));
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meetings</h1>
        <button
          onClick={() => setShowScheduler(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Schedule Meeting
        </button>
      </div>
      
      <div className="space-y-4">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="mr-4">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {new Date(meeting.scheduledFor).getDate()}
              </div>
              <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
                {new Date(meeting.scheduledFor).toLocaleDateString('en-US', { month: 'short' })}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-bold text-gray-900 dark:text-white">{meeting.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(meeting.status)}`}>
                  {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{meeting.description}</p>
              
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(meeting.scheduledFor)}
                <span className="mx-2">•</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {meeting.duration} min
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditMeeting(meeting)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => handleDeleteMeeting(meeting.id)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {showScheduler && (
        <MeetingScheduler
          onSchedule={handleScheduleMeeting}
          onCancel={() => {
            setShowScheduler(false);
            setEditingMeeting(null);
          }}
          initialData={editingMeeting || undefined}
        />
      )}
    </div>
  );
};

export default MeetingsPage;