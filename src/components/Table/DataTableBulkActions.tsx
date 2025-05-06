'use client';

import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Table } from '@tanstack/react-table';

export type BulkAction = {
  label: string;
  icon: React.ElementType;
  onClick: (ids: string[]) => Promise<void>;
};

export const FloatingBulkActions = <TData,>({
  label,
  pluralLabel,
  bulkActions,
  table,
}: {
  label: string;
  pluralLabel: string;
  bulkActions: BulkAction[];
  table: Table<TData>;
}) => {
  // get selectedRows from table
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  // @ts-expect-error - TODO: fix this
  const selectedIds = selectedRows.map((row) => row.original.id);

  return (
    <AnimatePresence>
      {selectedRows.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className='bg-primary text-primary-foreground fixed right-4 bottom-12 z-50 mx-auto flex max-w-full items-center gap-2 rounded-lg px-4 py-2 shadow-lg'
        >
          <span className='text-sm font-medium'>
            {selectedRows.length}{' '}
            {selectedRows.length === 1 ? label : pluralLabel}
          </span>
          <div className='bg-primary-foreground/20 h-4 w-px' />
          {bulkActions.map((action) => (
            <Button
              key={action.label}
              variant='ghost'
              size='sm'
              onClick={() => {
                action.onClick(selectedIds);
                table.getToggleAllRowsSelectedHandler();
              }}
              className='hover:bg-primary-400 hover:text-primary-foreground'
            >
              <action.icon className='mr-2 h-4 w-4' />
              <span className='hidden text-xs md:block'>{action.label}</span>
            </Button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
