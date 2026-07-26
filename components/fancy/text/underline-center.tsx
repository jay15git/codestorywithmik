"use client"

import { ElementType, useEffect, useMemo, useRef, useState } from "react"
import { motion, ValueAnimationTransition } from "motion/react"
import { cn } from "@/lib/utils"

interface UnderlineProps {
  /**
   * The content to be displayed and animated
   */
  children: React.ReactNode

  /**
   * HTML Tag to render the component as
   * @default span
   */
  as?: ElementType

  /**
   * Optional class name for styling
   */
  className?: string

  /**
   * Animation transition configuration
   * @default { duration: 0.25, ease: "easeInOut" }
   */
  transition?: ValueAnimationTransition

  /**
   * Height of the underline as a ratio of font size
   * @default 0.1
   */
  underlineHeightRatio?: number

  /**
   * Padding of the underline as a ratio of font size
   * @default 0.01
   */
  underlinePaddingRatio?: number

  /**
   * When set, controls underline visibility externally (e.g. parent card hover)
   * instead of hover on the element itself
   */
  active?: boolean
}

const CenterUnderline = ({
  children,
  as,
  className,
  transition = { duration: 0.25, ease: "easeInOut" },
  underlineHeightRatio = 0.1,
  underlinePaddingRatio = 0.01,
  active,
  ...props
}: UnderlineProps) => {
  const textRef = useRef<HTMLElement>(null)
  const MotionComponent = useMemo(() => motion.create(as ?? "span"), [as])
  const [underlineMetrics, setUnderlineMetrics] = useState({
    height: 2,
    padding: 1,
  })

  useEffect(() => {
    const updateUnderlineStyles = () => {
      if (!textRef.current) {
        return
      }

      const fontSize = parseFloat(getComputedStyle(textRef.current).fontSize)
      setUnderlineMetrics({
        height: fontSize * underlineHeightRatio,
        padding: fontSize * underlinePaddingRatio,
      })
    }

    updateUnderlineStyles()
    window.addEventListener("resize", updateUnderlineStyles)

    return () => window.removeEventListener("resize", updateUnderlineStyles)
  }, [underlineHeightRatio, underlinePaddingRatio])

  const hiddenBackgroundSize = `0% ${underlineMetrics.height}px`
  const visibleBackgroundSize = `100% ${underlineMetrics.height}px`

  const interactionProps =
    active !== undefined
      ? {
          initial: { backgroundSize: hiddenBackgroundSize },
          animate: {
            backgroundSize: active ? visibleBackgroundSize : hiddenBackgroundSize,
          },
          transition,
        }
      : {
          initial: { backgroundSize: hiddenBackgroundSize },
          whileHover: { backgroundSize: visibleBackgroundSize },
          transition,
        }

  return (
    <MotionComponent
      className={cn(
        "inline [box-decoration-break:clone] [-webkit-box-decoration-break:clone]",
        active === undefined && "cursor-pointer",
        className,
      )}
      ref={textRef}
      style={{
        backgroundImage: "linear-gradient(currentColor, currentColor)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center bottom",
        paddingBottom: underlineMetrics.padding,
      }}
      {...interactionProps}
      {...props}
    >
      {children}
    </MotionComponent>
  )
}

CenterUnderline.displayName = "CenterUnderline"

export default CenterUnderline
