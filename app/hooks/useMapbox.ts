import { useState, useEffect, useRef, useCallback } from 'react';
import { getMapboxConfig } from '~/utils/mapbox-env';
import type { MapboxMap, MapboxGL, MapInitializationOptions, UseMapboxReturn } from '~/types/mapbox';
import { DEFAULT_COORDINATES, DEFAULT_ZOOM } from '~/types/mapbox';

/**
 * Mapbox GL JSマップを管理するカスタムフック
 * @returns マップインスタンスと制御関数
 */
export function useMapbox(): UseMapboxReturn {
  const [mapInstance, setMapInstance] = useState<MapboxMap | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const mapRef = useRef<MapboxMap | null>(null);

  // Mapbox GL JSサポートチェック
  const isSupported = (globalThis as any).mapboxgl?.supported() ?? false;

  useEffect(() => {
    validateEnvironment();
  }, [isSupported]);

  /**
   * ブラウザ環境と設定の検証
   */
  const validateEnvironment = useCallback(() => {
    if (!isSupported) {
      setError(new Error('WebGL is not supported or Mapbox GL JS is not available'));
      return;
    }

    try {
      getMapboxConfig();
    } catch (err) {
      setError(err as Error);
    }
  }, [isSupported]);

  /**
   * マップを初期化する
   * @param container マップを描画するHTMLコンテナ
   * @param options マップ初期化オプション
   */
  const initializeMap = useCallback((container: HTMLElement, options: MapInitializationOptions) => {
    try {
      cleanupPreviousMap();

      const config = getMapboxConfig();
      const mapboxgl = (globalThis as any).mapboxgl as MapboxGL;
      
      const map = new mapboxgl.Map({
        accessToken: config.accessToken,
        container: container,
        style: options.style,
        center: options.center,
        zoom: options.zoom,
      });

      mapRef.current = map;
      setMapInstance(map);
      setIsInitialized(true);
      setError(null);
    } catch (err) {
      setError(err as Error);
      setIsInitialized(false);
    }
  }, []);

  /**
   * 前のマップインスタンスをクリーンアップ
   */
  const cleanupPreviousMap = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
  }, []);

  /**
   * マップインスタンスをクリーンアップして状態をリセット
   */
  const cleanup = useCallback(() => {
    cleanupPreviousMap();
    setMapInstance(null);
    setIsInitialized(false);
    setError(null);
  }, [cleanupPreviousMap]);

  // コンポーネントアンマウント時のクリーンアップ
  useEffect(() => {
    return cleanupPreviousMap;
  }, [cleanupPreviousMap]);

  return {
    mapInstance,
    isInitialized,
    error,
    initializeMap,
    cleanup,
  };
}