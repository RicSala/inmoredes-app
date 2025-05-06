'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { FileParserPapa } from '@/parsing/FileParserPapa';
import { ParseResult } from '@/parsing/IFileParser';
import { contactBulkCreateAction } from '@/contacts/actions/contactBulkCreateAction';
import {
  contactCreateInputSchema,
  TContactCreateInput,
} from '@/contacts/contactSchemas';
import { ContactGroup } from '@/db/generated/client';
import { ZodError } from 'zod';
import { createLogger } from '@/logging/Logger';

const REQUIRED_COLUMNS = ['name', 'phone', 'surname'];

interface ColumnValidation {
  name: string;
  matched: boolean;
  known: boolean;
  required: boolean;
}

type ContactImportState = {
  isLoading: boolean;
  isValidating: boolean;
  isComplete: boolean;
  file: File | null;
  columns: ColumnValidation[];
  results: ParseResult<any>;
  error: string | null;
};

type ContactImportActions = {
  loadFile: (file: File | null) => void;
  parseFile: (contactGroup: ContactGroup) => Promise<boolean>;
  reset: () => void;
  getColumnStats: () => {
    total: number;
    matched: number;
    mismatched: number;
    required: { total: number; matched: number };
  };
};

export function useContactImport({
  onColumnsDetected,
  onComplete,
}: {
  onColumnsDetected: (columns: ColumnValidation[]) => void;
  onComplete: (data: any[]) => void;
}): [ContactImportState, ContactImportActions] {
  const [state, setState] = useState<ContactImportState>({
    isLoading: false,
    isValidating: false,
    isComplete: false,
    file: null,
    columns: [],
    results: {
      data: [],
      invalidContacts: [],
      metadata: {
        total: 0,
        errors: 0,
        processed: 0,
      },
    },
    error: null,
  });

  const fileParser = new FileParserPapa();

  const loadFile = (file: File | null) => {
    setState((prev) => ({
      ...prev,
      file,
      columns: [],
      data: [],
      errors: [],
      error: null,
      isComplete: false,
    }));

    if (file) {
      detectColumns(file);
    }
  };

  const detectColumns = async (file: File) => {
    setState((prev) => ({ ...prev, isValidating: true }));

    try {
      const fields = await fileParser.detectColumns(file);

      if (!fields || fields.length === 0) {
        toast.error('No columns detected in the file');
        setState((prev) => ({
          ...prev,
          isValidating: false,
          error: 'No columns detected in the file',
        }));
        return;
      }

      // known columns
      const columnValidations = REQUIRED_COLUMNS.map((col) => ({
        name: col,
        matched: fields.includes(col),
        required: true,
        known: true,
      }));

      // add those that are not in the required columns but are in the file
      fields.forEach((col) => {
        if (!columnValidations.some((cv) => cv.name === col)) {
          columnValidations.push({
            name: col,
            matched: false,
            required: false,
            known: false,
          });
        }
      });

      // Check if all required columns are present and matched
      const missingRequired = columnValidations.filter(
        (col) => col.required && !col.matched
      );

      if (missingRequired.length > 0) {
        toast.warning(
          `Missing required columns: ${missingRequired
            .map((col) => col.name)
            .join(', ')}. 
          Please check your file format.`
        );
      } else {
        toast.success('File structure validated successfully');
      }

      onColumnsDetected(columnValidations);
      setState((prev) => ({
        ...prev,
        isValidating: false,
        columns: columnValidations,
      }));
    } catch (error) {
      toast.error(
        'Error validating file: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
      setState((prev) => ({
        ...prev,
        isValidating: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  };

  const parseFile = async (contactGroup: ContactGroup) => {
    if (!state.file) {
      toast.error('No file selected');
      setState((prev) => ({
        ...prev,
        error: 'No file selected',
      }));
      return false;
    }

    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      // Parse the file
      const data = await fileParser.parseFile<any>(state.file!);

      const validContacts: TContactCreateInput[] = [];
      const invalidContacts: (TContactCreateInput & {
        row: number;
        errors: ZodError;
      })[] = [];

      for (let i = 0; i < data.data.length; i++) {
        try {
          const validContact = contactCreateInputSchema.parse(data.data[i]);
          validContacts.push(validContact);
        } catch (error) {
          if (error instanceof ZodError) {
            logger.error('Invalid contact', data.data[i]);
          }
          invalidContacts.push({
            ...data.data[i],
            row: i,
            errors: error instanceof ZodError ? error.errors : [],
          });
        }
      }

      await contactBulkCreateAction({
        contacts: validContacts,
        defaultGroup: contactGroup,
      });

      setState((prev) => ({
        ...prev,
        isLoading: false,
        results: {
          data: validContacts,
          invalidContacts,
          metadata: {
            total: validContacts.length,
            errors: invalidContacts.length,
            processed: validContacts.length,
          },
        },
      }));

      onComplete(validContacts);

      return true;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      }));
      toast.error(
        'Error validating file: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
      return false;
    }
  };

  const reset = () => {
    setState({
      isLoading: false,
      isValidating: false,
      isComplete: false,
      file: null,
      columns: [],
      results: {
        data: [],
        invalidContacts: [],
        metadata: {
          total: 0,
          errors: 0,
          processed: 0,
        },
      },
      error: null,
    });
  };

  const getColumnStats = () => {
    const columns = state.columns;
    const requiredColumns = columns.filter((col) => col.required);

    return {
      total: columns.length,
      matched: columns.filter((col) => col.matched).length,
      mismatched: columns.filter((col) => !col.matched).length,
      required: {
        total: REQUIRED_COLUMNS.length,
        matched: requiredColumns.filter((col) => col.matched).length,
      },
    };
  };

  return [
    state,
    {
      loadFile,
      parseFile,
      reset,
      getColumnStats,
    },
  ];
}

const logger = createLogger('useContactImport');
