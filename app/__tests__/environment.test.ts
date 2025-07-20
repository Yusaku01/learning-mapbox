import { describe, test, expect } from 'vitest';

describe('テスト環境の確認', () => {
  test('Vitestが正常に動作する', () => {
    expect(true).toBe(true);
  });

  test('環境変数のモックが設定されている', () => {
    expect(import.meta.env.VITE_MAPBOX_ACCESS_TOKEN).toBe('test-mapbox-token');
    expect(import.meta.env.VITE_MAPBOX_STYLE_URL).toBe('mapbox://styles/saku-0109/cmdb2t1uq03d301r447l5hnif');
  });

  test('DOM環境が利用可能', () => {
    const div = document.createElement('div');
    expect(div).toBeInstanceOf(HTMLDivElement);
  });

  test('Mapbox GLのモックが設定されている', () => {
    expect((globalThis as any).mapboxgl).toBeDefined();
    expect((globalThis as any).mapboxgl.supported()).toBe(true);
  });
});