import React, { useState } from 'react';
import { KeyIcon, LogoIcon } from './Icons';

interface ApiKeyPromptProps {
  onApiKeySubmit: (apiKey: string) => void;
}

export const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onApiKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySubmit(apiKey.trim());
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
      <LogoIcon className="h-12 w-12 mx-auto text-blue-600 dark:text-blue-400" />
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-4 mb-2">Google AI API 키 입력</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        이 애플리케이션을 사용하려면 Google AI Studio에서 발급받은 API 키가 필요합니다.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <KeyIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="API 키를 여기에 붙여넣으세요"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            aria-label="Google AI API Key"
          />
        </div>
        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-blue-300"
          disabled={!apiKey.trim()}
        >
          저장하고 시작하기
        </button>
      </form>
      <p className="mt-4 text-xs text-gray-500">
        API 키는 브라우저에만 저장되며, 저희 서버로 전송되지 않습니다.
      </p>
    </div>
  );
};
