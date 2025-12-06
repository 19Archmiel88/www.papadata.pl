import React from 'react';

/**
 * A horizontal bar displaying trust indicators and technology partners.
 * Shows logos for Google Cloud, Vertex AI, BigQuery, and security standards.
 */
const TrustBar: React.FC = () => (
  <div className="bg-slate-900/50 py-8">
    <div className="container mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-4 px-4">
      <div className="flex items-center gap-2 text-slate-400">
        <span className="font-semibold">Partner technologiczny:</span>
        <img
          src="https://www.vectorlogo.zone/logos/google_cloud/google_cloud-icon.svg"
          alt="Google Cloud"
          className="h-8"
        />
        <span className="text-sm">Google Cloud</span>
      </div>
      <div className="flex items-center gap-2 text-slate-400">
        <span className="font-semibold">AI powered by:</span>
        <img
          src="https://www.vectorlogo.zone/logos/google_vertex_ai/google_vertex_ai-icon.svg"
          alt="Vertex AI"
          className="h-8"
        />
        <span className="text-sm">Vertex AI</span>
      </div>
      <div className="flex items-center gap-2 text-slate-400">
        <span className="font-semibold">Data warehouse:</span>
        <img
          src="https://www.vectorlogo.zone/logos/google_bigquery/google_bigquery-icon.svg"
          alt="BigQuery"
          className="h-8"
        />
        <span className="text-sm">BigQuery</span>
      </div>
      <div className="flex items-center gap-2 text-slate-400">
        <span className="font-semibold">Bezpieczeństwo:</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-7 h-7 text-green-400"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <span className="text-sm">ISO 27001</span>
      </div>
    </div>
  </div>
);

export default TrustBar;
