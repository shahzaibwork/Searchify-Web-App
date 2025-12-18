//@ts-nocheck

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function SearchBar({ onSearch }) {
  return (
    <div className="max-w-2xl mx-auto mb-12 ">
      <div className="relative">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg blur" />
          <div className="relative bg-gray-900/60 backdrop-blur-xl rounded-lg p-1">
            <div className="flex items-center">
              <Search className="h-5 w-5 text-gray-400 ml-3" />
              <Input
                onChange={(e) => onSearch(e.target.value)}
                type="text"
                placeholder="Search your wishlist..."
                className="flex-1 bg-transparent border-none text-gray-100 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

