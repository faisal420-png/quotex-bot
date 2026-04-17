import { pipeline, env } from '@xenova/transformers';

// Skip local check and download from HF
env.allowLocalModels = false;
env.useBrowserCache = true;

/**
 * Local AI Worker Logic
 */
let analyzerPipeline = null;

async function getInstance(progress_callback) {
  if (analyzerPipeline === null) {
      // Use SmolLM-135M-Instruct for fast local inference
      analyzerPipeline = await pipeline('text-generation', 'Xenova/SmolLM-135M-Instruct', {
          progress_callback,
      });
  }
  return analyzerPipeline;
}

self.onmessage = async (event) => {
  const { type, data } = event.data;

  if (type === 'load') {
    try {
      await getInstance((x) => {
        self.postMessage({ type: 'progress', status: x });
      });
      self.postMessage({ type: 'ready' });
    } catch (error) {
      self.postMessage({ type: 'error', message: error.message });
    }
  }

  if (type === 'analyze') {
    const { prompt } = data;
    try {
      const generator = await getInstance();
      
      const output = await generator(prompt, {
        max_new_tokens: 60,
        temperature: 0.7,
        do_sample: true,
        top_k: 40,
        repetition_penalty: 1.2
      });

      const response = output[0].generated_text.substring(prompt.length).trim();
      self.postMessage({ type: 'result', response });
    } catch (error) {
      self.postMessage({ type: 'error', message: error.message });
    }
  }
};
