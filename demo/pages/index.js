import { useState } from 'react'
import { Flex, Box, useThemeUI } from 'theme-ui'
import { Dimmer, Meta, Toggle } from '@carbonplan/components'
import { Map, Raster, RegionPicker } from '@carbonplan/maps'
import { useThemedColormap } from '@carbonplan/colormaps'
import RegionControls from '../components/region-controls'
import MyMap from '../components/my-map'
import MapboxSatMap from '../components/mapbox-style'
import ParameterControls from '../components/parameter-controls'

const bucket = 'https://carbonplan-maps.s3.us-west-2.amazonaws.com/'

const Index = () => {
  const { theme } = useThemeUI()
  const [display, setDisplay] = useState(true)
  const [debug, setDebug] = useState(false)
  const [opacity, setOpacity] = useState(1)
  const [clim, setClim] = useState([-20, 30])
  const [month, setMonth] = useState(1)
  const [band, setBand] = useState('tavg')
  const [colormapName, setColormapName] = useState('warm')
  const colormap = useThemedColormap(colormapName)
  const [showRegionPicker, setShowRegionPicker] = useState(false)
  const [regionData, setRegionData] = useState({ loading: true })
  const [showMapboxMap, setShowMapboxMap] = useState(false)

  const[zoom, setZoom] = useState(0)
  const[center, setCenter] = useState({lng: 0, lat: 0})

  const getters = { display, debug, opacity, clim, month, band, colormapName }
  const setters = {
    setDisplay,
    setDebug,
    setOpacity,
    setClim,
    setMonth,
    setBand,
    setColormapName,
  }

  return (
    <>
      <Meta
        card={'https://images.carbonplan.org/social/maps-demo.png'}
        description={
          'Demo of our library for making interactive multi-dimensional data-driven web maps.'
        }
        title={'@carbonplan/maps'}
      />
      <Box sx={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }}>
          {showRegionPicker && (
            <RegionPicker
              color={theme.colors.primary}
              backgroundColor={theme.colors.background}
              fontFamily={theme.fonts.mono}
              fontSize={'14px'}
              maxRadius={2000}
            />
          )}
        {showMapboxMap && <MapboxSatMap 
          initialZoom={zoom} 
          initialCenter={center} 
          setZoom={setZoom}
          setCenter={setCenter}
          debug={debug} 
        />}
        {!showMapboxMap &&         
        <MyMap 
          initialZoom={zoom} 
          initialCenter={center} 
          setZoom={setZoom}
          setCenter={setCenter}
          debug={debug} 
          source={bucket}
          color={theme.rawColors.primary}
          variable={'land'}
          opacity={opacity}
          style={{zIndex: 1}}
        />}
        <Map style={{zIndex: showMapboxMap? 1: -1}}>
          <Raster
            colormap={colormap}
            clim={clim}
            display={display}
            opacity={opacity}
            mode={'texture'}
            zoom={zoom}
            center={center}
            source={bucket + 'v2/demo/4d/tavg-prec-month'}
            variable={'climate'}
            selector={{ month, band }}
            regionOptions={{ setData: setRegionData }}
          />
        </Map>
      <div style={{zIndex: 2, position: 'absolute', top: 0, left: 0, right: 0}}>
        <RegionControls
          band={band}
          regionData={regionData}
          showRegionPicker={showRegionPicker}
          setShowRegionPicker={setShowRegionPicker}
        />
      
        <ParameterControls getters={getters} setters={setters} />
        <Dimmer
          sx={{
            display: ['initial', 'initial', 'initial', 'initial'],
            position: 'absolute',
            color: 'primary',
            right: [13],
            bottom: [17, 17, 15, 15],
          }}
        />
        <Box sx={{ position: 'absolute', top: 150, right: 20 }}>
        <Flex
          sx={{
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 4,
          }}
        >
          <Box>
            <Box>Show Mapbox Basemap</Box>
              <Toggle
                sx={{ float: 'right', mt: 20 }}
                value={showMapboxMap}
                onClick={() => setShowMapboxMap((prev) => !prev)}
              />
            </Box>
          </Flex>
        </Box>
        </div>
      </Box>
    </>
  )
}

export default Index
