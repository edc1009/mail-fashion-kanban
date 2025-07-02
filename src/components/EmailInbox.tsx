
import React, { useState } from 'react';
import EmailHeader from './EmailHeader';
import EmailSearchBar from './EmailSearchBar';
import EmailListItem from './EmailListItem';

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  labels: string[];
  priority: 'low' | 'medium' | 'high';
  threadCount?: number;
}

interface EmailInboxProps {
  onEmailSelect: (email: Email) => void;
  selectedEmailId?: string;
  onEmailDragStart?: (e: React.DragEvent, email: Email) => void;
}

const EmailInbox: React.FC<EmailInboxProps> = ({ onEmailSelect, selectedEmailId, onEmailDragStart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

  // Mock email data
  const mockEmails: Email[] = [
    {
      id: '1',
      from: 'sarah@fashionhouse.com',
      subject: 'Fashion Week Planning Meeting',
      preview: 'Let\'s discuss the upcoming fashion week schedule and venue arrangements for the Milan show...',
      timestamp: '2 hours ago',
      isRead: false,
      isStarred: true,
      labels: ['Fashion Week', 'Important'],
      priority: 'high',
      threadCount: 10
    },
    {
      id: '2',
      from: 'creative@studio.com',
      subject: 'Spring 2024 Collection Review',
      preview: 'The Spring 2024 collection needs final approval before production. Please review the attached designs...',
      timestamp: '4 hours ago',
      isRead: false,
      isStarred: false,
      labels: ['Design', 'Review'],
      priority: 'medium',
      threadCount: 3
    },
    {
      id: '3',
      from: 'suppliers@textiles.com',
      subject: 'Updated Pricing for Organic Cotton',
      preview: 'We have updated our pricing structure for organic cotton materials. Please find the new rates...',
      timestamp: '1 day ago',
      isRead: true,
      isStarred: false,
      labels: ['Suppliers', 'Materials'],
      priority: 'low',
      threadCount: 5
    },
    {
      id: '4',
      from: 'events@milanfw.com',
      subject: 'Milan Fashion Week 2024 Confirmation',
      preview: 'Confirmation for Milan Fashion Week 2024 - booth #47. Your registration has been confirmed...',
      timestamp: '2 days ago',
      isRead: true,
      isStarred: true,
      labels: ['Fashion Week', 'Events'],
      priority: 'high'
    },
    {
      id: '5',
      from: 'logistics@shipping.com',
      subject: 'Shipping Delays for Fabric Orders',
      preview: 'We regret to inform you about shipping delays for fabric orders from Italy due to customs...',
      timestamp: '3 days ago',
      isRead: false,
      isStarred: false,
      labels: ['Logistics', 'Delays'],
      priority: 'medium'
    }
  ];

  const filteredEmails = mockEmails.filter(email =>
    email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleEmailSelection = (emailId: string) => {
    setSelectedEmails(prev => 
      prev.includes(emailId) 
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  };

  const handleDragStart = (e: React.DragEvent, email: Email) => {
    if (onEmailDragStart) {
      onEmailDragStart(e, email);
    }
  };

  const unreadCount = filteredEmails.filter(email => !email.isRead).length;

  return (
    <div className="h-full flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm">
      <EmailHeader unreadCount={unreadCount} selectedCount={selectedEmails.length} />
      <EmailSearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        {filteredEmails.map((email) => (
          <EmailListItem
            key={email.id}
            email={email}
            isSelected={selectedEmailId === email.id}
            isChecked={selectedEmails.includes(email.id)}
            onSelect={() => onEmailSelect(email)}
            onToggleCheck={() => toggleEmailSelection(email.id)}
            onDragStart={handleDragStart}
          />
        ))}
      </div>
    </div>
  );
};

export default EmailInbox;
