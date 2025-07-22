import { Ref, RefObject, useImperativeHandle, useMemo, useRef } from "react";
import { useDataScrollOverflow, UseDataScrollOverflowProps } from "./useDataScrollOverflow";

type ScrollShadowVariantProps = {
  orientation?: "vertical" | "horizontal";
  hideScrollBar?: boolean;
};

/**
 * ScrollShadow component that adds shadow effects to scrollable containers
 * 
 * @example
 * <div className={scrollShadow({ orientation: "vertical", hideScrollBar: true })}>
 *   Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * </div>
 */

type ScrollShadowOptions = {
  orientation?: "vertical" | "horizontal";
  hideScrollBar?: boolean;
};

/**
 * Creates class names for a scroll shadow component
 */
const scrollShadow = (options?: ScrollShadowOptions): string => {
  const {
    orientation = "vertical",
    hideScrollBar = false,
  } = options || {};

  const baseClasses: string[] = [];
  
  // Add orientation-specific classes
  if (orientation === "vertical") {
    baseClasses.push("overflow-y-auto");
    baseClasses.push(
      "data-[top-scroll=true]:[mask-image:linear-gradient(0deg,#000_calc(100%_-_var(--scroll-shadow-size)),transparent)]",
      "data-[bottom-scroll=true]:[mask-image:linear-gradient(180deg,#000_calc(100%_-_var(--scroll-shadow-size)),transparent)]",
      "data-[top-bottom-scroll=true]:[mask-image:linear-gradient(#000,#000,transparent_0,#000_var(--scroll-shadow-size),#000_calc(100%_-_var(--scroll-shadow-size)),transparent)]"
    );
  } else {
    baseClasses.push("overflow-x-auto");
    baseClasses.push(
      "data-[left-scroll=true]:[mask-image:linear-gradient(270deg,#000_calc(100%_-_var(--scroll-shadow-size)),transparent)]",
      "data-[right-scroll=true]:[mask-image:linear-gradient(90deg,#000_calc(100%_-_var(--scroll-shadow-size)),transparent)]",
      "data-[left-right-scroll=true]:[mask-image:linear-gradient(to_right,#000,#000,transparent_0,#000_var(--scroll-shadow-size),#000_calc(100%_-_var(--scroll-shadow-size)),transparent)]"
    );
  }

  // Add scrollbar hiding class if needed
  if (hideScrollBar) {
    baseClasses.push("no-scrollbar");
  }

  return baseClasses.join(" ");
};

type ReactRef<T> = React.RefObject<T> | React.MutableRefObject<T> | React.Ref<T>;

interface DOMElement extends Element, HTMLOrSVGElement { }

type DataAttributes = {
  [dataAttr: string]: any;
};

type Merge<M, N> = N extends Record<string, unknown> ? M : Omit<M, keyof N> & N;

type DOMAttributes<T = DOMElement> = React.AriaAttributes &
  React.DOMAttributes<T> &
  DataAttributes & {
    id?: string;
    role?: React.AriaRole;
    tabIndex?: number;
    style?: React.CSSProperties;
  };

type PropGetter<P = Record<string, unknown>, R = DOMAttributes> = (
  props?: Merge<DOMAttributes, P>,
  ref?: React.Ref<any>,
) => R & React.RefAttributes<any>;

type As<Props = any> = React.ElementType<Props>;

export type PropsOf<T extends As> = React.ComponentPropsWithoutRef<T> & {
  as?: As;
};

type HTMLHeroUIProps<T extends As = "div", OmitKeys extends keyof any = never> = Omit<
  PropsOf<T>,
  "ref" | "color" | "slot" | "size" | "defaultChecked" | "defaultValue" | OmitKeys
> & {
  as?: As;
};

function useDOMRef<T extends HTMLElement = HTMLElement>(
  ref?: RefObject<T | null> | Ref<T | null>,
) {
  const domRef = useRef<T>(null);

  useImperativeHandle(ref, () => domRef.current);

  return domRef;
}

interface Props extends HTMLHeroUIProps<"div">, Omit<UseDataScrollOverflowProps, "domRef"> {
  /**
   * Ref to the DOM node.
   */
  ref?: ReactRef<HTMLElement | null>;
  /**
   * The shadow size in pixels.
   * @default 40
   */
  size?: number;
  /**
   * Additional class name
   */
  className?: string;
}

export type UseScrollShadowProps = Props & ScrollShadowVariantProps;

export function useScrollShadow(originalProps: UseScrollShadowProps) {
  const {
    ref,
    as,
    children,
    className,
    style,
    size = 40,
    offset = 0,
    visibility = "auto",
    isEnabled = true,
    onVisibilityChange,
    orientation = "vertical",
    hideScrollBar = false,
    ...otherProps
  } = originalProps;

  const Component = as || "div";

  const domRef = useDOMRef(ref);

  useDataScrollOverflow({
    domRef,
    offset,
    visibility,
    isEnabled,
    onVisibilityChange,
    updateDeps: [children],
    overflowCheck: orientation,
  });

  const styles = useMemo(
    () => {
      const shadowClasses = scrollShadow({
        orientation,
        hideScrollBar
      });
      
      return className ? `${shadowClasses} ${className}` : shadowClasses;
    },
    [orientation, hideScrollBar, className],
  );

  const getBaseProps: PropGetter = (props = {}) => ({
    ref: domRef,
    className: styles,
    "data-orientation": orientation,
    style: {
      "--scroll-shadow-size": `${size}px`,
      ...style,
      ...props.style,
    },
    ...otherProps,
    ...props,
  });

  return { Component, styles, domRef, children, getBaseProps };
}

export type UseScrollShadowReturn = ReturnType<typeof useScrollShadow>;