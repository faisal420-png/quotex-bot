/**
 * Local AI Client (Transformers.js Interface)
 */

class LocalAIClient {
  constructor() {
    this.worker = new Worker(new URL('../workers/aiWorker.js', import.meta.url), {
      type: 'module'
    });
    this.listeners = new Set();
    this.ready = false;
    this.progress = 0;

    this.worker.onmessage = (event) => {
      const { type, response, status, message } = event.data;
      
      if (type === 'ready') this.ready = true;
      if (type === 'progress') {
        // Transformers.js progress objects can have status.progress or status.loaded/total
        if (status.status === 'progress' && status.progress !== undefined) {
          this.progress = status.progress;
        } else if (status.loaded && status.total) {
          this.progress = (status.loaded / status.total) * 100;
        }
      }

      this.listeners.forEach(callback => callback(event.data));
    };
  }

  load() {
    this.worker.postMessage({ type: 'load' });
  }

  analyze(prompt, callback) {
    const handler = (data) => {
      if (data.type === 'result') {
        callback(data.response);
        this.listeners.delete(handler);
      }
    };
    this.listeners.add(handler);
    this.worker.postMessage({ type: 'analyze', data: { prompt } });
  }

  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
}

export const localAI = new LocalAIClient();
