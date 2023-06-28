import React, { useRef, useEffect, useState } from 'react'
import { useRegl } from './regl'

import { createTiles } from './tiles'
import { useRegion } from './region/context'
import { useSetLoading } from './loading'
import { useControls } from './use-controls'

const Raster = (props) => {
  const {
    mapRef,
    display = true,
    opacity = 1,
    clim,
    colormap,
    index = 0,
    regionOptions = {},
    selector = {},
    uniforms = {}
  } = props
  
  const [regionDataInvalidated, setRegionDataInvalidated] = useState(
    new Date().getTime()
  )
  const { regl } = useRegl()
  const { region } = useRegion()
  const { setLoading, clearLoading, loading, chunkLoading, metadataLoading } =
    useSetLoading()
  const tiles = useRef()
  const camera = useRef()
  const lastQueried = useRef()
  const { center, zoom} = useControls(mapRef)

  camera.current = { center: center, zoom: zoom }
  const queryRegion = async (r, s) => {
    const queryStart = new Date().getTime()
    lastQueried.current = queryStart

    regionOptions.setData({ value: null })

    const data = await tiles.current.queryRegion(r, s)

    // Invoke callback as long as a more recent query has not already been initiated
    if (lastQueried.current === queryStart) {
      regionOptions.setData({ value: data })
    }
  }

  useEffect(() => {
    tiles.current = createTiles(regl, {
      ...props,
      setLoading,
      clearLoading,
      invalidate: () => {
        console.log('invalidate') // When zoom is high, this gets called a lot - almost breaks
        mapRef.current.triggerRepaint()
        // if (!tiles.current) return
        // tiles.current.updateCamera(camera.current)
        // tiles.current.draw()
      },
      invalidateRegion: () => {
        setRegionDataInvalidated(new Date().getTime())
      },
    })
  }, [])

  useEffect(() => {
    if (props.setLoading) {
      props.setLoading(loading)
    }9
  }, [!!props.setLoading, loading])
  useEffect(() => {
    if (props.setMetadataLoading) {
      props.setMetadataLoading(metadataLoading)
    }
  }, [!!props.setMetadataLoading, metadataLoading])
  useEffect(() => {
    if (props.setChunkLoading) {
      props.setChunkLoading(chunkLoading)
    }
  }, [!!props.setChunkLoading, chunkLoading])

  useEffect(() => {
    if (!tiles.current) return
    // if (Object.values(camera.current).some(Boolean)) {
    //   tiles.current.updateCamera(camera.current)
    //   tiles.current.draw()
    // }
    const callback = () => {
      if (Object.values(camera.current).some(Boolean)) {
        tiles.current.updateCamera(camera.current)
        tiles.current.draw()
      }
    }
    console.log(mapRef)
    mapRef.current.on('render', callback)

    return () => {
      regl.clear({
        color: [0, 0, 0, 0],
        depth: 1,
      })
      mapRef.current.off('render', callback)
      mapRef.current.triggerRepaint()
    }
  }, [index])

  useEffect(() => {
    tiles.current.updateSelector({ selector })
  }, Object.values(selector))

  useEffect(() => {
    tiles.current.updateUniforms({ display, opacity, clim, ...uniforms })
  }, [display, opacity, clim, ...Object.values(uniforms)])

  useEffect(() => {
    tiles.current.updateColormap({ colormap })
  }, [colormap])

  useEffect(() => {
    if (region && regionOptions?.setData) {
      queryRegion(region, regionOptions.selector || selector)
    }
  }, [
    regionOptions?.setData,
    region,
    regionDataInvalidated,
    ...Object.values(regionOptions?.selector || selector || {}),
  ])

  return null
}

export default Raster
