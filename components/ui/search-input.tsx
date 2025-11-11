"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchInputProps {
  placeholder?: string
  className?: string
  onSearch?: (value: string) => void
}

export function SearchInput({ 
  placeholder = "Search API...", 
  className = "",
  onSearch 
}: SearchInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value)
    }
  }

  return (
    <div className={`relative w-full md:w-auto mt-3 md:mt-0 ${className}`}>
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        onChange={handleChange}
        className="w-full rounded-2xl pl-9 md:w-[200px]"
      />
    </div>
  )
}
