# TrelliscopeJS

TrelliscopeJS is a viewer for Trelliscope displays created with the [trelliscope](https://github.com/tesseradata/trelliscope) R package (and in the near future, conceptually created with anything else).  This viewer is being written as a pure JavaScript application and the ultimate goal is for it to be able to plug in to many languages and be served by many back-ends depending on the scale of the display.

Trelliscope is a system for detailed interactive visualization of potentially very large data sets.  The concept is to break a dataset into pieces, make a plot for each piece (each plot called a *panel*), and then arrange these plots into a grid or pages of grids for viewing.  This idea is based on [Trellis Display](http://polisci.msu.edu/jacoby/uic/manuscripts/95.8.color.pdf).  When the number of panels becomes very large, Trelliscope provides a system for allowing the user to interactively explore the space of the panels based on metrics computed for each panel, called *cognostics*.  To read more about Trelliscope, see [here](http://tessera.io/docs-trelliscope).

## Demo

Try out a demo [here](http://hafen.github.io/trelliscopejs-demo).

## Development

```bash
# install dependencies
npm install

# run webpack server for interactive development
npm start

# build a deployment bundle
npm run build

# run eslint
npm run lint
```

## Configuration

The application can be easily configured to point to different collections of displays, which we call [*visualization databases*](http://www.jmlr.org/proceedings/papers/v5/guha09a/guha09a.pdf) (VDBs).  By default, the configuration points to a display of median monthly home prices for each county in the United States, which is located [here](https://github.com/hafen/trelliscopejs_vdb_housing) and served through rawgit.

If want to link to a different display, you can modify [config.json](https://github.com/hafen/TrelliscopeJS/blob/master/config.json) to point to the new location.  This can be either a local file or served from somewhere that allows cross-domain requests.

Currently Trelliscope displays can be created using the [trelliscope](https://github.com/tesseradata/trelliscope) R package, although there is nothing that prevents them from being created with anything else, as long as the resulting json files have the appropriate schema.  As we work toward finalizing the initial release of TrelliscopeJS, this schema is subject to slightly change.

If you have created a Trelliscope display using the trelliscope R package, there is an additional conversion step that needs to be applied to the resulting visualization database, for which I will provide a script once the schema is finalized.

## Copyright and license

Copyright 2016 Hafen Consulting, LLC. Code released under the BSD license.
