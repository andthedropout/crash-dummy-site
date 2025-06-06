"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-neutral-800 border border-neutral-700">
      <SliderPrimitive.Range className="absolute h-full bg-[var(--slider-range-color,#39FF14)]" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className={cn(
        "block h-5 w-5 rounded-full border-2 border-neutral-700 bg-neutral-100 ring-offset-neutral-900 transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:ring-[var(--slider-focus-color,#39FF14)]"
     )} />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider } 