"use client";

import { useSharedState } from "@/components/providers/dashboard-context";
import {
  Map,
  MapMarker,
  MapTileLayer,
  MapTooltip,
} from "@/components/ui/map"
import { LatLngExpression } from "leaflet";
import { useLogs as uselogs } from "./preop.queries";
import LoadingPage from "@/components/loadingpage";

const Example = () => {

  const { value } = useSharedState()
  const { data } = uselogs()
  // const POPUP_CITIES = [
  //   {
  //     name: "Toronto",
  //     coordinates: [43.6532, -79.3832] satisfies LatLngExpression,
  //   },
  //   {
  //     name: "Port Elizabeth",
  //     coordinates: [-33.9137, 25.5827] satisfies LatLngExpression,
  //   },
  // ]
  if (!data) return <LoadingPage />
  // const TOOLTIP_CITIES = [
  //   {
  //     name: "Hong Kong",
  //     coordinates: [22.3193, 114.1694] satisfies LatLngExpression,
  //   },
  //   {
  //     name: "Pattaya",
  //     coordinates: [12.9236, 100.8825] satisfies LatLngExpression,
  //   },
  // ]

  const logs: {
    name: string;
    coordinates: LatLngExpression;
  }[] = data.map((log) => ({
    name: `${log.firstName} ${log.lastName}`, coordinates: [
      Number(log.lat || 0), Number(log.lon || 0)
    ]
  }))
  // const SOUTH_AMERICA_BOUNDS = [
  //   [12.5, -81.7],
  //   [12.5, -34.8],
  //   [-55.0, -34.8],
  //   [-55.0, -81.7],
  // ] satisfies LatLngExpression[]
  return (<>
    {/* {JSON.stringify(data.map(d => ({ lat: d.lat, lon: d.lon })))} */}
    <Map center={[Number(value.lat) || 12.9236, Number(value.lon) || 100.8825]} zoom={1} >
      <MapTileLayer
      // url="https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}"
      />
      {/* {POPUP_CITIES.map((city) => (
        <MapMarker key={city.name} position={city.coordinates}>
          <MapPopup className="w-56"> {city.name}!</MapPopup>
        </MapMarker>
      ))} */}
      {logs.map((city) => (
        <MapMarker key={city.name} position={city.coordinates}>
          <MapTooltip side="bottom">
            {city.name}!
          </MapTooltip>
        </MapMarker>
      ))}
      {/* <MapPolygon positions={SOUTH_AMERICA_BOUNDS}>
        <MapPopup className="w-56">Say hi to South America!</MapPopup>
      </MapPolygon> */}
    </Map></>

  )
};

export default Example;
