"use client"

import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface Asset {
  asset_id: string
  asset_name: string
  development_type: 'Maintenance' | 'Repair' | 'Extension'
  amount_spent: number
  created_at: string
}

// Helper function to get badge styling based on development type
function getBadgeStyles(type: Asset['development_type']) {
  switch (type) {
    case 'Maintenance':
      return 'bg-blue-50 text-blue-700 hover:bg-blue-50'
    case 'Repair':
      return 'bg-yellow-50 text-yellow-700 hover:bg-yellow-50'
    case 'Extension':
      return 'bg-green-50 text-green-700 hover:bg-green-50'
    default:
      return 'bg-gray-50 text-gray-700 hover:bg-gray-50'
  }
}

export function RecentAssets() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecentAssets = async () => {
      try {
        const res = await fetch('/api/assets/recent')
        if (!res.ok) throw new Error('Failed to fetch recent assets')
        const data = await res.json()
        setAssets(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch recent assets')
        console.error('Error fetching recent assets:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentAssets()
  }, [])

  if (error) {
    return (
      <div className="text-sm text-red-500 p-4">
        Error loading recent assets: {error}
      </div>
    )
  }

  if (loading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(3)].map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-4 w-[120px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[100px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-[80px]" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Asset</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assets.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center text-muted-foreground">
              No recent assets found
            </TableCell>
          </TableRow>
        ) : (
          assets.map((asset) => (
            <TableRow key={asset.asset_id}>
              <TableCell className="font-medium">{asset.asset_name}</TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={getBadgeStyles(asset.development_type)}
                >
                  {asset.development_type}
                </Badge>
              </TableCell>
              <TableCell>₹{asset.amount_spent.toLocaleString()}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
