import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { cn } from "../../lib/utils";
import { FormFieldWrapper, inputErrorStyleProps } from "./FormFieldWrapper";

export interface ImageUploadProps {
  /** Field name for form registration */
  name: string;
  /** Label text */
  label?: string;
  /** Whether the field is required (shows asterisk) */
  required?: boolean;
  /** Helper text shown below image input */
  helperText?: string;
  /** Accepted image types (defaults to common image formats) */
  accept?: string;
  /** Allow multiple images */
  multiple?: boolean;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Custom class name */
  className?: string;
}

/**
 * ImageUpload component with preview before upload
 * Integrates with react-hook-form via FormProvider context
 */
export const ImageUpload = React.forwardRef<HTMLInputElement, ImageUploadProps>(
  (
    {
      name,
      label,
      required,
      helperText,
      accept = "image/*",
      multiple = false,
      maxSize,
      className,
    },
    ref
  ) => {
    const {
      control,
      formState: { errors },
      setError,
      clearErrors,
    } = useFormContext();
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [previews, setPreviews] = React.useState<string[]>([]);

    const error = errors[name]?.message as string | undefined;

    // Cleanup previews on unmount
    React.useEffect(() => {
      return () => {
        previews.forEach((url) => URL.revokeObjectURL(url));
      };
    }, [previews]);

    const handleFileChange = (
      files: FileList | null,
      onChange: (files: File[] | null) => void
    ) => {
      if (!files || files.length === 0) {
        onChange(null);
        setPreviews([]);
        return;
      }

      const fileArray = Array.from(files);

      // Validate file size if maxSize is provided
      if (maxSize) {
        const oversizedFiles = fileArray.filter((file) => file.size > maxSize);
        if (oversizedFiles.length > 0) {
          setError(name, {
            type: "manual",
            message: `Image size must be less than ${formatFileSize(maxSize)}`,
          });
          return;
        }
      }

      // Generate previews
      const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
      setPreviews(newPreviews);

      clearErrors(name);
      onChange(fileArray);
    };

    const removeImage = (
      index: number,
      files: File[],
      onChange: (files: File[] | null) => void
    ) => {
      URL.revokeObjectURL(previews[index]);
      const newFiles = files.filter((_, i) => i !== index);
      const newPreviews = previews.filter((_, i) => i !== index);
      setPreviews(newPreviews);
      onChange(newFiles.length > 0 ? newFiles : null);
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
              <div className={cn("space-y-[var(--spacing-3)]", className)}>
                {/* Image previews */}
                {previews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-[var(--spacing-3)]">
                    {previews.map((preview, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-[var(--radius-md)] overflow-hidden border group"
                        style={{
                          borderColor: "var(--color-border)",
                        }}
                      >
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index, files, onChange)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-[length:var(--text-sm)] opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{
                            backgroundColor: "var(--color-error)",
                            color: "var(--color-text-on-primary)",
                          }}
                          aria-label={`Remove image ${index + 1}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload area */}
                <div
                  className={cn(
                    "relative border-2 border-dashed rounded-[var(--radius-md)] p-[var(--spacing-6)]",
                    "transition-colors duration-[var(--transition-fast)]",
                    "hover:border-[var(--color-primary)] cursor-pointer"
                  )}
                  style={{
                    borderColor: error
                      ? "var(--color-error)"
                      : "var(--color-border)",
                    backgroundColor: "var(--color-surface)",
                    ...(error ? inputErrorStyleProps : {}),
                  }}
                  onClick={() => inputRef.current?.click()}
                >
                  <input
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

                  <div className="text-center">
                    <div
                      className="text-[length:var(--text-4xl)] mb-[var(--spacing-2)]"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      🖼️
                    </div>
                    <p
                      className="text-[length:var(--text-sm)] font-[number:var(--font-medium)]"
                      style={{ color: "var(--color-text)" }}
                    >
                      Click to upload images
                    </p>
                    <p
                      className="text-[length:var(--text-xs)] mt-1"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {multiple ? "Multiple images allowed" : "Single image only"}
                    </p>
                    {maxSize && (
                      <p
                        className="text-[length:var(--text-xs)]"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        Max size: {formatFileSize(maxSize)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </FormFieldWrapper>
          );
        }}
      />
    );
  }
);

ImageUpload.displayName = "ImageUpload";

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
