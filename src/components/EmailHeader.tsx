
import React from 'react';
import { MoreVertical, Archive, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface EmailHeaderProps {
  unreadCount: number;
  selectedCount: number;
}

const EmailHeader: React.FC<EmailHeaderProps> = ({ unreadCount, selectedCount }) => {
  return (
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
            <span className="text-sm text-gray-500">{unreadCount} unread</span>
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
      
      {selectedCount > 0 && (
        <div className="flex items-center gap-2 mt-3 p-2 bg-purple-50 rounded-lg">
          <span className="text-sm text-purple-700">
            {selectedCount} selected
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
  );
};

export default EmailHeader;
