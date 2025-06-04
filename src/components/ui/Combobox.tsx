import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./Button";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { ComponentSize, InputVariant } from "../../lib/design-tokens";

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  size?: ComponentSize;
  variant?: InputVariant;
  fullWidth?: boolean;
  allowCreate?: boolean;
  onCreateOption?: (value: string) => void;
  createOptionLabel?: string;
  className?: string;
  popoverWidth?: string;
}

/**
 * Composant Combobox standardisé
 * Permet à l'utilisateur de sélectionner parmi une liste ou de créer une nouvelle option
 */
export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Sélectionner une option",
  label,
  helperText,
  error = false,
  disabled = false,
  size = "md",
  variant = "default",
  fullWidth = false,
  allowCreate = false,
  onCreateOption,
  createOptionLabel = "Créer",
  className,
  popoverWidth = "w-[--radix-popover-trigger-width]"
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [filteredOptions, setFilteredOptions] = React.useState<ComboboxOption[]>(options);
  
  // Mettre à jour les options filtrées lorsque les options ou l'entrée changent
  React.useEffect(() => {
    if (inputValue.trim() === "") {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(option =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [options, inputValue]);

  // Déterminer les styles de taille
  const sizeStyles = {
    xs: "h-7 text-xs px-2 py-1",
    sm: "h-8 text-sm px-3 py-1",
    md: "h-10 text-sm px-3 py-2",
    lg: "h-12 text-base px-4 py-2",
    xl: "h-14 text-lg px-5 py-2.5",
  };

  // Gérer la sélection d'une option
  const handleSelect = (value: string) => {
    onChange?.(value);
    setOpen(false);
    setInputValue("");
  };

  // Obtenir le libellé pour la valeur actuelle
  const selectedLabel = React.useMemo(() => {
    if (!value) return "";
    const option = options.find(option => option.value === value);
    return option ? option.label : "";
  }, [value, options]);

  // Vérifier si la valeur saisie correspond à une option existante
  const valueExists = React.useMemo(() => {
    return options.some(option => 
      option.label.toLowerCase() === inputValue.toLowerCase()
    );
  }, [options, inputValue]);

  return (
    <div className={cn("flex flex-col space-y-1", fullWidth && "w-full")}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={variant === "default" ? "outline" : variant}
            size={size}
            type="button"
            className={cn(
              "justify-between text-left font-normal",
              !value && !selectedLabel && "text-gray-400 dark:text-gray-500",
              sizeStyles[size],
              fullWidth && "w-full",
              error && "border-error-500 focus:ring-error-500",
              disabled && "opacity-50 cursor-not-allowed",
              className
            )}
            disabled={disabled}
            aria-expanded={open}
          >
            {value && selectedLabel ? selectedLabel : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("p-0", popoverWidth)}>
          <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-3 py-2">
            <input
              className={cn(
                "flex h-8 w-full rounded-md bg-transparent py-2 text-sm outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50",
                "focus:outline-none"
              )}
              placeholder="Rechercher..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setOpen(false);
                }
              }}
            />
          </div>
          
          {filteredOptions.length > 0 ? (
            <div className="max-h-60 overflow-auto p-1">
              {filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none",
                    "hover:bg-gray-100 dark:hover:bg-dark-700",
                    "focus:bg-gray-100 dark:focus:bg-dark-700",
                    value === option.value && "bg-gray-100 dark:bg-dark-700",
                    option.disabled && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => {
                    if (!option.disabled) {
                      handleSelect(option.value);
                    }
                  }}
                >
                  {option.label}
                  {value === option.value && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-3 text-sm text-gray-500 dark:text-gray-400">
              Aucun résultat trouvé
            </div>
          )}
          
          {allowCreate && inputValue && !valueExists && (
            <div className="p-1 border-t border-gray-200 dark:border-gray-700">
              <div
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none",
                  "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400",
                  "hover:bg-primary-100 dark:hover:bg-primary-900/30"
                )}
                onClick={() => {
                  onCreateOption?.(inputValue);
                  setInputValue("");
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                {createOptionLabel} "{inputValue}"
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
      
      {helperText && (
        <p className={cn(
          "text-xs",
          error ? "text-error-600 dark:text-error-500" : "text-gray-500 dark:text-gray-400"
        )}>
          {helperText}
        </p>
      )}
    </div>
  );
}