"use client";
import { Component, ReactNode } from "react";
import { toast } from "./ToastProvider";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    toast({ message: error.message || "Unexpected error", variant: "error" });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <div>Algo deu errado.</div>;
    }
    return this.props.children;
  }
}
