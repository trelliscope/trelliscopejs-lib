# trelliscopejs-lib

[![npm version](https://badge.fury.io/js/trelliscopejs-lib.svg)](https://badge.fury.io/js/trelliscopejs-lib)

trelliscopejs-lib is a viewer for Trelliscope displays which can currently be created using the [trelliscopejs](https://github.com/hafen/trelliscopejs) R package (and hopefully in the future, conceptually created with anything else).  This viewer is being written as a pure JavaScript application and the ultimate goal is for it to be able to plug in to many languages and be served by many back-ends depending on the scale of the display.

Trelliscope is a system for detailed interactive visualization of potentially very large data sets.  The concept is to break a dataset into pieces, make a plot for each piece (each plot called a *panel*), and then arrange these plots into a grid or pages of grids for viewing.  This idea is based on [Trellis Display](http://polisci.msu.edu/jacoby/uic/manuscripts/95.8.color.pdf).  When the number of panels becomes very large, Trelliscope provides a system for allowing the user to interactively explore the space of the panels based on metrics computed for each panel, called *cognostics*.  To read more about Trelliscope, see [here](http://tessera.io/docs-trelliscope).

## Demo

Try out a demo [here](http://hafen.github.io/trelliscopejs-demo/housing).

## Development

```bash
# install dependencies
npm install

# clone the examples that are needed to test the application
git clone https://github.com/hafen/trelliscopejs-examples.git _test

# run webpack server for interactive development
npm start

# build a deployment bundle
npm run build

# run eslint
npm run lint
```

## Copyright and license

Copyright 2016 Ryan Hafen. Code released under the BSD license.
