// Define our domain validation error type
export type DomainValidationError = {
  code: string;
  message: string;
};

// Define our server error type - remove null
export type ServerError = DomainValidationError;

// Define our metadata type with required properties
export type ActionMetadata = {
  actionName: string; // Make it required
};
