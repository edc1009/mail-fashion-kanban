
declare global {
  interface Window {
    gapi: {
      load: (api: string, callback: () => void) => void;
      auth2: {
        init: (config: { client_id: string }) => Promise<any>;
        getAuthInstance: () => {
          signIn: (options: { scope: string }) => Promise<any>;
          signOut: () => Promise<void>;
        };
      };
    };
  }
}

export {};
