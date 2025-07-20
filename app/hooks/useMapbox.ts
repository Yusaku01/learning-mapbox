import { useState, useEffect, useRef, useCallback } from 'react';
import { getMapboxConfig } from '~/utils/mapbox-env';
import type { MapboxMap, MapInitializationOptions, UseMapboxReturn } from '~/types/mapbox';
import { DEFAULT_COORDINATES, DEFAULT_ZOOM } from '~/types/mapbox';
import mapboxgl from 'mapbox-gl';

/**
 * Mapbox GL JSマップを管理するカスタムフック
 * @returns マップインスタンスと制御関数
 */
export function useMapbox(): UseMapboxReturn {
  const [mapInstance, setMapInstance] = useState<MapboxMap | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const mapRef = useRef<MapboxMap | null>(null);

  // ブラウザ環境チェック
  const isClient = typeof window !== 'undefined';
  
  // Mapbox GL JSサポートチェック（ブラウザ環境でのみ）
  const isSupported = isClient ? mapboxgl.supported?.() ?? false : false;

  useEffect(() => {
    if (!isClient) return;
    validateEnvironment();
  }, [isSupported, isClient]);

  /**
   * ブラウザ環境と設定の検証
   */
  const validateEnvironment = useCallback(() => {
    // ブラウザ環境でのみ実行
    if (!isClient) return;
    
    if (!isSupported) {
      setError(new Error('WebGL is not supported or Mapbox GL JS is not available'));
      return;
    }

    try {
      getMapboxConfig();
    } catch (err) {
      setError(err as Error);
    }
  }, [isSupported, isClient]);

  /**
   * マップを初期化する
   * @param container マップを描画するHTMLコンテナ
   * @param options マップ初期化オプション
   */
  const initializeMap = useCallback((container: HTMLElement, options: MapInitializationOptions) => {
    // ブラウザ環境でのみ実行
    if (!isClient) {
      setError(new Error('Map initialization is only available in browser environment'));
      return;
    }

    try {
      cleanupPreviousMap();

      const config = getMapboxConfig();
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
  }, [isClient]);

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