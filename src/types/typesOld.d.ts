interface AppOptions {
  logger?: boolean;
  mockData?: boolean;
  callbacks?: {
    [key: string]: () => void;
  };
}
interface Window {
  trelliscopeApp: (id: string, config: string, options: AppOptions) => void;
}
