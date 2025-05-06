'use client';

import { DataTableColumnHeader } from '@/components/Table/ColumnHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { contactDeleteAction } from '@/contacts/actions/contactDeleteAction';
import { cn } from '@/lib/utils';

import { ColumnDef } from '@tanstack/react-table';
import { CopyIcon, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  group: string;
};

export const contactTableColumns: ColumnDef<Contact>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        onClick={(e) => {
          e.stopPropagation();
        }}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      const id = row.getValue('id') as string;
      return (
        <div
          className='group relative max-w-20 truncate pr-4 text-left font-medium'
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(id);
            toast.success('ID copied to clipboard');
          }}
          title={id}
        >
          {id}
          <CopyIcon className='absolute top-0 right-0 h-4 w-4 text-slate-500 opacity-0 transition-opacity group-hover:opacity-100' />
        </div>
      );
    },
  },
  {
    accessorKey: 'name',
    header: 'Nombre',
    cell: ({ row }) => {
      const name = row.getValue('name') as string;
      return <div className='text-left font-medium'>{name}</div>;
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
  },
  {
    accessorKey: 'group',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Grupo' />
    ),
    cell: ({ row }) => {
      const group = row.getValue('group') as string;
      return (
        <Badge
          className={cn(
            'bg-blue-500',
            group === 'GROUP_1' &&
              'border-emerald-500 bg-emerald-50 text-emerald-500',
            group === 'GROUP_2' &&
              'border-yellow-500 bg-yellow-50 text-yellow-500',
            group === 'GROUP_3' &&
              'border-purple-500 bg-purple-50 text-purple-500'
          )}
          variant='outline'
        >
          {group}
        </Badge>
      );
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => {
      const payment = row.original;

      // TODO: why this works fine?
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const router = useRouter();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='h-8 w-8 p-0'
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(payment.id);
                toast.success('ID copied to clipboard');
              }}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                router.push(`/app/contacts/${payment.id}`);
              }}
            >
              View customer
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                await contactDeleteAction({ id: payment.id });
                toast.success('Contact deleted');
                router.refresh();
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
