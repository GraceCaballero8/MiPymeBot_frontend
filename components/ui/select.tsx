"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  placeholder?: string
  className?: string
}

interface SelectTriggerProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

interface SelectValueProps {
  placeholder?: string
  value?: string
}

interface SelectContentProps {
  children: React.ReactNode
  className?: string
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
  onSelect?: (value: string) => void
}

const SelectContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
}>({
  open: false,
  setOpen: () => {}
})

const Select: React.FC<SelectProps> = ({ 
  value, 
  onValueChange, 
  children, 
  placeholder,
  className 
}) => {
  const [open, setOpen] = React.useState(false)

  // Cerrar el menú cuando se hace clic fuera
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-select-container]')) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className={cn("relative", className)} data-select-container>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ children, className, onClick, ...props }, ref) => {
    const { open, setOpen } = React.useContext(SelectContext)
    
    return (
      <button
        type="button"
        ref={ref}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        onClick={() => {
          setOpen(!open)
          onClick?.()
        }}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
    )
  }
)
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ placeholder, value, ...props }, ref) => {
    const contextValue = React.useContext(SelectContext)
    const currentValue = value || contextValue.value
    
    return (
      <span ref={ref} {...props}>
        {currentValue || placeholder}
      </span>
    )
  }
)
SelectValue.displayName = "SelectValue"

const SelectContent: React.FC<SelectContentProps> = ({ 
  children, 
  className 
}) => {
  const { open } = React.useContext(SelectContext)
  
  if (!open) return null

  return (
    <div className={cn(
      "absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md",
      className
    )}>
      <div className="p-1">
        {children}
      </div>
    </div>
  )
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ value, children, onSelect, ...props }, ref) => {
    const { onValueChange, setOpen } = React.useContext(SelectContext)
    
    const handleClick = () => {
      onValueChange?.(value)
      onSelect?.(value)
      setOpen(false)
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer",
          "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SelectItem.displayName = "SelectItem"

export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
}