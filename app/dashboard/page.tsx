"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentAssets } from "@/components/recent-assets"
import { TopNav } from "@/components/top-nav"
import { useEffect, useState } from "react"
import { ArrowDown, ArrowUp, Building2, Clock, DollarSign, FileStack } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"

interface DashboardStats {
  totalAssets: number
  monthlyAssets: number
  pendingInspection: number
  totalAmount: number
  data: Array<{
    completion_date: string
    amount_spent: number
  }>
}

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/dashboard/stats")
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setStats(data)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const StatCard = ({
    title,
    value,
    icon: Icon,
    change,
    trend,
    subtitle,
    gradient,
    onClick,
  }: {
    title: string
    value: number | undefined
    icon: any
    change?: number
    trend?: "up" | "down"
    subtitle?: string
    gradient: string
    onClick?: () => void
  }) => (
    <Card
      className={`hover:shadow-lg transition-all duration-300 overflow-hidden border-0 relative group ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <div className={`absolute inset-0 ${gradient} opacity-90 animate-gradient`} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
        <CardTitle className="text-sm font-medium text-white">{title}</CardTitle>
        <Icon className="h-4 w-4 text-white" />
      </CardHeader>
      <CardContent className="relative">
        {loading ? (
          <>
            <Skeleton className="h-8 w-24 bg-white/20" />
            <Skeleton className="h-4 w-32 mt-2 bg-white/20" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold text-white">
              {title.includes("Amount") ? `₹${(value || 0).toLocaleString()}` : value}
            </div>
            <p className="text-xs text-white/80 mt-1">
              {change && (
                <span className={`text-white inline-flex items-center font-medium`}>
                  {trend === "up" ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                  {change}%
                </span>
              )}{" "}
              {subtitle}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-white">
      <TopNav />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Assets"
            value={stats?.totalAssets}
            icon={FileStack}
            change={12}
            trend="up"
            subtitle="from last month"
            gradient="bg-gradient-to-br from-blue-400 to-indigo-500"
            onClick={() => router.push("/assets/all")}
          />
          <StatCard
            title="This Month"
            value={stats?.monthlyAssets}
            icon={Building2}
            change={4}
            trend="down"
            subtitle="from previous month"
            gradient="bg-gradient-to-br from-emerald-400 to-teal-500"
          />
          <StatCard
            title="Pending Inspection"
            value={stats?.pendingInspection}
            icon={Clock}
            subtitle="Requires immediate attention"
            gradient="bg-gradient-to-br from-orange-400 to-pink-500"
          />
          <StatCard
            title="Total Amount"
            value={stats?.totalAmount}
            icon={DollarSign}
            change={8}
            trend="up"
            subtitle="from last quarter"
            gradient="bg-gradient-to-br from-violet-400 to-purple-500"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-[350px] w-full" />
                </div>
              ) : (
                <Overview data={stats?.data || []} />
              )}
            </CardContent>
          </Card>
          <Card className="col-span-3 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle>Recent Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentAssets />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

