import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, BarChart3, MapPin, ClipboardList } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent opacity-50 animate-aurora" />
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <div className="inline-block animate-fade-in-up">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                Asset Management System
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
                Transform your asset tracking with our powerful and intuitive management solution
              </p>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            <Card className="group bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-300 animate-fade-in-up [animation-delay:200ms]">
              <CardContent className="p-6">
                <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold mb-2 text-white group-hover:text-purple-300 transition-colors">
                  Smart Asset Tracking
                </h2>
                <p className="text-gray-400">
                  Advanced analytics and real-time monitoring for comprehensive asset management and insights.
                </p>
              </CardContent>
            </Card>

            <Card className="group bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-300 animate-fade-in-up [animation-delay:400ms]">
              <CardContent className="p-6">
                <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold mb-2 text-white group-hover:text-blue-300 transition-colors">
                  Precision Location Mapping
                </h2>
                <p className="text-gray-400">
                  Track assets with GPS accuracy and get detailed inspection reports with location data.
                </p>
              </CardContent>
            </Card>

            <Card className="group bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-300 animate-fade-in-up [animation-delay:600ms]">
              <CardContent className="p-6">
                <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold mb-2 text-white group-hover:text-emerald-300 transition-colors">
                  Comprehensive Reports
                </h2>
                <p className="text-gray-400">
                  Generate detailed analytics and reports for data-driven decision making and planning.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center animate-fade-in-up [animation-delay:800ms]">
            <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white">
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-gray-700 hover:bg-gray-800 text-gray-300"
                >
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

