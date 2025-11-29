import { useEffect, type RefObject } from "react";

/**
 * A hook that triggers a callback when a click occurs outside the specified element(s).
 * Useful for closing custom dropdowns, modals, and popovers.
 *
 * @param ref - A ref or array of refs to the element(s) to detect clicks outside of
 * @param handler - The callback to invoke when a click outside is detected
 * @param enabled - Optional flag to enable/disable the listener (default: true)
 *
 * @example
 * // Single element
 * function Dropdown() {
 *   const dropdownRef = useRef<HTMLDivElement>(null);
 *   const [isOpen, setIsOpen] = useState(false);
 *
 *   useOnClickOutside(dropdownRef, () => setIsOpen(false), isOpen);
 *
 *   return (
 *     <div ref={dropdownRef}>
 *       <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
 *       {isOpen && <div>Dropdown content</div>}
 *     </div>
 *   );
 * }
 *
 * @example
 * // Multiple elements (e.g., trigger and dropdown)
 * function Dropdown() {
 *   const triggerRef = useRef<HTMLButtonElement>(null);
 *   const contentRef = useRef<HTMLDivElement>(null);
 *   const [isOpen, setIsOpen] = useState(false);
 *
 *   useOnClickOutside([triggerRef, contentRef], () => setIsOpen(false), isOpen);
 *
 *   return (
 *     <>
 *       <button ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>Toggle</button>
 *       {isOpen && <div ref={contentRef}>Dropdown content</div>}
 *     </>
 *   );
 * }
 */
export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null> | RefObject<T | null>[],
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const refs = Array.isArray(ref) ? ref : [ref];
      const target = event.target;

      // Check if click is inside any of the refs
      // Guard against null target (edge case in some browsers)
      if (!target || !(target instanceof Node)) return;

      const isInside = refs.some((r) => {
        const element = r.current;
        if (!element) return false;
        return element.contains(target);
      });

      if (!isInside) {
        handler(event);
      }
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, enabled]);
}
