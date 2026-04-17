# Quotex Antigravity AI

A complete multi-file trading application for Quotex binary options trading using the **Antigravity (Center of Gravity)** indicator with integrated **Gemini AI** analysis.

## Features

- **Signal Generator**: Real-time COG indicator visualization with crossover signal detection and adaptive confidence scoring.
- **Gemini AI Integration**: Technical signal analysis and strategy backtest evaluation using Google's 2.0-Flash and 2.5-Pro models.
- **Advanced Backtester**: Simulate thousands of trades with custom risk parameters, initial balance, and asset selection.
- **Trade History**: Local persistence of trade logs with performance metrics (Win Rate, P&L, ROI) and CSV export.
- **Modern UI**: High-fidelity dark mode dashboard built with Tailwind CSS, Framer Motion, and Chart.js.

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Logic**: Vanilla Javascript (COG Formula)

## Setup Instructions

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Configuration**:
    - Open the **Settings** tab in the application.
    - Paste your Gemini API Key (get one at [aistudio.google.com](https://aistudio.google.com/)).
    - Select your preferred AI model.

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Logic & Indicators

### Center of Gravity (COG)
Based on Ehlers' formula, the COG indicator identifies turning points without lag.
Formula used: `COG[i] = -SUM(price[j] * (j+1), period) / SUM(price[j], period)`
Signal Line: 3-period Simple Moving Average (SMA) of COG values.

- **CALL Signal**: COG crosses ABOVE the signal line.
- **PUT Signal**: COG crosses BELOW the signal line.

---
*Disclaimer: Trading binary options involves significant risk. This tool is for educational purposes only and does not constitute financial advice.*
