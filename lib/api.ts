/**
 * Centralized API Routes Configuration
 * All backend API endpoints are defined here for easy management
 */

// ============= AUTH ENDPOINTS =============
export const AUTH_ROUTES = {
  LOGIN: "/api/auth/login",
  SIGNUP: "/api/auth/signup",
  REFRESH_TOKEN: "/api/auth/refresh-token",
  LOGOUT: "/api/auth/logout",
} as const;

// ============= USER ENDPOINTS =============
export const USER_ROUTES = {
  GET_CURRENT_USER: "/api/v1/users/me",
  GET_USER_BY_ID: (id: string) => `/api/v1/users/${id}`,
  UPDATE_USER: (id: string) => `/api/v1/users/${id}`,
  DELETE_USER: (id: string) => `/api/v1/users/${id}`,
  GET_ALL_USERS: "/api/v1/users",
} as const;

// ============= ALERTS ENDPOINTS =============
export const ALERT_ROUTES = {
  GET_ALERTS: "/api/v1/alerts",
  GET_ALERT_BY_ID: (id: string) => `/api/v1/alerts/${id}`,
  CREATE_ALERT: "/api/v1/alerts",
  UPDATE_ALERT: (id: string) => `/api/v1/alerts/${id}`,
  DELETE_ALERT: (id: string) => `/api/v1/alerts/${id}`,
} as const;

// ============= NETWORK ENDPOINTS =============
export const NETWORK_ROUTES = {
  GET_NETWORK_DATA: "/api/v1/network",
  GET_NETWORK_SESSIONS: "/api/v1/network/sessions",
  GET_NETWORK_TRAFFIC: "/api/v1/network/traffic",
} as const;

// ============= RESOURCES ENDPOINTS =============
export const RESOURCE_ROUTES = {
  GET_RESOURCES: "/api/v1/resources",
  GET_RESOURCE_BY_ID: (id: string) => `/api/v1/resources/${id}`,
  CREATE_RESOURCE: "/api/v1/resources",
  UPDATE_RESOURCE: (id: string) => `/api/v1/resources/${id}`,
  DELETE_RESOURCE: (id: string) => `/api/v1/resources/${id}`,
} as const;

// ============= METRICS ENDPOINTS =============
export const METRICS_ROUTES = {
  GET_METRICS: "/api/v1/metrics",
  GET_METRICS_BY_RESOURCE: (resourceId: string) => `/api/v1/metrics/resource/${resourceId}`,
} as const;

// ============= LOGS ENDPOINTS =============
export const LOG_ROUTES = {
  GET_LOGS: "/api/v1/logs",
  GET_LOG_BY_ID: (id: string) => `/api/v1/logs/${id}`,
  CREATE_LOG: "/api/v1/logs",
} as const;

// ============= SETTINGS ENDPOINTS =============
export const SETTINGS_ROUTES = {
  GET_SETTINGS: "/api/v1/settings",
  UPDATE_SETTINGS: "/api/v1/settings",
} as const;

// ============= POLICIES ENDPOINTS =============
export const POLICY_ROUTES = {
  GET_POLICIES: "/api/v1/policies",
  GET_POLICY_BY_ID: (id: string) => `/api/v1/policies/${id}`,
  CREATE_POLICY: "/api/v1/policies",
  UPDATE_POLICY: (id: string) => `/api/v1/policies/${id}`,
  DELETE_POLICY: (id: string) => `/api/v1/policies/${id}`,
} as const;

// ============= WEBSOCKET ENDPOINTS =============
export const WS_ROUTES = {
  ALERTS: "/ws/alerts",
  NETWORK: "/ws/network",
  METRICS: "/ws/metrics",
  LOGS: "/ws/logs",
} as const;
