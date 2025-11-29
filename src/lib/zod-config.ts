import { z } from "zod";

/**
 * Configure Zod's global error map
 * This customizes the default error messages, particularly for required fields
 */
z.config({
  customError: (ctx) => {
    // Handle required field errors (invalid_type when input is undefined)
    if (ctx.code === "invalid_type" && ctx.input === undefined) {
      // Get field name from path
      const fieldName =
        ctx.path && ctx.path.length > 0
          ? String(ctx.path[ctx.path.length - 1])
              // Convert camelCase/snake_case to Title Case
              .replace(/([A-Z])/g, " $1")
              .replace(/_/g, " ")
              .replace(/^\w/, (c) => c.toUpperCase())
              .trim()
          : "Field";

      return `${fieldName} is required`;
    }

    // Handle too_small for min length requirements (often used for required strings)
    if (ctx.code === "too_small" && ctx.minimum === 1) {
      const fieldName =
        ctx.path && ctx.path.length > 0
          ? String(ctx.path[ctx.path.length - 1])
              .replace(/([A-Z])/g, " $1")
              .replace(/_/g, " ")
              .replace(/^\w/, (c) => c.toUpperCase())
              .trim()
          : "Field";

      return `${fieldName} is required`;
    }

    // Return undefined to use default message for all other cases
    return undefined;
  },
});

// Export the configured Zod instance
export { z };

// Re-export commonly used types
export type { ZodSchema, ZodType, core } from "zod";
