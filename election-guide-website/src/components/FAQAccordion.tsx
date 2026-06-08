import React, { useState } from 'react';
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
    <div className="space-y-8">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">{category}</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {items.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <div key={item.id} className="p-2">
                  <button
                    onClick={() => toggleExpand(item.id)}
                    aria-expanded={isExpanded}
                    className="w-full flex justify-between items-center px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md transition-colors hover:bg-gray-50"
                  >
                    <span className="font-medium text-gray-900">{item.question}</span>
                    <span className="ml-6 flex-shrink-0 text-gray-400">
                      {isExpanded ? (
                        <svg className="w-5 h-5 transform rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </span>
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 text-gray-600 prose max-w-none">
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
