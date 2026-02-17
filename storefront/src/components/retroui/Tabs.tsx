"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@lib/util";
import React from "react";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  HTMLDivElement,
  TabsPrimitive.TabsListProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center gap-1 border-b-2 border-ink",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  TabsPrimitive.TabsTriggerProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "font-head inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-all cursor-pointer",
      "border-b-2 border-transparent -mb-[2px]",
      "hover:text-ink data-[state=active]:border-ink data-[state=active]:text-ink",
      "text-ink/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef<
  HTMLDivElement,
  TabsPrimitive.TabsContentProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";

const TabsComponent = Object.assign(Tabs, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});

export { TabsComponent as Tabs };
