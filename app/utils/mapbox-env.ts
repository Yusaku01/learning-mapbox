import { getSafeStyleUrl } from './mapbox-style';

export interface MapboxConfig {
  accessToken: string;
  styleUrl: string;
}

/**
 * Mapboxの環境変数設定を取得する
 * @returns Mapbox設定オブジェクト
 * @throws アクセストークンが未設定または無効な場合
 */
export function getMapboxConfig(): MapboxConfig {
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  
  if (!isValidAccessToken(accessToken)) {
    throw new Error('Mapbox access token is required. Please set VITE_MAPBOX_ACCESS_TOKEN in your environment variables.');
  }
  
  // スタイルURLの取得（環境変数 → フォールバック）
  const styleUrl = getSafeStyleUrl();
  
  return {
    accessToken: accessToken.trim(),
    styleUrl,
  };
}

/**
 * Mapboxアクセストークンが有効かどうかを検証する
 * @param token 検証するトークン
 * @returns トークンが有効な場合true
 */
function isValidAccessToken(token: string | undefined): token is string {
  return typeof token === 'string' && token.trim().length > 0;
}