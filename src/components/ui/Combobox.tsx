import React, { useState, useRef, useCallback, memo } from 'react';
import { Command } from 'cmdk';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { cn } from '../../lib/utils';

interface ComboboxProps {
  value?: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; email?: string }[];
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  onCreateNew?: () => void;
}

export const Combobox = memo(React.forwardRef<HTMLDivElement, ComboboxProps>(({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  label,
  error,
  disabled,
  className,
  onCreateNew
}, ref) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedOption = options.find(option => option.value === value);

  const handleSelect = useCallback((selectedValue: string) => {
    onChange(selectedValue);
    setOpen(false);
    setSearchQuery('');
  }, [onChange]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {label && (
        <label className="block text-xs uppercase font-bold tracking-wide text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "w-full flex items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm",
              "dark:bg-dark-800 dark:border-dark-600 dark:text-white",
              "hover:bg-gray-50 dark:hover:bg-dark-700",
              "focus:outline-none focus:ring-2 focus:ring-primary-500",
              disabled && "opacity-50 cursor-not-allowed",
              error && "border-error-500 dark:border-error-500",
              className
            )}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(!open);
            }}
          >
            {selectedOption ? (
              <div className="flex flex-col items-start">
                <span>{selectedOption.label}</span>
                {selectedOption.email && (
                  <span className="text-xs text-gray-500">{selectedOption.email}</span>
                )}
              </div>
            ) : (
              <span>{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="z-50 min-w-[200px] w-[--radix-popover-trigger-width] p-0"
            align="start"
            sideOffset={4}
            onInteractOutside={(e) => {
              if (inputRef.current?.contains(e.target as Node)) {
                return;
              }
              setOpen(false);
            }}
          >
            <Command
              className={cn(
                "rounded-lg border border-gray-200 bg-white shadow-md",
                "dark:border-dark-600 dark:bg-dark-800"
              )}
            >
              <div
                className={cn(
                  "flex items-center border-b border-gray-200 px-3",
                  "dark:border-dark-600"
                )}
              >
                <input
                  ref={inputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500",
                    "dark:placeholder:text-gray-400"
                  )}
                  placeholder="Search..."
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <Command.List
                className="max-h-[300px] overflow-y-auto p-1"
              >
                {options.length > 0 ? (
                  options
                    .filter(option => 
                      option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (option.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
                    )
                    .map((option) => (
                      <Command.Item
                        key={option.value}
                        value={option.value}
                        onSelect={() => handleSelect(option.value)}
                        className={cn(
                          "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                          "hover:bg-gray-100 dark:hover:bg-dark-700",
                          "aria-selected:bg-gray-100 dark:aria-selected:bg-dark-700"
                        )}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            option.value === value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div>
                          <div>{option.label}</div>
                          {option.email && (
                            <div className="text-xs text-gray-500">{option.email}</div>
                          )}
                        </div>
                      </Command.Item>
                    ))
                ) : (
                  <Command.Empty className="py-6 text-center text-sm">
                    No results found.
                  </Command.Empty>
                )}
                {onCreateNew && (
                  <Command.Item
                    onSelect={() => {
                      onCreateNew();
                      setOpen(false);
                      setSearchQuery('');
                    }}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none mt-1 border-t",
                      "hover:bg-gray-100 dark:hover:bg-dark-700"
                    )}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add new contact
                  </Command.Item>
                )}
              </Command.List>
            </Command>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {error && (
        <p className="mt-1 text-sm text-error-600 dark:text-error-400">{error}</p>
      )}
    </div>
  );
}));

Combobox.displayName = 'Combobox';