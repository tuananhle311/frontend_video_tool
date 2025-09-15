export const splitScripts = (script: string): string[] => {
  const arrScript: string[] = [];
  let index = 0;

  while (index <= script.length) {
    const endIndex = index + 1000;
    arrScript.push(script.slice(index, endIndex));
    index = endIndex;
  }

  return arrScript;
};
