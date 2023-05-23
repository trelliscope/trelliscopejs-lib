import { useState } from 'react';
import { useDisplayInfo } from './slices/displayInfoAPI';

export const getLocalStoragePrefix = (di: DisplayObject) => `${di.group}_:_${di.name}_:`;

export const getLocalStorageKey = (tags: string[], displayName: string, panelKey: string, name: string) =>
  `${tags.join('__')}_:_${displayName}_:_${panelKey}_:_${name}`;

// Stores a user-specified input value
// Note that this always stores in localStorage
// It additionaly stores to API if that is specified
// localStorage is always used to keep track of inputs within the app
/* export const setPanelCogInput = (di: DisplayObject, value: string, panelKey: string, cogId: string) => {
  const lsKey = getLocalStorageKey(di, panelKey, cogId);

  if (di.input_type === 'API') {
    const queryObj = {
      display_id: `${di.group}___${di.name}`,
      display_version: 'v1',
      panel_id: panelKey,
      cog_id: cogId,
      // if it's the current value, it means the user has deselected all radio values
      val: encodeURIComponent(localStorage.getItem(lsKey) === value ? '' : value),
    };
    const qry = Object.entries(queryObj)
      .map((e) => e.join('='))
      .join('&');
    fetch(`${di.input_api.set}?${qry}`, di.input_api.setRequestOptions)
      .then(async (response) => {
        const isJson = response.headers.get('content-type')?.includes('application/json');
        const data = isJson && (await response.json());
        // check for error response
        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
        // if success, put value in local storage as well
        if (localStorage.getItem(lsKey) === value) {
          localStorage.removeItem(lsKey);
        } else {
          localStorage.setItem(lsKey, value);
        }

        return data;
      })
      .catch((error) => {
        console.error('There was an error setting the input.', error);
      });
  }

  if (di.input_type === 'localStorage') {
    if (localStorage.getItem(lsKey) === value && cogId !== 'comments') {
      localStorage.removeItem(lsKey);
    } else {
      localStorage.setItem(lsKey, value);
    }
  }
}; */

/* export const getInputsAPI = (di: DisplayObject) => {
  const queryObj = {
    display_id: `${di.group}___${di.name}`,
    display_version: 'v1',
  };

  const qry = Object.entries(queryObj)
    .map((e) => e.join('='))
    .join('&');
  fetch(`${di.input_api.get}?${qry}`, di.input_api.getRequestOptions)
    .then(async (response) => {
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson && (await response.json());
      if (!response.ok) {
        // get error message from body or default to response status
        const error = (data && data.message) || response.status;
        return error;
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        // clear out old localStorage for this display
        const rgxp = new RegExp(`^${getLocalStoragePrefix(di)}`, 'g');
        Object.keys(localStorage).forEach((kk) => {
          if (kk.match(rgxp)) {
            localStorage.removeItem(kk);
          }
        });
        Object.keys(data.panels).forEach((pk) => {
          Object.keys(data.panels[pk]).forEach((ck) => {
            const key = getLocalStorageKey(di, pk, ck);
            const val = data.panels[pk][ck];
            if (val !== '') {
              localStorage.setItem(key, val);
            }
          });
        });
      }
    })
    .catch((error) => {
      console.error('There was an error getting inputs stored in the API.', error);
    });
}; */

// const requestOptions = {
//   mode: 'cors',
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//     'Access-Control-Allow-Credentials': 'true',
//     'Access-Control-Allow-Origin': 'http://localhost:3000',
//     'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, PUT, OPTIONS',
//     'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
//   }
// };

export const useStoredInputValue = (panelKey: string, name: string) => {
  const { data: displayInfo } = useDisplayInfo();
  const lsKey = getLocalStorageKey(displayInfo?.tags || [], displayInfo?.name || '', panelKey, name);

  const getStoredValue = () => localStorage.getItem(lsKey);

  const setStoredValue = (value: string) => {
    localStorage.setItem(lsKey, value);
  };

  const clearStoredValue = () => localStorage.removeItem(lsKey);

  return { setStoredValue, getStoredValue, clearStoredValue };
};
