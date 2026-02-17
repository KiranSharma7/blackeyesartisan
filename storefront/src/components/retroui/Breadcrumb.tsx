import { cn } from "@lib/util";
import { ChevronRight } from "lucide-react";
import React, { HTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";

const Breadcrumb = ({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) => (
  <nav
    aria-label="Breadcrumb"
    className={cn("text-sm font-medium", className)}
    {...props}
  />
);

const BreadcrumbList = ({
  className,
  ...props
}: HTMLAttributes<HTMLOListElement>) => (
  <ol
    className={cn("flex items-center gap-1.5 flex-wrap", className)}
    {...props}
  />
);

const BreadcrumbItem = ({
  className,
  ...props
}: HTMLAttributes<HTMLLIElement>) => (
  <li className={cn("inline-flex items-center gap-1.5", className)} {...props} />
);

interface BreadcrumbLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean;
}

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "a";
    return (
      <Comp
        ref={ref}
        className={cn(
          "text-ink/60 hover:text-ink transition-colors hover:underline underline-offset-2",
          className,
        )}
        {...props}
      />
    );
  },
);
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => (
  <span
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("text-ink font-bold", className)}
    {...props}
  />
);

const BreadcrumbSeparator = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLLIElement>) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("text-ink/40", className)}
    {...props}
  >
    {children || <ChevronRight className="h-3.5 w-3.5" />}
  </li>
);

const BreadcrumbComponent = Object.assign(Breadcrumb, {
  List: BreadcrumbList,
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  Page: BreadcrumbPage,
  Separator: BreadcrumbSeparator,
});

export { BreadcrumbComponent as Breadcrumb };
