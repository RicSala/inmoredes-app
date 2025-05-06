export type ParseOptions = {
  header?: boolean;
  skipEmptyLines?: boolean;
  transformHeader?: (header: string) => string;
  [key: string]: any;
};

export type ParseResult<T> = {
  data: T[];
  invalidContacts: (T & { row: number })[];
  metadata: {
    total: number;
    errors: number;
    processed: number;
  };
};

export interface IFileParser {
  detectColumns(file: File, options?: ParseOptions): Promise<string[]>;
  parseFile<T>(file: File, options?: ParseOptions): Promise<ParseResult<T>>;
}
