// import React from 'react';
// import geojson from './geojson.json';
// import { geoMercator, geoPath } from 'd3-geo';
// import { select } from 'd3-selection';





// export default class Map extends React.Component {
//   render() {
//     const width = 500;
//     const height = width * 0.5;
//     const projection = geoMercator().fitExtent(
//       [[0, 0], [width * 0.9, height * 0.9]],
//       geojson
//     );
//     const path = geoPath().projection(projection);

//     return (
//       <svg width={width} height={height}>
//         <g className="geojson-layer">
//           {
//             geojson.features.map(d => (
//               <path
//                 key={d.properties.Name}
//                 d={path(d)}
//                 fill="#eee"
//                 stroke="#0e1724"
//                 strokeWidth="1"
//                 strokeOpacity="0.5"
//                 onMouseEnter={(e) => {
//                   select(e.target)
//                     .attr('fill', '#000')
//                 }}
//                 onMouseOut={(e) => {
//                   select(e.target)
//                     .attr('fill', '#eee')
//                 }}
//               />
//             ))
//           }
//         </g>
//       </svg>
//     )
//   }
// }


// import React from 'react'
// import Mapbox from './mapbox'
// import Regl from './regl'
// import { RegionProvider } from './region/context'
// import { LoadingProvider, LoadingUpdater } from './loading'

// const D3Map = () => {
//   return (
//     <svg width={width} height={height}>
//     <g className="geojson-layer">
//       {
//         geojson.features.map(d => (
//           <path
//             key={d.properties.Name}
//             d={path(d)}
//             fill="#eee"
//             stroke="#0e1724"
//             strokeWidth="1"
//             strokeOpacity="0.5"
//             onMouseEnter={(e) => {
//               select(e.target)
//                 .attr('fill', '#000')
//             }}
//             onMouseOut={(e) => {
//               select(e.target)
//                 .attr('fill', '#eee')
//             }}
//           />
//         ))
//       }
//     </g>
//   </svg>
//   )
// }

// export default Map
