import React, { useState, useEffect, useCallback } from 'react'
import { flushSync } from 'react-dom'

export const useControls = (mapRef) => {
  const [zoom, setZoom] = useState()
  const [center, setCenter] = useState()


  const updateControlsSync = useCallback(() => {
    flushSync(() => {
      setZoom(mapRef.current.getZoom())
      setCenter(mapRef.current.getCenter())
    })
  }, [])

  useEffect(() => {
    if (!mapRef.current) return 
    setZoom(mapRef.current.getZoom())
    setCenter(mapRef.current.getCenter())
    mapRef.current.on('load', updateControlsSync)
    mapRef.current.on('move', updateControlsSync)
  }, [mapRef.current])

  return { center: center, zoom: zoom }
}
