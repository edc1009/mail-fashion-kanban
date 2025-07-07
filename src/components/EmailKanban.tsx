
import React, { useState } from 'react';
import { Mail, Plus, Search, Filter, Calendar, Edit2, Check, X } from 'lucide-react';
import KanbanColumn from './KanbanColumn';
import GmailConnect from './GmailConnect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EmailData } from '@/services/gmailService';

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

const EmailKanban = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingColor, setEditingColor] = useState('');
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [newColumnColor, setNewColumnColor] = useState('from-gray-500 to-gray-600');
  const [showGmailDialog, setShowGmailDialog] = useState(false);


  const [columns, setColumns] = useState([
    {
      id: 'inbox',
      title: 'Inbox',
      color: 'from-blue-500 to-cyan-500',
      cards: [
        {
          id: 'email-1',
          subject: '貨櫃船 MSC MAYA 延遲抵港通知',
          emails: [{
            id: 'email-1-1',
            from: 'operations@mscshipping.com',
            preview: '由於惡劣天氣影響，MSC MAYA 貨櫃船預計將延遲 6 小時抵達高雄港。請調整您的提貨安排。貨櫃編號: MSCU1234567',
            timestamp: '2 小時前',
            isRead: false
          }],
          priority: 'high' as const,
          labels: ['緊急', '延遲通知']
        },
        {
          id: 'email-2',
          subject: '提單確認 - 電子產品出口至德國',
          emails: [{
            id: 'email-2-1',
            from: 'documentation@evergreen-line.com',
            preview: '您的提單 EGLV202401001 已確認。貨物: 電子產品 500 箱，目的地: 漢堡港。預計航行時間 25 天。',
            timestamp: '4 小時前',
            isRead: false
          }],
          priority: 'medium' as const,
          labels: ['提單', '出口']
        },
        {
          id: 'email-3',
          subject: '海關檢查通知 - 進口紡織品',
          emails: [{
            id: 'email-3-1',
            from: 'customs@keelung-port.gov.tw',
            preview: '您的進口貨物 (申報編號: IMP240115001) 已被選中進行海關檢查。請於明日上午 10:00 前往基隆港 3 號碼頭配合檢查。',
            timestamp: '6 小時前',
            isRead: true
          }],
          priority: 'high' as const,
          labels: ['海關', '檢查']
        },
        {
          id: 'email-4',
          subject: '運費報價 - 台灣至美國西岸',
          emails: [{
            id: 'email-4-1',
            from: 'sales@yangming.com',
            preview: '感謝您的詢價。20呎貨櫃台灣至洛杉磯運費報價: USD 2,850/TEU，40呎貨櫃: USD 3,200/TEU。報價有效期至本月底。',
            timestamp: '8 小時前',
            isRead: false
          }],
          priority: 'medium' as const,
          labels: ['報價', '美國線']
        },
        {
          id: 'email-5',
          subject: '貨物保險理賠申請確認',
          emails: [{
            id: 'email-5-1',
            from: 'claims@marine-insurance.com',
            preview: '您的理賠申請 (案件編號: CL2024001) 已收到。貨物: 機械設備，損失金額: USD 15,000。預計 10 個工作天內完成審核。',
            timestamp: '1 天前',
            isRead: true
          }],
          priority: 'medium' as const,
          labels: ['保險', '理賠']
        },
        {
          id: 'email-6',
          subject: '新航線開通 - 台灣直達歐洲',
          emails: [{
            id: 'email-6-1',
            from: 'marketing@cosco-shipping.com',
            preview: '中遠海運新開通台灣直達鹿特丹航線，每週二班，航行時間縮短至 22 天。首航優惠運費 85 折，歡迎洽詢。',
            timestamp: '1 天前',
            isRead: false
          }],
          priority: 'low' as const,
          labels: ['新航線', '優惠']
        },
        {
          id: 'email-7',
          subject: '危險品申報文件補件通知',
          emails: [{
            id: 'email-7-1',
            from: 'dangerous-goods@port-authority.gov.tw',
            preview: '您申報的危險品貨物 (UN1993 易燃液體) 文件不完整，請補交 MSDS 安全資料表及包裝證明書。截止日期: 明日下午 5:00。',
            timestamp: '1 天前',
            isRead: false
          }],
          priority: 'high' as const,
          labels: ['危險品', '補件']
        },
        {
          id: 'email-8',
          subject: '空櫃調度安排 - 台中港',
          emails: [{
            id: 'email-8-1',
            from: 'equipment@hapag-lloyd.com',
            preview: '您預訂的 20 呎空櫃已安排至台中港 5 號碼頭。提櫃時間: 明日上午 9:00-12:00。請攜帶設備交接單及相關證件。',
            timestamp: '2 天前',
            isRead: true
          }],
          priority: 'medium' as const,
          labels: ['空櫃', '調度']
        },
        {
          id: 'email-9',
          subject: '月度運輸報告 - 2024年1月',
          emails: [{
            id: 'email-9-1',
            from: 'reports@logistics-partner.com',
            preview: '1月份運輸統計: 總貨櫃量 1,250 TEU，準時率 96.8%，主要目的地為東南亞 (45%) 及北美 (32%)。詳細報告請見附件。',
            timestamp: '3 天前',
            isRead: true
          }],
          priority: 'low' as const,
          labels: ['報告', '統計']
        },
        {
          id: 'email-10',
          subject: '港口擁堵預警 - 上海洋山港',
          emails: [{
            id: 'email-10-1',
            from: 'alerts@shipping-intelligence.com',
            preview: '受春節前貨量激增影響，上海洋山港出現嚴重擁堵。預計延遲 3-5 天。建議考慮替代港口或調整船期安排。',
            timestamp: '3 天前',
            isRead: false
          }],
          priority: 'high' as const,
          labels: ['港口擁堵', '預警']
        }
      ]
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      color: 'from-yellow-500 to-orange-500',
      cards: []
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
      cards: []
    }
  ]);

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

  const handleGmailEmailsLoaded = (gmailEmails: EmailData[]) => {
    // Convert Gmail emails to EmailCard format
    const emailCards: EmailCard[] = gmailEmails.map(email => ({
      id: email.id,
      subject: email.subject,
      emails: [{
        id: email.id,
        from: email.from,
        preview: email.preview,
        timestamp: email.timestamp,
        isRead: email.isRead
      }],
      priority: 'medium' as const,
      labels: email.labels.filter(label => !['INBOX', 'UNREAD', 'IMPORTANT'].includes(label))
    }));

    // Add all Gmail emails to the inbox column
    setColumns(prevColumns => 
      prevColumns.map(col => 
        col.id === 'inbox' 
          ? { ...col, cards: [...col.cards, ...emailCards] }
          : col
      )
    );

    setShowGmailDialog(false);
  };

  const handleDragStart = (e: React.DragEvent, cardId: string, sourceColumnId: string) => {
    e.dataTransfer.setData('cardId', cardId);
    e.dataTransfer.setData('sourceColumnId', sourceColumnId);
    e.dataTransfer.setData('dragType', 'card');
  };

  // Handle email drag from inbox
  const handleEmailDragStart = (e: React.DragEvent, email: DraggedEmail) => {
    console.log('Email drag started:', email);
    e.dataTransfer.setData('emailData', JSON.stringify(email));
    e.dataTransfer.setData('dragType', 'email');
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
    setColumns(columns.filter(col => col.id !== columnId));
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
    
    if (dragType === 'card') {
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
          }
        }
        
        return newColumns;
      });
    } else if (dragType === 'email') {
      // Handle email drop from inbox
      const emailDataString = e.dataTransfer.getData('emailData');
      if (emailDataString) {
        const email: DraggedEmail = JSON.parse(emailDataString);
        console.log('Email dropped into column:', targetColumnId, email);
        
        setColumns(prevColumns => {
          const newColumns = [...prevColumns];
          const targetColumn = newColumns.find(col => col.id === targetColumnId);
          
          if (targetColumn) {
            // Check if a card with the same subject already exists
            const existingCard = targetColumn.cards.find(card => 
              card.subject.toLowerCase().trim() === email.subject.toLowerCase().trim()
            );
            
            if (existingCard) {
              // Add email to existing card if not already present
              const emailExists = existingCard.emails.some(e => e.id === email.id);
              if (!emailExists) {
                existingCard.emails.push({
                  id: email.id,
                  from: email.from,
                  preview: email.preview,
                  timestamp: email.timestamp,
                  isRead: email.isRead
                });
                console.log('Added email to existing card:', existingCard.subject);
              }
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
            }
          }
          
          return newColumns;
        });
      }
    }
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Email Management Studio
          </h1>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search emails..."
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
            <Dialog open={showGmailDialog} onOpenChange={setShowGmailDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-red-50 border-red-200 text-red-600 hover:bg-red-100">
                  <Mail className="h-4 w-4" />
                  Import Gmail
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Connect Gmail Account</DialogTitle>
                </DialogHeader>
                <GmailConnect onEmailsLoaded={handleGmailEmailsLoaded} />
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              Today
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Plus className="h-4 w-4" />
              Compose
            </Button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map(column => (
          <div key={column.id} className="w-[320px] flex-shrink-0">
            <KanbanColumn
              column={column}
              onDragStart={handleDragStart}
              onDrop={(e) => handleDrop(e, column.id)}
              onEmailToCard={handleEmailToCard}
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
              onEmailDragStart={handleEmailDragStart}

            />
          </div>
        ))}
        
        {/* Add New Column */}
        <div className="w-[320px] flex-shrink-0">
          {isAddingColumn ? (
            <div className="w-full bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
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
              className="w-full h-32 bg-white/30 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center group"
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
  );
};

export default EmailKanban;
