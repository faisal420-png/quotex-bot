/**
 * Gemini AI Client for Quotex Antigravity AI
 */

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export const analyzeSignal = async (params) => {
  const apiKey = localStorage.getItem('gemini_api_key');
  const model = localStorage.getItem('gemini_model') || 'gemini-1.5-flash';
  
  if (!apiKey) {
    return "DEMO MODE: Gemini API key not found. Please add your key in Settings to enable real-time AI analysis. Based on technical indicators, current COG crossover suggests a potential trade opportunity.";
  }

  const { asset, interval, cogValue, crossover, confidence, p1, p2 } = params;

  const prompt = `
    You are an expert binary options trading analyst. Analyze the following setup for ${asset} on ${interval} timeframe.
    Technical Data:
    - COG Value: ${cogValue.toFixed(6)}
    - Detected Crossover: ${crossover}
    - Calculated Confidence: ${confidence}%
    - Future Prediction P1: ${p1.direction} (${p1.confidence}% confidence)
    - Future Prediction P2: ${p2.direction} (${p2.confidence}% confidence)

    Provide a concise, professional analysis (max 3 sentences) explaining the validity of this signal and potential risks.
  `;

  try {
    const response = await fetch(`${BASE_URL}/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('[Gemini] Analysis Error:', error);
    return "Error fetching AI analysis. Please check your API key and network connection.";
  }
};

export const analyzeBacktest = async (stats) => {
  const apiKey = localStorage.getItem('gemini_api_key');
  const model = localStorage.getItem('gemini_model') || 'gemini-1.5-flash';

  if (!apiKey) {
    return "DEMO MODE: Backtest analysis requires a Gemini API key. Summary: The strategy shows a positive expectancy but requires further validation on higher timeframes.";
  }

  const { winRate, pnl, trades, asset } = stats;

  const prompt = `
    Analyze these backtest results for the Antigravity COG strategy on ${asset}:
    - Win Rate: ${winRate}%
    - Total P&L: $${pnl}
    - Samples: ${trades} trades
    
    Give a one-sentence professional verdict on whether this strategy is stable enough for live execution.
  `;

  try {
    const response = await fetch(`${BASE_URL}/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    return "Backtest analysis unavailable.";
  }
};
