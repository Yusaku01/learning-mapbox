// Mapbox GL JS型定義（基本的なもののみ）
export type ControlPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface MapboxMap {
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string, callback: (...args: any[]) => void) => void;
  remove: () => void;
  getStyle: () => any;
  setStyle: (style: string) => void;
  resize: () => void;
  getCenter: () => { lng: number; lat: number };
  getZoom: () => number;
  addControl: (control: any, position?: ControlPosition) => any;
  removeControl: (control: any) => void;
}

export interface MapboxGL {
  Map: new (options: MapboxMapOptions) => MapboxMap;
  supported: () => boolean;
}

export interface MapboxMapOptions {
  accessToken: string;
  container: HTMLElement;
  style: string;
  center: [number, number];
  zoom: number;
}

export interface MapInitializationOptions {
  center: [number, number];
  zoom: number;
  style: string;
}

export interface Coordinates {
  longitude: number;
  latitude: number;
}

// デフォルト座標（東京）
export const DEFAULT_COORDINATES: Coordinates = {
  longitude: 139.7671,
  latitude: 35.6812,
};

export const DEFAULT_ZOOM = 10;

export interface MapContainerProps {
  width?: string;
  height?: string;
  center?: [number, number];
  zoom?: number;
  styleUrl?: string;
  className?: string;
  showNavigationControl?: boolean;
  showSearchBox?: boolean;
  searchBoxProps?: {
    placeholder?: string;
    language?: string;
    country?: string;
    marker?: boolean;
    className?: string;
  };
}

export interface UseMapboxReturn {
  mapInstance: MapboxMap | null;
  isInitialized: boolean;
  error: Error | null;
  initializeMap: (container: HTMLElement, options: MapInitializationOptions) => void;
  cleanup: () => void;
}