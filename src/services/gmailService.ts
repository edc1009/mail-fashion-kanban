
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

// You'll need to replace this with your actual Google OAuth Client ID
const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your actual client ID

export interface GmailEmail {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  payload: {
    headers: Array<{
      name: string;
      value: string;
    }>;
  };
  internalDate: string;
}

export interface EmailData {
  id: string;
  subject: string;
  from: string;
  preview: string;
  timestamp: string;
  isRead: boolean;
  labels: string[];
}

class GmailService {
  private auth: any = null;
  private gmail: any = null;

  async initializeAuth(): Promise<boolean> {
    try {
      // Load Google API client
      await this.loadGoogleAPI();
      
      // Initialize auth
      this.auth = google.auth.getAuthHeadersClient({
        keyFile: '', // We'll use OAuth2 instead
        scopes: SCOPES,
      });

      // Initialize OAuth2 client
      const oauth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        '', // No client secret needed for frontend
        window.location.origin
      );

      // Sign in user
      const authResult = await this.signInUser();
      if (authResult) {
        oauth2Client.setCredentials(authResult);
        this.auth = oauth2Client;
        this.gmail = google.gmail({ version: 'v1', auth: oauth2Client });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Gmail auth initialization failed:', error);
      return false;
    }
  }

  private async loadGoogleAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('auth2', () => {
          resolve();
        });
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  private async signInUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      window.gapi.load('auth2', () => {
        window.gapi.auth2.init({
          client_id: CLIENT_ID,
        }).then(() => {
          const authInstance = window.gapi.auth2.getAuthInstance();
          authInstance.signIn({
            scope: SCOPES.join(' ')
          }).then((user: any) => {
            const authResponse = user.getAuthResponse();
            resolve({
              access_token: authResponse.access_token,
              refresh_token: authResponse.refresh_token,
              expiry_date: authResponse.expires_at,
            });
          }).catch(reject);
        });
      });
    });
  }

  async getEmails(maxResults: number = 50): Promise<EmailData[]> {
    if (!this.gmail) {
      throw new Error('Gmail not initialized. Call initializeAuth() first.');
    }

    try {
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        maxResults,
        q: 'in:inbox', // Only get inbox emails
      });

      const messages = response.data.messages || [];
      const emailPromises = messages.map((message: any) => 
        this.getEmailDetails(message.id)
      );

      const emails = await Promise.all(emailPromises);
      return emails.filter(email => email !== null) as EmailData[];
    } catch (error) {
      console.error('Error fetching emails:', error);
      throw error;
    }
  }

  private async getEmailDetails(messageId: string): Promise<EmailData | null> {
    try {
      const response = await this.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full',
      });

      const message = response.data;
      const headers = message.payload.headers;
      
      const subject = this.getHeader(headers, 'Subject') || 'No Subject';
      const from = this.getHeader(headers, 'From') || 'Unknown Sender';
      const date = this.getHeader(headers, 'Date') || '';
      
      return {
        id: message.id,
        subject,
        from: this.extractEmailAddress(from),
        preview: message.snippet || '',
        timestamp: this.formatDate(date),
        isRead: !message.labelIds?.includes('UNREAD'),
        labels: message.labelIds || [],
      };
    } catch (error) {
      console.error(`Error fetching email ${messageId}:`, error);
      return null;
    }
  }

  private getHeader(headers: any[], name: string): string | null {
    const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
    return header ? header.value : null;
  }

  private extractEmailAddress(fromHeader: string): string {
    const match = fromHeader.match(/<(.+)>/);
    return match ? match[1] : fromHeader;
  }

  private formatDate(dateString: string): string {
    if (!dateString) return 'Unknown date';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffHours < 1) {
        return 'Just now';
      } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else if (diffDays < 7) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      return 'Unknown date';
    }
  }

  async signOut(): Promise<void> {
    if (window.gapi && window.gapi.auth2) {
      const authInstance = window.gapi.auth2.getAuthInstance();
      await authInstance.signOut();
    }
    this.auth = null;
    this.gmail = null;
  }
}

export const gmailService = new GmailService();
