// API Configuration
export const API_BASE_URL = 'http://ypu.localhost:8000';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/jwt/create/',
  REFRESH_TOKEN: '/auth/jwt/refresh/',
  USER_INFO: '/auth/users/me/',
  USERS: '/auth/users/',
  
  // Schedules
  SCHEDULES: '/api/schedules/',
  
  // Meetings
  MEETINGS: '/api/meetings/',
  
  // Study Plans
  STUDY_PLANS: '/api/study-plans/',
  
  // Recent Activities
  RECENT_ACTIVITIES: '/api/recent-activities/',
  
  // Dean Services
  DEAN_MEETINGS: '/api/dean/meetings/',
  DEAN_ACADEMIC_DECISIONS: '/api/dean/academic-decisions/',
  DEAN_STUDENTS_ATTENTION: '/api/dean/academic-decisions/students/',
  DEAN_ISSUE_DECISION: '/api/dean/academic-decisions/issue/',
  DEAN_PLAN_APPROVAL: '/api/dean/plan-approval/',
  DEAN_APPROVE_PLAN: (id: number) => `/api/dean/plan-approval/${id}/approve/`,
  DEAN_RETURN_PLAN: (id: number) => `/api/dean/plan-approval/${id}/return/`,
  DEAN_DASHBOARD_STATS: '/api/dean/dashboard/stats/',
  DEAN_DASHBOARD_ACTIVITY: '/api/dean/dashboard/recent-activity/',
};

// API Service Class
class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('access_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: this.getHeaders(),
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, try to refresh
          await this.refreshToken();
          // Retry the request with new token
          config.headers = this.getHeaders();
          const retryResponse = await fetch(url, config);
          if (!retryResponse.ok) {
            throw new Error(`HTTP error! status: ${retryResponse.status}`);
          }
          return await retryResponse.json();
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`API Response for ${endpoint}:`, data); // Debug log
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(username: string, password: string) {
    const response = await this.request<{ access: string; refresh: string }>(
      API_ENDPOINTS.LOGIN,
      {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }
    );
    
    this.token = response.access;
    localStorage.setItem('access_token', response.access);
    localStorage.setItem('refresh_token', response.refresh);
    
    return response;
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.request<{ access: string }>(
      API_ENDPOINTS.REFRESH_TOKEN,
      {
        method: 'POST',
        body: JSON.stringify({ refresh: refreshToken }),
      }
    );

    this.token = response.access;
    localStorage.setItem('access_token', response.access);
    
    return response;
  }

  async getUserInfo() {
    return await this.request<{
      id: number;
      username: string;
      email: string;
      role: 'admin' | 'dean' | 'coordinator' | 'teacher' | 'student';
      first_name?: string;
      last_name?: string;
    }>(API_ENDPOINTS.USER_INFO);
  }

  async getUsers() {
    const response = await this.request(API_ENDPOINTS.USERS);
    if (Array.isArray(response)) return response;
    if (response && Array.isArray(response.results)) return response.results;
    return [];
  }

  logout() {
    this.token = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // Schedules
  async getSchedules() {
    return await this.request(API_ENDPOINTS.SCHEDULES);
  }

  async createSchedule(data: any) {
    return await this.request(API_ENDPOINTS.SCHEDULES, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSchedule(id: number, data: any) {
    return await this.request(`${API_ENDPOINTS.SCHEDULES}${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSchedule(id: number) {
    return await this.request(`${API_ENDPOINTS.SCHEDULES}${id}/`, {
      method: 'DELETE',
    });
  }

  // Meetings
  async getMeetings() {
    return await this.request(API_ENDPOINTS.MEETINGS);
  }

  async createMeeting(data: any) {
    return await this.request(API_ENDPOINTS.MEETINGS, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMeeting(id: number, data: any) {
    return await this.request(`${API_ENDPOINTS.MEETINGS}${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteMeeting(id: number) {
    return await this.request(`${API_ENDPOINTS.MEETINGS}${id}/`, {
      method: 'DELETE',
    });
  }

  // Study Plans
  async getStudyPlans() {
    return await this.request(API_ENDPOINTS.STUDY_PLANS);
  }

  async createStudyPlan(data: any) {
    return await this.request(API_ENDPOINTS.STUDY_PLANS, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateStudyPlan(id: number, data: any) {
    return await this.request(`${API_ENDPOINTS.STUDY_PLANS}${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteStudyPlan(id: number) {
    return await this.request(`${API_ENDPOINTS.STUDY_PLANS}${id}/`, {
      method: 'DELETE',
    });
  }

  // Recent Activities
  async getRecentActivities() {
    return await this.request(API_ENDPOINTS.RECENT_ACTIVITIES);
  }

  // Dean Services
  async getDeanMeetings() {
    return await this.request(API_ENDPOINTS.DEAN_MEETINGS);
  }

  async getDeanAcademicDecisions() {
    return await this.request(API_ENDPOINTS.DEAN_ACADEMIC_DECISIONS);
  }

  async getDeanStudentsAttention() {
    return await this.request(API_ENDPOINTS.DEAN_STUDENTS_ATTENTION);
  }

  async issueDeanDecision(data: any) {
    return await this.request(API_ENDPOINTS.DEAN_ISSUE_DECISION, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDeanPlanApproval() {
    return await this.request(API_ENDPOINTS.DEAN_PLAN_APPROVAL);
  }

  async approvePlan(id: number) {
    return await this.request(API_ENDPOINTS.DEAN_APPROVE_PLAN(id), {
      method: 'POST',
    });
  }

  async returnPlan(id: number, data: any) {
    return await this.request(API_ENDPOINTS.DEAN_RETURN_PLAN(id), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDeanDashboardStats() {
    return await this.request(API_ENDPOINTS.DEAN_DASHBOARD_STATS);
  }

  async getDeanDashboardActivity() {
    return await this.request(API_ENDPOINTS.DEAN_DASHBOARD_ACTIVITY);
  }
}

// Export singleton instance
export const apiService = new ApiService(API_BASE_URL); 