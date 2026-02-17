"use client";

import * as ReactDialog from "@radix-ui/react-dialog";
import { cn } from "@lib/util";
import { cva, VariantProps } from "class-variance-authority";
import React, { HTMLAttributes } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { X } from "lucide-react";

const Drawer = ReactDialog.Root;
const DrawerTrigger = ReactDialog.Trigger;

const drawerContentVariants = cva(
  "fixed inset-y-0 z-50 flex flex-col bg-paper border-ink shadow-hard-xl data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        left: "left-0 border-r-2 data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
        right:
          "right-0 border-l-2 data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
      },
      size: {
        sm: "w-full max-w-sm",
        md: "w-full max-w-md",
        lg: "w-full max-w-lg",
      },
    },
    defaultVariants: {
      side: "right",
      size: "md",
    },
  },
);

interface DrawerContentProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof drawerContentVariants> {
  title?: string;
  onClose?: () => void;
}

const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>(
  ({ className, side = "right", size = "md", title, children, onClose, ...props }, ref) => (
    <ReactDialog.Portal>
      <ReactDialog.Overlay className="fixed inset-0 z-40 bg-ink/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
      <ReactDialog.Content
        ref={ref}
        className={cn(drawerContentVariants({ side, size }), className)}
        {...props}
      >
        <VisuallyHidden>
          <ReactDialog.Title>{title || "Drawer"}</ReactDialog.Title>
        </VisuallyHidden>
        {children}
      </ReactDialog.Content>
    </ReactDialog.Portal>
  ),
);
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex items-center justify-between p-6 border-b-2 border-ink",
      className,
    )}
    {...props}
  >
    {children}
    <ReactDialog.Close className="cursor-pointer rounded p-1 hover:bg-ink/10 transition">
      <X className="w-6 h-6" />
      <VisuallyHidden>Close</VisuallyHidden>
    </ReactDialog.Close>
  </div>
);

const DrawerBody = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex-1 overflow-y-auto p-6", className)} {...props} />
);

const DrawerFooter = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("p-6 border-t-2 border-ink bg-white", className)}
    {...props}
  />
);

const DrawerComponent = Object.assign(Drawer, {
  Trigger: DrawerTrigger,
  Content: DrawerContent,
  Header: DrawerHeader,
  Body: DrawerBody,
  Footer: DrawerFooter,
});

export { DrawerComponent as Drawer };
