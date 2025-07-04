import React, { useState, useRef, useCallback } from 'react';
import { Search, Filter, Calendar, Plus, Kanban, GripVertical, X, ArrowLeft, Archive, Trash2, MoreVertical, Reply, Forward, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import EmailInbox from './EmailInbox';
import AnimatedKanbanColumn from './AnimatedKanbanColumn';
import EmailCardModal from './EmailCardModal';

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
}

interface EmailCard {
  id: string;
  subject: string;
  emails: {
    id: string;
    from: string;
    preview: string;
    timestamp: string;
    isRead: boolean;
  }[];
  priority: 'low' | 'medium' | 'high';
  labels: string[];
}

// Add interface for dragged email from inbox
interface DraggedEmail {
  id: string;
  from: string;
  subject: string;
  preview: string;
  timestamp: string;
  isRead: boolean;
  labels: string[];
}

const EmailKanbanLayout = () => {
  const [selectedEmail, setSelectedEmail] = useState<EmailCard | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [inboxWidth, setInboxWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const [expandedEmails, setExpandedEmails] = useState<Set<string>>(new Set());
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingColor, setEditingColor] = useState('');
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [newColumnColor, setNewColumnColor] = useState('from-gray-500 to-gray-600');

  const [selectedCard, setSelectedCard] = useState<EmailCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);

  // Mock data for kanban cards
  const mockEmailCards: EmailCard[] = [
    {
      id: '1',
      subject: 'Fashion Week Planning',
      emails: [
        {
          id: '1a',
          from: 'sarah@fashionhouse.com',
          preview: 'Let\'s discuss the upcoming fashion week schedule and venue arrangements...',
          timestamp: '2 hours ago',
          isRead: false
        },
        {
          id: '1b',
          from: 'events@milanfw.com',
          preview: 'Confirmation for Milan Fashion Week 2024 - booth #47',
          timestamp: '4 hours ago',
          isRead: true
        }
      ],
      priority: 'high',
      labels: ['Fashion Week', 'Events']
    },
    {
      id: '2',
      subject: 'Collection Review',
      emails: [
        {
          id: '2a',
          from: 'creative@studio.com',
          preview: 'The Spring 2024 collection needs final approval before production...',
          timestamp: '1 day ago',
          isRead: false
        }
      ],
      priority: 'medium',
      labels: ['Design', 'Review']
    },
    {
      id: '3',
      subject: 'Supplier Negotiations',
      emails: [
        {
          id: '3a',
          from: 'suppliers@textiles.com',
          preview: 'Updated pricing for organic cotton materials...',
          timestamp: '3 days ago',
          isRead: true
        },
        {
          id: '3b',
          from: 'logistics@shipping.com',
          preview: 'Shipping delays for fabric orders from Italy',
          timestamp: '2 days ago',
          isRead: false
        }
      ],
      priority: 'low',
      labels: ['Suppliers', 'Materials']
    }
  ];

  const colorOptions = [
    { name: 'Blue', value: 'from-blue-500 to-cyan-500' },
    { name: 'Yellow', value: 'from-yellow-500 to-orange-500' },
    { name: 'Purple', value: 'from-purple-500 to-pink-500' },
    { name: 'Green', value: 'from-green-500 to-emerald-500' },
    { name: 'Red', value: 'from-red-500 to-rose-500' },
    { name: 'Indigo', value: 'from-indigo-500 to-purple-500' },
    { name: 'Teal', value: 'from-teal-500 to-cyan-500' },
    { name: 'Gray', value: 'from-gray-500 to-gray-600' }
  ];

  const [columns, setColumns] = useState([
    {
      id: 'todo',
      title: 'To Do',
      color: 'from-blue-500 to-cyan-500',
      cards: [mockEmailCards[0]]
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      color: 'from-yellow-500 to-orange-500',
      cards: [mockEmailCards[1]]
    },
    {
      id: 'waiting',
      title: 'Waiting for Reply',
      color: 'from-purple-500 to-pink-500',
      cards: []
    },
    {
      id: 'done',
      title: 'Completed',
      color: 'from-green-500 to-emerald-500',
      cards: [mockEmailCards[2]]
    }
  ]);

  const { toast } = useToast();

  // Enhanced function to find if email exists in any card
  const findEmailInCards = (emailId: string): { columnId: string; cardId: string; cardTitle: string } | null => {
    for (const column of columns) {
      for (const card of column.cards) {
        if (card.emails.some(email => email.id === emailId)) {
          return {
            columnId: column.id,
            cardId: card.id,
            cardTitle: card.subject
          };
        }
      }
    }
    return null;
  };

  // Function to handle card click and open modal
  const handleCardClick = (card: EmailCard) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  // Function to close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  const handleDragStart = (e: React.DragEvent, cardId: string, sourceColumnId: string) => {
    e.dataTransfer.setData('cardId', cardId);
    e.dataTransfer.setData('sourceColumnId', sourceColumnId);
    e.dataTransfer.setData('dragType', 'card');
  };

  // Handle email drag from inbox
  const handleEmailDragStart = (e: React.DragEvent, email: Email) => {
    console.log('Email drag started:', email);
    const draggedEmail: DraggedEmail = {
      id: email.id,
      from: email.from,
      subject: email.subject,
      preview: email.preview,
      timestamp: email.timestamp,
      isRead: email.isRead,
      labels: email.labels
    };
    e.dataTransfer.setData('emailData', JSON.stringify(draggedEmail));
    e.dataTransfer.setData('dragType', 'email');
  };

  const handleEmailToCard = (e: React.DragEvent, targetCardId: string) => {
    e.preventDefault();
    
    const dragType = e.dataTransfer.getData('dragType');
    
    if (dragType === 'email') {
      const emailDataString = e.dataTransfer.getData('emailData');
      if (emailDataString) {
        const email: DraggedEmail = JSON.parse(emailDataString);
        console.log('Email dropped onto card:', targetCardId, email);
        
        setColumns(prevColumns => {
          const newColumns = [...prevColumns];
          
          // Find the target card across all columns
          for (const column of newColumns) {
            const targetCard = column.cards.find(card => card.id === targetCardId);
            if (targetCard) {
              // Check if email already exists in this card
              const emailExists = targetCard.emails.some(e => e.id === email.id);
              if (!emailExists) {
                targetCard.emails.push({
                  id: email.id,
                  from: email.from,
                  preview: email.preview,
                  timestamp: email.timestamp,
                  isRead: email.isRead
                });
                console.log('Added email to existing card:', targetCard.subject);
                
                toast({
                  title: "Email Added",
                  description: `Email added to card "${targetCard.subject}".`,
                });
              } else {
                toast({
                  title: "Email Already Exists",
                  description: `This email is already in card "${targetCard.subject}".`,
                  variant: "destructive",
                });
              }
              break;
            }
          }
          
          return newColumns;
        });
      }
    }
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    
    const dragType = e.dataTransfer.getData('dragType');
    
    if (dragType === 'email') {
      // Handle email drop from inbox
      const emailDataString = e.dataTransfer.getData('emailData');
      if (emailDataString) {
        const email: DraggedEmail = JSON.parse(emailDataString);
        console.log('Email dropped into column:', targetColumnId, email);
        
        // Check if email already exists in any card
        const existingLocation = findEmailInCards(email.id);
        if (existingLocation) {
          toast({
            title: "Email Already Exists",
            description: `This email is already in "${existingLocation.cardTitle}". Click to view.`,
            variant: "destructive",
          });
          
          // Find and highlight the existing card
          const existingCard = columns
            .find(col => col.id === existingLocation.columnId)
            ?.cards.find(card => card.id === existingLocation.cardId);
          
          if (existingCard) {
            handleCardClick(existingCard);
          }
          return;
        }
        
        setColumns(prevColumns => {
          const newColumns = [...prevColumns];
          const targetColumn = newColumns.find(col => col.id === targetColumnId);
          
          if (targetColumn) {
            // Check if a card with the same subject already exists
            const existingCard = targetColumn.cards.find(card => 
              card.subject.toLowerCase().trim() === email.subject.toLowerCase().trim()
            );
            
            if (existingCard) {
              // Add email to existing card
              existingCard.emails.push({
                id: email.id,
                from: email.from,
                preview: email.preview,
                timestamp: email.timestamp,
                isRead: email.isRead
              });
              console.log('Added email to existing card:', existingCard.subject);
              
              toast({
                title: "Email Added",
                description: `Email added to existing card "${existingCard.subject}".`,
              });
            } else {
              // Create new card
              const newCard: EmailCard = {
                id: `card-${Date.now()}-${email.id}`,
                subject: email.subject,
                emails: [{
                  id: email.id,
                  from: email.from,
                  preview: email.preview,
                  timestamp: email.timestamp,
                  isRead: email.isRead
                }],
                priority: 'medium',
                labels: email.labels.filter(label => !['INBOX', 'UNREAD', 'IMPORTANT'].includes(label))
              };
              targetColumn.cards.push(newCard);
              console.log('Created new card:', newCard.subject);
              
              toast({
                title: "New Card Created",
                description: `Created new card "${newCard.subject}" from email.`,
              });
            }
          }
          
          return newColumns;
        });
      }
    } else if (dragType === 'email-from-card') {
      // Handle email extracted from existing card
      const emailDataString = e.dataTransfer.getData('emailData');
      const sourceCardId = e.dataTransfer.getData('sourceCardId');
      
      if (emailDataString && sourceCardId) {
        const email = JSON.parse(emailDataString);
        
        setColumns(prevColumns => {
          const newColumns = [...prevColumns];
          
          // Remove email from source card
          for (const column of newColumns) {
            const sourceCard = column.cards.find(card => card.id === sourceCardId);
            if (sourceCard && sourceCard.emails.length > 1) {
              sourceCard.emails = sourceCard.emails.filter(e => e.id !== email.id);
              break;
            }
          }
          
          // Create new card in target column
          const targetColumn = newColumns.find(col => col.id === targetColumnId);
          if (targetColumn) {
            const newCard: EmailCard = {
              id: `card-${Date.now()}-${email.id}`,
              subject: email.subject || 'Extracted Email',
              emails: [email],
              priority: 'medium',
              labels: []
            };
            targetColumn.cards.push(newCard);
            
            toast({
              title: "Email Extracted",
              description: `Created new card from extracted email.`,
            });
          }
          
          return newColumns;
        });
      }
    } else if (dragType === 'card') {
      // Handle card movement between columns
      const cardId = e.dataTransfer.getData('cardId');
      const sourceColumnId = e.dataTransfer.getData('sourceColumnId');

      if (sourceColumnId === targetColumnId) return;

      setColumns(prevColumns => {
        const newColumns = [...prevColumns];
        const sourceColumn = newColumns.find(col => col.id === sourceColumnId);
        const targetColumn = newColumns.find(col => col.id === targetColumnId);
        
        if (sourceColumn && targetColumn) {
          const cardIndex = sourceColumn.cards.findIndex(card => card.id === cardId);
          if (cardIndex !== -1) {
            const [movedCard] = sourceColumn.cards.splice(cardIndex, 1);
            targetColumn.cards.push(movedCard);
            
            toast({
              title: "Card Moved",
              description: `Card "${movedCard.subject}" moved to ${targetColumn.title}.`,
            });
          }
        }
        
        return newColumns;
      });
    }
  };



  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      const newColumn = {
        id: `column-${Date.now()}`,
        title: newColumnTitle,
        color: newColumnColor,
        cards: []
      };
      setColumns([...columns, newColumn]);
      setNewColumnTitle('');
      setNewColumnColor('from-gray-500 to-gray-600');
      setIsAddingColumn(false);
    }
  };

  const handleEditColumn = (columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    if (column) {
      setEditingColumnId(columnId);
      setEditingTitle(column.title);
      setEditingColor(column.color);
    }
  };

  const handleSaveEdit = () => {
    if (editingTitle.trim()) {
      setColumns(columns.map(col => 
        col.id === editingColumnId 
          ? { ...col, title: editingTitle, color: editingColor }
          : col
      ));
      setEditingColumnId(null);
      setEditingTitle('');
      setEditingColor('');
    }
  };

  const handleCancelEdit = () => {
    setEditingColumnId(null);
    setEditingTitle('');
    setEditingColor('');
  };

  const handleCancelAdd = () => {
    setIsAddingColumn(false);
    setNewColumnTitle('');
    setNewColumnColor('from-gray-500 to-gray-600');
  };

  const handleDeleteColumn = (columnId: string) => {
    if (columns.length <= 1) {
      alert('Cannot delete the last column');
      return;
    }
    
    if (confirm('Are you sure you want to delete this column? All emails in this column will be lost.')) {
      setColumns(columns.filter(col => col.id !== columnId));
      // Cancel editing if we're deleting the column being edited
      if (editingColumnId === columnId) {
        setEditingColumnId(null);
        setEditingTitle('');
        setEditingColor('');
      }
    }
  };

  const handleEmailSelect = (email: Email) => {
    // Convert single Email to EmailCard format for thread display
    const emailCard: EmailCard = {
      id: email.id,
      subject: email.subject,
      emails: [
        {
          id: email.id,
          from: email.from,
          preview: email.preview,
          timestamp: email.timestamp,
          isRead: email.isRead
        },
        // Add mock thread replies for demonstration
        {
          id: email.id + '_reply1',
          from: 'support@chargepoint.com',
          preview: 'Thank you for contacting ChargePoint Support. We have received your request and will process it shortly.',
          timestamp: 'Jun 16',
          isRead: true
        },
        {
          id: email.id + '_reply2',
          from: email.from,
          preview: 'Thank you for the quick response. I look forward to hearing back from you.',
          timestamp: 'Jun 17',
          isRead: true
        }
      ],
      priority: email.priority,
      labels: email.labels
    };
    setSelectedEmail(emailCard);
    // Auto-adjust inbox width when email is selected
    if (email && inboxWidth < 600) {
      setInboxWidth(600);
    }
  };

  const handleCloseEmailReview = () => {
    setSelectedEmail(null);
    setExpandedEmails(new Set());
  };

  const toggleEmailExpansion = (emailId: string) => {
    setExpandedEmails(prev => {
      const newSet = new Set(prev);
      if (newSet.has(emailId)) {
        newSet.delete(emailId);
      } else {
        newSet.add(emailId);
      }
      return newSet;
    });
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const newWidth = e.clientX;
    if (newWidth >= 300 && newWidth <= 800) {
      setInboxWidth(newWidth);
    }
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Inbox Section */}
      <div 
        className="flex bg-white rounded-lg border border-gray-200 shadow-sm ml-4 mr-0 mb-4"
        style={{ width: `${inboxWidth}px`, minWidth: '300px', maxWidth: '800px' }}
      >
        {/* Email Inbox */}
        <div className="flex-1 flex flex-col">
          <EmailInbox 
            onEmailSelect={handleEmailSelect}
            selectedEmailId={selectedEmail?.id}
            onEmailDragStart={handleEmailDragStart}
          />
        </div>

        {/* Email Thread Panel - Gmail Style */}
        {selectedEmail && (
          <div className="w-96 border-l border-gray-200 bg-white flex flex-col rounded-lg">
            {/* Thread Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCloseEmailReview}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close email"
                >
                  <ArrowLeft className="h-4 w-4 text-gray-600" />
                </button>
                <div className="flex items-center gap-2">
                  <Archive className="h-4 w-4 text-gray-600 hover:text-gray-800 cursor-pointer" />
                  <Trash2 className="h-4 w-4 text-gray-600 hover:text-gray-800 cursor-pointer" />
                  <MoreVertical className="h-4 w-4 text-gray-600 hover:text-gray-800 cursor-pointer" />
                </div>
              </div>
            </div>

            {/* Thread Subject and Info */}
            <div className="p-4 border-b border-gray-100">
              <h1 className="text-lg font-medium text-gray-900 mb-2">{selectedEmail.subject}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{selectedEmail.emails.length} messages</span>
                {selectedEmail.labels.length > 0 && (
                  <>
                    <span>•</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedEmail.labels.map((label, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {label}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Thread Messages */}
            <div className="flex-1 overflow-y-auto">
              {selectedEmail.emails.map((email, index) => {
                const isExpanded = expandedEmails.has(email.id);
                const isLatest = index === selectedEmail.emails.length - 1;
                
                return (
                  <div 
                    key={email.id} 
                    className={`border-b border-gray-100 last:border-b-0 transition-colors ${
                      !isLatest ? 'hover:bg-gray-50 cursor-pointer' : ''
                    } ${
                      isExpanded ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => !isLatest && toggleEmailExpansion(email.id)}
                  >
                    {/* Message Header */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-xs flex-shrink-0">
                            {email.from.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 text-sm truncate">{email.from}</span>
                              {index === 0 && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Original</span>
                              )}
                              {isLatest && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Latest</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              to me • {email.timestamp}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                           <button className="p-1 hover:bg-gray-100 rounded" onClick={(e) => e.stopPropagation()}>
                             <Reply className="h-3 w-3 text-gray-500" />
                           </button>
                           <button className="p-1 hover:bg-gray-100 rounded" onClick={(e) => e.stopPropagation()}>
                             <MoreVertical className="h-3 w-3 text-gray-500" />
                           </button>
                         </div>
                      </div>
                      
                      {/* Message Content */}
                      {(isLatest || isExpanded) && (
                        <div className="ml-11">
                          <div className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">
                            {email.preview}
                          </div>
                        </div>
                      )}
                      
                      {/* Collapsed Preview */}
                      {!isLatest && !isExpanded && (
                        <div className="ml-11">
                          <div className="text-sm text-gray-600 truncate">
                            {email.preview.substring(0, 80)}...
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Section */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-medium text-xs">
                  M
                </div>
                <span className="text-sm text-gray-700">Reply to all</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                  <Reply className="h-4 w-4" />
                  Reply
                </Button>
                <Button size="sm" variant="outline" className="gap-2">
                  <Forward className="h-4 w-4" />
                  Forward
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resize Handle */}
      <div 
        ref={resizeRef}
        className={`w-1 bg-gray-300 hover:bg-purple-400 cursor-col-resize flex items-center justify-center transition-colors ${
          isResizing ? 'bg-purple-500' : ''
        }`}
        onMouseDown={handleMouseDown}
      >
        <GripVertical className="h-4 w-4 text-gray-500" />
      </div>

      {/* Right Side - Kanban Board */}
      <div className="flex-1 flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm mr-4 mb-4">
        {/* Header with consistent styling */}
        <div className="border-b border-gray-200">
          <div className="p-4">
            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl leading-none">📧</span>
                <h1 className="text-2xl font-bold leading-none bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Email Kanban Board
                </h1>
              </div>
            </div>
          </div>
        </div>
          
        {/* Search and Action Bar */}
        <div className="p-4">
          <div className="flex items-center gap-4 bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
            <div className="flex-1 flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search kanban cards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 border-gray-200 focus:border-purple-300"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Calendar className="h-4 w-4" />
                Today
              </Button>
              <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Plus className="h-4 w-4" />
                New Card
              </Button>
            </div>
          </div>
        </div>

        {/* Kanban Columns */}
        <div className="flex-1 overflow-hidden p-4">
          <div className="flex gap-6 h-full overflow-x-auto pb-4" style={{height: 'calc(100vh - 280px)'}}>
            {columns.map(column => (
              <div 
                key={column.id} 
                className="w-[380px] flex-shrink-0 h-full"
              >
                <AnimatedKanbanColumn
                  column={column}
                  index={columns.indexOf(column)}
                  onDragStart={handleDragStart}
                  onDrop={(e) => handleDrop(e, column.id)}
                  onEdit={() => handleEditColumn(column.id)}
                  onDelete={() => handleDeleteColumn(column.id)}
                  isEditing={editingColumnId === column.id}
                  editingTitle={editingTitle}
                  editingColor={editingColor}
                  onTitleChange={setEditingTitle}
                  onColorChange={setEditingColor}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={handleCancelEdit}
                  colorOptions={colorOptions}
                  onCardClick={handleCardClick}
                  onEmailToCard={handleEmailToCard}
                />
              </div>
            ))}
            
            {/* Add New Column */}
            {isAddingColumn ? (
              <div className="min-w-60 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
                <div className="p-4">
                  <div className="space-y-4">
                    <Input
                      placeholder="Column title"
                      value={newColumnTitle}
                      onChange={(e) => setNewColumnTitle(e.target.value)}
                      className="bg-white/80"
                      autoFocus
                    />
                    
                    {/* Color Picker */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Color</label>
                      <div className="grid grid-cols-4 gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => setNewColumnColor(color.value)}
                            className={`w-8 h-8 rounded-full bg-gradient-to-r ${color.value} border-2 ${
                              newColumnColor === color.value ? 'border-gray-800' : 'border-gray-300'
                            }`}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={handleAddColumn} size="sm" className="flex-1">
                        <Check className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                      <Button onClick={handleCancelAdd} variant="outline" size="sm" className="flex-1">
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingColumn(true)}
                className="min-w-60 h-32 bg-white/30 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center group"
              >
                <div className="text-center">
                  <Plus className="h-8 w-8 text-gray-400 group-hover:text-gray-600 mx-auto mb-2" />
                  <span className="text-gray-500 group-hover:text-gray-700 font-medium">Add Column</span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Email Card Modal */}
      <EmailCardModal
        card={selectedCard}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default EmailKanbanLayout;
