"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Settings2Icon,
  ArrowUpDown,
  MoreHorizontal,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  collection,
  endBefore,
  getCountFromServer,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/firebase/firebaseConfig";
import {
  RazorPayPaymentTypes,
  RazorPaySubscriptionTypes,
} from "@/types/SubscriptionTypes";
import { useAuth } from "@clerk/nextjs";

export type RazorpayWebhookPayload = {
  event: string;
  subscription?: RazorPaySubscriptionTypes;
  payment?: RazorPayPaymentTypes;
};

export type Payment = {
  id: string;
  amount: number;
  status: string;
  email: string;
  created_at?: number;
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: () => <div className="text-left pl-4">Status</div>,
    cell: ({ row }) => (
      <div className="capitalize pl-4">{row.getValue("status")}</div>
    ),
    enableHiding: true,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    enableHiding: true,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
    enableHiding: true,
  },
  {
    id: "actions",
    header: ({ header }) => {
      return (
        <div className="text-right pr-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <Settings2Icon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {header
                .getContext()
                .table.getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <div className="text-right pr-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payment.id)}
              >
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

const pageSize = 10;

const BillActivity = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const { orgId, isLoaded } = useAuth();

  // firestore pagination --- start
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState<Payment[]>([]);
  const [page, setPage] = useState<number>(1);
  const [currentDocs, setcurrentDocs] = useState<QueryDocumentSnapshot[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      if (orgId && isLoaded) {
        setIsLoading(true);

        const collectionRef = collection(db, "doctor", orgId, "subscriptions");

        const [snapshot, countSnapshot] = await Promise.all([
          getDocs(
            query(
              collectionRef,
              orderBy("subscription.created_at", "desc"),
              limit(pageSize)
            )
          ),
          getCountFromServer(collectionRef),
        ]);

        setTotalCount(countSnapshot.data().count);
        setcurrentDocs(snapshot.docs);

        const items: Payment[] = snapshot.docs.map((doc) => {
          const data = doc.data() as RazorpayWebhookPayload;
          return {
            id: doc.id,
            amount: 0,
            status: data.event,
            email: "unknown@gmail.com",
            created_at: data.subscription?.created_at,
          };
        });

        setPage(1);
        setList(items);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isLoaded, orgId]);

  const showNext = () => {
    if (list.length === 0) {
      alert("Thats all we have for now !");
    } else {
      const fetchNextData = async () => {
        if (orgId && isLoaded) {
          setIsLoading(true);
          const snapshot = await getDocs(
            query(
              collection(db, "doctor", orgId, "subscriptions"),
              orderBy("subscription.created_at", "desc"),
              limit(pageSize),
              startAfter(currentDocs[currentDocs.length - 1])
            )
          );
          setcurrentDocs(snapshot.docs);
          const items: Payment[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data() as RazorpayWebhookPayload;
            items.push({
              id: doc.id,
              amount: 0,
              status: data.event,
              email: "unknown@gmail.com",
              created_at: data.subscription?.created_at,
            });
          });
          setList(items);
          setPage(page + 1);
          if (table.getCanNextPage()) table.nextPage();
          setIsLoading(false);
        }
      };
      fetchNextData();
    }
  };

  const showPrevious = () => {
    const fetchPreviousData = async () => {
      if (orgId && isLoaded) {
        setIsLoading(true);
        const snapshot = await getDocs(
          query(
            collection(db, "doctor", orgId, "subscriptions"),
            orderBy("subscription.created_at", "desc"),
            limitToLast(pageSize),
            endBefore(currentDocs[0])
          )
        );
        setcurrentDocs(snapshot.docs);
        const items: Payment[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data() as RazorpayWebhookPayload;
          items.push({
            id: doc.id,
            amount: 0,
            status: data.event,
            email: "unknown@gmail.com",
            created_at: data.subscription?.created_at,
          });
        });
        setList(items);
        setPage(page - 1);
        if (table.getCanPreviousPage()) table.previousPage();
        setIsLoading(false);
      }
    };
    fetchPreviousData();
  };

  // firestore pagination --- end

  const table = useReactTable({
    initialState: {
      pagination: {
        pageSize,
      },
    },
    data: list,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <Card className="p-0 w-full shadow-none border overflow-hidden">
        <CardHeader className="border-b p-4 bg-sidebar/70">
          <CardTitle className="font-medium tracking-normal">
            Billing Activity & Invoices
          </CardTitle>
          <CardDescription hidden></CardDescription>
        </CardHeader>
        <CardContent className="p-0 w-full">
          {isLoading ? (
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors bg-muted/50">
                  {[...Array(5)].map((_, i) => (
                    <th
                      key={i}
                      className="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
                    >
                      <Skeleton className="h-3 w-[100px]" />
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="[&_tr:last-child]:border-0">
                {[...Array(pageSize)].map((_, i) => (
                  <tr key={i} className="border-b">
                    {[...Array(5)].map((_, i) => (
                      <td key={i} className="py-[14px] px-2 align-middle h-min">
                        <Skeleton className="h-5 w-[100px]" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow className="bg-muted/50" key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="hover:bg-transparent text-muted-foreground">
                    <TableCell
                      colSpan={columns.length}
                      className="h-28 text-center"
                    >
                      No billing activity found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="border-t py-2 px-4 flex items-center justify-between space-x-2 gap-4 flex-row bg-sidebar/70">
          <div className="text-sm text-muted-foreground hidden sm:block">
            {`${list.length} row(s)`}
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4 md:space-x-6">
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {page} of {Math.ceil(totalCount / pageSize)}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => showPrevious()}
                disabled={page === 1 || isLoading}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => showNext()}
                disabled={
                  list.length < pageSize ||
                  isLoading ||
                  list.length === totalCount
                }
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight />
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default BillActivity;
