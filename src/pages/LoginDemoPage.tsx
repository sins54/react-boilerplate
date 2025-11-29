import { AuthLayout } from "../components/layouts/AuthLayout";
import { toast } from "sonner";

/**
 * Demo login page to showcase the AuthLayout component.
 */
export default function LoginDemoPage() {
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
          Welcome Back
        </h2>
        <p
          className="text-center mb-6"
          style={{ color: "var(--color-text-muted)" }}
        >
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--color-text)" }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
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
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
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
            Sign In
          </button>
        </form>

        <p
          className="mt-6 text-center text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          Don't have an account?{" "}
          <a
            href="#"
            className="font-medium"
            style={{ color: "var(--color-primary)" }}
          >
            Sign up
          </a>
        </p>
      </div>
    </AuthLayout>
  );
}
