import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { FormFieldWrapper } from "./FormFieldWrapper";

export interface FileUploadProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "type"> {
  /** Field name for form registration */
  name: string;
  /** Label text */
  label?: string;
  /** Whether the field is required (shows asterisk) */
  required?: boolean;
  /** Helper text shown below file input */
  helperText?: string;
  /** Accepted file types (e.g., ".pdf,.doc,.docx") */
  accept?: string;
  /** Allow multiple files */
  multiple?: boolean;
  /** Maximum file size in bytes */
  maxSize?: number;
}

/**
 * FileUpload component for generic file input
 * Integrates with react-hook-form via FormProvider context
 */
export const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  (
    { name, label, required, helperText, accept, multiple, maxSize, className, ...props },
    ref
  ) => {
    const {
      control,
      formState: { errors },
      setError,
      clearErrors,
    } = useFormContext();
    const inputRef = React.useRef<HTMLInputElement>(null);

    const error = errors[name]?.message as string | undefined;

    const handleFileChange = (
      files: FileList | null,
      onChange: (files: File[] | null) => void
    ) => {
      if (!files || files.length === 0) {
        onChange(null);
        return;
      }

      const fileArray = Array.from(files);

      // Validate file size if maxSize is provided
      if (maxSize) {
        const oversizedFiles = fileArray.filter((file) => file.size > maxSize);
        if (oversizedFiles.length > 0) {
          setError(name, {
            type: "manual",
            message: `File size must be less than ${formatFileSize(maxSize)}`,
          });
          return;
        }
      }

      clearErrors(name);
      onChange(fileArray);
    };

    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => {
          const files: File[] = value || [];

          return (
            <FormFieldWrapper
              name={name}
              label={label}
              required={required}
              error={error}
              helperText={helperText}
            >
              <div
                className={cn(
                  "relative border-2 border-dashed rounded-[var(--radius-md)] p-[var(--spacing-4)]",
                  "transition-colors duration-[var(--transition-fast)]",
                  "hover:border-[var(--color-primary)]",
                  className
                )}
                style={{
                  borderColor: error
                    ? "var(--color-error)"
                    : "var(--color-border)",
                  backgroundColor: "var(--color-surface)",
                }}
                onClick={() => inputRef.current?.click()}
              >
                <input
                  {...props}
                  ref={(el) => {
                    inputRef.current = el;
                    if (typeof ref === "function") {
                      ref(el);
                    } else if (ref) {
                      ref.current = el;
                    }
                  }}
                  type="file"
                  id={name}
                  accept={accept}
                  multiple={multiple}
                  onChange={(e) => handleFileChange(e.target.files, onChange)}
                  className="sr-only"
                  aria-invalid={!!error}
                />

                <div className="text-center cursor-pointer">
                  <div
                    className="text-[length:var(--text-3xl)] mb-[var(--spacing-2)]"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    📁
                  </div>
                  <p
                    className="text-[length:var(--text-sm)] font-[number:var(--font-medium)]"
                    style={{ color: "var(--color-text)" }}
                  >
                    Click to upload or drag and drop
                  </p>
                  {accept && (
                    <p
                      className="text-[length:var(--text-xs)] mt-1"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {accept.split(",").join(", ")}
                    </p>
                  )}
                  {maxSize && (
                    <p
                      className="text-[length:var(--text-xs)]"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      Max size: {formatFileSize(maxSize)}
                    </p>
                  )}
                </div>

                {/* File list */}
                {files.length > 0 && (
                  <div className="mt-[var(--spacing-3)] space-y-[var(--spacing-2)]">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between px-[var(--spacing-3)] py-[var(--spacing-2)] rounded-[var(--radius-sm)]"
                        style={{
                          backgroundColor: "var(--color-bg-secondary)",
                        }}
                      >
                        <span
                          className="text-[length:var(--text-sm)] truncate max-w-[80%]"
                          style={{ color: "var(--color-text)" }}
                        >
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newFiles = files.filter((_, i) => i !== index);
                            onChange(newFiles.length > 0 ? newFiles : null);
                          }}
                          className="text-[length:var(--text-sm)] hover:opacity-70"
                          style={{ color: "var(--color-error)" }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
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

FileUpload.displayName = "FileUpload";

/**
 * Format file size to human readable string
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
