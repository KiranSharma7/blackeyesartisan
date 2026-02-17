"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@lib/util";
import { Check } from "lucide-react";
import React from "react";

const Menu = DropdownMenuPrimitive.Root;
const MenuTrigger = DropdownMenuPrimitive.Trigger;
const MenuGroup = DropdownMenuPrimitive.Group;

const MenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuPrimitive.DropdownMenuContentProps
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded border-2 border-ink bg-paper shadow-hard-sm",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
MenuContent.displayName = "MenuContent";

const MenuItem = React.forwardRef<
  HTMLDivElement,
  DropdownMenuPrimitive.DropdownMenuItemProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center px-3 py-2 text-sm font-medium outline-none transition",
      "hover:bg-ink hover:text-paper focus:bg-ink focus:text-paper",
      "data-disabled:pointer-events-none data-disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
MenuItem.displayName = "MenuItem";

const MenuCheckboxItem = React.forwardRef<
  HTMLDivElement,
  DropdownMenuPrimitive.DropdownMenuCheckboxItemProps
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center py-2 pl-8 pr-3 text-sm font-medium outline-none transition",
      "hover:bg-ink hover:text-paper focus:bg-ink focus:text-paper",
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
MenuCheckboxItem.displayName = "MenuCheckboxItem";

const MenuSeparator = React.forwardRef<
  HTMLDivElement,
  DropdownMenuPrimitive.DropdownMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("h-[2px] bg-ink/20 my-1", className)}
    {...props}
  />
));
MenuSeparator.displayName = "MenuSeparator";

const MenuLabel = React.forwardRef<
  HTMLDivElement,
  DropdownMenuPrimitive.DropdownMenuLabelProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn("px-3 py-1.5 text-xs font-bold uppercase text-ink/60", className)}
    {...props}
  />
));
MenuLabel.displayName = "MenuLabel";

const MenuComponent = Object.assign(Menu, {
  Trigger: MenuTrigger,
  Content: MenuContent,
  Item: MenuItem,
  CheckboxItem: MenuCheckboxItem,
  Separator: MenuSeparator,
  Label: MenuLabel,
  Group: MenuGroup,
});

export { MenuComponent as Menu };
