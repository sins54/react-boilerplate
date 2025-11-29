import { AuthLayout } from "@/components/layouts/AuthLayout";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

/**
 * Demo login page to showcase the AuthLayout component.
 */
export default function LoginDemoPage() {
  const { t } = useTranslation("auth");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Login form submitted! (Demo only)");
  };

  return (
    <AuthLayout>
      <div>
        <h2
          className="text-2xl font-bold text-center mb-2"
          style={{ color: "var(--color-text)" }}
        >
          {t("login.title")}
        </h2>
        <p
          className="text-center mb-6"
          style={{ color: "var(--color-text-muted)" }}
        >
          {t("login.subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--color-text)" }}
            >
              {t("fields.email")}
            </label>
            <input
              type="email"
              id="email"
              placeholder={t("placeholders.email")}
              className="w-full px-3 py-2 rounded-[length:var(--radius-md)] text-sm"
              style={{
                backgroundColor: "var(--color-bg)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--color-text)" }}
            >
              {t("fields.password")}
            </label>
            <input
              type="password"
              id="password"
              placeholder={t("placeholders.password")}
              className="w-full px-3 py-2 rounded-[length:var(--radius-md)] text-sm"
              style={{
                backgroundColor: "var(--color-bg)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              }}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-[length:var(--radius-md)] font-medium transition-colors"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-text-on-primary)",
            }}
          >
            {t("login.button")}
          </button>
        </form>

        <p
          className="mt-6 text-center text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          {t("login.noAccount")}{" "}
          <a
            href="#"
            className="font-medium"
            style={{ color: "var(--color-primary)" }}
          >
            {t("login.signUp")}
          </a>
        </p>
      </div>
    </AuthLayout>
  );
}
