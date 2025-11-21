import React from 'react';
import { Navigate } from 'react-router-dom';
import type { Role } from '../../types';

interface Props {
  allowed: Role[];
  userRole?: Role;
  children: React.ReactElement;
}

/**
 * Simple role guard that redirects users without sufficient permissions.
 * In a real application the userRole would come from session context or
 * decoded JWT. Here it can be passed manually for testing.
 */
const RoleGuard: React.FC<Props> = ({ allowed, userRole, children }) => {
  if (!userRole || !allowed.includes(userRole)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default RoleGuard;