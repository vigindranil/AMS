"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Asset {
  id: number
  asset_id: string
  asset_name: string
  scheme: string
  latitude: number
  longitude: number
  amount_spent: number
  development_type: string
}

export default function AssetsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const params = new URLSearchParams({
          search: searchTerm,
          type: filterType,
        })
        const res = await fetch(`/api/assets?${params}`)
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setAssets(data)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(fetchAssets, 300)
    return () => clearTimeout(debounce)
  }, [searchTerm, filterType])

  const handleExport = async () => {
    // Implement CSV export
    const csv = assets.map((asset) => Object.values(asset).join(",")).join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "assets.csv"
    a.click()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search assets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-[300px]"
        />
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="md:w-[200px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Maintenance">Maintenance</SelectItem>
            <SelectItem value="Repair">Repair</SelectItem>
            <SelectItem value="Extension">Extension</SelectItem>
          </SelectContent>
        </Select>
        <Button className="ml-auto" onClick={handleExport}>
          Export
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Scheme</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : assets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No assets found
                </TableCell>
              </TableRow>
            ) : (
              assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>{asset.asset_id}</TableCell>
                  <TableCell>{asset.asset_name}</TableCell>
                  <TableCell>{asset.scheme}</TableCell>
                  <TableCell>{`${asset.latitude}, ${asset.longitude}`}</TableCell>
                  <TableCell>₹{asset.amount_spent.toLocaleString()}</TableCell>
                  <TableCell>{asset.development_type}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/assets/${asset.id}`)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

