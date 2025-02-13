"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TopNav } from "@/components/top-nav"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Filter,
  Calendar,
  Building2,
  FileSpreadsheet,
  Loader2,
  Eye,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SearchFormData {
  assetId: string
  assetName: string
  scheme: string
  agency: string
  type: string
  minAmount: string
  maxAmount: string
  dateFrom: string
  dateTo: string
  natureOfWork: string
}

interface Asset {
  id: number
  asset_id: string
  asset_name: string
  scheme: string
  implementing_agency: string
  amount_spent: number
  development_type: string
  created_at: string
  created_by_name: string
  nature_of_work: string
}

interface PaginationInfo {
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function SearchPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState<SearchFormData>({
    assetId: "",
    assetName: "",
    scheme: "",
    agency: "",
    type: "All",
    minAmount: "",
    maxAmount: "",
    dateFrom: "",
    dateTo: "",
    natureOfWork: "",
  })
  const [assets, setAssets] = useState<Asset[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (page = 1) => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams({
        ...formData,
        page: page.toString(),
        limit: pagination.limit.toString(),
      })

      const res = await fetch(`/api/assets/search?${params}`)
      if (!res.ok) throw new Error("Failed to search assets")

      const data = await res.json()
      setAssets(data.data)
      setPagination(data.pagination)
      setSearched(true)

      if (data.data.length === 0) {
        toast({
          title: "No results found",
          description: "Try adjusting your search criteria",
          variant: "default",
        })
      }
    } catch (error) {
      console.error("Error:", error)
      setError("Failed to search assets. Please try again.")
      toast({
        title: "Error",
        description: "Failed to search assets",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      assetId: "",
      assetName: "",
      scheme: "",
      agency: "",
      type: "All",
      minAmount: "",
      maxAmount: "",
      dateFrom: "",
      dateTo: "",
      natureOfWork: "",
    })
    setAssets([])
    setSearched(false)
    setPagination({
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    })
    setError(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto py-8 animate-fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">Asset Search</h2>
            <p className="text-muted-foreground">Search and filter assets using advanced criteria</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="overflow-hidden border-t border-l border-r border-b border-gray-200 dark:border-gray-800 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800/50 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-primary" />
              <CardTitle>Search Filters</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSearch(1)
              }}
              className="space-y-6"
            >
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Basic Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assetId">Asset ID</Label>
                    <Input
                      id="assetId"
                      value={formData.assetId}
                      onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
                      className="transition-all duration-200"
                      placeholder="Enter asset ID"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assetName">Asset Name</Label>
                    <Input
                      id="assetName"
                      value={formData.assetName}
                      onChange={(e) => setFormData({ ...formData, assetName: e.target.value })}
                      className="transition-all duration-200"
                      placeholder="Enter asset name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scheme">Scheme</Label>
                    <Input
                      id="scheme"
                      value={formData.scheme}
                      onChange={(e) => setFormData({ ...formData, scheme: e.target.value })}
                      className="transition-all duration-200"
                      placeholder="Enter scheme"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Filters */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Additional Filters</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="agency">Implementing Agency</Label>
                    <Input
                      id="agency"
                      value={formData.agency}
                      onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                      className="transition-all duration-200"
                      placeholder="Enter agency name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Development Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger className="transition-all duration-200">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Types</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Repair">Repair</SelectItem>
                        <SelectItem value="Extension">Extension</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="natureOfWork">Nature of Work</Label>
                    <Input
                      id="natureOfWork"
                      value={formData.natureOfWork}
                      onChange={(e) => setFormData({ ...formData, natureOfWork: e.target.value })}
                      className="transition-all duration-200"
                      placeholder="Enter nature of work"
                    />
                  </div>
                </div>
              </div>

              {/* Amount Range */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Amount Range & Date</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minAmount">Min Amount</Label>
                      <Input
                        id="minAmount"
                        type="number"
                        value={formData.minAmount}
                        onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                        className="transition-all duration-200"
                        placeholder="₹0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxAmount">Max Amount</Label>
                      <Input
                        id="maxAmount"
                        type="number"
                        value={formData.maxAmount}
                        onChange={(e) => setFormData({ ...formData, maxAmount: e.target.value })}
                        className="transition-all duration-200"
                        placeholder="₹999999"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateFrom">Date From</Label>
                      <Input
                        id="dateFrom"
                        type="date"
                        value={formData.dateFrom}
                        onChange={(e) => setFormData({ ...formData, dateFrom: e.target.value })}
                        className="transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateTo">Date To</Label>
                      <Input
                        id="dateTo"
                        type="date"
                        value={formData.dateTo}
                        onChange={(e) => setFormData({ ...formData, dateTo: e.target.value })}
                        className="transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="transition-all duration-200 hover:bg-primary/5"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {searched && (
          <Card className="mt-6 overflow-hidden border-t border-l border-r border-b border-gray-200 dark:border-gray-800 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800/50 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Search className="h-5 w-5 text-primary" />
                  <CardTitle>Search Results</CardTitle>
                </div>
                <div className="text-sm text-muted-foreground">Found {pagination.total} results</div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-b-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Asset ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Scheme</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Nature of Work</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Searching assets...</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : assets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <Search className="h-8 w-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">No assets found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      assets.map((asset) => (
                        <TableRow key={asset.id} className="hover:bg-muted/50 transition-colors">
                          <TableCell className="font-mono">{asset.asset_id}</TableCell>
                          <TableCell className="font-medium">{asset.asset_name}</TableCell>
                          <TableCell>{asset.scheme}</TableCell>
                          <TableCell className="font-mono">₹{asset.amount_spent.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`
                                transition-colors duration-150
                                ${
                                  asset.development_type === "Maintenance"
                                    ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
                                    : asset.development_type === "Repair"
                                      ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800"
                                      : "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                                }
                              `}
                            >
                              {asset.development_type}
                            </Badge>
                          </TableCell>
                          <TableCell>{asset.nature_of_work}</TableCell>
                          <TableCell>{asset.created_by_name}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/assets/${asset.id}`)}
                              className="hover:bg-primary/5"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {assets.length > 0 && (
                <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="text-sm text-muted-foreground">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSearch(pagination.page - 1)}
                      disabled={pagination.page === 1 || loading}
                      className="transition-all duration-200 hover:bg-primary/5"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSearch(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages || loading}
                      className="transition-all duration-200 hover:bg-primary/5"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

