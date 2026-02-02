import React, { useState } from 'react';
import { MailInbox } from '../../components/messaging/MailInbox';

const MailInboxPage: React.FC = () => {
  const [mails] = useState([
    {
      id: '1',
      sender: 'John Smith',
      subject: 'Project Update',
      preview: 'Please find the attached project update document...',
      body: 'Hi there,\n\nPlease find the attached project update document for your review. We need to discuss the timeline adjustments by Friday.\n\nBest regards,\nJohn',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      read: false,
      starred: true,
      attachments: 1,
    },
    {
      id: '2',
      sender: 'Sarah Johnson',
      subject: 'Meeting Reminder',
      preview: 'Just a reminder about our meeting tomorrow at 10am...',
      body: 'Hello,\n\nThis is just a reminder about our meeting scheduled for tomorrow at 10am in Conference Room B. Please confirm your attendance.\n\nThanks,\nSarah',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      read: true,
      starred: false,
    },
    {
      id: '3',
      sender: 'Michael Brown',
      subject: 'Budget Approval',
      preview: 'The budget for Q3 has been approved by the finance team...',
      body: 'Dear Team,\n\nI\'m pleased to inform you that the budget for Q3 has been approved by the finance team. Please review the attached document for details.\n\nRegards,\nMichael',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      read: true,
      starred: false,
      attachments: 2,
    },
    {
      id: '4',
      sender: 'Emily Davis',
      subject: 'Welcome to the team!',
      preview: 'Welcome to our organization! We\'re excited to have you aboard...',
      body: 'Hi!\n\nWelcome to our organization! We\'re thrilled to have you join our team. Your orientation is scheduled for Monday at 9am. Looking forward to working with you.\n\nBest,\nEmily',
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      read: false,
      starred: true,
    },
  ]);
  
  const [selectedMail, setSelectedMail] = useState<any>(null);

  const handleSelectMail = (mail: any) => {
    setSelectedMail(mail);
  };

  const handleToggleStar = (mailId: string) => {
    console.log(`Toggle star for mail ${mailId}`);
  };

  const handleArchive = (mailId: string) => {
    console.log(`Archive mail ${mailId}`);
  };

  return (
    <div className="h-full">
      <MailInbox
        mails={mails}
        selectedMail={selectedMail}
        onSelectMail={handleSelectMail}
        onToggleStar={handleToggleStar}
        onArchive={handleArchive}
      />
    </div>
  );
};

export default MailInboxPage;