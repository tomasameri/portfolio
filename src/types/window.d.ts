interface Window {
  ethereum?: {
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    on: (event: string, handler: (accounts: string[]) => void) => void;
    removeListener: (event: string, handler: (accounts: string[]) => void) => void;
  };
}

