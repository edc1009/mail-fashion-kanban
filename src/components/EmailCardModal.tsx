import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Reply, Forward, Archive, Trash2, MoreVertical, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface Email {
  id: string;
  from: string;
  preview: string;
  timestamp: string;
  isRead: boolean;
}

interface EmailCard {
  id: string;
  subject: string;
  emails: Email[];
  priority: 'low' | 'medium' | 'high';
  labels: string[];
}

interface EmailCardModalProps {
  card: EmailCard | null;
  isOpen: boolean;
  onClose: () => void;
  onEmailDragOut?: (email: Email) => void;
}

const EmailCardModal: React.FC<EmailCardModalProps> = ({ 
  card, 
  isOpen, 
  onClose, 
  onEmailDragOut 
}) => {
  if (!card) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-500 bg-red-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-green-500 bg-green-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const handleEmailDragStart = (e: React.DragEvent, email: Email) => {
    e.dataTransfer.setData('emailData', JSON.stringify(email));
    e.dataTransfer.setData('dragType', 'email-from-card');
    e.dataTransfer.setData('sourceCardId', card.id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden mx-4"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{card.subject}</h2>
                  <div className="flex items-center gap-3 mb-3">
                    <Badge 
                      variant="outline" 
                      className={`px-3 py-1 border-2 ${getPriorityColor(card.priority)}`}
                    >
                      {card.priority.toUpperCase()} PRIORITY
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      {card.emails.length} email{card.emails.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {card.labels.map(label => (
                      <Badge key={label} variant="secondary" className="bg-purple-100 text-purple-700">
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Archive className="mr-2 h-4 w-4" />
                        Archive Card
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Card
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button onClick={onClose} variant="ghost" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Email List */}
            <div className="overflow-y-auto max-h-[60vh] p-6 space-y-4">
              {card.emails.map((email, index) => (
                <motion.div
                  key={email.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div
                    draggable={card.emails.length > 1}
                    onDragStart={(e) => handleEmailDragStart(e, email)}
                    className={`p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all ${
                      card.emails.length > 1 ? 'cursor-grab active:cursor-grabbing hover:border-purple-300' : ''
                    } ${!email.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}
                  >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-medium ${!email.isRead ? 'text-blue-900' : 'text-gray-900'}`}>
                          {email.from}
                        </span>
                        {!email.isRead && (
                          <Badge className="bg-blue-500 text-white text-xs">New</Badge>
                        )}
                        {card.emails.length > 1 && (
                          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-600">
                            Drag to extract
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{email.preview}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-xs text-gray-500">{email.timestamp}</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Reply className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Forward className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                    {index < card.emails.length - 1 && (
                      <div className="mt-4 pt-4 border-t border-gray-100" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {card.emails.length > 1 && (
                  "Drag individual emails out to create new cards"
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Reply className="h-4 w-4 mr-2" />
                  Reply All
                </Button>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Forward className="h-4 w-4 mr-2" />
                  Forward
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EmailCardModal;