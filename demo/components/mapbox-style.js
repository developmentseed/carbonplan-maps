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
  debug,
  setZoom,
  setCenter
}) => {
  const map = useRef()
  const containerRef = useRef()
  const [ready, setReady] = useState()

  useEffect(() => {
    if (!containerRef.current) return 
      map.current = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/light-v11',
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
    <div>
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
      
    </div>
  )
}

export default Mapbox
