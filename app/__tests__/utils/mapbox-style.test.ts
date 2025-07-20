import { describe, test, expect } from 'vitest';
import { validateMapboxStyle, isValidStyleUrl, getStyleInfo } from '../../utils/mapbox-style';

describe('Mapboxスタイル管理', () => {
  describe('スタイルURL検証', () => {
    test('有効なMapboxスタイルURLが正しく検証される', () => {
      const validUrls = [
        'mapbox://styles/mapbox/streets-v12',
        'mapbox://styles/saku-0109/cmdb2t1uq03d301r447l5hnif',
        'mapbox://styles/username/styleid123abc',
      ];

      validUrls.forEach(url => {
        expect(isValidStyleUrl(url)).toBe(true);
      });
    });

    test('無効なMapboxスタイルURLが正しく拒否される', () => {
      const invalidUrls = [
        '',
        'not-a-url',
        'https://example.com/style.json',
        'mapbox://invalid',
        'mapbox://styles/',
        'mapbox://styles/user',
        'mapbox://styles/user/',
        'styles/user/style',
      ];

      invalidUrls.forEach(url => {
        expect(isValidStyleUrl(url)).toBe(false);
      });
    });
  });

  describe('スタイル検証関数', () => {
    test('有効なスタイルURLに対して成功を返す', () => {
      const result = validateMapboxStyle('mapbox://styles/saku-0109/cmdb2t1uq03d301r447l5hnif');
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('無効なスタイルURLに対してエラーを返す', () => {
      const result = validateMapboxStyle('invalid-style-url');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBeTruthy();
      expect(result.error?.message).toContain('Invalid Mapbox style URL');
    });

    test('空のスタイルURLに対してエラーを返す', () => {
      const result = validateMapboxStyle('');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBeTruthy();
      expect(result.error?.message).toContain('Style URL is required');
    });
  });

  describe('スタイル情報解析', () => {
    test('Mapboxスタイルから情報を正しく抽出する', () => {
      const styleUrl = 'mapbox://styles/saku-0109/cmdb2t1uq03d301r447l5hnif';
      const result = getStyleInfo(styleUrl);
      
      expect(result).toEqual({
        username: 'saku-0109',
        styleId: 'cmdb2t1uq03d301r447l5hnif',
        isOfficial: false,
        provider: 'mapbox',
      });
    });

    test('公式Mapboxスタイルから情報を正しく抽出する', () => {
      const styleUrl = 'mapbox://styles/mapbox/streets-v12';
      const result = getStyleInfo(styleUrl);
      
      expect(result).toEqual({
        username: 'mapbox',
        styleId: 'streets-v12',
        isOfficial: true,
        provider: 'mapbox',
      });
    });

    test('無効なスタイルURLに対してnullを返す', () => {
      const result = getStyleInfo('invalid-url');
      
      expect(result).toBeNull();
    });
  });

  describe('カスタムスタイル適用', () => {
    test('ユーザー指定カスタムスタイルが正しく認識される', () => {
      const customStyleUrl = 'mapbox://styles/saku-0109/cmdb2t1uq03d301r447l5hnif';
      const validation = validateMapboxStyle(customStyleUrl);
      const styleInfo = getStyleInfo(customStyleUrl);
      
      // 検証が成功する
      expect(validation.isValid).toBe(true);
      
      // カスタムスタイルとして認識される
      expect(styleInfo?.isOfficial).toBe(false);
      expect(styleInfo?.username).toBe('saku-0109');
      expect(styleInfo?.styleId).toBe('cmdb2t1uq03d301r447l5hnif');
    });

    test('カスタムスタイルのフォールバック処理', () => {
      // カスタムスタイルが無効な場合のフォールバック
      const invalidStyle = 'mapbox://styles/invalid';
      const validation = validateMapboxStyle(invalidStyle);
      
      expect(validation.isValid).toBe(false);
      expect(validation.fallbackStyle).toBe('mapbox://styles/mapbox/streets-v12');
    });
  });
});