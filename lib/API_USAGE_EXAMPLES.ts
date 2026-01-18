/**
 * API Usage Examples
 * This file demonstrates how to use the refactored API setup
 */

import api from "@/lib/api-client";
import { API_ROUTES, AUTH_ROUTES, USER_ROUTES, ALERT_ROUTES, NETWORK_ROUTES } from "@/lib/apiRoutes";

// ============================================================
// AUTHENTICATION EXAMPLES
// ============================================================

/**
 * Example 1: Login
 * POST request with email and password
 */
async function exampleLogin() {
  const loginPayload = {
    email: "user@example.com",
    password: "password123",
  };

  const response = await api.post(AUTH_ROUTES.LOGIN, loginPayload);
  // Response: { accessToken: string, refreshToken: string }
  console.log("Login Response:", response.data);
}

/**
 * Example 2: Signup
 * POST request with user details
 */
async function exampleSignup() {
  const signupPayload = {
    email: "newuser@example.com",
    password: "securePassword123",
    username: "newuser",
  };

  const response = await api.post(AUTH_ROUTES.SIGNUP, signupPayload);
  // Response: { success: true } or error
  console.log("Signup Response:", response.data);
}

/**
 * Example 3: Refresh Token (Auto-handled by interceptor)
 * The api client automatically handles 401 responses
 * But you can manually call it if needed
 */
async function exampleRefreshToken() {
  const refreshPayload = {
    refreshToken: localStorage.getItem("refreshToken"),
  };

  const response = await api.post(AUTH_ROUTES.REFRESH_TOKEN, refreshPayload);
  // Response: { accessToken: string, refreshToken?: string }
  console.log("Refresh Response:", response.data);
}

// ============================================================
// USER EXAMPLES
// ============================================================

/**
 * Example 4: Get Current User
 * GET request - requires valid access token
 * Token is automatically included by request interceptor
 */
async function exampleGetCurrentUser() {
  const response = await api.get(USER_ROUTES.GET_CURRENT_USER);
  // Response: { id, email, username, role, user_metadata }
  console.log("Current User:", response.data);
}

/**
 * Example 5: Get User by ID
 * GET request with dynamic parameter
 */
async function exampleGetUserById() {
  const userId = "123";
  const response = await api.get(USER_ROUTES.GET_USER_BY_ID(userId));
  console.log("User:", response.data);
}

/**
 * Example 6: Update User
 * PUT request with user data
 */
async function exampleUpdateUser() {
  const userId = "123";
  const updatePayload = {
    username: "updated_username",
    // other fields...
  };

  const response = await api.put(USER_ROUTES.UPDATE_USER(userId), updatePayload);
  console.log("Updated User:", response.data);
}

// ============================================================
// ALERTS EXAMPLES
// ============================================================

/**
 * Example 7: Get All Alerts
 * GET request with pagination/filters (if supported by backend)
 */
async function exampleGetAlerts() {
  const response = await api.get(ALERT_ROUTES.GET_ALERTS);
  // Response: { alerts: [...], total: number }
  console.log("Alerts:", response.data);
}

/**
 * Example 8: Create Alert
 * POST request with alert details
 */
async function exampleCreateAlert() {
  const alertPayload = {
    title: "Security Alert",
    description: "Suspicious login detected",
    severity: "HIGH",
    type: "SECURITY",
  };

  const response = await api.post(ALERT_ROUTES.CREATE_ALERT, alertPayload);
  console.log("Created Alert:", response.data);
}

/**
 * Example 9: Update Alert
 * PUT request to update specific alert
 */
async function exampleUpdateAlert() {
  const alertId = "alert-123";
  const updatePayload = {
    status: "RESOLVED",
  };

  const response = await api.put(ALERT_ROUTES.UPDATE_ALERT(alertId), updatePayload);
  console.log("Updated Alert:", response.data);
}

/**
 * Example 10: Delete Alert
 * DELETE request
 */
async function exampleDeleteAlert() {
  const alertId = "alert-123";
  const response = await api.delete(ALERT_ROUTES.DELETE_ALERT(alertId));
  console.log("Alert deleted:", response.data);
}

// ============================================================
// NETWORK EXAMPLES
// ============================================================

/**
 * Example 11: Get Network Data (like the example you provided)
 * POST request with location and scanning data
 */
async function exampleNetworkInlog() {
  const inLogPayload = {
    latitude: 1234.00,
    longitude: 4321.00,
    fcss: 95.5, // fcsScore
    isFaceMatched: 1,
  };

  const response = await api.post(NETWORK_ROUTES.GET_NETWORK_DATA, inLogPayload);
  console.log("Network InLog Response:", response.data);
}

/**
 * Example 12: Get Network Sessions
 * GET request for active network sessions
 */
async function exampleGetNetworkSessions() {
  const response = await api.get(NETWORK_ROUTES.GET_NETWORK_SESSIONS);
  console.log("Network Sessions:", response.data);
}

/**
 * Example 13: Get Network Traffic
 * GET request with optional filters
 */
async function exampleGetNetworkTraffic() {
  const response = await api.get(NETWORK_ROUTES.GET_NETWORK_TRAFFIC);
  console.log("Network Traffic:", response.data);
}

// ============================================================
// ERROR HANDLING EXAMPLES
// ============================================================

/**
 * Example 14: Proper Error Handling
 */
async function exampleErrorHandling() {
  try {
    const response = await api.post(AUTH_ROUTES.LOGIN, {
      email: "user@example.com",
      password: "wrongpassword",
    });
  } catch (error: any) {
    // Error from API response
    if (error.response?.status === 401) {
      console.error("Unauthorized:", error.response.data.message);
    }
    // Network error
    else if (error.request) {
      console.error("No response from server:", error.request);
    }
    // Request error
    else {
      console.error("Error:", error.message);
    }
  }
}

// ============================================================
// USING COMBINED API_ROUTES
// ============================================================

/**
 * Example 15: Using the combined API_ROUTES object
 * This allows you to access all routes from a single import
 */
async function exampleCombinedRoutes() {
  // Instead of importing individual route objects:
  // import { AUTH_ROUTES, USER_ROUTES } from "@/lib/apiRoutes";

  // You can import the combined API_ROUTES:
  // import { API_ROUTES } from "@/lib/apiRoutes";

  // Then access routes like:
  // API_ROUTES.LOGIN
  // API_ROUTES.GET_CURRENT_USER
  // API_ROUTES.CREATE_ALERT

  const response = await api.post(API_ROUTES.LOGIN, {
    email: "user@example.com",
    password: "password",
  });

  console.log("Login via combined routes:", response.data);
}

// ============================================================
// COMPONENT USAGE EXAMPLE
// ============================================================

/**
 * Example 16: Using in React Component
 */
// components/MyComponent.tsx
/*
import { useEffect, useState } from "react";
import api from "@/lib/api-client";
import { ALERT_ROUTES } from "@/lib/apiRoutes";

export function MyComponent() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const response = await api.get(ALERT_ROUTES.GET_ALERTS);
        setAlerts(response.data.alerts);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch alerts");
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {alerts.map(alert => (
        <div key={alert.id}>{alert.title}</div>
      ))}
    </div>
  );
}
*/

// ============================================================
// INTERCEPTOR BEHAVIOR
// ============================================================

/**
 * How the Interceptors Work:
 *
 * REQUEST INTERCEPTOR:
 * 1. Every request automatically includes the access token
 * 2. Token is fetched from localStorage
 * 3. Attached to Authorization header: "Bearer <token>"
 *
 * RESPONSE INTERCEPTOR:
 * 1. If response is 200-299: return as-is
 * 2. If response is 401 (Unauthorized):
 *    a. Check if token refresh is already happening
 *    b. If yes: queue the request
 *    c. If no: attempt token refresh
 *       - Get refreshToken from localStorage
 *       - Send to /api/auth/refresh-token endpoint
 *       - Update tokens in localStorage
 *       - Retry original request
 * 3. If any other error: reject the promise
 *
 * AUTO-QUEUE BEHAVIOR:
 * - Multiple 401 responses are handled gracefully
 * - All requests wait for single token refresh
 * - Once refreshed, all queued requests are retried
 * - Prevents multiple refresh attempts
 */

// ============================================================
// ENVIRONMENT CONFIGURATION
// ============================================================

/**
 * Environment Setup:
 *
 * Development (.env.local):
 * NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
 *
 * Production (.env.production):
 * NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com
 *
 * The api client automatically uses this URL for all requests
 */

// ============================================================
// TYPE SAFETY
// ============================================================

/**
 * All routes are typed with `as const`
 * This provides TypeScript autocomplete and type safety
 *
 * Example:
 * api.get(USER_ROUTES.GET_CURRENT_USER) // ✅ Type-safe
 * api.get("/api/v1/users/me") // ❌ String literal (not safe)
 */

export {
  exampleLogin,
  exampleSignup,
  exampleRefreshToken,
  exampleGetCurrentUser,
  exampleGetUserById,
  exampleUpdateUser,
  exampleGetAlerts,
  exampleCreateAlert,
  exampleUpdateAlert,
  exampleDeleteAlert,
  exampleNetworkInlog,
  exampleGetNetworkSessions,
  exampleGetNetworkTraffic,
  exampleErrorHandling,
  exampleCombinedRoutes,
};
