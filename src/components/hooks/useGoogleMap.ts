import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";

const styles = [
  // Hide all points of interest (POIs)
  { featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }] },

  // Hide all labels except cities
  {
    featureType: "administrative",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels",
    stylers: [{ visibility: "on" }],
  }, // Keep city names
  {
    featureType: "administrative.neighborhood",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },

  // Hide transit station labels
  {
    featureType: "transit",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },

  // Hide road shields and signs (for cleaner look)
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },

  // Show roads (geometry only, no extra labels)
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "road",
    elementType: "labels.text",
    stylers: [{ visibility: "off" }],
  },

  // Show water bodies, no labels
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "water",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },

  // Show land areas (natural features), no labels
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "landscape.natural",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },

  // Hide man-made landscapes (like parks or theme parks)
  {
    featureType: "landscape.man_made",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },

  // Optional: show country/state borders without labels
  {
    featureType: "administrative.country",
    elementType: "geometry",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "administrative.province",
    elementType: "geometry",
    stylers: [{ visibility: "on" }],
  },
];

export function useGoogleMap({
  mapContainer,
  defaultCenter,
  defaultZoom,
  mapId,
  apiKey,
}: {
  mapContainer: React.RefObject<HTMLDivElement>;
  defaultCenter: { lat: number; lng: number };
  defaultZoom: number;
  mapId: string;
  apiKey: string;
}) {
  const gMap = useRef<google.maps.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [googlemaps, setGoogleMaps] = useState<google.maps.MapsLibrary>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [googleMarker, setGoogleMarker] =
    useState<google.maps.MarkerLibrary>(null);
  useState<google.maps.MarkerLibrary>(null);

  useEffect(() => {
    if (!mapContainer.current || gMap.current) return;
    const loader = new Loader({
      apiKey,
      version: "weekly",
    });

    loader
      .importLibrary("maps")
      .then((gmaps) => {
        const mapInstance = new gmaps.Map(mapContainer.current, {
          center: defaultCenter,
          zoom: defaultZoom,
          // mapId,
          mapTypeId: google.maps.MapTypeId.HYBRID,
          mapTypeControl: false,
          clickableIcons: false,
          styles: styles,
        });
        setGoogleMaps(gmaps);

        gMap.current = mapInstance;
        setMapLoaded(true);
      })
      .catch((error) => {
        setMapError("Failed to load Google Maps");
      });
  }, []);

  return { gMap, mapLoaded, googlemaps, mapError, googleMarker };
}
