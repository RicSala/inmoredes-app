'use client';

import { IFileParser, ParseOptions, ParseResult } from '@/parsing/IFileParser';
import { defaultParseOptions } from '@/parsing/defaultParseOptions';
import Papa from 'papaparse';

export class FileParserPapa implements IFileParser {
  async detectColumns(file: File, options?: ParseOptions): Promise<string[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        ...defaultParseOptions,
        ...options,
        preview: 1, // Only parse first row to get headers
        complete: (results) => {
          resolve(results.meta?.fields || []);
        },
        error: (error) => {
          reject(new Error(`CSV column detection error: ${error.message}`));
        },
      });
    });
  }
  async parseFile<T>(
    file: File,
    options?: ParseOptions
  ): Promise<ParseResult<T>> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        ...defaultParseOptions,
        ...options,
        complete: (results) => {
          resolve({
            data: results.data as T[],
            metadata: {
              total: results.data.length + results.errors.length,
              errors: results.errors.length,
              processed: results.data.length,
            },
            // @ts-expect-error - TODO: fix this
            invalidContacts: results.errors.map((error) => ({
              row: error.row,
              message: error.message,
            })),
          });
        },
        error: (error) => {
          reject(new Error(`CSV parsing error: ${error.message}`));
        },
      });
    });
  }
}
