// Define Liveblocks types for your application
// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data
declare global {
  interface Liveblocks {
    UserMeta: {
      id: string;
      info: {
        name: string;
        email: string;
        photoURL?: string;
        role: string;
      };
    };
  }
}

export { };
