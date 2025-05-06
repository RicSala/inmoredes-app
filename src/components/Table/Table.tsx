'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import { DataTablePagination } from '@/components/Table/DataTablePagination';
import { DataTableViewOptions } from '@/components/Table/DataTableColumnToggle';
import { useRouter } from 'next/navigation';
import {
  BulkAction,
  FloatingBulkActions,
} from '@/components/Table/DataTableBulkActions';
import { Trash, Users } from 'lucide-react';
import { toast } from 'sonner';
import { contactDeleteManyAction } from '@/contacts/actions/contactDeleteManyAction';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  resourceBasePath: string;
}

export function DataTable<TData, TValue>({
  columns,
  resourceBasePath,
  data,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const router = useRouter();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  const bulkActions: BulkAction[] = [
    {
      label: 'Delete',
      icon: Trash,
      onClick: async (ids) => {
        await contactDeleteManyAction({ ids });
        toast.success('Contacts deleted');
        router.refresh();
      },
    },
    {
      label: 'Change group',
      icon: Users,
      onClick: async (ids) => {
        await contactDeleteManyAction({ ids });
        toast.success('Contacts deleted');
        router.refresh();
      },
    },
  ];

  return (
    <div>
      <DataTableViewOptions table={table} />
      <div className='rounded-md border'>
        <Table>
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
                  className='cursor-pointer'
                  onClick={() => {
                    // @ts-expect-error - TODO: fix this
                    router.push(`${resourceBasePath}/${row.original.id!}`);
                  }}
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
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
      <div className='flex items-center justify-end space-x-2 py-4'>
        <DataTablePagination table={table} />
      </div>
      <FloatingBulkActions
        label='Contact'
        pluralLabel='Contacts'
        bulkActions={bulkActions}
        table={table}
      />
    </div>
  );
}
