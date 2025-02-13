"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TopNav } from "@/components/top-nav"
import { Edit, FileSpreadsheet, Plus, Download, MapIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { AssetMap } from "@/components/asset-map"
import type { ColumnDef } from "@tanstack/react-table"

interface Asset {
  id: number
  asset_id: string
  asset_name: string
  scheme: string
  implementing_agency: string
  latitude: number
  longitude: number
  amount_spent: number
  development_type: string
  created_at: string
  created_by_name: string
}

export default function AllAssetsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [isMapOpen, setIsMapOpen] = useState(false)

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await fetch("/api/assets")
        if (!res.ok) throw new Error("Failed to fetch assets")
        const data = await res.json()
        setAssets(data.data || [])
      } catch (error) {
        console.error("Error:", error)
        toast({
          title: "Error",
          description: "Failed to fetch assets. Please try again.",
          variant: "destructive",
        })
        setAssets([])
      } finally {
        setLoading(false)
      }
    }

    fetchAssets()
  }, [toast])

  const handleExport = () => {
    // Convert assets to CSV
    const headers = ["Asset ID", "Name", "Scheme", "Agency", "Amount", "Type", "Created By"]
    const csvContent = [
      headers,
      ...assets.map((asset) => [
        asset.asset_id,
        asset.asset_name,
        asset.scheme,
        asset.implementing_agency,
        asset.amount_spent,
        asset.development_type,
        asset.created_by_name,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `assets-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const columns: ColumnDef<Asset>[] = [
    {
      accessorKey: "asset_id",
      header: "Asset ID",
    },
    {
      accessorKey: "asset_name",
      header: "Name",
      cell: ({ row }) => <div className="font-medium">{row.getValue("asset_name")}</div>,
    },
    {
      accessorKey: "scheme",
      header: "Scheme",
    },
    {
      accessorKey: "implementing_agency",
      header: "Agency",
    },
    {
      accessorKey: "amount_spent",
      header: "Amount",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("amount_spent"))
        return <div className="font-medium tabular-nums">₹{amount.toLocaleString()}</div>
      },
    },
    {
      accessorKey: "development_type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("development_type") as string
        return (
          <Badge
            variant="outline"
            className={`
              transition-colors duration-150
              ${
                type === "Maintenance"
                  ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
                  : type === "Repair"
                    ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800"
                    : "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
              }
            `}
          >
            {type}
          </Badge>
        )
      },
    },
    {
      accessorKey: "created_by_name",
      header: "Created By",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const asset = row.original
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedAsset(asset)
                setIsMapOpen(true)
              }}
              className="hover:bg-primary/5"
              disabled={!asset.latitude || !asset.longitude}
              title={!asset.latitude || !asset.longitude ? "No location data available" : "View on map"}
            >
              <MapIcon className="h-4 w-4 mr-2" />
              Map
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/assets/edit/${asset.id}`)}
              className="hover:bg-primary/5"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto py-8 animate-fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">Assets</h2>
            <p className="text-muted-foreground">Manage and track all your assets in one place</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleExport} className="transition-all duration-200 hover:bg-primary/5">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={() => router.push("/assets/new")}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden border-t border-l border-r border-b border-gray-200 dark:border-gray-800 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800/50 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              <CardTitle>All Assets</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-b-lg overflow-hidden">
              <DataTable columns={columns} data={assets} searchColumn="asset_name" isLoading={loading} />
            </div>
          </CardContent>
        </Card>
        <AssetMap
          asset={selectedAsset}
          isOpen={isMapOpen}
          onClose={() => {
            setIsMapOpen(false)
            setSelectedAsset(null)
          }}
        />
      </div>
    </div>
  )
}

