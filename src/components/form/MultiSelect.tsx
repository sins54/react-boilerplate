import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "../../lib/utils";
import { FormFieldWrapper, inputStyleProps, inputErrorStyleProps } from "./FormFieldWrapper";

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  /** Field name for form registration */
  name: string;
  /** Label text */
  label?: string;
  /** Whether the field is required (shows asterisk) */
  required?: boolean;
  /** Helper text shown below input */
  helperText?: string;
  /** Options for selection */
  options: MultiSelectOption[];
  /** Placeholder text */
  placeholder?: string;
  /** Custom class name */
  className?: string;
}

/**
 * MultiSelect component with tags/chips interface
 * Integrates with react-hook-form via FormProvider context
 */
export const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  ({ name, label, required, helperText, options, placeholder, className }, ref) => {
    const {
      control,
      formState: { errors },
    } = useFormContext();
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState("");
    const containerRef = React.useRef<HTMLDivElement>(null);

    const error = errors[name]?.message as string | undefined;

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

    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field }) => {
          const selectedValues: string[] = field.value || [];

          const handleToggle = (value: string) => {
            const newValues = selectedValues.includes(value)
              ? selectedValues.filter((v) => v !== value)
              : [...selectedValues, value];
            field.onChange(newValues);
          };

          const handleRemove = (value: string) => {
            field.onChange(selectedValues.filter((v) => v !== value));
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
                <div
                  ref={ref}
                  className={cn(
                    "min-h-[42px] w-full px-[var(--spacing-2)] py-[var(--spacing-1)]",
                    "rounded-[var(--radius-md)] border",
                    "flex flex-wrap gap-[var(--spacing-1)] items-center cursor-text",
                    className
                  )}
                  style={{
                    ...inputStyleProps,
                    ...(error ? inputErrorStyleProps : {}),
                  }}
                  onClick={() => setIsOpen(true)}
                >
                  {/* Selected tags */}
                  {selectedValues.map((value) => {
                    const option = options.find((o) => o.value === value);
                    return (
                      <span
                        key={value}
                        className="inline-flex items-center gap-1 px-[var(--spacing-2)] py-[var(--spacing-1)] rounded-[var(--radius-sm)] text-[length:var(--text-sm)]"
                        style={{
                          backgroundColor: "var(--color-primary)",
                          color: "var(--color-text-on-primary)",
                        }}
                      >
                        {option?.label || value}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(value);
                          }}
                          className="hover:opacity-80 focus:outline-none"
                          aria-label={`Remove ${option?.label || value}`}
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}

                  {/* Search input */}
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    placeholder={selectedValues.length === 0 ? placeholder : ""}
                    className="flex-1 min-w-[100px] bg-transparent border-none outline-none text-[length:var(--text-base)]"
                    style={{ color: "var(--color-text)" }}
                  />
                </div>

                {/* Dropdown */}
                {isOpen && (
                  <div
                    className="absolute z-50 w-full mt-1 max-h-[200px] overflow-auto rounded-[var(--radius-md)] border shadow-lg"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      borderColor: "var(--color-border)",
                    }}
                  >
                    {filteredOptions.length === 0 ? (
                      <div
                        className="px-[var(--spacing-3)] py-[var(--spacing-2)] text-[length:var(--text-sm)]"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        No options found
                      </div>
                    ) : (
                      filteredOptions.map((option) => {
                        const isSelected = selectedValues.includes(option.value);
                        return (
                          <div
                            key={option.value}
                            className={cn(
                              "px-[var(--spacing-3)] py-[var(--spacing-2)] cursor-pointer",
                              "flex items-center gap-[var(--spacing-2)]",
                              "transition-colors duration-[var(--transition-fast)]"
                            )}
                            style={{
                              backgroundColor: isSelected
                                ? "var(--color-surface-active)"
                                : "transparent",
                              color: "var(--color-text)",
                            }}
                            onClick={() => handleToggle(option.value)}
                            onMouseEnter={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.backgroundColor =
                                  "var(--color-surface-hover)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.backgroundColor = "transparent";
                              }
                            }}
                          >
                            <span
                              className={cn(
                                "w-4 h-4 rounded-[var(--radius-sm)] border flex items-center justify-center text-[length:var(--text-xs)]"
                              )}
                              style={{
                                borderColor: isSelected
                                  ? "var(--color-primary)"
                                  : "var(--color-border)",
                                backgroundColor: isSelected
                                  ? "var(--color-primary)"
                                  : "transparent",
                                color: isSelected
                                  ? "var(--color-text-on-primary)"
                                  : "transparent",
                              }}
                            >
                              {isSelected && "✓"}
                            </span>
                            {option.label}
                          </div>
                        );
                      })
                    )}
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

MultiSelect.displayName = "MultiSelect";
