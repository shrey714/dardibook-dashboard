import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      effect: {
        expandIcon: "group gap-0 relative",
        ringHover:
          "transition-all duration-300 hover:ring-2 hover:ring-primary/90 hover:ring-offset-2",
        underline:
          "relative !no-underline after:absolute after:bg-primary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-left after:scale-x-100 hover:after:origin-bottom-right hover:after:scale-x-0 after:transition-transform after:ease-in-out after:duration-300",
        hoverUnderline:
          "relative !no-underline after:absolute after:bg-primary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface LoadingProps {
  loading?: boolean;
  loadingText?: string;
  hideIconOnLoading?: boolean;
  loadingIconPlacement?: "left" | "right";
}

interface IconProps {
  icon: React.ElementType;
  iconPlacement: "left" | "right";
}
interface IconRefProps {
  icon?: never;
  iconPlacement?: undefined;
}
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export type ButtonIconProps = IconProps | IconRefProps;
export type ButtonLoadingProps = LoadingProps;

const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & ButtonIconProps & ButtonLoadingProps
>(
  (
    {
      className,
      variant,
      effect,
      size,
      icon: Icon,
      iconPlacement,
      loading,
      loadingText,
      loadingIconPlacement = "right",
      hideIconOnLoading = true,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, effect, size, className }))}
        disabled={loading}
        ref={ref}
        {...props}
      >
        {loading && loadingIconPlacement === "left" && (
          <Spinner variant={variant || "default"} />
        )}
        {Icon &&
          iconPlacement === "left" &&
          !(hideIconOnLoading && loading) &&
          (effect === "expandIcon" ? (
            <div className="w-0 translate-x-[0%] pr-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-100 group-hover:pr-2 group-hover:opacity-100">
              <Icon />
            </div>
          ) : (
            <Icon />
          ))}
        <Slottable>{loading ? loadingText : props.children}</Slottable>
        {loading && loadingIconPlacement === "right" && (
          <Spinner variant={variant || "default"} />
        )}
        {Icon &&
          iconPlacement === "right" &&
          !(hideIconOnLoading && loading) &&
          (effect === "expandIcon" ? (
            <div className="w-0 translate-x-[100%] pl-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-2 group-hover:opacity-100">
              <Icon />
            </div>
          ) : (
            <Icon />
          ))}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
