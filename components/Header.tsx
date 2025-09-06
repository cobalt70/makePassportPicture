
import React from 'react';
import { LogoIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4">
      <div className="max-w-5xl mx-auto flex items-center">
        <LogoIcon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
        <h1 className="text-xl md:text-2xl font-bold ml-3 text-gray-900 dark:text-white tracking-tight">
          AI 한국 여권 사진 생성기
        </h1>
      </div>
    </header>
  );
};
