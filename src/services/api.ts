const API_URL = 'http://localhost:3001/api';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'factor' | 'supplier' | 'debtor' | 'admin';
}

export interface Request {
  id: number;
  requestNumber: string;
  supplierId: number;
  supplierName: string;
  debtorName: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  createdAt: string;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async getRequests(): Promise<Request[]> {
    return this.request('/requests');
  }

  async createRequest(data: Partial<Request>): Promise<Request> {
    return this.request('/requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiService();