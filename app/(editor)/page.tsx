import EditorShell from "components/editor/EditorShell";
import ErrorBoundary from "components/ErrorBoundary";

export default function Page() {
  return (
    <ErrorBoundary>
      <EditorShell />
    </ErrorBoundary>
  );
}
