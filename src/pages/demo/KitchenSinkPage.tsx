import * as React from "react";
import { useTranslation } from "react-i18next";
import { type ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { ServerTable, type ServerTableState } from "@/components/data-display/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from "@/components/data-display";
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/overlay";
import { Form, Input, Select } from "@/components/form";
import { LanguageSwitcher } from "@/components/ui";
import { useFetch } from "@/hooks/useFetch";
import { useGenericMutation } from "@/hooks/useGenericMutation";

// Badge type matching MSW handler
interface BadgeItem {
  id: string;
  name: string;
  status: "active" | "inactive" | "pending";
  createdAt: string;
}

interface BadgesResponse {
  data: BadgeItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Form schema with i18n validation messages
function useCreateBadgeSchema() {
  const { t } = useTranslation("validation");
  
  return React.useMemo(() => z.object({
    name: z.string().min(1, t("required", { field: "Name" })).min(3, t("min", { field: "Name", min: 3 })),
    status: z.enum(["active", "inactive", "pending"], {
      message: t("required", { field: "Status" }),
    }),
  }), [t]);
}

type CreateBadgeFormData = z.infer<ReturnType<typeof useCreateBadgeSchema>>;

/**
 * Create Badge Modal Component
 */
function CreateBadgeModal({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useTranslation(["demo", "common", "validation"]);
  const [open, setOpen] = React.useState(false);
  
  const schema = useCreateBadgeSchema();
  
  const form = useForm<CreateBadgeFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      status: "pending",
    },
  });

  const createBadgeMutation = useGenericMutation<BadgeItem, CreateBadgeFormData>({
    method: "POST",
    url: "/badges",
    invalidateKeys: [["badges"]],
    disableToast: true,
    onSuccess: () => {
      toast.success(t("demo:success.badgeCreated"));
      form.reset();
      setOpen(false);
      onSuccess();
    },
    onError: () => {
      toast.error(t("demo:error.badgeCreationFailed"));
    },
  });

  const onSubmit = (data: CreateBadgeFormData) => {
    createBadgeMutation.mutate({ data });
  };

  const statusOptions = [
    { value: "active", label: t("demo:statusActive") },
    { value: "inactive", label: t("demo:statusInactive") },
    { value: "pending", label: t("demo:statusPending") },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t("demo:createBadge")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("demo:createBadgeTitle")}</DialogTitle>
          <DialogDescription>{t("demo:createBadgeDescription")}</DialogDescription>
        </DialogHeader>
        <Form form={form} onSubmit={onSubmit}>
          <Input
            name="name"
            label={t("demo:badgeName")}
            placeholder={t("demo:badgeNamePlaceholder")}
            required
          />
          <Select
            name="status"
            label={t("demo:badgeStatus")}
            placeholder={t("demo:badgeStatusPlaceholder")}
            options={statusOptions}
            required
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              {t("common:buttons.cancel")}
            </Button>
            <Button type="submit" disabled={createBadgeMutation.isPending}>
              {createBadgeMutation.isPending ? t("common:loading") : t("common:buttons.create")}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Kitchen Sink Page - demonstrates all boilerplate systems working together
 */
export default function KitchenSinkPage() {
  const { t } = useTranslation(["demo", "common"]);
  
  // Table state for server-side operations
  const [tableState, setTableState] = React.useState<ServerTableState>({
    pagination: { pageIndex: 0, pageSize: 10 },
    sorting: [],
    globalFilter: "",
    columnFilters: [],
  });

  // Build query params from table state
  const queryParams = React.useMemo(() => ({
    page: tableState.pagination.pageIndex + 1,
    limit: tableState.pagination.pageSize,
    search: tableState.globalFilter || undefined,
  }), [tableState.pagination.pageIndex, tableState.pagination.pageSize, tableState.globalFilter]);

  // Fetch badges from MSW endpoint
  const { data: badgesData, isLoading, refetch } = useFetch<BadgesResponse>(
    ["badges", queryParams],
    "/badges",
    {
      params: queryParams,
    }
  );

  // Table columns with i18n
  const columns: ColumnDef<BadgeItem>[] = React.useMemo(() => [
    {
      accessorKey: "id",
      header: t("demo:table.columnId"),
      cell: ({ row }) => (
        <span
          className="font-[number:var(--font-medium)]"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {row.getValue<string>("id").slice(0, 8)}...
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: t("demo:table.columnName"),
      cell: ({ row }) => (
        <span className="font-[number:var(--font-medium)]">
          {row.getValue("name")}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: t("demo:table.columnStatus"),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const colorScheme =
          status === "active"
            ? "success"
            : status === "inactive"
            ? "error"
            : "warning";
        const label =
          status === "active"
            ? t("demo:statusActive")
            : status === "inactive"
            ? t("demo:statusInactive")
            : t("demo:statusPending");
        return (
          <Badge variant="solid" colorScheme={colorScheme}>
            {label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: t("demo:table.columnCreatedAt"),
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt") as string);
        return (
          <span style={{ color: "var(--color-text-secondary)" }}>
            {date.toLocaleDateString()}
          </span>
        );
      },
    },
  ], [t]);

  const handleStateChange = React.useCallback((state: ServerTableState) => {
    setTableState(state);
  }, []);

  const handleBadgeCreated = () => {
    refetch();
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Header */}
      <header
        className="border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="max-w-7xl mx-auto px-[length:var(--spacing-6)] py-[length:var(--spacing-4)]">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-[length:var(--text-2xl)] font-[number:var(--font-bold)]"
                style={{ color: "var(--color-text)" }}
              >
                {t("demo:pageTitle")}
              </h1>
              <p
                className="text-[length:var(--text-sm)]"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {t("demo:pageDescription")}
              </p>
            </div>
            <div className="flex items-center gap-[length:var(--spacing-4)]">
              <LanguageSwitcher showLabel />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-[length:var(--spacing-6)] py-[length:var(--spacing-8)]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t("demo:table.title")}</CardTitle>
                <CardDescription>{t("demo:table.description")}</CardDescription>
              </div>
              <CreateBadgeModal onSuccess={handleBadgeCreated} />
            </div>
          </CardHeader>
          <CardContent>
            <ServerTable
              data={badgesData?.data ?? []}
              columns={columns}
              pageCount={badgesData?.meta?.totalPages ?? 0}
              totalRows={badgesData?.meta?.total ?? 0}
              isLoading={isLoading}
              onStateChange={handleStateChange}
              initialPageSize={10}
              searchPlaceholder={t("demo:table.searchPlaceholder")}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
