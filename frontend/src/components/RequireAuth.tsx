// src/components/RequireAuth.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

export const RequireAuth = ({ children }: { children: React.ReactElement }) => {
  const { isSignedIn } = useUser();
  

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

