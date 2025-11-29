import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  FormFieldWrapper,
  inputBaseStyles,
  inputStyleProps,
  inputErrorStyleProps,
} from "./FormFieldWrapper";

export interface AutoCompleteOption {
  value: string;
  label: string;
}

export interface AutoCompleteProps {
  /** Field name for form registration */
  name: string;
  /** Label text */
  label?: string;
  /** Whether the field is required (shows asterisk) */
  required?: boolean;
  /** Helper text shown below input */
  helperText?: string;
  /** Options for autocomplete suggestions */
  options: AutoCompleteOption[];
  /** Placeholder text */
  placeholder?: string;
  /** Allow free text input (not limited to options) */
  freeSolo?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * AutoComplete (Combobox) component
 * Integrates with react-hook-form via FormProvider context
 */
export const AutoComplete = React.forwardRef<HTMLInputElement, AutoCompleteProps>(
  (
    {
      name,
      label,
      required,
      helperText,
      options,
      placeholder,
      freeSolo = false,
      className,
    },
    ref
  ) => {
    const {
      control,
      formState: { errors },
      watch,
    } = useFormContext();
    const [isOpen, setIsOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");
    const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const error = errors[name]?.message as string | undefined;
    const watchedValue = watch(name);

    // Sync input value with form value
    React.useEffect(() => {
      const option = options.find((o) => o.value === watchedValue);
      if (option) {
        setInputValue(option.label);
      } else if (watchedValue && freeSolo) {
        setInputValue(watchedValue);
      } else if (!watchedValue) {
        setInputValue("");
      }
    }, [watchedValue, options, freeSolo]);

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter options based on input
    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );

    // Handle keyboard navigation
    const handleKeyDown = (
      e: React.KeyboardEvent,
      onChange: (value: string) => void
    ) => {
      if (!isOpen && e.key !== "Escape") {
        setIsOpen(true);
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            const selectedOption = filteredOptions[highlightedIndex];
            setInputValue(selectedOption.label);
            onChange(selectedOption.value);
            setIsOpen(false);
          } else if (freeSolo && inputValue) {
            onChange(inputValue);
            setIsOpen(false);
          }
          break;
        case "Escape":
          setIsOpen(false);
          break;
      }
    };

    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => {
          const handleSelect = (option: AutoCompleteOption) => {
            setInputValue(option.label);
            onChange(option.value);
            setIsOpen(false);
            setHighlightedIndex(-1);
          };

          const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            setInputValue(newValue);
            setIsOpen(true);
            setHighlightedIndex(-1);

            if (freeSolo) {
              onChange(newValue);
            } else if (newValue === "") {
              onChange("");
            }
          };

          return (
            <FormFieldWrapper
              name={name}
              label={label}
              required={required}
              error={error}
              helperText={helperText}
            >
              <div ref={containerRef} className="relative">
                <input
                  ref={(el) => {
                    inputRef.current = el;
                    if (typeof ref === "function") {
                      ref(el);
                    } else if (ref) {
                      ref.current = el;
                    }
                  }}
                  type="text"
                  id={name}
                  value={inputValue}
                  onChange={handleInputChange}
                  onFocus={() => setIsOpen(true)}
                  onKeyDown={(e) => handleKeyDown(e, onChange)}
                  placeholder={placeholder}
                  aria-invalid={!!error}
                  aria-autocomplete="list"
                  aria-expanded={isOpen}
                  aria-controls={`${name}-listbox`}
                  role="combobox"
                  className={cn(inputBaseStyles, className)}
                  style={{
                    ...inputStyleProps,
                    ...(error ? inputErrorStyleProps : {}),
                  }}
                />

                {/* Dropdown */}
                {isOpen && filteredOptions.length > 0 && (
                  <ul
                    id={`${name}-listbox`}
                    role="listbox"
                    className="absolute z-50 w-full mt-1 max-h-[200px] overflow-auto rounded-[var(--radius-md)] border shadow-lg"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      borderColor: "var(--color-border)",
                    }}
                  >
                    {filteredOptions.map((option, index) => (
                      <li
                        key={option.value}
                        role="option"
                        aria-selected={highlightedIndex === index}
                        className={cn(
                          "px-[var(--spacing-3)] py-[var(--spacing-2)] cursor-pointer",
                          "transition-colors duration-[var(--transition-fast)]"
                        )}
                        style={{
                          backgroundColor:
                            highlightedIndex === index
                              ? "var(--color-surface-hover)"
                              : value === option.value
                              ? "var(--color-surface-active)"
                              : "transparent",
                          color: "var(--color-text)",
                        }}
                        onClick={() => handleSelect(option)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                      >
                        {option.label}
                      </li>
                    ))}
                  </ul>
                )}

                {/* No results message */}
                {isOpen && inputValue && filteredOptions.length === 0 && !freeSolo && (
                  <div
                    className="absolute z-50 w-full mt-1 px-[var(--spacing-3)] py-[var(--spacing-2)] rounded-[var(--radius-md)] border"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      borderColor: "var(--color-border)",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    No options found
                  </div>
                )}
              </div>
            </FormFieldWrapper>
          );
        }}
      />
    );
  }
);

AutoComplete.displayName = "AutoComplete";
