"use client"

import { useState, useCallback } from "react"
import { GoogleMap, useJsApiLoader, InfoWindow, Marker } from "@react-google-maps/api"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

const mapContainerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "0.5rem",
}

const options = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  streetViewControl: true,
  fullscreenControl: true,
}

interface Asset {
  id: number
  asset_id: string
  asset_name: string
  scheme: string
  implementing_agency: string
  latitude: number | null
  longitude: number | null
  amount_spent: number
  development_type: string
  created_at: string
  created_by_name: string
}

interface AssetMapProps {
  asset: Asset | null
  isOpen: boolean
  onClose: () => void
}

interface LatLngLiteral {
  lat: number
  lng: number
}

export function AssetMap({ asset, isOpen, onClose }: AssetMapProps) {
  const [selectedMarker, setSelectedMarker] = useState<LatLngLiteral | null>(null)
  const [mapType, setMapType] = useState("roadmap")
  const [mapError, setMapError] = useState<string | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDNEuM3btkWUELicWHIeqFUE_HWhNAqhxs", // Replace with your actual API key
    libraries: ["places"],
  })

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map)
  }, [])

  if (!asset) return null

  // Validate and parse coordinates
  const latitude = typeof asset.latitude === "string" ? Number.parseFloat(asset.latitude) : asset.latitude
  const longitude = typeof asset.longitude === "string" ? Number.parseFloat(asset.longitude) : asset.longitude

  if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px]" aria-describedby="asset-location-description">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>Asset Location</span>
            </DialogTitle>
            <DialogDescription id="asset-location-description">
              View the location details for {asset.asset_name}
            </DialogDescription>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Location coordinates are not available for this asset.</AlertDescription>
          </Alert>
          <Card className="p-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{asset.asset_name}</h3>
                <Badge
                  variant="outline"
                  className={`
                    ${
                      asset.development_type === "Maintenance"
                        ? "bg-blue-50 text-blue-700"
                        : asset.development_type === "Repair"
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-green-50 text-green-700"
                    }
                  `}
                >
                  {asset.development_type}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Scheme: {asset.scheme}</p>
                <p>Agency: {asset.implementing_agency}</p>
                <p>Amount: ₹{asset.amount_spent.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </DialogContent>
      </Dialog>
    )
  }

  const center: LatLngLiteral = {
    lat: latitude,
    lng: longitude,
  }

  const renderMap = () => {
    if (loadError) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Error loading Google Maps. Please try again later.</AlertDescription>
        </Alert>
      )
    }

    if (!isLoaded) {
      return (
        <div className="h-[400px] w-full flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )
    }

    return (
      <div className="relative w-full h-[400px] rounded-lg overflow-hidden border">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={15}
          onLoad={onMapLoad}
          options={{ ...options, mapTypeId: mapType }}
        >
          <Marker position={center} onClick={() => setSelectedMarker(center)} title={asset.asset_name} />
          {selectedMarker && (
            <InfoWindow position={selectedMarker} onCloseClick={() => setSelectedMarker(null)}>
              <div className="p-2">
                <h3 className="font-semibold text-sm">{asset.asset_name}</h3>
                <p className="text-xs text-gray-600">{asset.scheme}</p>
                <p className="text-xs text-gray-600 mt-1">₹{asset.amount_spent.toLocaleString()}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]" aria-describedby="asset-map-description">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>Asset Location</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMapType("roadmap")}
                className={mapType === "roadmap" ? "bg-primary/10" : ""}
              >
                Map
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMapType("satellite")}
                className={mapType === "satellite" ? "bg-primary/10" : ""}
              >
                Satellite
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription id="asset-map-description">
            View the location and details for {asset.asset_name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Card className="p-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{asset.asset_name}</h3>
                <Badge
                  variant="outline"
                  className={`
                    ${
                      asset.development_type === "Maintenance"
                        ? "bg-blue-50 text-blue-700"
                        : asset.development_type === "Repair"
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-green-50 text-green-700"
                    }
                  `}
                >
                  {asset.development_type}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Scheme: {asset.scheme}</p>
                <p>Agency: {asset.implementing_agency}</p>
                <p>Amount: ₹{asset.amount_spent.toLocaleString()}</p>
                <p className="font-mono text-xs mt-1">
                  Coordinates: {latitude}, {longitude}
                </p>
              </div>
            </div>
          </Card>

          {renderMap()}
        </div>
      </DialogContent>
    </Dialog>
  )
}

