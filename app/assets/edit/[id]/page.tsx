"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TopNav } from "@/components/top-nav"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Save, ArrowLeft, Building2, MapPin, FileSpreadsheet, ClipboardList, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Asset {
  id: number
  asset_id: string
  asset_name: string
  scheme: string
  implementing_agency: string
  latitude: number
  longitude: number
  work_order_number: string
  completion_date: string
  amount_spent: number
  development_type: string
  development_details: string
  photo_url: string
  inspection_location: string
  nature_of_work: string
}

export default function EditAssetPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [asset, setAsset] = useState<Asset | null>(null)

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        setError(null)
        const res = await fetch(`/api/assets/${params.id}`)
        if (!res.ok) throw new Error("Failed to fetch asset")
        const data = await res.json()
        setAsset(data)
      } catch (error) {
        console.error("Error:", error)
        setError("Failed to fetch asset details. Please try again.")
        toast({
          title: "Error",
          description: "Failed to fetch asset details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAsset()
  }, [params.id, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const res = await fetch(`/api/assets/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(asset),
      })

      if (!res.ok) throw new Error("Failed to update asset")

      toast({
        title: "Success",
        description: "Asset updated successfully",
        className: "bg-green-50 text-green-900 border-green-200",
      })

      router.push("/assets/all")
    } catch (error) {
      console.error("Error:", error)
      setError("Failed to update asset. Please try again.")
      toast({
        title: "Error",
        description: "Failed to update asset",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading asset details...</p>
        </div>
      </div>
    )
  }

  if (!asset) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] gap-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-muted-foreground">Asset not found</p>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto py-8 animate-fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">Edit Asset</h2>
            <p className="text-muted-foreground">Update the details of your asset</p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="transition-all duration-200 hover:bg-primary/5"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="overflow-hidden border-t border-l border-r border-b border-gray-200 dark:border-gray-800 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800/50 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              <CardTitle>Asset Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="assetId">Asset Details</Label>
                    </div>
                    <Input
                      id="assetId"
                      value={asset?.asset_id || ""}
                      onChange={(e) => setAsset({ ...asset, asset_id: e.target.value })}
                      className="transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Input
                      placeholder="Asset Name"
                      required
                      value={asset?.asset_name || ""}
                      onChange={(e) => setAsset({ ...asset, asset_name: e.target.value })}
                      className="transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Input
                      placeholder="Scheme"
                      value={asset?.scheme || ""}
                      onChange={(e) => setAsset({ ...asset, scheme: e.target.value })}
                      className="transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Input
                      placeholder="Implementing Agency"
                      value={asset?.implementing_agency || ""}
                      onChange={(e) => setAsset({ ...asset, implementing_agency: e.target.value })}
                      className="transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Location Information */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="latitude">Location</Label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        id="latitude"
                        placeholder="Latitude"
                        type="number"
                        step="any"
                        value={asset?.latitude || ""}
                        onChange={(e) => setAsset({ ...asset, latitude: Number(e.target.value) })}
                        className="transition-all duration-200"
                      />
                      <Input
                        placeholder="Longitude"
                        type="number"
                        step="any"
                        value={asset?.longitude || ""}
                        onChange={(e) => setAsset({ ...asset, longitude: Number(e.target.value) })}
                        className="transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <ClipboardList className="h-4 w-4 text-muted-foreground" />
                      <Label>Work Details</Label>
                    </div>
                    <Input
                      placeholder="Work Order Number"
                      value={asset?.work_order_number || ""}
                      onChange={(e) => setAsset({ ...asset, work_order_number: e.target.value })}
                      className="transition-all duration-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Input
                        type="date"
                        value={asset?.completion_date || ""}
                        onChange={(e) => setAsset({ ...asset, completion_date: e.target.value })}
                        className="transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="number"
                        placeholder="Amount Spent"
                        value={asset?.amount_spent || ""}
                        onChange={(e) => setAsset({ ...asset, amount_spent: Number(e.target.value) })}
                        className="transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Select
                      value={asset?.development_type || ""}
                      onValueChange={(value) => setAsset({ ...asset, development_type: value })}
                    >
                      <SelectTrigger className="transition-all duration-200">
                        <SelectValue placeholder="Development Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Repair">Repair</SelectItem>
                        <SelectItem value="Extension">Extension</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="developmentDetails">Development Details</Label>
                  <Textarea
                    id="developmentDetails"
                    value={asset?.development_details || ""}
                    onChange={(e) => setAsset({ ...asset, development_details: e.target.value })}
                    className="min-h-[100px] transition-all duration-200"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="photoUrl">Photo URL</Label>
                    <Input
                      id="photoUrl"
                      value={asset?.photo_url || ""}
                      onChange={(e) => setAsset({ ...asset, photo_url: e.target.value })}
                      className="transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inspectionLocation">Inspection Location</Label>
                    <Input
                      id="inspectionLocation"
                      value={asset?.inspection_location || ""}
                      onChange={(e) => setAsset({ ...asset, inspection_location: e.target.value })}
                      className="transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="natureOfWork">Nature of Work</Label>
                  <Input
                    id="natureOfWork"
                    value={asset?.nature_of_work || ""}
                    onChange={(e) => setAsset({ ...asset, nature_of_work: e.target.value })}
                    className="transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={saving}
                  className="transition-all duration-200 hover:bg-primary/5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

