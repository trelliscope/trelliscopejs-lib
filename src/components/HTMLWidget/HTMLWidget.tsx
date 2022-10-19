import React, { useLayoutEffect, useRef, useState } from 'react';

interface HTMLWidgetProps {
  name: string;
  width: number;
  height: number;
  data: HTMLWidgetData;
  widgetKey: string;
}

const HTMLWidget: React.FC<HTMLWidgetProps> = ({ name, widgetKey, width = 0, height = 0, data }) => {
  const widgetEl = useRef<HTMLDivElement>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  useLayoutEffect(() => {
    if (data && !initialized) {
      const widget = window.HTMLWidgets?.widgets?.find((w: { name: string }) => w.name === name);

      if (widget) {
        const init = widget.initialize(widgetEl.current, width, height);
        window.HTMLWidgets.evaluateStringMember(data.x, data.evals);

        widget.renderValue(widgetEl.current, data.x, init);
        setInitialized(true);
      }
    }
  }, [data, initialized, name, widgetKey, width, height]);

  useLayoutEffect(() => {
    if (data) {
      const widget = window.HTMLWidgets.widgets.find((w: { name: string }) => w.name === name);
      if (widget) {
        widget.resize(widgetEl?.current, width, height, {});
      }
    }
  }, [width, height, data, name]);

  return <div ref={widgetEl} id={`widget_${widgetKey}`} style={{ width, height }} />;
};

export default HTMLWidget;
