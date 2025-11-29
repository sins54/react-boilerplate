import { z } from "zod";
import i18n from "./i18n";

/**
 * Helper to format field name from path
 * Converts camelCase/snake_case to Title Case
 */
function formatFieldName(path: PropertyKey[] | undefined): string {
  if (!path || path.length === 0) return "Field";
  
  return String(path[path.length - 1])
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

/**
 * Configure Zod's global error map with i18n support
 * This customizes the default error messages to use translations
 */
z.config({
  customError: (ctx) => {
    const fieldName = formatFieldName(ctx.path);

    // Handle required field errors (invalid_type when input is undefined)
    if (ctx.code === "invalid_type" && ctx.input === undefined) {
      return i18n.t("validation:required", { field: fieldName });
    }

    // Handle too_small for min length requirements (often used for required strings)
    if (ctx.code === "too_small") {
      if (ctx.minimum === 1) {
        return i18n.t("validation:required", { field: fieldName });
      }
      return i18n.t("validation:min", { field: fieldName, min: ctx.minimum });
    }

    // Handle too_big for max length requirements
    if (ctx.code === "too_big") {
      return i18n.t("validation:max", { field: fieldName, max: ctx.maximum });
    }

    // Handle invalid format (email, url, etc.) - Zod v4 uses invalid_format
    if (ctx.code === "invalid_format") {
      const format = (ctx as { format?: string }).format;
      if (format === "email") {
        return i18n.t("validation:email");
      }
      if (format === "url") {
        return i18n.t("validation:url");
      }
      if (format === "date" || format === "datetime") {
        return i18n.t("validation:date");
      }
      return i18n.t("validation:invalidFormat");
    }

    // Return undefined to use default message for all other cases
    return undefined;
  },
});

// Export the configured Zod instance
export { z };

// Re-export commonly used types
export type { ZodSchema, ZodType, core } from "zod";
