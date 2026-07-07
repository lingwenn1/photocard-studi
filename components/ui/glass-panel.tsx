import { clsx } from "clsx";
import { HTMLAttributes } from "react";

export function GlassPanel({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx("glass-panel rounded-3xl", className)} {...rest}>
      {children}
    </div>
  );
}
