import React, {
  createContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react'
import mapboxgl from 'mapbox-gl'
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

mapboxgl.accessToken = publicRuntimeConfig.MAPBOX_TOKEN

const Mapbox = ({
  glyphs,
  style,
  initialCenter,
  initialZoom,
  minZoom,
  maxZoom,
  maxBounds,
  source,
  debug,
  variable,
  color, 
  opacity,
  setZoom,
  setCenter,
  width=1
}) => {
  const map = useRef()
  const containerRef = useRef()
  const [ready, setReady] = useState()
  const landSourceId = 'line'
  const oceanSourceId = 'fill'
  const landLayerId = 'line-layer'
  const oceanLayerId = 'fill-layer'

  
  useEffect(() => {
    if (!containerRef.current) return 
    const mapboxStyle = { version: 8, sources: {
      [landSourceId]:{
        type: 'vector',
        tiles: [`${source}basemaps/land/{z}/{x}/{y}.pbf`],
        maxzoom: 5
      },
      [oceanSourceId]:{
        type: 'vector',
        tiles: [`${source}basemaps/ocean/{z}/{x}/{y}.pbf`],
        maxzoom: 5
      }
    }, 
    layers: [{
      id: landLayerId,
      type: 'line',
      source: landSourceId,
      'source-layer': variable,
      layout: { visibility: 'visible' },
      paint: {
        'line-blur': 1,
        'line-color': color,
        'line-opacity': opacity,
        'line-width': width,
      },
    }, {
      id: oceanLayerId,
      type: 'fill',
      source: oceanSourceId,
      'source-layer': 'ocean',
      layout: { visibility: 'visible' },
      paint: {
        'fill-color': 'black',
        'fill-opacity': opacity,
      }
    }]}

      map.current = new mapboxgl.Map({
        container: containerRef.current,
        style: mapboxStyle, 
        minZoom: minZoom,
        maxZoom: maxZoom,
        maxBounds: maxBounds,
        center: initialCenter,
        zoom: initialZoom,
        projection: 'mercator',
        dragRotate: false,
        pitchWithRotate: false,
        touchZoomRotate: true,
      })

      // if (center) map.current.setCenter(center)
      // if (zoom) map.current.setZoom(zoom)


      if (maxZoom) {
        map.getSource(sourceId).maxzoom = maxZoom
      }

      map.current.touchZoomRotate.disableRotation()
      map.current.touchPitch.disable()
      map.current.on('styledata', () => {
        setReady(true)
      })

      const moveCallback = () => {
        const currentCenter = map.current.getCenter();
        const currentZoom = map.current.getZoom();
        setCenter(currentCenter)
        setZoom(currentZoom)
      }
      map.current.on('render', moveCallback )
      
      return () => {
        if (map.current) {
          map.current.remove()
          map.current.off('render', moveCallback)
          setReady(false)
        }
      }
  }, [])

  useEffect(() => {
    map.current.showTileBoundaries = debug
  }, [debug])

  return (
    
      <div
        style={{
          top: '0px',
          bottom: '0px',
          position: 'absolute',
          width: '100%',
          ...style,
        }}
        ref={containerRef}
      />
      
    
  )
}

export default Mapbox
