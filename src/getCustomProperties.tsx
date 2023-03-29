const getCustomProperties = (variables: string[], asNumber = true) =>
  variables.map((variable) => {
    const value = getComputedStyle(document.documentElement).getPropertyValue(variable);
    if (asNumber) {
      return parseFloat(value) as number;
    }

    return value;
  });

export default getCustomProperties;
