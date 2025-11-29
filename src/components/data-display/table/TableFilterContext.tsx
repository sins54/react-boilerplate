import * as React from "react";

interface TableFilterContextValue {
  isFilterOpen: boolean;
  openFilter: () => void;
  closeFilter: () => void;
  toggleFilter: () => void;
}

const TableFilterContext = React.createContext<TableFilterContextValue | null>(null);

export interface TableFilterProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component for managing filter panel open/close state
 */
export function TableFilterProvider({ children }: TableFilterProviderProps) {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const openFilter = React.useCallback(() => setIsFilterOpen(true), []);
  const closeFilter = React.useCallback(() => setIsFilterOpen(false), []);
  const toggleFilter = React.useCallback(() => setIsFilterOpen((prev) => !prev), []);

  const value = React.useMemo(
    () => ({ isFilterOpen, openFilter, closeFilter, toggleFilter }),
    [isFilterOpen, openFilter, closeFilter, toggleFilter]
  );

  return (
    <TableFilterContext.Provider value={value}>
      {children}
    </TableFilterContext.Provider>
  );
}

/**
 * Hook to access filter panel state
 */
export function useTableFilter() {
  const context = React.useContext(TableFilterContext);
  if (!context) {
    throw new Error("useTableFilter must be used within a TableFilterProvider");
  }
  return context;
}

export { TableFilterContext };
