import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';

export const ProtectedRoute: React.FC = () => {
  const userSession = useAppSelector((state) => state.session.userSession);

  if (!userSession) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
