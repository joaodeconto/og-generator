let worker: Worker | null = null;
let messageId = 0;

interface WorkerResponse {
  id: number;
  dataUrl?: string;
  error?: string;
}

/**
 * Remove the background of an image using a dedicated WebWorker.
 *
 * @param source File, Blob, or URL string pointing to an image
 * @returns A base64 data URL of the processed image
 */
export function removeImageBackground(source: Blob | string): Promise<string> {
  if (!worker) {
    worker = new Worker(new URL("../workers/removeBgWorker.ts", import.meta.url));
  }
  const id = ++messageId;
  return new Promise((resolve, reject) => {
    const handleMessage = (event: MessageEvent<WorkerResponse>) => {
      if (event.data.id !== id) return;
      worker?.removeEventListener("message", handleMessage);
      worker?.removeEventListener("error", handleError);
      if (event.data.error) {
        reject(new Error(event.data.error));
      } else {
        resolve(event.data.dataUrl);
      }
    };
    const handleError = (event: ErrorEvent) => {
      worker?.removeEventListener("message", handleMessage);
      reject(event.error || new Error("Worker error"));
    };
    worker!.addEventListener("message", handleMessage);
    worker!.addEventListener("error", handleError);
    worker!.postMessage({ id, source });
  });
}

/**
 * Cancel any in-flight background removal by terminating the worker.
 * A new worker will be created on the next call to removeImageBackground.
 */
export function cancelRemoveBackground() {
  try {
    worker?.terminate();
  } finally {
    worker = null;
  }
}
