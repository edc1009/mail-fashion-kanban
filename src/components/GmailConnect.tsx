
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { gmailService, EmailData } from '@/services/gmailService';
import { toast } from '@/hooks/use-toast';

interface GmailConnectProps {
  onEmailsLoaded: (emails: EmailData[]) => void;
}

const GmailConnect: React.FC<GmailConnectProps> = ({ onEmailsLoaded }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoadingEmails, setIsLoadingEmails] = useState(false);

  const handleConnectGmail = async () => {
    setIsConnecting(true);
    
    try {
      const success = await gmailService.initializeAuth();
      
      if (success) {
        setIsConnected(true);
        toast({
          title: "Gmail Connected!",
          description: "Successfully connected to your Gmail account.",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Failed to connect to Gmail. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Gmail connection error:', error);
      toast({
        title: "Connection Error",
        description: "An error occurred while connecting to Gmail.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLoadEmails = async () => {
    if (!isConnected) return;
    
    setIsLoadingEmails(true);
    
    try {
      const emails = await gmailService.getEmails(20); // Load 20 recent emails
      onEmailsLoaded(emails);
      
      toast({
        title: "Emails Loaded!",
        description: `Successfully loaded ${emails.length} emails from your Gmail.`,
      });
    } catch (error) {
      console.error('Error loading emails:', error);
      toast({
        title: "Loading Error",
        description: "Failed to load emails from Gmail.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingEmails(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await gmailService.signOut();
      setIsConnected(false);
      toast({
        title: "Disconnected",
        description: "Successfully disconnected from Gmail.",
      });
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Mail className="h-5 w-5 text-red-500" />
          Gmail Integration
        </CardTitle>
        <CardDescription>
          Connect your Gmail account to import emails into your kanban board
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <span>This will request read-only access to your Gmail</span>
            </div>
            <Button
              onClick={handleConnectGmail}
              disabled={isConnecting}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Connect Gmail
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle className="h-4 w-4" />
              <span>Gmail account connected successfully!</span>
            </div>
            <div className="space-y-2">
              <Button
                onClick={handleLoadEmails}
                disabled={isLoadingEmails}
                className="w-full"
              >
                {isLoadingEmails ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Loading Emails...
                  </>
                ) : (
                  'Load Recent Emails'
                )}
              </Button>
              <Button
                onClick={handleDisconnect}
                variant="outline"
                className="w-full"
              >
                Disconnect Gmail
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GmailConnect;
