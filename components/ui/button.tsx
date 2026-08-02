import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { type VariantProps } from "class-variance-authority"

import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"

function Button({
  className,
  variant = "default",
  size = "default",
  static: isStatic = false,
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & { static?: boolean }) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-cuelume-press={isStatic ? undefined : ""}
      data-cuelume-release={isStatic ? undefined : ""}
      className={cn(
        buttonVariants({ variant, size, static: isStatic, className })
      )}
      {...props}
    />
  )
}

export { Button }
