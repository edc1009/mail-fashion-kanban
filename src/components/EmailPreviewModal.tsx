import React from 'react';
import { X, Reply, Forward, Star, Archive, Trash2 } from 'lucide-react';
import { Button } from './ui/button';

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

interface EmailPreviewModalProps {
  email: Email | null;
  isOpen: boolean;
  onClose: () => void;
}

const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({ email, isOpen, onClose }) => {
  if (!isOpen || !email) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Email Preview</h2>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(email.priority)}`}>
              {email.priority.toUpperCase()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Email Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Email Header Info */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{email.subject}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span><strong>From:</strong> {email.from}</span>
                  <span><strong>Time:</strong> {email.timestamp}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Star className={`h-5 w-5 ${email.isStarred ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                </button>
              </div>
            </div>

            {/* Labels */}
            {email.labels && email.labels.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {email.labels.map((label, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Email Body */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-gray-900 leading-relaxed whitespace-pre-wrap">
              {email.preview}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Reply className="h-4 w-4" />
              Reply
            </Button>
            <Button variant="outline" className="gap-2">
              <Forward className="h-4 w-4" />
              Forward
            </Button>
            <Button variant="outline" className="gap-2">
              <Archive className="h-4 w-4" />
              Archive
            </Button>
            <Button variant="outline" className="gap-2 text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPreviewModal;