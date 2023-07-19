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

type SidebarType =
  | 'Panel Grid Layout'
  | 'Filter Panels'
  | 'Sort Panels'
  | 'Show/Hide Labels'
  | 'Views'
  | 'Configuration'
  | '';
