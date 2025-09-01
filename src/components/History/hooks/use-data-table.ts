"use client";

import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  type Updater,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  type Parser,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  type UseQueryStateOptions,
  useQueryState,
  useQueryStates,
} from "nuqs";
import * as React from "react";

import { useDebouncedCallback } from "./use-debounced-callback";
import { getSortingStateParser } from "@/components/History/lib/parsers";
import type { ExtendedColumnSort } from "@/components/History/types/data-table";
import {
  collection,
  endBefore,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  startAfter,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { OrgBed } from "@/types/FormTypes";
import { checkPageAccess } from "@/app/dashboard/history/(history)/_actions";

const PAGE_KEY = "page";
const PER_PAGE_KEY = "perPage";
const SORT_KEY = "sort";
const ARRAY_SEPARATOR = ",";
const DEBOUNCE_MS = 300;
const THROTTLE_MS = 50;

interface UseDataTableProps<TData>
  extends Omit<
      TableOptions<TData>,
      | "state"
      | "pageCount"
      | "getCoreRowModel"
      | "manualFiltering"
      | "manualPagination"
      | "manualSorting"
    >,
    Required<Pick<TableOptions<TData>, "pageCount">> {
  initialState?: Omit<Partial<TableState>, "sorting"> & {
    sorting?: ExtendedColumnSort<TData>[];
  };
  history?: "push" | "replace";
  debounceMs?: number;
  throttleMs?: number;
  clearOnDefault?: boolean;
  enableAdvancedFilter?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  orgId: string | null | undefined;
  orgRole: string | null | undefined;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  startTransition?: React.TransitionStartFunction;
}

export function useDataTable<TData>(props: UseDataTableProps<TData>) {
  const {
    orgId,
    orgRole,
    columns,
    pageCount = -1,
    initialState,
    history = "replace",
    debounceMs = DEBOUNCE_MS,
    throttleMs = THROTTLE_MS,
    clearOnDefault = false,
    enableAdvancedFilter = false,
    scroll = false,
    shallow = true,
    startTransition,
    loading,
    setLoading,
    error,
    setError,
    ...tableProps
  } = props;

  const queryStateOptions = React.useMemo<
    Omit<UseQueryStateOptions<string>, "parse">
  >(
    () => ({
      history,
      scroll,
      shallow,
      throttleMs,
      debounceMs,
      clearOnDefault,
      startTransition,
    }),
    [
      history,
      scroll,
      shallow,
      throttleMs,
      debounceMs,
      clearOnDefault,
      startTransition,
    ]
  );

  const [data, setData] = React.useState<TData[]>([]);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [firstDoc, setFirstDoc] = React.useState<any | null>(null);
  const [lastDoc, setLastDoc] = React.useState<any | null>(null);

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    initialState?.rowSelection ?? {}
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialState?.columnVisibility ?? {});

  const [page, setPage] = useQueryState(
    PAGE_KEY,
    parseAsInteger.withOptions(queryStateOptions).withDefault(1)
  );
  const [perPage, setPerPage] = useQueryState(
    PER_PAGE_KEY,
    parseAsInteger
      .withOptions(queryStateOptions)
      .withDefault(initialState?.pagination?.pageSize ?? 5)
  );

  const pagination: PaginationState = React.useMemo(() => {
    return {
      pageIndex: page - 1, // zero-based index -> one-based index
      pageSize: perPage,
    };
  }, [page, perPage]);

  const onPaginationChange = React.useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      if (typeof updaterOrValue === "function") {
        const newPagination = updaterOrValue(pagination);
        void setPage(newPagination.pageIndex + 1);
        void setPerPage(newPagination.pageSize);
      } else {
        void setPage(updaterOrValue.pageIndex + 1);
        void setPerPage(updaterOrValue.pageSize);
      }
    },
    [pagination, setPage, setPerPage]
  );

  const columnIds = React.useMemo(() => {
    return new Set(
      columns.map((column) => column.id).filter(Boolean) as string[]
    );
  }, [columns]);

  const [sorting, setSorting] = useQueryState(
    SORT_KEY,
    getSortingStateParser<TData>(columnIds)
      .withOptions(queryStateOptions)
      .withDefault(initialState?.sorting ?? [])
  );

  const onSortingChange = React.useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      if (typeof updaterOrValue === "function") {
        const newSorting = updaterOrValue(sorting);
        setSorting(newSorting as ExtendedColumnSort<TData>[]);
      } else {
        setSorting(updaterOrValue as ExtendedColumnSort<TData>[]);
      }
      setPage(1);
      setFirstDoc(null);
    },
    [sorting, setSorting]
  );

  const filterableColumns = React.useMemo(() => {
    if (enableAdvancedFilter) return [];

    return columns.filter((column) => column.enableColumnFilter);
  }, [columns, enableAdvancedFilter]);

  const filterParsers = React.useMemo(() => {
    if (enableAdvancedFilter) return {};

    return filterableColumns.reduce<
      Record<string, Parser<string> | Parser<string[]>>
    >((acc, column) => {
      if (column.meta?.options) {
        acc[column.id ?? ""] = parseAsArrayOf(
          parseAsString,
          ARRAY_SEPARATOR
        ).withOptions(queryStateOptions);
      } else {
        acc[column.id ?? ""] = parseAsString.withOptions(queryStateOptions);
      }
      return acc;
    }, {});
  }, [filterableColumns, queryStateOptions, enableAdvancedFilter]);

  const [filterValues, setFilterValues] = useQueryStates(filterParsers);

  const debouncedSetFilterValues = useDebouncedCallback(
    (values: typeof filterValues) => {
      void setPage(1);
      void setFilterValues(values);
    },
    debounceMs
  );

  const initialColumnFilters: ColumnFiltersState = React.useMemo(() => {
    if (enableAdvancedFilter) return [];

    return Object.entries(filterValues).reduce<ColumnFiltersState>(
      (filters, [key, value]) => {
        if (value !== null) {
          const processedValue = Array.isArray(value)
            ? value
            : typeof value === "string" && /[^a-zA-Z0-9]/.test(value)
            ? value.split(/[^a-zA-Z0-9]+/).filter(Boolean)
            : [value];

          filters.push({
            id: key,
            value: processedValue,
          });
        }
        return filters;
      },
      []
    );
  }, [filterValues, enableAdvancedFilter]);

  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(initialColumnFilters);

  const onColumnFiltersChange = React.useCallback(
    (updaterOrValue: Updater<ColumnFiltersState>) => {
      if (enableAdvancedFilter) return;

      setColumnFilters((prev) => {
        const next =
          typeof updaterOrValue === "function"
            ? updaterOrValue(prev)
            : updaterOrValue;

        const filterUpdates = next.reduce<
          Record<string, string | string[] | null>
        >((acc, filter) => {
          if (filterableColumns.find((column) => column.id === filter.id)) {
            acc[filter.id] = filter.value as string | string[];
          }
          return acc;
        }, {});

        for (const prevFilter of prev) {
          if (!next.some((filter) => filter.id === prevFilter.id)) {
            filterUpdates[prevFilter.id] = null;
          }
        }

        void setPage(1);
        setFirstDoc(null);

        debouncedSetFilterValues(filterUpdates);
        return next;
      });
    },
    [debouncedSetFilterValues, filterableColumns, enableAdvancedFilter]
  );

  const stableSorting = React.useMemo(() => sorting, [JSON.stringify(sorting)]);

  const stablePagination = React.useMemo(
    () => ({ pageIndex: pagination.pageIndex, pageSize: pagination.pageSize }),
    [pagination.pageIndex, pagination.pageSize]
  );

  React.useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    if (!orgId || !orgRole || !checkPageAccess(orgRole, "Admissions")) {
      setError("User is not authorized for this organization.");
      setLoading(false);
      return;
    }

    try {
      const bedsCollectionRef = collection(db, "doctor", orgId, "beds");
      const constraints: QueryConstraint[] = [];

      // sorting
      if (stableSorting.length > 0) {
        const sort = stableSorting[0];
        constraints.push(orderBy(sort.id, sort.desc ? "desc" : "asc"));
      } else {
        constraints.push(orderBy("admission_at", "desc"));
      }

      // pagination cursor
      if (page > 1 && lastDoc && pagination.pageIndex > 0) {
        // when going forward
        constraints.push(startAfter(lastDoc));
      }
      if (page < pagination.pageIndex + 1 && firstDoc) {
        // when going backward
        constraints.push(endBefore(firstDoc));
      }

      constraints.push(limit(stablePagination.pageSize));

      const admissionsQuery = query(bedsCollectionRef, ...constraints);
      const snapshot = await getDocs(admissionsQuery);

      // cache first & last doc of this page
      setFirstDoc(snapshot.docs[0] ?? null);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] ?? null);

      const countSnap = await getCountFromServer(bedsCollectionRef);
      setTotalRecords(countSnap.data().count);

      const mapped = snapshot.docs.map((doc) => {
        const d = doc.data() as OrgBed;
        return {
          bedBookingId: d.bedBookingId,
          bedId: d.bedId,
          patient_id: d.patient_id,
          admission_at: d.admission_at,
          discharge_at: d.discharge_at,
          dischargeMarked: d.dischargeMarked ? "YES" : "NO",
          admission_by: d.admission_by.name,
          admission_for: d.admission_for.name,
          discharged_by: d.discharged_by?.name,
        } as TData;
      });

      setData(mapped);
    } catch (err) {
      console.error(err);
      setError("Failed to load admissions.");
    } finally {
      setLoading(false);
    }
  };

  if (orgId) {
    void fetchData();
  }
}, [orgId, page, stablePagination, stableSorting]);

console.log("data : ",data)
  const table = useReactTable({
    ...tableProps,
    columns,
    data,
    initialState,
    pageCount,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    defaultColumn: {
      ...tableProps.defaultColumn,
      enableColumnFilter: false,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  return { table, shallow, debounceMs, throttleMs };
}
