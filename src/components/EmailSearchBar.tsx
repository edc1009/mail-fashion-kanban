
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface EmailSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const EmailSearchBar: React.FC<EmailSearchBarProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="p-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search emails..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-gray-50 border-gray-200 focus:border-purple-300"
        />
      </div>
    </div>
  );
};

export default EmailSearchBar;
