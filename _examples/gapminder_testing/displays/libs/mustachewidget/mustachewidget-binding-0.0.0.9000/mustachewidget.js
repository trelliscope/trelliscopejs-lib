HTMLWidgets.widget({
  name: 'mustachewidget',
  type: 'output',
  factory: function(el, width, height) {
    return {
      renderValue: function(x) {
        if (x.data.pre_render) {
          x.data.pre_render(x.data, width, height);
        }
        var output = Mustache.render(x.template, x.data);
        el.innerHTML = output;
      },
      resize: function(width, height) {
      }
    };
  }
});

