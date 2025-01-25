import { useEffect, useState } from 'react';

export interface INetworkInformation extends EventTarget {
  readonly downlink: number;
  readonly downlinkMax: number;
  readonly effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
  readonly rtt: number;
  readonly saveData: boolean;
  readonly type:
    | 'bluetooth'
    | 'cellular'
    | 'ethernet'
    | 'none'
    | 'wifi'
    | 'wimax'
    | 'other'
    | 'unknown';
  onchange: ((event: Event) => void) | null;
}

export interface IUseNetworkState {
  online: boolean | undefined;
  previous: boolean | undefined;
  since: Date | undefined;
  downlink: INetworkInformation['downlink'] | undefined;
  downlinkMax: INetworkInformation['downlinkMax'] | undefined;
  effectiveType: INetworkInformation['effectiveType'] | undefined;
  rtt: INetworkInformation['rtt'] | undefined;
  saveData: INetworkInformation['saveData'] | undefined;
  type: INetworkInformation['type'] | undefined;
}

type IHookStateInitAction<T> = T | (() => T);

export default function useNetworkState(
  initialState?: IHookStateInitAction<IUseNetworkState> | undefined,
): IUseNetworkState {
  const [state, setState] = useState<IUseNetworkState>(() => ({
    online: navigator.onLine,
    previous: undefined,
    since: undefined,
    downlink: undefined,
    downlinkMax: undefined,
    effectiveType: undefined,
    rtt: undefined,
    saveData: undefined,
    type: undefined,
    ...(typeof initialState === 'function'
      ? initialState()
      : initialState || {}),
  }));

  useEffect(() => {
    const updateNetworkState = () => {
      const connection = navigator.connection as
        | INetworkInformation
        | undefined;
      setState((prevState) => {
        const online = navigator.onLine;
        return {
          online,
          previous: prevState.online,
          since: online !== prevState.online ? new Date() : prevState.since,
          downlink: connection?.downlink,
          downlinkMax: connection?.downlinkMax,
          effectiveType: connection?.effectiveType,
          rtt: connection?.rtt,
          saveData: connection?.saveData,
          type: connection?.type,
        };
      });
    };

    // Update state on mount
    updateNetworkState();

    // Listen for online/offline events
    window.addEventListener('online', updateNetworkState);
    window.addEventListener('offline', updateNetworkState);

    // Listen for changes in the Network Information API (if supported)
    const connection = navigator.connection as INetworkInformation | undefined;
    connection?.addEventListener('change', updateNetworkState);

    return () => {
      window.removeEventListener('online', updateNetworkState);
      window.removeEventListener('offline', updateNetworkState);
      connection?.removeEventListener('change', updateNetworkState);
    };
  }, []);

  return state;
}
