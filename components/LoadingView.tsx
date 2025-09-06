
import React, { useState, useEffect } from 'react';

const messages = [
  "AI가 사진을 분석하고 있습니다...",
  "배경을 깔끔하게 제거하는 중입니다...",
  "여권 규격에 맞게 이미지를 조정합니다...",
  "거의 다 되었습니다. 잠시만 기다려 주세요...",
  "최종 이미지를 생성하고 있습니다..."
];

export const LoadingView: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState(messages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => {
        const currentIndex = messages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-lg mx-auto">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-6 mb-2">AI가 여권 사진을 만들고 있어요</h2>
      <p className="text-gray-600 dark:text-gray-400 transition-opacity duration-500">{currentMessage}</p>
      <p className="text-sm text-gray-500 mt-8">이 작업은 최대 1분 정도 소요될 수 있습니다. 페이지를 닫지 마세요.</p>
    </div>
  );
};
