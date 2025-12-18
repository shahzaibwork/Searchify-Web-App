
//@ts-nocheck
import { ArrowRight, LucideArrowLeft, Star, Check, Award, TrendingUp, ShieldCheck } from "lucide-react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Loader from "@/components/loader"
import { Link, useNavigate } from "react-router-dom"
import { Chart } from "@/components/comparisonPage/Chart"
import { Badge } from "@/components/ui/badge"

interface Product {
  name: string
  image: string
  price: string
  description: string
}

interface FeatureComparison {
  name: string
  description1: string
  description2: string
}

export default function ModernProductComparison() {
  const navigate = useNavigate()
  const { compareProducts, currentPage } = useSelector((state) => state.product)
  const [compareCards, setCompareCards] = useState([])
  const [product1Features, setProduct1Features] = useState([])
  const [product2Features, setProduct2Features] = useState([])
  const [product1Values, setProduct1Values] = useState({})
  const [product2Values, setProduct2Values] = useState({})
  const [AIRecommendations, setAIRecommendations] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [winnerProduct, setWinnerProduct] = useState(null)

  const getProductCards = async () => {
    setIsLoading(true)

    try {
      const res = await axios.post(`http://localhost:3000/api/products/compare`, compareProducts)

      const data = res.data
      setIsLoading(false)

      if (data) {
        setCompareCards([data.compareProduct1, data.compareProduct2])

        const { AIResponse } = data
        const { product1, product2 } = AIResponse

        setProduct1Features(product1.features)
        setProduct2Features(product2.features)

        const { currentPrice, customerRating, customerReviews, sellerRating, sellerReviews } = product1
        const {
          currentPrice: cp,
          customerRating: cr,
          customerReviews: crs,
          sellerRating: sr,
          sellerReviews: srs,
        } = product2

        setProduct1Values({
          currentPrice,
          customerRating,
          customerReviews,
          sellerRating,
          sellerReviews,
        })

        setProduct2Values({
          currentPrice: cp,
          customerRating: cr,
          customerReviews: crs,
          sellerRating: sr,
          sellerReviews: srs,
        })

        // Determine which product is better overall
        const p1Rating = (Number.parseFloat(customerRating) || 0 + Number.parseFloat(sellerRating) || 0) / 2
        const p2Rating = (Number.parseFloat(cr) || 0 + Number.parseFloat(sr) || 0) / 2

        setWinnerProduct(p1Rating > p2Rating ? 0 : 1)
      }
    } catch (err) {
      setIsLoading(false)
      navigate("/")
      console.error("Err fetching compare products: ", err)
    }
  }

  const handleBack = () => {
    navigate(`/?page=${currentPage}`)
  }

  useEffect(() => {
    getProductCards()
  }, [])

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button
          variant="ghost"
          className="mb-6 text-white font-medium hover:bg-gray-800/80 group transition-all duration-300"
          onClick={handleBack}
        >
          <LucideArrowLeft className="mr-2 h-4 w-4 text-white group-hover:translate-x-[-2px] transition-transform" />
          Back to Products
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-purple-600 text-transparent bg-clip-text mb-3">
            Product Comparison
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Compare features, specifications, and value to make the best choice for your needs
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 relative">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-10">
                <div className="bg-gray-800 rounded-full p-3 shadow-lg">
                  <ArrowRight className="w-6 h-6 text-purple-400" />
                </div>
              </div>

              {compareCards.map((product, index) => (
                <ProductCard
                  key={index}
                  product={product}
                  isWinner={winnerProduct === index}
                  rating={index === 0 ? product1Values.customerRating : product2Values.customerRating}
                  reviews={index === 0 ? product1Values.customerReviews : product2Values.customerReviews}
                />
              ))}
            </div>

            <div className="space-y-10 mb-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text inline-block">
                  Feature Comparison
                </h2>
                <p className="text-gray-300 mt-2">See how these products stack up against each other</p>
              </div>

              {product1Features?.map((feature, index) => {
                const feature2 = product2Features[index]
                return (
                  <FeatureComparisonCard
                    key={index}
                    product1Title={compareProducts[0].title}
                    product2Title={compareProducts[1].title}
                    feature1={feature}
                    feature2={feature2}
                    isReversed={index % 2 !== 0}
                  />
                )
              })}
            </div>

            <div className="mb-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text inline-block">
                  Performance Metrics
                </h2>
                <p className="text-gray-300 mt-2">Compare ratings, price, and popularity</p>
              </div>

              <Chart
                product1Title={compareProducts[0].title}
                product2Title={compareProducts[1].title}
                product1Values={product1Values}
                product2Values={product2Values}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {compareCards.map((product, index) => (
                <div key={index} className="flex justify-center">
                  <Link to={`/products/${product?.title}?id=${product?.id}`}>
                    <Button
                      variant="custom"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-6 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                    >
                      {index === winnerProduct ? (
                        <>
                          <Award className="mr-2 h-5 w-5" />
                          Get the {product?.title} Now
                        </>
                      ) : (
                        <>Learn More About {product?.title}</>
                      )}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function ProductCard({ product, isWinner, rating, reviews }) {
  return (
    <Card
      className={`bg-gray-800/60 backdrop-blur-lg border-gray-700 hover:border-purple-500/50 transition-all duration-300 overflow-hidden ${isWinner ? "ring-2 ring-purple-500 shadow-lg shadow-purple-500/20" : ""}`}
    >
      <CardContent className="p-8">
        <div className="flex flex-col items-center">
          {isWinner && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold mb-4 py-1 px-3">
              <Award className="w-4 h-4 mr-1" /> Recommended Choice
            </Badge>
          )}

          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-blue-500/20 rounded-full blur-xl opacity-70"></div>
            <img
              src={product?.imageUrl || "/placeholder.svg"}
              alt={product?.title}
              width={200}
              height={200}
              className="relative z-10 mx-auto rounded-full shadow-lg object-cover w-[180px] h-[180px]"
            />
          </div>

          <h2 className="text-2xl font-bold mb-2 text-center">{product?.title}</h2>

          <div className="flex justify-center mb-4">
          <Badge className="bg-blue-500/20 text-blue-400 border border-blue-400/50">
           Source: {product?.source || "Unknown"}
         </Badge>
          </div>


          <div className="flex items-center mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}`}
              />
            ))}
            <span className="ml-2 text-gray-300">
              {rating} ({reviews} reviews)
            </span>
          </div>

          <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
            {product?.price}
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4 mb-6 text-gray-300">
            <p className="text-center">{product?.description}</p>
          </div>

          <div className="w-full space-y-3 mb-6">
            <div className="flex items-start">
              <ShieldCheck className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300">Premium quality materials</span>
            </div>
            <div className="flex items-start">
              <Check className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300">30-day money-back guarantee</span>
            </div>
            <div className="flex items-start">
              <TrendingUp className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300">Top-rated customer support</span>
            </div>
          </div>

          <Link to={`/products/${product?.title}?id=${product?.id}`} className="w-full">
            <Button
              variant="custom"
              className={`w-full ${isWinner ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" : "bg-gray-700 hover:bg-gray-600"} transition-all duration-300`}
            >
              {isWinner ? "Best Choice - Learn More" : "Learn More"}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}


const isFeatureBetter = (feature1, feature2) => {
  const details1 = feature1?.details || "";
  const details2 = feature2?.details || "";

  // Extract numbers from details (if any)
  const extractNumbers = (text) => {
    const numbers = text.match(/\d+/g) || [];
    return numbers.map(Number);
  };

  const numbers1 = extractNumbers(details1);
  const numbers2 = extractNumbers(details2);

  // Compare numeric values if both features have numbers
  if (numbers1.length > 0 && numbers2.length > 0) {
    const max1 = Math.max(...numbers1);
    const max2 = Math.max(...numbers2);
    return max1 > max2;
  }

  // Fallback to comparing the length of details (for descriptive text)
  return details1.length > details2.length;
};

function FeatureComparisonCard({ feature1, feature2, isReversed, product1Title, product2Title }) {
  // Determine which feature is better (simplified logic - could be more sophisticated)
  const feature1IsBetter = isFeatureBetter(feature1, feature2);
  const feature2IsBetter = isFeatureBetter(feature2, feature1);

  return (
    <Card className="bg-gray-800/40 backdrop-blur-xl border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-300">
      <CardContent className="p-6">
        <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
          {feature1?.feature}
        </h3>

        <div
          className={`grid grid-cols-1 ${isReversed ? "md:grid-cols-[1fr_auto_1fr]" : "md:grid-cols-[1fr_auto_1fr]"} gap-6`}
        >
          <div className={`flex-1 bg-gray-900/30 p-5 rounded-lg ${feature1IsBetter ? "ring-2 ring-green-500/30" : ""}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold">{product1Title}</h4>
              {feature1IsBetter && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <Check className="w-3 h-3 mr-1" /> Better
                </Badge>
              )}
            </div>
            <p className="text-gray-300">{feature1?.details}</p>
          </div>

          <div className="hidden md:flex items-center justify-center">
            <div className="h-full w-px bg-gray-700"></div>
          </div>

          <div className={`flex-1 bg-gray-900/30 p-5 rounded-lg ${feature2IsBetter ? "ring-2 ring-green-500/30" : ""}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold">{product2Title}</h4>
              {feature2IsBetter && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <Check className="w-3 h-3 mr-1" /> Better
                </Badge>
              )}
            </div>
            <p className="text-gray-300">{feature2?.details}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

