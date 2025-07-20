import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { getMapboxConfig } from './mapbox-env';

describe('Mapbox環境変数管理', () => {
  beforeEach(() => {
    // 各テスト前に環境変数をクリア
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    // 各テスト後に環境変数をクリア
    vi.unstubAllEnvs();
  });

  test('環境変数からMapboxアクセストークンが取得できる', () => {
    // Arrange: テスト用の環境変数を設定
    vi.stubEnv('VITE_MAPBOX_ACCESS_TOKEN', 'pk.test_token_12345');
    
    // Act: 環境変数取得関数を実行
    const config = getMapboxConfig();
    
    // Assert: 期待される値が取得できることを確認
    expect(config.accessToken).toBe('pk.test_token_12345');
  });

  test('環境変数からカスタムスタイルURLが取得できる', () => {
    // Arrange
    vi.stubEnv('VITE_MAPBOX_ACCESS_TOKEN', 'pk.test_token_12345');
    vi.stubEnv('VITE_MAPBOX_STYLE_URL', 'mapbox://styles/saku-0109/cmdb2t1uq03d301r447l5hnif');
    
    // Act
    const config = getMapboxConfig();
    
    // Assert
    expect(config.styleUrl).toBe('mapbox://styles/saku-0109/cmdb2t1uq03d301r447l5hnif');
  });

  test('無効な環境変数の場合にエラーが発生する', () => {
    // Arrange: 無効なトークンを設定
    vi.stubEnv('VITE_MAPBOX_ACCESS_TOKEN', '');
    
    // Act & Assert: エラーが発生することを確認
    expect(() => getMapboxConfig()).toThrow('Mapbox access token is required');
  });

  test('環境変数が未設定の場合にエラーが発生する', () => {
    // Arrange: 環境変数を明示的にundefinedに設定
    vi.stubEnv('VITE_MAPBOX_ACCESS_TOKEN', undefined as any);
    
    // Act & Assert
    expect(() => getMapboxConfig()).toThrow('Mapbox access token is required');
  });
});