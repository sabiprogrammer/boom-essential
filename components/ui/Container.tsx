import type { ElementType, HTMLAttributes } from "react";

type ContainerSize = "content" | "narrow" | "prose";

const sizes: Record<ContainerSize, string> = {
  content: "max-w-content",
  narrow: "max-w-narrow",
  prose: "max-w-prose",
};

type ContainerProps = HTMLAttributes<HTMLElement> & {
  size?: ContainerSize;
  as?: ElementType;
};

/** Centres content to a token width with the responsive page gutter. */
export function Container({ size = "content", as: Tag = "div", className = "", ...rest }: ContainerProps) {
  return <Tag className={`mx-auto w-full px-gutter ${sizes[size]} ${className}`} {...rest} />;
}
