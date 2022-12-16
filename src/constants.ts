export const SB_PANEL_LAYOUT = 'Panel Grid Layout' as string;
export const SB_PANEL_FILTER = 'Filter Panels' as string;
export const SB_PANEL_SORT = 'Sort Panels' as string;
export const SB_PANEL_LABELS = 'Show/Hide Labels' as string;
export const SB_VIEWS = 'Views' as string;
export const SB_CONFIG = 'Configuration' as string;

export const SB_LOOKUP = [SB_PANEL_LAYOUT, SB_PANEL_FILTER, SB_PANEL_SORT, SB_PANEL_LABELS, SB_VIEWS] as SidebarType[];
export const SB_REV_LOOKUP = {} as { [k: string]: number };
SB_LOOKUP.forEach((d, i) => {
  SB_REV_LOOKUP[d] = i;
});
SB_REV_LOOKUP[''] = -1;
