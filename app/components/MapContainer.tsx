"use client";

import React, { useEffect, useRef, lazy, Suspense } from "react";
import { useMapbox } from "../hooks/useMapbox";
import type { MapContainerProps } from "../types/mapbox";
import mapboxgl from "mapbox-gl";
import { getMapboxConfig } from "~/utils/mapbox-env";
import "mapbox-gl/dist/mapbox-gl.css";

const SearchBox = lazy(() =>
  import("@mapbox/search-js-react").then((mod) => ({
    default: mod.SearchBox as any,
  }))
);

// 東京駅をデフォルト座標として設定
const DEFAULT_COORDINATES = [139.7671, 35.6812] as [number, number];
const DEFAULT_ZOOM = 10;

export function MapContainer({
  width = "100%",
  height = "400px",
  center = DEFAULT_COORDINATES,
  zoom = DEFAULT_ZOOM,
  styleUrl = "mapbox://styles/mapbox/streets-v12",
  className = "",
  showNavigationControl = true,
  showSearchBox = true,
  searchBoxProps = {
    placeholder: "地名を検索...",
    language: "ja",
    country: "JP",
    marker: true,
    className: "",
  },
}: MapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { mapInstance, isInitialized, error, initializeMap } = useMapbox();

  useEffect(() => {
    if (containerRef.current && !error) {
      initializeMap(containerRef.current, {
        center,
        zoom,
        style: styleUrl,
      });
    }
  }, [initializeMap, center, zoom, styleUrl, error]);

  // NavigationControlを追加
  useEffect(() => {
    let navigationControl: any = null;

    if (mapInstance && isInitialized && showNavigationControl) {
      console.log("Adding NavigationControl", {
        mapInstance,
        isInitialized,
        showNavigationControl,
      });

      navigationControl = new mapboxgl.NavigationControl();

      try {
        mapInstance.addControl(navigationControl, "top-right");
        console.log("NavigationControl added successfully");
      } catch (error) {
        console.error("Failed to add NavigationControl:", error);
      }
    }

    // クリーンアップ関数
    return () => {
      if (navigationControl && mapInstance) {
        try {
          mapInstance.removeControl(navigationControl);
          console.log("NavigationControl removed");
        } catch (error) {
          console.error("Failed to remove NavigationControl:", error);
        }
      }
    };
  }, [mapInstance, isInitialized, showNavigationControl]);

  // エラー状態の表示
  if (error) {
    return (
      <div className="mapbox-error-container" style={{ width, height }}>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h3 className="font-bold">マップの読み込みに失敗しました</h3>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mapbox-wrapper relative" style={{ width, height }}>
      {/* ローディング状態 */}
      {!isInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-gray-600">マップを読み込み中...</div>
        </div>
      )}

      {/* 検索ボックス */}
      {typeof window !== "undefined" &&
        showSearchBox &&
        mapInstance &&
        isInitialized && (
          <Suspense fallback={null}>
            <div
              className={`
              absolute top-4 left-4 z-20 w-80 max-w-[calc(100%-2rem)]
              focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent
              ${searchBoxProps.className || ""}
            `}
            >
              {React.createElement(SearchBox as any, {
                accessToken: getMapboxConfig().accessToken,
                map: mapInstance as any,
                mapboxgl: mapboxgl,
                marker: searchBoxProps.marker,
                options: {
                  language: searchBoxProps.language || "ja",
                  country: searchBoxProps.country || "JP",
                },
                placeholder: searchBoxProps.placeholder,
              })}
            </div>
          </Suspense>
        )}

      {/* マップコンテナ */}
      <div
        ref={containerRef}
        data-testid="mapbox-container"
        className={`mapbox-container ${className}`}
        style={{ width, height }}
      />
    </div>
  );
}
