// Note: an app "instance" consists of a directory that contains the app
// code and subdirectories containing any number of "dipslays"

// Config for an app instance (that can include many displays)
// Note that everything except display_base should probably be defined
// at the "Display" level as the data type, etc., could vary by display.
interface Config {
  display_base: '/displays/' | '/__self__/';
  data_type: 'json' | 'jsonp';
  cog_server: CogServer; // tells the app how to access the "cognostics" data
  split_layout: boolean; // currently not used and probably won't be
  has_legend: boolean; // currently not used and probably won't be
  require_token: boolean; // should remove this and its functionality
  disclaimer: boolean; // should remove this and its functionality
}

interface CogServer {
  type: 'jsonp' | 'json'; // in the future this could be a REST endpoint, etc.
  // The "info" below is additional info for the given "type" of cog server.
  // For type "jsonp" or "json", the only "info" we need is the base directory
  // where the cognostics data can be found. Note that even this is not
  // correct because this directory currently only contains the
  // "displayList.json/jsonp" file and then subdirectories contain the
  // actual cognostics.
  // In the future, there may be CogServer with type: "REST" and in that
  // case "info" could be an object that contains information about
  // the URL, header content, etc.
  info: { base: string };
}

// Group as used in DisplayObject below should just be a string.
// The 'group' attribute was added to allow the organization of potentially
// many displays. For example, suppose an app has 20 displays but these can
// be conceptually organized into 3 groups, the app will present the list
// of displays by these groups to help navigate to the display of interest.
type Group = 'common' | 'condVar' | 'panelKey';

// Each of these are entries in the "DisplayList", which is a list of all
// displays associated with the current app instance.
// This information is repeated inside "DisplayObject" so it is redundant.
// It's possible we don't need the DisplayList. If each DisplayObject
// had its own unique ID, this could just be an array of those IDs.
interface Display {
  // ?
  group: Group; // see note above
  // Name of the display. Should be a string with no spaces or special
  // characters other than underscore (I think - maybe it's more permissive).
  name: string; 
  desc: string; // Free text description of the display. 
  n: number; // Number of panels. Name should probably be more descriptive.
  // Below is correct but in some of my examples it looks like it is storing
  // the contents of R's "order()" function. Oops.
  order: number;
  height: number; // Height of the panels corresponding to this display.
  width: number; // Width of the panels corresponding to this display.
  // Note: the height and width are relative to however much screen space
  // is available in the app. Basically the important metric here is the
  // aspect ratio of the plot, which we want to preserve. If you are curious,
  // here is a reference as to why sticking to a good aspect ratio is a good
  // practice in statistical visualization:
  // http://vis.stanford.edu/papers/banking
  // Anyway, we could instead store the aspect ratio as that's more concise.
  updated: string; // Date when display was updated (is there a TS date type?)
  // keySig is a "signature" of the panel keys. Every display has a file
  // "cogData.json/jsonp" which is a table of all of the cognostics.
  // One required field in this table is the "panelKey". This uniquely
  // defines a panel. The "keySig" is an md5 has of the sorted panelKeys.
  // This is used with "related displays" where we want to identify
  // all displays that have the same set of panel keys.
  keySig: string;
}

interface DisplayObject {
  // Note: currently each display is uniquely defined by its name and group.
  // Instead we could identify with with a guid as mentioned earlier and
  // not repeat the name, group, etc. in the DisplayList
  name: string; // Name of the display.
  // ?
  group: Group; // See my notes on Group above.
  desc: string;  // Free text description of the display. 
  // 
  mdDesc: string; // Optional longer-form markdown text describing the display.
  mdTitle: string; // Optional title for the markdown description dialog.
  // Below: should the mdDesc dialog be shown on the launch of the display?
  showMdDesc: boolean;
  updated: string; // Date the display was updated (see above).
  n: number; // Number of panels (see above).
  height: number; // Height of panels (see above).
  width: number; // Width of panels (see above).
  // "order" indicates what order the display should be listed in the
  // DisplayList component if there are multiple displays.
  order: number;
  has_legend: boolean; // Not used.
  has_inputs: boolean; // Does this display have inputs?
  // Currently the only way inputs are stored in in localStorage.
  // So this is the only option if inputs are being used.
  input_type: 'localStorage' | undefined;
  // Email address to send the inputs to when the user specifies to do so.
  // This is a niche feature that I would love to generalize.
  input_email: string;
  // Should be an array of strings. These strings must be a field name
  // found in CogData. The idea of this is that currently a user can
  // export all inputs that have been entered in a csv file. But they
  // might also want to export other cognostics associated with the panels
  // for additional context. Ideally this wouldn't be hard-coded here but
  // would be a UI option for the user to specify what columns they want to
  // export.
  input_csv_vars: Array;
  // I honestly don't remember what this is :). In the code it looks like
  // it's being used to set and get the input values (so in the currently-
  // implemented case, set and get from localStorage)
  input_api: {
    set: function;
    get: function;
    getRequestOptions: function;
  };
  gaID: string; // Optional Google Analytics ID.
  split_layout: boolean; // Not used.
  split_aspect: boolean; // Not used.
  keySig: string; // See above.
  // cogInterface provides information about where to find the cognostics
  // for this display. In the case of type = JSON or JSONP, "group" and "name"
  // point to the subdirectory where the cognostic info can be found, e.g.
  // __group__/__name__/cogData.json
  cogInterface: {
    name: string;
    // ?
    group: Group;
    // ?
    type: string;
  };
  // This specifies how panels should be rendered.
  // If 'image', then it expects to find a json/jsonp file with a
  // base64-encoded file that can be rendered in a <img> tag.
  // If 'img_src', it expects a URL (can be relative) pointing to the
  // image to show (anything that can be stuck in a <img> tag).
  // If 'htmlwidget', then it expects to find a json/jsonp file
  // with all of the payload necessary to render an htmlwidget.
  // See here for reference: https://www.htmlwidgets.org.
  panelInterface: {
    type: 'image' | 'image_src' | 'htmlwidget';
    deps: {
      name: string;
      assets: {
        url: string;
        type: 'script' | 'stylesheet';
      };
    };
  };
  imgSrcLookup: object; // Can't remember what this is.
  cogInfo: {
    [key: string]: CogInfo;
  };
  cogDistns: {
    [key: string]: CogDistns;
  };
}

// Cognostics are the table of metrics about each of the panels.
// I'll refer to each cognostic as a variable since that's a more natural term.
// CogInfo contains metadata for each metric.
interface CogInfo {
  name: string; // Name of the cognostic.
  desc: string; // Description of the cognostic.
  // "type" describes the variable type which determines how it can be used
  // in terms of a visual filter, and how it behaves elsewhere in the app.
  //   key: identifies the panel key
  //   integer: numeric variable - histogram filters
  //   numeric: numeric variable - histogram filters
  //   factor: categorical variable - barchart filters
  //   date: date variable - date filter in the future
  //   time: time variable (e.g. HH:MM:SS) - may have its own filter some day
  //   panelSrc: indicates the variable points to the image URL
  //   panelSrcLocal: points to a relative ("local") image URL
  //   href: the variable is a link and will be rendered as such as a label
  //   href_hash: the variable is a link to another view of the display
  //   color: should be rendered as color in the panel label (not implemented)
  //   geo: the variable is a lat/lon coordinate (not implemented)
  //   hier: indicates some hierarchy wrt another variable (not implemented)
  type: 'factor'; // See comments directly above.
  // "group" can be any string. It indicates a grouping of variables. This is
  // useful when there are many variables and it is difficult to find them
  // in the app. In the sort and filter sidebar, variables are visually
  // separated by group. The default group is "common".
  group: Group;
  defLabel: boolean; // Is this variable shown as a panel label by default?
  defActive: boolean; // Is this variable "active" by default?
  filterable: boolean; // Is this variable filterable?
  log: boolean; // Should this variable's filter be shown on a log scale?
  // We should get rid of the rest of these as we should be able to infer
  // these from within the app.
  levels: string[]; // For categorical, all distinct values.
  range: number[]; // For numeric, the min and max value.
  nnna: number; // Number of non-missing values.
  breaks: number[]; // For numeric, the histogram bin breaks.
  delta: number; // How wide each histogram bin is.
}

// We should do away with this as well. It stores the unfiltered distribution
// of a numeric or categorical variable. In the case of numeric, it's a
// histogram (count of how many values fall into each bin). In the case of 
// categorical, it's a frequency distribution (how many values have each
// value).
interface CogDistns {
  type: 'factor' | 'numeric';
  dis: {
    [key: string]: number;
  };
}
