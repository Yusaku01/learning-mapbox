import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMapbox } from './useMapbox';

// Mock Mapbox GL
const mockMapInstance = {
  on: vi.fn(),
  off: vi.fn(),
  remove: vi.fn(),
  getStyle: vi.fn(),
  setStyle: vi.fn(),
  resize: vi.fn(),
  getCenter: vi.fn(() => ({ lng: 139.7671, lat: 35.6812 })),
  getZoom: vi.fn(() => 10),
};

const mockMapboxgl = {
  Map: vi.fn().mockImplementation(() => mockMapInstance),
  supported: vi.fn(() => true),
};

vi.stubGlobal('mapboxgl', mockMapboxgl);

describe('useMapboxフック', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // デフォルトの環境変数を設定
    vi.stubEnv('VITE_MAPBOX_ACCESS_TOKEN', 'pk.test_token_12345');
    vi.stubEnv('VITE_MAPBOX_STYLE_URL', 'mapbox://styles/saku-0109/cmdb2t1uq03d301r447l5hnif');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test('有効なアクセストークンでMapboxインスタンスが作成される', () => {
    // Arrange & Act
    const { result } = renderHook(() => useMapbox());
    
    // Assert: Mapboxインスタンスが正しく作成されることを確認
    expect(result.current.isInitialized).toBe(false); // 初期状態
    expect(result.current.error).toBeNull();
    
    // コンテナが設定された後の状態をテスト
    act(() => {
      const mockContainer = document.createElement('div');
      result.current.initializeMap(mockContainer, {
        center: [139.7671, 35.6812],
        zoom: 10,
        style: 'mapbox://styles/saku-0109/cmdb2t1uq03d301r447l5hnif'
      });
    });
    
    expect(mockMapboxgl.Map).toHaveBeenCalledWith({
      accessToken: 'pk.test_token_12345',
      container: expect.any(HTMLDivElement),
      style: 'mapbox://styles/saku-0109/cmdb2t1uq03d301r447l5hnif',
      center: [139.7671, 35.6812], // 東京の座標
      zoom: 10,
    });
    
    expect(result.current.isInitialized).toBe(true);
  });

  test('無効なアクセストークンでエラーが発生する', () => {
    // Arrange: 無効なトークンを設定
    vi.stubEnv('VITE_MAPBOX_ACCESS_TOKEN', '');
    
    // Act
    const { result } = renderHook(() => useMapbox());
    
    // Assert: エラーが設定されることを確認
    expect(result.current.error).toBeTruthy();
    expect(result.current.isInitialized).toBe(false);
  });

  test('ブラウザでMapbox GL JSがサポートされていない場合エラーが発生する', () => {
    // Arrange: サポートされていない環境をモック
    mockMapboxgl.supported.mockReturnValue(false);
    
    // Act
    const { result } = renderHook(() => useMapbox());
    
    // Assert
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toContain('WebGL');
  });

  test('マップコンテナが正しく初期化される', () => {
    // Arrange
    const { result } = renderHook(() => useMapbox());
    const mockContainer = document.createElement('div');
    mockContainer.id = 'test-map-container';
    
    // Act
    act(() => {
      result.current.initializeMap(mockContainer, {
        center: [139.7671, 35.6812],
        zoom: 10,
        style: 'mapbox://styles/saku-0109/cmdb2t1uq03d301r447l5hnif'
      });
    });
    
    // Assert
    expect(mockMapboxgl.Map).toHaveBeenCalledWith(
      expect.objectContaining({
        container: mockContainer,
      })
    );
    expect(result.current.mapInstance).toBe(mockMapInstance);
  });

  test('コンポーネントアンマウント時にマップが適切にクリーンアップされる', () => {
    // Arrange
    const { result, unmount } = renderHook(() => useMapbox());
    
    act(() => {
      const mockContainer = document.createElement('div');
      result.current.initializeMap(mockContainer, {
        center: [139.7671, 35.6812],
        zoom: 10,
        style: 'mapbox://styles/saku-0109/cmdb2t1uq03d301r447l5hnif'
      });
    });
    
    // Act: アンマウント
    unmount();
    
    // Assert: remove メソッドが呼ばれることを確認
    expect(mockMapInstance.remove).toHaveBeenCalled();
  });
});