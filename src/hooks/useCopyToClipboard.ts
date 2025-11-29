import { useState, useCallback, useRef, useEffect } from "react";

/**
 * Return type for the useCopyToClipboard hook.
 */
interface UseCopyToClipboardReturn {
  /** The current copied value (null if nothing has been copied) */
  copiedValue: string | null;
  /** Whether the copy was successful and is in the "success" state */
  isSuccess: boolean;
  /** Function to copy text to clipboard */
  copy: (text: string) => Promise<boolean>;
  /** Function to reset the copied state */
  reset: () => void;
}

/**
 * A hook for copying text to the clipboard with temporary success state handling.
 *
 * @param successDuration - Duration in milliseconds to show success state (default: 2000)
 * @returns Object containing copiedValue, isSuccess state, copy function, and reset function
 *
 * @example
 * function CopyButton({ textToCopy }: { textToCopy: string }) {
 *   const { copy, isSuccess } = useCopyToClipboard();
 *
 *   return (
 *     <button onClick={() => copy(textToCopy)}>
 *       {isSuccess ? 'Copied!' : 'Copy to clipboard'}
 *     </button>
 *   );
 * }
 *
 * @example
 * // With custom success duration
 * function CodeBlock({ code }: { code: string }) {
 *   const { copy, isSuccess, copiedValue } = useCopyToClipboard(3000);
 *
 *   return (
 *     <div>
 *       <pre>{code}</pre>
 *       <button onClick={() => copy(code)}>
 *         {isSuccess ? `Copied: ${copiedValue}` : 'Copy'}
 *       </button>
 *     </div>
 *   );
 * }
 */
export function useCopyToClipboard(
  successDuration: number = 2000
): UseCopyToClipboardReturn {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Check if clipboard API is available
      if (!navigator?.clipboard) {
        console.warn("Clipboard API not supported");
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopiedValue(text);
        setIsSuccess(true);

        // Reset success state after duration
        timeoutRef.current = setTimeout(() => {
          setIsSuccess(false);
        }, successDuration);

        return true;
      } catch (error) {
        console.warn("Failed to copy to clipboard:", error);
        setCopiedValue(null);
        setIsSuccess(false);
        return false;
      }
    },
    [successDuration]
  );

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setCopiedValue(null);
    setIsSuccess(false);
  }, []);

  return { copiedValue, isSuccess, copy, reset };
}
