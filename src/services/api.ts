const API_URL = '/api';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'factor' | 'supplier' | 'debtor' | 'admin';
  createdAt: string;
}

export interface Request {
  id: number;
  requestNumber: string;
  supplierId: number;
  supplierName: string;
  debtorId: number;
  debtorName: string;
  debtorEdrpou: string;
  amount: number;
  financingAmount: number;
  factoringType: string;
  recourseType: string;
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  paymentDate: string;
  createdAt: string;
}

export interface Company {
  id: number;
  name: string;
  edrpou: string;
  kycStatus: 'approved' | 'pending' | 'rejected';
  createdAt: string;
}

export interface Limit {
  id: number;
  supplierId: number;
  supplierName: string;
  debtorId: number;
  debtorName: string;
  limitAmount: number;
  usedAmount: number;
  availableAmount: number;
  status: string;
  createdAt: string;
}

export interface AuditEntry {
  id: number;
  userId: number;
  userName: string;
  userRole: string;
  action: string;
  entityType: string;
  entityId: string;
  entityName: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

export interface Document {
  id: number;
  documentNumber: string;
  name: string;
  type: string;
  supplierId: number;
  supplierName: string;
  fileUrl?: string;
  status: 'verified' | 'pending' | 'rejected';
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

  async getRequestById(id: number): Promise<Request | null> {
    const requests = await this.getRequests();
    return requests.find(r => r.id === id) || null;
  }

  async createRequest(data: Omit<Request, 'id' | 'createdAt'>): Promise<Request> {
    return this.request('/requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async approveRequest(id: number, financingAmount: number): Promise<void> {
    return this.request(`/requests/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ financingAmount }),
    });
  }

  async getLimits(): Promise<Limit[]> {
    return this.request('/limits');
  }

  async createLimit(data: Omit<Limit, 'id' | 'createdAt' | 'status' | 'usedAmount' | 'availableAmount'>): Promise<Limit> {
    return this.request('/limits', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLimit(id: number, data: Partial<Limit>): Promise<void> {
    return this.request(`/limits/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteLimit(id: number): Promise<void> {
    return this.request(`/limits/${id}`, {
      method: 'DELETE',
    });
  }

  async getCompanies(): Promise<Company[]> {
    return this.request('/companies');
  }

  async getAudit(): Promise<AuditEntry[]> {
    return this.request('/audit');
  }

  async getDocuments(): Promise<Document[]> {
    return this.request('/documents');
  }

  async createDocument(data: Omit<Document, 'id' | 'createdAt'>): Promise<Document> {
    return this.request('/documents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyDocument(id: number): Promise<void> {
    return this.request(`/documents/${id}/verify`, {
      method: 'PATCH',
    });
  }

  async deleteDocument(id: number): Promise<void> {
    return this.request(`/documents/${id}`, {
      method: 'DELETE',
    });
  }

  async getUsers(): Promise<User[]> {
    return this.request('/users');
  }

  async deleteUser(id: number): Promise<void> {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiService();
