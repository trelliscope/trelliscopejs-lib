export interface DisplayItem {
  desc: string;
  group: string;
  height: number;
  keySig: string;
  n: number;
  name: string;
  order: number;
  updated: string;
  width: number;
}

export interface DisplayGroups {
  [key: string]: number[];
}

export interface Config {
  cog_server: {
    info: {
      base: string;
    };
    type: string;
  };
  config_base: string;
  data_type: string;
  display_base: string;
  has_legend: boolean;
  split_layout: boolean;
}

export interface SelectedDisplay {
  desc: string;
  group: string;
  name: string;
}
