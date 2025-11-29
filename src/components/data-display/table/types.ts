import type { ColumnDef, SortingState, PaginationState, ColumnFiltersState } from "@tanstack/react-table";

/**
 * Base table props shared between ClientTable and ServerTable
 */
export interface BaseTableProps<TData> {
  /** Column definitions */
  columns: ColumnDef<TData, unknown>[];
  /** Additional class names for the table container */
  className?: string;
  /** Whether to hide the search input */
  hideSearch?: boolean;
  /** Whether to hide the filter button */
  hideFilter?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Available page sizes */
  pageSizeOptions?: number[];
  /** Initial page size */
  initialPageSize?: number;
  /** Filter panel content renderer */
  filterContent?: React.ReactNode;
  /** Callback when filters are applied */
  onApplyFilters?: () => void;
  /** Callback when filters are reset */
  onResetFilters?: () => void;
}

/**
 * Props for ClientTable (client-side data handling)
 */
export interface ClientTableProps<TData> extends BaseTableProps<TData> {
  /** Full array of data to be filtered, sorted, and paginated client-side */
  data: TData[];
}

/**
 * Server-side table state
 */
export interface ServerTableState {
  pagination: PaginationState;
  sorting: SortingState;
  globalFilter: string;
  columnFilters: ColumnFiltersState;
}

/**
 * Props for ServerTable (server-side data handling)
 */
export interface ServerTableProps<TData> extends BaseTableProps<TData> {
  /** Current page data from the server */
  data: TData[];
  /** Total number of pages */
  pageCount: number;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Callback when table state changes */
  onStateChange: (state: ServerTableState) => void;
  /** Initial state */
  initialState?: Partial<ServerTableState>;
}

/**
 * Column filter definition for filter forms
 */
export interface ColumnFilterDef {
  id: string;
  label: string;
  type: "text" | "select" | "number" | "date";
  options?: { value: string; label: string }[];
  placeholder?: string;
}
