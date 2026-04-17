import React from 'react';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';

const AIAnalysis = ({ analysis, loading, error }) => {
  if (loading) {
    return (
      <div className="bg-surface-dark border border-gray-800 rounded-card p-6 h-full flex flex-col items-center justify-center text-center space-y-4">
        <div className="relative">
          <Loader2 className="animate-spin text-primary" size={48} />
          <Sparkles className="absolute -top-1 -right-1 text-primary animate-pulse" size={16} />
        </div>
        <div>
          <h3 className="text-white font-bold mb-1">Gemini AI is thinking...</h3>
          <p className="text-gray-500 text-xs px-10">Correlating COG patterns with market liquidity and momentum vectors.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface-dark border border-danger/20 rounded-card p-6 h-full flex flex-col items-center justify-center text-center space-y-3">
        <AlertCircle className="text-danger" size={32} />
        <div>
          <h3 className="text-white font-bold mb-1">Analysis Unavailable</h3>
          <p className="text-gray-500 text-xs px-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-dark border border-gray-800 rounded-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Sparkles className="text-primary" size={18} />
        </div>
        <h3 className="text-white font-bold uppercase tracking-wider text-xs">AI Market Analysis</h3>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {analysis ? (
          <div className="space-y-4">
            <div className="p-4 bg-gray-950/50 rounded-lg border border-gray-800/50">
              <p className="text-sm text-gray-300 leading-relaxed font-medium italic">
                 "{analysis.text}"
              </p>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800">
              <span className="text-[10px] font-bold text-gray-500 uppercase">AI Recommendation</span>
              <span className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
                analysis.recommendation === 'CALL' ? 'bg-primary text-white' : 
                analysis.recommendation === 'PUT' ? 'bg-danger text-white' : 
                'bg-gray-700 text-gray-300'
              }`}>
                {analysis.recommendation}
              </span>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-center p-8 bg-gray-950/20 rounded-lg border border-dashed border-gray-800">
            <p className="text-gray-500 text-xs font-medium">Click "Analyze Signal" to receive Gemini AI technical insights.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnalysis;
