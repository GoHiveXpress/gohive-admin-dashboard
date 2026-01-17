// src/constants/routes.ts

export const ROUTES = {
  DASHBOARD: "/dashboard",
  ACTIVE_USERS: "/active-users", 
  
  CUSTOMERS: "/customer-management",
  // Dynamic route helper
  CUSTOMER_DETAILS: (id: string) => `/customer-management/${id}`,

  VENDORS: "/vendor-management",
  RIDERS: "/rider-management",
  ORDERS: "/order-management",
  SUPPORT: "/support",
  FINANCE: "/finance-management",
  ANALYTICS: "/analytics",
  USERS: "/users-management",
  
  SETTINGS: "/settings",
  HELP: "/help",
  LOGOUT: "/logout",
} as const;

export const getRoute = (path: string, params?: Record<string, string>) => {
  if (!params) return path;
  const queryString = new URLSearchParams(params).toString();
  return `${path}?${queryString}`;
};