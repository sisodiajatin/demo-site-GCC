import { MapContainer, TileLayer, CircleMarker, Popup, Rectangle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Organization, CoverageGap, OrgType } from "../types";

interface Props {
  organizations: Organization[];
  gaps: CoverageGap[];
  showGaps: boolean;
}

const TYPE_COLORS: Record<OrgType, string> = {
  organization: "#33513a",
  municipality: "#3a6ea5",
  committee: "#8a5a2f",
  individual: "#7a4a7d",
};

const NEW_ENGLAND_CENTER: [number, number] = [43.0, -71.8];

export function MapView({ organizations, gaps, showGaps }: Props) {
  return (
    <MapContainer
      center={NEW_ENGLAND_CENTER}
      zoom={6}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {showGaps &&
        gaps.map((gap, i) => (
          <Rectangle
            key={i}
            bounds={[
              [gap.lat, gap.lng],
              [gap.lat + gap.size, gap.lng + gap.size],
            ]}
            pathOptions={{
              color: "#b9812f",
              weight: 1,
              fillColor: "#b9812f",
              fillOpacity: 0.12,
            }}
          />
        ))}

      {organizations.map((org) => (
        <CircleMarker
          key={org.id}
          center={[org.latitude, org.longitude]}
          radius={7}
          pathOptions={{
            color: TYPE_COLORS[org.org_type],
            fillColor: TYPE_COLORS[org.org_type],
            fillOpacity: 0.85,
            weight: 1.5,
          }}
        >
          <Popup>
            <div style={{ minWidth: 200 }}>
              <strong>{org.name}</strong>
              <div style={{ fontSize: 12, color: "#6b6b62", margin: "2px 0 6px" }}>
                {org.city}, {org.state} &middot; {org.org_type}
              </div>
              {org.mission_summary && (
                <p style={{ fontSize: 13, margin: "0 0 6px" }}>{org.mission_summary}</p>
              )}
              {org.focus_areas.length > 0 && (
                <div style={{ fontSize: 11, color: "#6b6b62" }}>
                  Focus: {org.focus_areas.join(", ")}
                </div>
              )}
              {org.website && (
                <a href={org.website} target="_blank" rel="noreferrer" style={{ fontSize: 12 }}>
                  Visit site
                </a>
              )}
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
