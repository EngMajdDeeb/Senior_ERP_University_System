// Role-based access control utilities

export type UserRole = 'admin' | 'dean' | 'coordinator' | 'teacher' | 'student';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  first_name?: string;
  last_name?: string;
}

// Role hierarchy (higher roles have access to lower roles' features)
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  'admin': 5,
  'dean': 4,
  'coordinator': 3,
  'teacher': 2,
  'student': 1,
};

// Check if user has required role or higher
export const hasRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

// Check if user has exact role
export const hasExactRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return userRole === requiredRole;
};

// Get role display name
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    'admin': 'Administrator',
    'dean': 'Dean',
    'coordinator': 'Coordinator',
    'teacher': 'Teacher',
    'student': 'Student',
  };
  return roleNames[role] || role;
};

// Check if user can access coordinator features
export const canAccessCoordinatorFeatures = (userRole: UserRole): boolean => {
  return hasRole(userRole, 'coordinator');
};

// Check if user can access dean features
export const canAccessDeanFeatures = (userRole: UserRole): boolean => {
  return hasRole(userRole, 'dean');
};

// Check if user can access admin features
export const canAccessAdminFeatures = (userRole: UserRole): boolean => {
  return hasRole(userRole, 'admin');
};

// Get default route for user role
export const getDefaultRoute = (role: UserRole): string => {
  switch (role) {
    case 'dean':
      return '/dean';
    case 'coordinator':
      return '/';
    case 'teacher':
      return '/';
    case 'student':
      return '/';
    case 'admin':
      return '/admin';
    default:
      return '/';
  }
}; 