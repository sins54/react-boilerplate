import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/navigation/DropdownMenu";
import { supportedLanguages, type SupportedLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  /** Additional class names */
  className?: string;
  /** Show language name instead of just icon */
  showLabel?: boolean;
}

/**
 * Language Switcher Component
 * 
 * A dropdown menu that allows users to switch between supported languages.
 * Persists selection to localStorage and instantly updates the UI.
 * 
 * @example
 * // Icon only (default)
 * <LanguageSwitcher />
 * 
 * @example
 * // With label
 * <LanguageSwitcher showLabel />
 */
export function LanguageSwitcher({ className, showLabel = false }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation("common");
  
  const currentLanguage = supportedLanguages.find(
    (lang) => lang.code === i18n.language
  ) || supportedLanguages[0];

  const handleLanguageChange = (languageCode: SupportedLanguage) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 p-2 rounded-[length:var(--radius-md)] transition-colors",
            className
          )}
          style={{
            color: "var(--color-text-secondary)",
            backgroundColor: "transparent",
          }}
          aria-label={t("language.select")}
          title={t("language.current")}
        >
          <GlobeIcon className="w-5 h-5" />
          {showLabel && (
            <span className="text-sm font-medium">
              {currentLanguage.nativeName}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuLabel>{t("language.select")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {supportedLanguages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code as SupportedLanguage)}
            className="flex items-center justify-between gap-4"
          >
            <span>{language.nativeName}</span>
            {currentLanguage.code === language.code && (
              <CheckIcon className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Globe icon for language switcher
 */
function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

/**
 * Check icon for selected language
 */
function CheckIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default LanguageSwitcher;
