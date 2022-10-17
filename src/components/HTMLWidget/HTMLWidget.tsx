import React, { useLayoutEffect, useRef } from 'react';

interface HTMLWidgetProps {
  name: string;
  width: number;
  height: number;
  data: { evals: string[]; x: any };
  widgetKey: string;
}

const HTMLWidget: React.FC<HTMLWidgetProps> = ({ name, widgetKey, width = 0, height = 0, data }) => {
  const widgetEl = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (data) {
      const widget = window.HTMLWidgets.widgets.find((w: { name: string }) => w.name === name);
      if (widget) {
        const init = widget.initialize(widgetEl.current, width, height);
        window.HTMLWidgets.evaluateStringMember(data.x, data.evals);

        widget.renderValue(widgetEl.current, data.x, init);
      }
    }
  }, []);

  useLayoutEffect(() => {
    if (data) {
      const widget = window.HTMLWidgets.widgets.find((w: { name: string }) => w.name === name);
      if (widget) {
        widget.resize(widgetEl?.current, width, height, {});
      }
    }
  }, [width, height]);

  return <div ref={widgetEl} id={`widget_${widgetKey}`} style={{ width, height }} />;
};

export default HTMLWidget;
