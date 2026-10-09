import { useState } from 'react';
import { useAppData } from '../context/AppContext';
import { FAQEntry } from '../types';

export function FAQAccordion() {
  const { state } = useAppData();
  const { faqEntries } = state;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Group by category
  const grouped = faqEntries.reduce((acc, entry) => {
    if (!acc[entry.category]) acc[entry.category] = [];
    acc[entry.category].push(entry);
    return acc;
  }, {} as Record<string, FAQEntry[]>);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, items]) => (
        <div
          key={category}
          className="bg-white rounded-2xl shadow-xs border border-gray-200/80 overflow-hidden"
        >
          <div className="bg-slate-50/80 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              <span>{category}</span>
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200/70 text-gray-600">
              {items.length} {items.length === 1 ? 'question' : 'questions'}
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {items.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <div key={item.id} className="transition-colors">
                  <button
                    onClick={() => toggleExpand(item.id)}
                    aria-expanded={isExpanded}
                    className={`w-full flex justify-between items-center px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-inset transition-colors ${
                      isExpanded ? 'bg-orange-50/30' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <span className="font-semibold text-gray-900 text-sm sm:text-base pr-4 leading-snug">
                      {item.question}
                    </span>
                    <span className="flex-shrink-0 text-gray-400">
                      <svg
                        className={`w-5 h-5 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-orange-600' : 'text-gray-400'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  {isExpanded && (
                    <div className="px-6 pb-5 pt-1 text-gray-600 text-sm leading-relaxed border-t border-orange-100/50 bg-orange-50/15 animate-fade-in">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
