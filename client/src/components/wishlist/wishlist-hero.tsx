
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function WishlistHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div className="relative h-64 overflow-hidden bg-gradient-to-r from-purple-800 to-indigo-900">
      <motion.div
        className="absolute inset-0 opacity-50"
        animate={{
          backgroundPosition: `${mousePosition.x / 5}px ${mousePosition.y / 5}px`,
        }}
        style={{
          backgroundImage: 'url("/placeholder.svg?height=400&width=400")',
          backgroundSize: "400px 400px",
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="relative h-full flex items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold text-white text-center"
        >
          Your Wishlist
        </motion.h1>
      </div>
    </div>
  )
}

