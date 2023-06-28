import React from 'react'
import Mapbox from './mapbox'
import Regl from './regl'
import { RegionProvider } from './region/context'
import { LoadingProvider, LoadingUpdater } from './loading'

const Map = ({
  id,
  tabIndex,
  className,
  style,
  zoom,
  minZoom,
  maxZoom,
  maxBounds,
  center,
  debug,
  extensions,
  glyphs,
  children,
  /** Tracks *any* pending requests made by containing `Raster` layers */
  setLoading,
  /** Tracks any metadata and coordinate requests made on initialization by containing `Raster` layers */
  setMetadataLoading,
  /** Tracks any requests of new chunks by containing `Raster` layers */
  setChunkLoading,
}) => {
  return (
    <div
      id={'regl-map'}
      tabIndex={tabIndex}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...style,
      }}
    >
      <Regl
        extensions={extensions}
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        <LoadingProvider>
          <LoadingUpdater
            setLoading={setLoading}
            setMetadataLoading={setMetadataLoading}
            setChunkLoading={setChunkLoading}
          />
          <RegionProvider>{children}</RegionProvider>
        </LoadingProvider>
      </Regl>
    </div>
  )
}

export default Map
