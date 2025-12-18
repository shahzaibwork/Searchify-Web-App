//@ts-nocheck
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"

// Enhanced custom colors for a more premium look
const customColors = {
  productA: "#6366F1", // Indigo
  productB: "#8B5CF6", // Purple
  productALight: "rgba(99, 102, 241, 0.2)", // Light indigo for backgrounds
  productBLight: "rgba(139, 92, 246, 0.2)", // Light purple for backgrounds
  background: "#1F2937", // Dark navy
  text: "#F9FAFB", // Light text
  muted: "#9CA3AF", // Muted text
  grid: "#374151", // Grid lines
  cardBg: "rgba(17, 24, 39, 0.7)", // Card background with transparency
}

export function Chart({ product1Values, product2Values, product1Title, product2Title }) {
  // Format product titles to be shorter if needed
  const formatTitle = (title) => {
    return title.length > 15 ? title.substring(0, 15) + "..." : title
  }

  const p1Title = formatTitle(product1Title)
  const p2Title = formatTitle(product2Title)

  const chartConfig = {
    productA: {
      label: p1Title,
      color: customColors.productA,
    },
    productB: {
      label: p2Title,
      color: customColors.productB,
    },
  }

  const ratingsData = [
    {
      name: "Seller Rating",
      category: "Seller Rating",
      productA: product1Values.sellerRating,
      productB: product2Values.sellerRating,
    },
    {
      name: "Customer Rating",
      category: "Customer Rating",
      productA: product1Values.customerRating,
      productB: product2Values.customerRating,
    },
  ]

  const metricsData = [
    {
      name: "Price ($)",
      category: "Price ($)",
      productA: product1Values.currentPrice,
      productB: product2Values.currentPrice,
    },
    {
      name: "Seller Reviews",
      category: "Seller Reviews",
      productA: product1Values.sellerReviews,
      productB: product2Values.sellerReviews,
    },
    {
      name: "Customer Reviews",
      category: "Customer Reviews",
      productA: product1Values.customerReviews,
      productB: product2Values.customerReviews,
    },
  ]

  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 overflow-hidden shadow-xl">
        <CardHeader className="border-b border-gray-700/50 pb-4">
          <CardTitle className="text-gray-100 text-xl">Ratings Comparison</CardTitle>
          <CardDescription className="text-gray-400">Product ratings on a scale of 1-5</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingsData} layout="vertical" barCategoryGap={24} margin={{ right: 30 }}>
                <defs>
                  <linearGradient id="colorProductA" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#4F46E5" />
                  </linearGradient>
                  <linearGradient id="colorProductB" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
                <CartesianGrid horizontal={false} stroke={customColors.grid} strokeDasharray="4 4" />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                  domain={[0, 5]}
                  ticks={[0, 1, 2, 3, 4, 5]}
                  tick={{ fill: customColors.muted }}
                />
                <YAxis
                  dataKey="category"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                  width={120}
                  tick={{ fill: customColors.muted }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(31, 41, 55, 0.95)",
                    borderColor: "rgba(75, 85, 99, 0.5)",
                    borderRadius: "0.5rem",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                    color: "#F9FAFB",
                  }}
                  formatter={(value) => [value.toFixed(1), "Rating"]}
                  labelFormatter={(label) => `${label}`}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  wrapperStyle={{ paddingBottom: "10px" }}
                  formatter={(value) => <span style={{ color: "#D1D5DB" }}>{value}</span>}
                />
                <Bar
                  dataKey="productA"
                  fill="url(#colorProductA)"
                  radius={[4, 4, 4, 4]}
                  name={p1Title}
                  animationDuration={1500}
                  barSize={24}
                />
                <Bar
                  dataKey="productB"
                  fill="url(#colorProductB)"
                  radius={[4, 4, 4, 4]}
                  name={p2Title}
                  animationDuration={1500}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 overflow-hidden shadow-xl">
        <CardHeader className="border-b border-gray-700/50 pb-4">
          <CardTitle className="text-gray-100 text-xl">Price and Reviews Comparison</CardTitle>
          <CardDescription className="text-gray-400">Product price and review count comparison</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricsData} layout="vertical" barCategoryGap={24} margin={{ right: 30 }}>
                <defs>
                  <linearGradient id="colorProductA2" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#4F46E5" />
                  </linearGradient>
                  <linearGradient id="colorProductB2" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
                <CartesianGrid horizontal={false} stroke={customColors.grid} strokeDasharray="4 4" />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                  tick={{ fill: customColors.muted }}
                />
                <YAxis
                  dataKey="category"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                  width={120}
                  tick={{ fill: customColors.muted }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(31, 41, 55, 0.95)",
                    borderColor: "rgba(75, 85, 99, 0.5)",
                    borderRadius: "0.5rem",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                    color: "#F9FAFB",
                  }}
                  formatter={(value, name, props) => {
                    const category = props.payload.category
                    if (category?.includes("Price")) {
                      return [`$${value.toFixed(2)}`, "Price"]
                    }
                    return [value.toLocaleString(), "Count"]
                  }}
                  labelFormatter={(label) => `${label}`}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  wrapperStyle={{ paddingBottom: "10px" }}
                  formatter={(value) => <span style={{ color: "#D1D5DB" }}>{value}</span>}
                />
                <Bar
                  dataKey="productA"
                  fill="url(#colorProductA2)"
                  radius={[4, 4, 4, 4]}
                  name={p1Title}
                  animationDuration={1500}
                  barSize={24}
                />
                <Bar
                  dataKey="productB"
                  fill="url(#colorProductB2)"
                  radius={[4, 4, 4, 4]}
                  name={p2Title}
                  animationDuration={1500}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

