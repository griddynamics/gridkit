export interface TokenViewerProps {
  tokens: Record<string, unknown>;
  path?: string;
  indent?: number;
  tokensDescription?: Record<string, unknown>;
}

export interface JsonNodeProps {
  indent: number;
  value: object | number | string;
  path?: string;
  tokensDescription?: Record<string, unknown>;
}
