/**
 * Mapboxスタイル管理ユーティリティ
 * カスタムスタイルの検証と適用を処理
 */

export interface StyleValidationResult {
  isValid: boolean;
  error: Error | null;
  fallbackStyle?: string;
}

export interface StyleInfo {
  username: string;
  styleId: string;
  isOfficial: boolean;
  provider: 'mapbox';
}

/**
 * MapboxスタイルURLの形式を検証
 * @param styleUrl 検証するスタイルURL
 * @returns 有効かどうか
 */
export function isValidStyleUrl(styleUrl: string): boolean {
  if (!styleUrl || typeof styleUrl !== 'string') {
    return false;
  }

  // mapbox://styles/username/styleid の形式をチェック
  const mapboxStylePattern = /^mapbox:\/\/styles\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/;
  return mapboxStylePattern.test(styleUrl);
}

/**
 * Mapboxスタイルを検証し、結果を返す
 * @param styleUrl 検証するスタイルURL
 * @returns 検証結果
 */
export function validateMapboxStyle(styleUrl: string): StyleValidationResult {
  // 空のURL
  if (!styleUrl || styleUrl.trim() === '') {
    return {
      isValid: false,
      error: new Error('Style URL is required'),
      fallbackStyle: 'mapbox://styles/mapbox/streets-v12',
    };
  }

  // URL形式の検証
  if (!isValidStyleUrl(styleUrl)) {
    return {
      isValid: false,
      error: new Error('Invalid Mapbox style URL format. Expected: mapbox://styles/username/styleid'),
      fallbackStyle: 'mapbox://styles/mapbox/streets-v12',
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * MapboxスタイルURLから情報を抽出
 * @param styleUrl 解析するスタイルURL
 * @returns スタイル情報またはnull
 */
export function getStyleInfo(styleUrl: string): StyleInfo | null {
  if (!isValidStyleUrl(styleUrl)) {
    return null;
  }

  try {
    // mapbox://styles/username/styleid からusernameとstyleidを抽出
    const match = styleUrl.match(/^mapbox:\/\/styles\/([^/]+)\/([^/]+)$/);
    
    if (!match) {
      return null;
    }

    const [, username, styleId] = match;
    
    return {
      username,
      styleId,
      isOfficial: username === 'mapbox',
      provider: 'mapbox',
    };
  } catch (error) {
    return null;
  }
}

/**
 * デフォルトスタイル設定
 */
export const FALLBACK_STYLE_URL = 'mapbox://styles/mapbox/streets-v12';

/**
 * 環境変数からカスタムスタイルURLを取得
 * @returns カスタムスタイルURL（設定されていない場合はnull）
 */
function getCustomStyleUrl(): string | null {
  const customStyle = import.meta.env.VITE_MAPBOX_STYLE_URL;
  return customStyle && customStyle.trim() !== '' ? customStyle : null;
}

/**
 * スタイルURLを安全に取得（フォールバック付き）
 * @param preferredStyle 優先するスタイルURL
 * @returns 有効なスタイルURL
 */
export function getSafeStyleUrl(preferredStyle?: string): string {
  // 1. 明示的に指定されたスタイルを優先
  if (preferredStyle) {
    const validation = validateMapboxStyle(preferredStyle);
    if (validation.isValid) {
      return preferredStyle;
    }
  }

  // 2. 環境変数からカスタムスタイルを試行
  const customStyleUrl = getCustomStyleUrl();
  if (customStyleUrl) {
    const customValidation = validateMapboxStyle(customStyleUrl);
    if (customValidation.isValid) {
      return customStyleUrl;
    }
  }

  // 3. 最終フォールバック
  return FALLBACK_STYLE_URL;
}