export interface Device {
  ID: number;
  DeviceName: string;
  DeviceType: string;
  SerialNumber: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface DeviceFormData {
  deviceName: string;
  deviceType: string;
  serialNumber: string;
}
