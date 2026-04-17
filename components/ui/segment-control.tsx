"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SegmentOption {
  value: string
  label: string
}

interface SegmentControlProps {
  value: string
  onValueChange: (value: string) => void
  options: SegmentOption[]
  className?: string
}

export function SegmentControl({
  value,
  onValueChange,
  options,
  className,
}: SegmentControlProps) {
  const [position, setPosition] = useState({ left: 0, width: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  useEffect(() => {
    const activeButton = buttonRefs.current.get(value)
    if (activeButton && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const buttonRect = activeButton.getBoundingClientRect()
      
      setPosition({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
      })
    }
  }, [value])

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex items-center rounded-lg border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-700 dark:bg-zinc-900/40",
        className
      )}
      role="group"
      data-slot="button-group"
    >
      {/* Sliding Indicator Background */}
      <div
        className="absolute rounded-md bg-white shadow-sm transition-all duration-300 ease-out dark:bg-zinc-800"
        style={{
          left: `${position.left}px`,
          width: `${position.width}px`,
          top: "4px",
          bottom: "4px",
          pointerEvents: "none",
        }}
      />

      {/* Buttons */}
      {options.map((option) => (
        <button
          key={option.value}
          ref={(el) => {
            if (el) buttonRefs.current.set(option.value, el)
          }}
          type="button"
          onClick={() => onValueChange(option.value)}
          className={cn(
            "relative flex-1 px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-300 z-10",
            value === option.value
              ? "text-blue-600 dark:text-blue-400"
              : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
