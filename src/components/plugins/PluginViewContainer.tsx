import React, { Component, type ReactNode, type ErrorInfo } from "react";
import { motion } from "framer-motion";
import type { PluginViewRegistration } from "../../plugins/types";
import { PluginManager } from "../../plugins/PluginManager";
interface Props {
  registry: PluginViewRegistration;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class PluginErrorBoundary extends Component<
  { children: ReactNode; pluginId: string },
  State
> {
  constructor(props: { children: ReactNode; pluginId: string }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(`[Plugin ${this.props.pluginId}] Render error:`, error, info);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-red-400 gap-2 p-8">
          <span className="text-lg">Plugin Error</span>
          <span className="text-sm text-gray-400">
            {this.state.error?.message ?? "Unknown error"}
          </span>
        </div>
      );
    }
    return this.props.children;
  }
}

export function PluginViewContainer({ registry }: Props) {
  const pm = PluginManager.instance;
  const plugin = pm.plugins.get(registry.pluginId);
  if (!plugin) return null;
  let Component: React.ComponentType<Record<string, unknown>>;
  try {
    Component = registry.factory(plugin.api);
  } catch (err) {
    console.error(`[Plugin] Error creating component for ${registry.id}:`, err);
    return (
      <div className="flex items-center justify-center h-full text-red-400">
        Failed to create view
      </div>
    );
  }

  return (
    <PluginErrorBoundary pluginId={registry.pluginId}>
      <motion.div
        key={registry.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
        className="w-full h-full flex flex-col items-center justify-center"
      >
        <Component />
      </motion.div>
    </PluginErrorBoundary>
  );
}
