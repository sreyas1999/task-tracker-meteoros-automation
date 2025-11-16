export interface DeviceInfo {
  browser: string;
  os: string;
  deviceType: string;
}

export interface Location {
  lat: number;
  lon: number;
  accuracy: number;
  timestamp: number;
}

export interface UserSession {
  email: string;
  loginTime: string;
  deviceInfo: DeviceInfo;
  location: Location | null;
}
