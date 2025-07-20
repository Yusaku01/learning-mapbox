import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock environment variables for testing
vi.stubEnv('VITE_MAPBOX_ACCESS_TOKEN', 'test-mapbox-token');
vi.stubEnv('VITE_MAPBOX_STYLE_URL', 'mapbox://styles/saku-0109/cmdb2t1uq03d301r447l5hnif');

// Mock Mapbox GL JS for testing
const mockMapboxgl = {
  Map: vi.fn().mockImplementation(() => ({
    on: vi.fn(),
    off: vi.fn(),
    remove: vi.fn(),
    getStyle: vi.fn(),
    setStyle: vi.fn(),
    resize: vi.fn(),
  })),
  supported: vi.fn(() => true),
};

vi.stubGlobal('mapboxgl', mockMapboxgl);

// Setup DOM environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});