let removeBackgroundFn: ((source: Blob | string) => Promise<Blob>) | null = null;

async function ensureRemoveBackground() {
  if (!removeBackgroundFn) {
    if (typeof crossOriginIsolated !== "undefined" && !crossOriginIsolated) {
      try {
        Object.defineProperty(navigator, "hardwareConcurrency", {
          configurable: true,
          get: () => 1,
        });
      } catch {
        // ignore inability to override
      }
    }
    const mod = await import("@imgly/background-removal");
    removeBackgroundFn = mod.removeBackground;
  }
  return removeBackgroundFn!;
}

function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

self.addEventListener("message", async (event: MessageEvent<{ id: number; source: Blob | string }>) => {
  const { id, source } = event.data;
  try {
    const removeBackground = await ensureRemoveBackground();
    const blob = await removeBackground(source);
    if (!(blob instanceof Blob)) {
      throw new Error("removeBackground did not return a Blob");
    }
    const dataUrl = await blobToDataURL(blob);
    (self as unknown as Worker).postMessage({ id, dataUrl });
  } catch (error) {
    (self as unknown as Worker).postMessage({ id, error: (error as Error).message || String(error) });
  }
});

export {};
