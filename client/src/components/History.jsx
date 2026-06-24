import { useState, useEffect } from 'react';
import { callApi } from '../utils/api';
import { Loader2, History as HistoryIcon } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

const HistoryItem = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="card overflow-hidden transition-all duration-200">
      <div 
        className="flex items-center justify-between cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-semibold">
            {item.feature}
          </span>
          <span className="text-sm text-gray-500">
            {new Date(item.createdAt).toLocaleString()}
          </span>
        </div>
        <div className="text-gray-500 group-hover:text-primary transition-colors text-sm font-medium flex items-center gap-1">
          {isExpanded ? 'Hide Details' : 'View Details'}
          <svg 
            className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-dark-lighter animate-fade-in">
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-400 mb-2">Input:</h4>
            <pre className="bg-dark p-4 rounded-lg text-xs text-gray-300 overflow-x-auto border border-dark-lighter">
              {JSON.stringify(item.input, null, 2)}
            </pre>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Output:</h4>
            <div className="bg-dark rounded-lg p-6 border border-dark-lighter">
              <MarkdownRenderer content={item.output} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    callApi('/history', null, 'GET')
      .then(data => setHistory(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 space-x-2">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span>Loading history...</span>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-500/10 text-red-400 rounded-lg">{error}</div>;
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <HistoryIcon className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold text-white">Your Generation History</h2>
      </div>

      {history.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">
          You haven't generated anything yet. Go try out some features!
        </div>
      ) : (
        history.map((item) => (
          <HistoryItem key={item._id} item={item} />
        ))
      )}
    </div>
  );
}
