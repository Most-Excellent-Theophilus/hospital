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
  const { data } = uselogs();

  if (!data) return <LoadingPage />

  const logs: {
    name: string;
    coordinates: LatLngExpression;
  }[] = data.map((log) => ({
    name: `${log.firstName} ${log.lastName}`, coordinates: [
      Number(log.lat || 0), Number(log.lon || 0)
    ]
  }))
 
  return (<>
    <Map center={[Number(value.lat) || 12.9236, Number(value.lon) || 100.8825]} zoom={1} >
      <MapTileLayer
      url="https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}"
      />
  
      {logs.map((city) => (
        <MapMarker key={city.name} position={city.coordinates}>
          <MapTooltip side="bottom">
            {city.name}!
          </MapTooltip>
        </MapMarker>
      ))}
     
    </Map></>

  )
};

export default Example;
