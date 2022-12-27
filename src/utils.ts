export const snakeCase = (name: string) => name.replace(/ /g, '_');

export const nothing = () => {};

// TODO
// export const generateDisplayGroups = (list: Display[]) => {
//   const dispGroups = {} as DisplayGroup;
//   console.log('in this method');
//   if (list) {
//     for (let ii = 0; ii < list.length; ii += 1) {
//       if (!dispGroups[list[ii].group]) {
//         dispGroups[list[ii].group] = [];
//       }
//       dispGroups[list[ii].group].push(ii);
//     }
//   }
//   return dispGroups;
// };
