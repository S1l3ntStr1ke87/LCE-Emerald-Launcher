import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import { PluginManager } from "./PluginManager";
import type {
  PluginViewRegistration,
  ActionSlot,
  ActionDef,
  ToastOptions,
} from "./types";
interface PluginContextType {
  views: PluginViewRegistration[];
  getActions: (slot: ActionSlot) => ActionDef[];
  navigateToView: (viewId: string) => void;
}

const PluginContext = createContext<PluginContextType>({
  views: [],
  getActions: () => [],
  navigateToView: () => {},
});

export function usePluginViews(): PluginViewRegistration[] {
  return useContext(PluginContext).views;
}

export function usePluginActions(slot: ActionSlot): ActionDef[] {
  return useContext(PluginContext).getActions(slot);
}

export function usePluginNavigate(): (viewId: string) => void {
  return useContext(PluginContext).navigateToView;
}

interface PluginProviderProps {
  children: ReactNode;
  onNavigate?: (viewId: string) => void;
  onToast?: (pluginId: string, message: string, options?: ToastOptions) => void;
  onSound?: (name: string) => void;
}

export function PluginProvider({
  children,
  onNavigate,
  onToast,
  onSound,
}: PluginProviderProps) {
  const [views, setViews] = useState<PluginViewRegistration[]>([]);
  const pm = PluginManager.instance;
  useEffect(() => {
    pm.setViewsChangedCallback((updatedViews) => {
      setViews(updatedViews);
    });

    if (onNavigate) {
      pm.setNavigateCallback(onNavigate);
    }

    if (onToast) {
      pm.setToastCallback(onToast);
    }

    if (onSound) {
      pm.setSoundCallback(onSound);
    }

    pm.init().catch(console.error);
  }, []);

  const getActions = useCallback((slot: ActionSlot): ActionDef[] => {
    return pm.getActions(slot);
  }, []);

  const navigateToView = useCallback(
    (viewId: string) => {
      onNavigate?.(viewId);
    },
    [onNavigate],
  );

  const value = useMemo(
    () => ({ views, getActions, navigateToView }),
    [views, getActions, navigateToView],
  );

  return (
    <PluginContext.Provider value={value}>{children}</PluginContext.Provider>
  );
}
