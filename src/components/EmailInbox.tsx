
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
      from: 'operations@mscshipping.com',
      subject: 'Container Ship MSC MAYA Arrival Delay Notice',
      preview: 'Due to severe weather conditions, container ship MSC MAYA is expected to arrive at Kaohsiung Port 6 hours behind schedule. Please adjust your cargo pickup arrangements. Container No: MSCU1234567',
      timestamp: '2 hours ago',
      isRead: false,
      isStarred: true,
      labels: ['Urgent', 'Delay Notice'],
      priority: 'high'
    },
    {
      id: '2',
      from: 'documentation@evergreen-line.com',
      subject: 'Bill of Lading Confirmation - Electronics Export to Germany',
      preview: 'Your Bill of Lading EGLV202401001 has been confirmed. Cargo: Electronics 500 boxes, Destination: Hamburg Port. Estimated transit time 25 days.',
      timestamp: '4 hours ago',
      isRead: false,
      isStarred: false,
      labels: ['Bill of Lading', 'Export'],
      priority: 'medium'
    },
    {
      id: '3',
      from: 'customs@keelung-port.gov.tw',
      subject: 'Customs Inspection Notice - Imported Textiles',
      preview: 'Your imported cargo (Declaration No: IMP240115001) has been selected for customs inspection. Please arrive at Keelung Port Terminal 3 by 10:00 AM tomorrow for inspection cooperation.',
      timestamp: '6 hours ago',
      isRead: true,
      isStarred: false,
      labels: ['Customs', 'Inspection'],
      priority: 'high'
    },
    {
      id: '4',
      from: 'sales@yangming.com',
      subject: 'Freight Quote - Taiwan to US West Coast',
      preview: 'Thank you for your inquiry. 20ft container Taiwan to Los Angeles freight quote: USD 2,850/TEU, 40ft container: USD 3,200/TEU. Quote valid until end of month.',
      timestamp: '8 hours ago',
      isRead: false,
      isStarred: true,
      labels: ['Quote', 'US Route'],
      priority: 'medium'
    },
    {
      id: '5',
      from: 'claims@marine-insurance.com',
      subject: 'Cargo Insurance Claim Application Confirmation',
      preview: 'Your claim application (Case No: CL2024001) has been received. Cargo: Machinery Equipment, Loss Amount: USD 15,000. Expected review completion within 10 business days.',
      timestamp: '1 day ago',
      isRead: true,
      isStarred: false,
      labels: ['Insurance', 'Claims'],
      priority: 'medium'
    },
    {
      id: '6',
      from: 'marketing@cosco-shipping.com',
      subject: 'New Route Launch - Taiwan Direct to Europe',
      preview: 'COSCO Shipping launches new Taiwan direct to Rotterdam route, twice weekly service, transit time reduced to 22 days. 15% discount for inaugural voyage, welcome to inquire.',
      timestamp: '1 day ago',
      isRead: false,
      isStarred: false,
      labels: ['New Route', 'Promotion'],
      priority: 'low'
    },
    {
      id: '7',
      from: 'dangerous-goods@port-authority.gov.tw',
      subject: 'Dangerous Goods Declaration Document Supplement Notice',
      preview: 'Your declared dangerous goods cargo (UN1993 Flammable Liquid) documentation is incomplete. Please submit MSDS safety data sheet and packaging certificate. Deadline: tomorrow 5:00 PM.',
      timestamp: '1 day ago',
      isRead: false,
      isStarred: true,
      labels: ['Dangerous Goods', 'Documentation'],
      priority: 'high'
    },
    {
      id: '8',
      from: 'equipment@hapag-lloyd.com',
      subject: 'Empty Container Arrangement - Taichung Port',
      preview: 'Your reserved 20ft empty container has been arranged at Taichung Port Terminal 5. Pickup time: tomorrow 9:00 AM-12:00 PM. Please bring equipment interchange receipt and relevant documents.',
      timestamp: '2 days ago',
      isRead: true,
      isStarred: false,
      labels: ['Empty Container', 'Arrangement'],
      priority: 'medium'
    },
    {
      id: '9',
      from: 'reports@logistics-partner.com',
      subject: 'Monthly Transportation Report - January 2024',
      preview: 'January transportation statistics: Total container volume 1,250 TEU, On-time rate 96.8%, Main destinations Southeast Asia (45%) and North America (32%). Detailed report attached.',
      timestamp: '3 days ago',
      isRead: true,
      isStarred: false,
      labels: ['Report', 'Statistics'],
      priority: 'low'
    },
    {
      id: '10',
      from: 'alerts@shipping-intelligence.com',
      subject: 'Port Congestion Alert - Shanghai Yangshan Port',
      preview: 'Due to cargo volume surge before Chinese New Year, Shanghai Yangshan Port is experiencing severe congestion. Expected delay 3-5 days. Consider alternative ports or schedule adjustments.',
      timestamp: '3 days ago',
      isRead: false,
      isStarred: false,
      labels: ['Port Congestion', 'Alert'],
      priority: 'high'
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
