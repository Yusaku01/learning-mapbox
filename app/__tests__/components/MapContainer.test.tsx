import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MapContainer } from '../../components/MapContainer';

// Mock useMapbox hook
vi.mock('../../hooks/useMapbox', () => ({
  useMapbox: vi.fn(),
}));

// Mock mapbox-gl
vi.mock('mapbox-gl', () => ({
  Map: vi.fn(() => ({
    on: vi.fn(),
    remove: vi.fn(),
    setStyle: vi.fn(),
  })),
  default: {
    accessToken: '',
  },
}));

import { useMapbox } from '../../hooks/useMapbox';

describe('MapContainer', () => {
  const mockUseMapbox = vi.mocked(useMapbox);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('正常なレンダリング', () => {
    it('マップコンテナ要素が正しく表示される', () => {
      mockUseMapbox.mockReturnValue({
        mapInstance: null,
        isInitialized: false,
        error: null,
        initializeMap: vi.fn(),
        cleanup: vi.fn(),
      });

      render(<MapContainer />);
      
      const mapContainer = screen.getByTestId('mapbox-container');
      expect(mapContainer).toBeInTheDocument();
      expect(mapContainer).toHaveClass('mapbox-container');
    });

    it('デフォルトの幅と高さが設定される', () => {
      mockUseMapbox.mockReturnValue({
        mapInstance: null,
        isInitialized: false,
        error: null,
        initializeMap: vi.fn(),
        cleanup: vi.fn(),
      });

      render(<MapContainer />);
      
      const mapContainer = screen.getByTestId('mapbox-container');
      expect(mapContainer).toHaveStyle({
        width: '100%',
        height: '400px',
      });
    });

    it('カスタムの幅と高さが適用される', () => {
      mockUseMapbox.mockReturnValue({
        mapInstance: null,
        isInitialized: false,
        error: null,
        initializeMap: vi.fn(),
        cleanup: vi.fn(),
      });

      render(<MapContainer width="800px" height="600px" />);
      
      const mapContainer = screen.getByTestId('mapbox-container');
      expect(mapContainer).toHaveStyle({
        width: '800px',
        height: '600px',
      });
    });
  });

  describe('マップの初期化', () => {
    it('useMapboxフックが呼び出される', () => {
      mockUseMapbox.mockReturnValue({
        mapInstance: null,
        isInitialized: false,
        error: null,
        initializeMap: vi.fn(),
        cleanup: vi.fn(),
      });

      render(<MapContainer />);
      
      expect(mockUseMapbox).toHaveBeenCalled();
    });

    it('マップが初期化されるとinitializeMapが呼び出される', async () => {
      const mockInitializeMap = vi.fn();
      mockUseMapbox.mockReturnValue({
        mapInstance: null,
        isInitialized: false,
        error: null,
        initializeMap: mockInitializeMap,
        cleanup: vi.fn(),
      });

      render(<MapContainer />);
      
      await waitFor(() => {
        expect(mockInitializeMap).toHaveBeenCalled();
      });
    });

    it('カスタムスタイルURLがinitializeMapに渡される', async () => {
      const mockInitializeMap = vi.fn();
      const customStyleUrl = 'mapbox://styles/saku-0109/cmdb2t1uq03d301r447l5hnif';
      
      mockUseMapbox.mockReturnValue({
        mapInstance: null,
        isInitialized: false,
        error: null,
        initializeMap: mockInitializeMap,
        cleanup: vi.fn(),
      });

      render(<MapContainer styleUrl={customStyleUrl} />);
      
      await waitFor(() => {
        expect(mockInitializeMap).toHaveBeenCalledWith(
          expect.any(Element),
          expect.objectContaining({
            style: customStyleUrl,
          })
        );
      });
    });
  });

  describe('エラーハンドリング', () => {
    it('エラーが発生した場合にエラーメッセージが表示される', () => {
      const errorMessage = 'Mapbox access token is required';
      mockUseMapbox.mockReturnValue({
        mapInstance: null,
        isInitialized: false,
        error: new Error(errorMessage),
        initializeMap: vi.fn(),
        cleanup: vi.fn(),
      });

      render(<MapContainer />);
      
      expect(screen.getByText('マップの読み込みに失敗しました')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('エラー状態ではマップコンテナが非表示になる', () => {
      mockUseMapbox.mockReturnValue({
        mapInstance: null,
        isInitialized: false,
        error: new Error('Test error'),
        initializeMap: vi.fn(),
        cleanup: vi.fn(),
      });

      render(<MapContainer />);
      
      const mapContainer = screen.queryByTestId('mapbox-container');
      expect(mapContainer).not.toBeInTheDocument();
    });
  });

  describe('ローディング状態', () => {
    it('初期化中にローディングメッセージが表示される', () => {
      mockUseMapbox.mockReturnValue({
        mapInstance: null,
        isInitialized: false,
        error: null,
        initializeMap: vi.fn(),
        cleanup: vi.fn(),
      });

      render(<MapContainer />);
      
      expect(screen.getByText('マップを読み込み中...')).toBeInTheDocument();
    });

    it('初期化完了後にローディングメッセージが非表示になる', () => {
      const mockMapInstance = {
        on: vi.fn(),
        remove: vi.fn(),
        setStyle: vi.fn(),
      };

      mockUseMapbox.mockReturnValue({
        mapInstance: mockMapInstance as any,
        isInitialized: true,
        error: null,
        initializeMap: vi.fn(),
        cleanup: vi.fn(),
      });

      render(<MapContainer />);
      
      expect(screen.queryByText('マップを読み込み中...')).not.toBeInTheDocument();
    });
  });

  describe('プロパティ', () => {
    it('デフォルトプロパティが正しく設定される', async () => {
      const mockInitializeMap = vi.fn();
      mockUseMapbox.mockReturnValue({
        mapInstance: null,
        isInitialized: false,
        error: null,
        initializeMap: mockInitializeMap,
        cleanup: vi.fn(),
      });

      render(<MapContainer />);
      
      await waitFor(() => {
        expect(mockInitializeMap).toHaveBeenCalledWith(
          expect.any(Element),
          expect.objectContaining({
            center: [139.7671, 35.6812], // 東京駅
            zoom: 10,
            style: 'mapbox://styles/mapbox/streets-v12',
          })
        );
      });
    });

    it('カスタムプロパティが正しく適用される', async () => {
      const mockInitializeMap = vi.fn();
      const props = {
        center: [140.0, 36.0] as [number, number],
        zoom: 15,
        styleUrl: 'mapbox://styles/saku-0109/cmdb2t1uq03d301r447l5hnif',
      };

      mockUseMapbox.mockReturnValue({
        mapInstance: null,
        isInitialized: false,
        error: null,
        initializeMap: mockInitializeMap,
        cleanup: vi.fn(),
      });

      render(<MapContainer {...props} />);
      
      await waitFor(() => {
        expect(mockInitializeMap).toHaveBeenCalledWith(
          expect.any(Element),
          expect.objectContaining({
            center: props.center,
            zoom: props.zoom,
            style: props.styleUrl,
          })
        );
      });
    });
  });
});