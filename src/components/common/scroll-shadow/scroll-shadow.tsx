import { forwardRef } from "react";
import type { UseScrollShadowProps } from "./use-scroll-shadow";
import { useScrollShadow } from "./use-scroll-shadow";

export type ScrollShadowProps = UseScrollShadowProps;

const ScrollShadow = forwardRef<HTMLDivElement, ScrollShadowProps>(
  (props, ref) => {
    const { Component, children, getBaseProps } = useScrollShadow({
      ...props,
      ref,
    });

    return <Component {...getBaseProps()}>{children}</Component>;
  }
);

ScrollShadow.displayName = "ScrollShadow";

export default ScrollShadow;
