import { DashboardLayout } from "../components/layouts/DashboardLayout";
import { SectionErrorBoundary } from "../components/feedback/SectionErrorBoundary";
import { toast } from "sonner";

/**
 * Demo dashboard page to showcase the DashboardLayout component.
 * 
 * Note: To see navigation items in the sidebar, you need to be authenticated
 * with appropriate permissions. For demo purposes, we mock this with AuthContext.
 */
export default function DashboardDemoPage() {
  const handleToastDemo = (type: "success" | "error" | "warning" | "info") => {
    const messages = {
      success: "Operation completed successfully!",
      error: "Something went wrong. Please try again.",
      warning: "Please review your changes before saving.",
      info: "New updates are available.",
    };
    toast[type](messages[type]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--color-text)" }}
          >
            Dashboard
          </h1>
          <p style={{ color: "var(--color-text-muted)" }}>
            Welcome to your dashboard. This is a demo of the DashboardLayout component.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: "2,543", change: "+12%" },
            { label: "Active Sessions", value: "1,234", change: "+5%" },
            { label: "Revenue", value: "$45,231", change: "+23%" },
            { label: "Conversion Rate", value: "3.24%", change: "-2%" },
          ].map((stat) => (
            <SectionErrorBoundary key={stat.label}>
              <div
                className="p-4 rounded-[length:var(--radius-lg)]"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {stat.label}
                </p>
                <p
                  className="text-2xl font-bold mt-1"
                  style={{ color: "var(--color-text)" }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-sm mt-1"
                  style={{
                    color: stat.change.startsWith("+")
                      ? "var(--color-success)"
                      : "var(--color-error)",
                  }}
                >
                  {stat.change} from last month
                </p>
              </div>
            </SectionErrorBoundary>
          ))}
        </div>

        {/* Toast Demo Section */}
        <div
          className="p-6 rounded-[length:var(--radius-lg)]"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--color-text)" }}
          >
            Toast Notification Demo
          </h2>
          <p
            className="mb-4"
            style={{ color: "var(--color-text-muted)" }}
          >
            Click buttons below to see different toast notifications:
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleToastDemo("success")}
              className="px-4 py-2 rounded-[length:var(--radius-md)] text-sm font-medium"
              style={{
                backgroundColor: "var(--color-success)",
                color: "var(--color-text-on-primary)",
              }}
            >
              Success Toast
            </button>
            <button
              onClick={() => handleToastDemo("error")}
              className="px-4 py-2 rounded-[length:var(--radius-md)] text-sm font-medium"
              style={{
                backgroundColor: "var(--color-error)",
                color: "var(--color-text-on-primary)",
              }}
            >
              Error Toast
            </button>
            <button
              onClick={() => handleToastDemo("warning")}
              className="px-4 py-2 rounded-[length:var(--radius-md)] text-sm font-medium"
              style={{
                backgroundColor: "var(--color-warning)",
                color: "var(--color-text-on-primary)",
              }}
            >
              Warning Toast
            </button>
            <button
              onClick={() => handleToastDemo("info")}
              className="px-4 py-2 rounded-[length:var(--radius-md)] text-sm font-medium"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-text-on-primary)",
              }}
            >
              Info Toast
            </button>
          </div>
        </div>

        {/* Features List */}
        <div
          className="p-6 rounded-[length:var(--radius-lg)]"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--color-text)" }}
          >
            DashboardLayout Features
          </h2>
          <ul className="space-y-2">
            {[
              "Collapsible sidebar (state persisted to localStorage)",
              "Sticky header with theme toggle",
              "User avatar dropdown with profile/settings/logout",
              "Scrollable main content area with proper padding",
              "Mobile: Sidebar becomes a drawer/sheet",
              "Navigation items filtered based on user permissions (RBAC)",
            ].map((feature, index) => (
              <li
                key={index}
                className="flex items-center gap-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  style={{ color: "var(--color-success)" }}
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
