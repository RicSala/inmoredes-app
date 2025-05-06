import { ParseOptions } from '@/parsing/IFileParser';

export const defaultParseOptions: ParseOptions = {
  header: true,
  skipEmptyLines: true,
  transformHeader: (header: string) => header.trim().toLowerCase(),
};
