const getCustomProperties = (variables: string[]) =>
  variables.map((variable) => +getComputedStyle(document.documentElement).getPropertyValue(variable));

export default getCustomProperties;
