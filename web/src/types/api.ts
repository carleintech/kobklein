// API-specific types for KobKlein

export interface ApiEndpoints {
  auth: {
    login: "/api/auth/login";
    register: "/api/auth/register";
    logout: "/api/auth/logout";
    refresh: "/api/auth/refresh";
    forgot: "/api/auth/forgot-password";
    reset: "/api/auth/reset-password";
  };
  users: {
    profile: "/api/users/profile";
    update: "/api/users/update";
    delete: "/api/users/delete";
  };
  wallet: {
    balance: "/api/wallet/balance";
    transactions: "/api/wallet/transactions";
    send: "/api/wallet/send";
    refill: "/api/wallet/refill";
    withdraw: "/api/wallet/withdraw";
  };
  cards: {
    list: "/api/cards";
    activate: "/api/cards/activate";
    deactivate: "/api/cards/deactivate";
    replace: "/api/cards/replace";
  };
  merchants: {
    list: "/api/merchants";
    approve: "/api/merchants/approve";
    transactions: "/api/merchants/transactions";
    payout: "/api/merchants/payout";
  };
  distributors: {
    list: "/api/distributors";
    inventory: "/api/distributors/inventory";
    commission: "/api/distributors/commission";
    onboard: "/api/distributors/onboard";
  };
  admin: {
    stats: "/api/admin/stats";
    users: "/api/admin/users";
    transactions: "/api/admin/transactions";
    reports: "/api/admin/reports";
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  headers: Record<string, string>;
}
