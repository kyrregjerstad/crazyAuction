'use client';

import {
  Column,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import SortIcon from '@/components/icons/SortIcon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ListingFull } from '@/lib/schemas/listingSchema';
import { getMultipleAuctions } from '@/lib/services/auction-api';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

type Props = {
  username: string;
  winIds: string[];
};
const UserWinsTable = ({ username, winIds }: Props) => {
  const { data: wins, isLoading } = useQuery({
    queryKey: ['userWins', winIds, username],
    queryFn: () => getMultipleAuctions(winIds),
  });

  if (isLoading) return <p>Loading...</p>;
  if (!wins) return <p>No wins</p>;

  const transformedData = transformWins(wins);

  return (
    <>
      <DataTable wins={transformedData} />
    </>
  );
};

type ListingOrNull = ListingFull | null;

const transformWins = (wins: ListingOrNull[]) => {
  return wins
    .filter((win) => !!win)
    .map((win) => {
      return {
        ...win,
        sellerName: win!.seller.name,
        price: win!.bids.at(0)?.amount,
        auctionId: win!.id,
      };
    });
};

type TransformWins = ReturnType<typeof transformWins>;

export default UserWinsTable;

const columnHelper = createColumnHelper<TransformWins[0]>();

export const columns = [
  columnHelper.accessor('title', {
    header: ({ column }) => {
      const sortingState = column.getIsSorted();
      const sort =
        sortingState === 'asc'
          ? 'asc'
          : sortingState === 'desc'
            ? 'desc'
            : 'none';

      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          size='sm'
        >
          Title
          <SortIcon sort={sort} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <div className='pl-2 sm:px-4'>
          <Link href={`/item/${id}`} className='hover:underline'>
            {row.getValue('title')}
          </Link>
        </div>
      );
    },
  }),
  columnHelper.accessor('price', {
    header: ({ column }) => {
      const sortingState = column.getIsSorted();
      const sort =
        sortingState === 'asc'
          ? 'asc'
          : sortingState === 'desc'
            ? 'desc'
            : 'none';

      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          size='sm'
        >
          Price
          <SortIcon sort={sort} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('price'));

      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return <div className='sm:px-4'>{formatted}</div>;
    },
  }),
  columnHelper.accessor('endsAt', {
    header: ({ column }) => {
      const sortingState = column.getIsSorted();
      const sort =
        sortingState === 'asc'
          ? 'asc'
          : sortingState === 'desc'
            ? 'desc'
            : 'none';

      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          size='sm'
        >
          Date
          <SortIcon sort={sort} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const formattedDate = new Date(
        row.getValue('endsAt'),
      ).toLocaleDateString();
      return <div className='sm:px-4'>{formattedDate}</div>;
    },
  }),
  columnHelper.accessor('seller', {
    header: ({ column }) => {
      const sortingState = column.getIsSorted();
      const sort =
        sortingState === 'asc'
          ? 'asc'
          : sortingState === 'desc'
            ? 'desc'
            : 'none';

      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          size='sm'
        >
          Seller
          <SortIcon sort={sort} />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const { avatar, name } = getValue() as { avatar: string; name: string };
      return (
        <div className='flex gap-2 pr-2 sm:px-4'>
          <Avatar className='hidden h-6 w-6 border border-accent-500 sm:block'>
            <AvatarImage src={avatar || ''} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <Link href={`/user/${name}`} className='break-all hover:underline'>
            {name}
          </Link>
        </div>
      );
    },
  }),
] as Column<TransformWins[0]>[];

export const DataTable = ({ wins }: { wins: TransformWins }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: wins,
    columns: columns,
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
    <div className='w-full'>
      <div className='flex items-center pb-4'>
        <Input
          placeholder='Filter auctions...'
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('title')?.setFilterValue(event.target.value)
          }
          className='max-w-sm'
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              Columns <ChevronDown className='ml-2 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
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
      <div className='rounded-md border'>
        <Table className='relative'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
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
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
