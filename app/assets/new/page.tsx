"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { TopNav } from "@/components/top-nav"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save, ArrowLeft, Building2, MapPin, FileSpreadsheet, ClipboardList } from "lucide-react"

export default function NewAssetPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    assetId: "",
    assetName: "",
    scheme: "",
    implementingAgency: "",
    latitude: "",
    longitude: "",
    workOrderNumber: "",
    completionDate: "",
    amountSpent: "",
    developmentType: "Maintenance",
    developmentDetails: "",
    photoUrl: "",
    inspectionLocation: "",
    natureOfWork: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to create asset")

      toast({
        title: "Success",
        description: "Asset created successfully",
        className: "bg-green-50 text-green-900 border-green-200",
      })

      router.push("/assets")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create asset. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto py-8 animate-fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">New Asset</h2>
            <p className="text-muted-foreground">Create a new asset entry in the system</p>
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
                      placeholder="Asset ID"
                      value={formData.assetId}
                      onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
                      className="transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Input
                      placeholder="Asset Name"
                      required
                      value={formData.assetName}
                      onChange={(e) => setFormData({ ...formData, assetName: e.target.value })}
                      className="transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Input
                      placeholder="Scheme"
                      value={formData.scheme}
                      onChange={(e) => setFormData({ ...formData, scheme: e.target.value })}
                      className="transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Input
                      placeholder="Implementing Agency"
                      value={formData.implementingAgency}
                      onChange={(e) => setFormData({ ...formData, implementingAgency: e.target.value })}
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
                        value={formData.latitude}
                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                        className="transition-all duration-200"
                      />
                      <Input
                        placeholder="Longitude"
                        type="number"
                        step="any"
                        value={formData.longitude}
                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
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
                      value={formData.workOrderNumber}
                      onChange={(e) => setFormData({ ...formData, workOrderNumber: e.target.value })}
                      className="transition-all duration-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Input
                        type="date"
                        value={formData.completionDate}
                        onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                        className="transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="number"
                        placeholder="Amount Spent"
                        value={formData.amountSpent}
                        onChange={(e) => setFormData({ ...formData, amountSpent: e.target.value })}
                        className="transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Select
                      value={formData.developmentType}
                      onValueChange={(value) => setFormData({ ...formData, developmentType: value })}
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
                    placeholder="Enter detailed description..."
                    value={formData.developmentDetails}
                    onChange={(e) => setFormData({ ...formData, developmentDetails: e.target.value })}
                    className="min-h-[100px] transition-all duration-200"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="photoUrl">Photo URL</Label>
                    <Input
                      id="photoUrl"
                      placeholder="Enter photo URL"
                      value={formData.photoUrl}
                      onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                      className="transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inspectionLocation">Inspection Location</Label>
                    <Input
                      id="inspectionLocation"
                      placeholder="Enter inspection location"
                      value={formData.inspectionLocation}
                      onChange={(e) => setFormData({ ...formData, inspectionLocation: e.target.value })}
                      className="transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="natureOfWork">Nature of Work</Label>
                  <Input
                    id="natureOfWork"
                    placeholder="Enter nature of work"
                    value={formData.natureOfWork}
                    onChange={(e) => setFormData({ ...formData, natureOfWork: e.target.value })}
                    className="transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                  className="transition-all duration-200 hover:bg-primary/5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Create Asset
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

