import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MapContainer } from '../../components/MapContainer';

// 実際のMapbox機能の統合テスト
// モックを最小限にして、実際の連携をテスト

// Mock Mapbox GL JS
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

describe('Mapbox統合テスト', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // カスタムスタイルの環境変数を設定
    vi.stubEnv('VITE_MAPBOX_ACCESS_TOKEN', 'pk.test_token_12345');
    vi.stubEnv('VITE_MAPBOX_STYLE_URL', 'mapbox://styles/saku-0109/cmdb2t1uq03d301r447l5hnif');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('完全なMapboxワークフロー', () => {
    it('環境変数からカスタムスタイルまでの完全なフローが動作する', async () => {
      // Act: MapContainerをレンダリング
      render(<MapContainer />);

      // Wait: マップの初期化完了を待機
      await waitFor(() => {
        expect(mockMapboxgl.Map).toHaveBeenCalledWith(
          expect.objectContaining({
            accessToken: 'pk.test_token_12345',
            container: expect.any(HTMLElement),
            center: [139.7671, 35.6812],
            zoom: 10,
          })
        );
      }, { timeout: 2000 });

      // Assert: マップコンテナが表示される
      expect(screen.getByTestId('mapbox-container')).toBeInTheDocument();
      
      // Assert: 正しいアクセストークンでMapが初期化されている
      expect(mockMapboxgl.Map).toHaveBeenCalledTimes(1);
    });

    it('プロパティとして渡されたカスタムスタイルが正しく適用される', async () => {
      const customStyle = 'mapbox://styles/custom-user/custom-style';

      // Act: カスタムスタイルを指定してレンダリング
      render(<MapContainer styleUrl={customStyle} />);

      // Assert: 指定されたスタイルでマップが初期化される
      await waitFor(() => {
        expect(mockMapboxgl.Map).toHaveBeenCalledWith(
          expect.objectContaining({
            style: customStyle,
          })
        );
      });
    });

    it('無効なスタイルの場合にフォールバックスタイルが使用される', async () => {
      // Arrange: 無効なスタイルURLを環境変数に設定
      vi.stubEnv('VITE_MAPBOX_STYLE_URL', 'invalid-style-url');

      // Act: MapContainerをレンダリング
      render(<MapContainer />);

      // Assert: フォールバックスタイルが使用される
      await waitFor(() => {
        expect(mockMapboxgl.Map).toHaveBeenCalledWith(
          expect.objectContaining({
            style: 'mapbox://styles/mapbox/streets-v12', // 最終フォールバック
          })
        );
      });
    });
  });

  describe('エラーハンドリング統合', () => {
    it('アクセストークンエラーが適切にハンドリングされる', () => {
      // Arrange: 無効なアクセストークンを設定
      vi.stubEnv('VITE_MAPBOX_ACCESS_TOKEN', '');

      // Act: MapContainerをレンダリング
      render(<MapContainer />);

      // Assert: エラーメッセージが表示される
      expect(screen.getByText('マップの読み込みに失敗しました')).toBeInTheDocument();
      expect(screen.getByText(/Mapbox access token is required/)).toBeInTheDocument();

      // Assert: マップコンテナが非表示
      expect(screen.queryByTestId('mapbox-container')).not.toBeInTheDocument();
    });

    it.skip('WebGLサポートエラーが適切にハンドリングされる（実装予定）', async () => {
      // TODO: WebGLエラーハンドリングの統合テスト
      // 現在のモック環境では正確にテストできないため、実際のMapbox統合時に実装
    });
  });

  describe('カスタムプロパティ統合', () => {
    it('すべてのカスタムプロパティが統合されて動作する', async () => {
      const props = {
        width: '800px',
        height: '600px',
        center: [140.0, 36.0] as [number, number],
        zoom: 15,
        styleUrl: 'mapbox://styles/saku-0109/cmdb2t1uq03d301r447l5hnif',
        className: 'custom-map-class',
      };

      // Act: 全プロパティを指定してレンダリング
      render(<MapContainer {...props} />);

      // Assert: コンテナのスタイルが正しく適用される
      const container = screen.getByTestId('mapbox-container');
      expect(container).toHaveStyle({
        width: '800px',
        height: '600px',
      });
      expect(container).toHaveClass('mapbox-container custom-map-class');

      // Assert: マップ初期化時に正しいオプションが渡される
      await waitFor(() => {
        expect(mockMapboxgl.Map).toHaveBeenCalledWith({
          accessToken: 'pk.test_token_12345',
          container: container,
          style: props.styleUrl,
          center: props.center,
          zoom: props.zoom,
        });
      });
    });
  });

  describe('レスポンシブ対応統合', () => {
    it('異なる画面サイズでマップが正しく表示される', async () => {
      const testCases = [
        { width: '100%', height: '400px', label: 'デスクトップ' },
        { width: '100vw', height: '50vh', label: 'タブレット' },
        { width: '320px', height: '240px', label: 'モバイル' },
      ];

      for (const testCase of testCases) {
        // Act: 各サイズでレンダリング
        const { unmount } = render(
          <MapContainer width={testCase.width} height={testCase.height} />
        );

        // Assert: 正しいサイズが適用される
        const container = screen.getByTestId('mapbox-container');
        expect(container).toHaveStyle({
          width: testCase.width,
          height: testCase.height,
        });

        // Assert: マップが初期化される
        await waitFor(() => {
          expect(mockMapboxgl.Map).toHaveBeenCalled();
        });

        // Cleanup: 次のテストケースのために清理
        unmount();
        vi.clearAllMocks();
      }
    });
  });
});