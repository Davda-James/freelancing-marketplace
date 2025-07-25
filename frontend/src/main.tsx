import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Only use Clerk if a valid publishable key is provided
const isClerkEnabled = PUBLISHABLE_KEY && PUBLISHABLE_KEY.startsWith('pk_');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isClerkEnabled ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    ) : (
      <App />
    )}
  </StrictMode>
);
