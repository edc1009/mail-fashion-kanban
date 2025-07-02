
import React, { useState } from 'react';
import { Inbox, Search, Filter, Star, Archive, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

  const getReadStatusColor = (isRead: boolean) => {
    return isRead ? 'border-l-green-500' : 'border-l-red-500';
  };

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

  return (
    <div className="h-full flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Inbox Header */}
      <div className="border-b border-gray-200">
        <div className="p-4">
          <div className="mb-6">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl leading-none">📥</span>
              <h1 className="text-2xl font-bold leading-none bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                INBOX
              </h1>
            </div>
          </div>
        </div>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{filteredEmails.filter(email => !email.isRead).length} unread</span>
              <Button size="sm" variant="outline">
                Mark all read
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Archive className="mr-2 h-4 w-4" />
                  Archive All
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete All
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 focus:border-purple-300"
            />
          </div>
        </div>
        
        {/* Action Buttons */}
        {selectedEmails.length > 0 && (
          <div className="flex items-center gap-2 mt-3 p-2 bg-purple-50 rounded-lg">
            <span className="text-sm text-purple-700">
              {selectedEmails.length} selected
            </span>
            <Button variant="ghost" size="sm">
              <Archive className="h-4 w-4 mr-1" />
              Archive
            </Button>
            <Button variant="ghost" size="sm">
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        {filteredEmails.map((email) => (
          <div
            key={email.id}
            draggable={!!onEmailDragStart}
            onDragStart={(e) => handleDragStart(e, email)}
            onClick={() => onEmailSelect(email)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${
              getReadStatusColor(email.isRead)
            } ${
              selectedEmailId === email.id ? 'bg-purple-50 border-r-4 border-r-purple-500' : ''
            } ${
              !email.isRead ? 'bg-red-50/30' : 'bg-green-50/20'
            } ${
              onEmailDragStart ? 'cursor-grab active:cursor-grabbing' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={selectedEmails.includes(email.id)}
                onChange={() => toggleEmailSelection(email.id)}
                onClick={(e) => e.stopPropagation()}
                className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm truncate ${
                      !email.isRead ? 'text-red-900 font-bold' : 'text-green-700 font-normal'
                    }`}>
                      {email.from}
                    </span>
                    {email.threadCount && email.threadCount > 1 && (
                       <span className="text-xs text-gray-500 font-medium">
                         {email.threadCount}
                       </span>
                     )}
                    {email.isStarred && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {email.timestamp}
                  </span>
                </div>
                
                <h3 className={`text-sm mb-1 truncate ${
                  !email.isRead ? 'font-bold text-red-900' : 'font-normal text-green-800'
                }`}>
                  {email.subject}
                </h3>
                
                <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                  {email.preview}
                </p>
                
                {email.labels.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {email.labels.map((label, index) => (
                      <Badge key={index} variant="outline" className="text-xs px-2 py-0">
                        {label}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmailInbox;
