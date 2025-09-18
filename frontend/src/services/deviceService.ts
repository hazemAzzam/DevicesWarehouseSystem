import { Device, DeviceFormData } from "../types/device";

// API Client للاتصال بالـ Backend
class ApiClient {
  private baseUrl: string;

  constructor() {
    // تحديد الـ base URL بناءً على البيئة
    this.baseUrl = (window as any).electronAPI
      ? "http://localhost:3001" // في Electron
      : "http://localhost:3001"; // في المتصفح
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// إنشاء instance من API Client
const apiClient = new ApiClient();

export class DeviceService {
  // الحصول على جميع الأجهزة
  static async getAllDevices(): Promise<Device[]> {
    try {
      const response = await apiClient.get<{ data: Device[] }>("/api/devices");
      return response.data || [];
    } catch (error) {
      console.error("Error fetching devices:", error);
      throw error;
    }
  }

  // إضافة جهاز جديد
  static async addDevice(deviceData: DeviceFormData): Promise<any> {
    try {
      return await apiClient.post("/api/devices", deviceData);
    } catch (error) {
      console.error("Error adding device:", error);
      throw error;
    }
  }

  // تحديث جهاز
  static async updateDevice(
    id: number,
    deviceData: DeviceFormData
  ): Promise<any> {
    try {
      return await apiClient.put(`/api/devices/${id}`, deviceData);
    } catch (error) {
      console.error("Error updating device:", error);
      throw error;
    }
  }

  // حذف جهاز
  static async deleteDevice(id: number): Promise<any> {
    try {
      return await apiClient.delete(`/api/devices/${id}`);
    } catch (error) {
      console.error("Error deleting device:", error);
      throw error;
    }
  }
}
