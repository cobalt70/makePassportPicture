
import React from 'react';
import { DownloadIcon, RestartIcon } from './Icons';

interface ResultViewProps {
  imageSrc: string;
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ imageSrc, onReset }) => {

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = 'korean_passport_photo.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-lg mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">여권 사진 완성!</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">생성된 여권 사진입니다. 아래 버튼을 눌러 저장하세요.</p>
      <div className="w-[175px] h-[225px] mx-auto rounded-lg shadow-md overflow-hidden mb-8 border-4 border-gray-200 dark:border-gray-700">
        <img src={imageSrc} alt="Generated Passport Photo" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleDownload}
          className="w-full sm:w-auto flex-1 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2"
        >
          <DownloadIcon className="w-5 h-5" />
          다운로드
        </button>
        <button
          onClick={onReset}
          className="w-full sm:w-auto flex-1 bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 flex items-center justify-center gap-2"
        >
          <RestartIcon className="w-5 h-5" />
          새로 만들기
        </button>
      </div>
      <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 text-left bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">참고 사항:</h4>
        <p>생성된 사진을 여권 신청에 사용하기 전, 반드시 외교부 여권 안내 홈페이지에서 최신 규정을 다시 한번 확인하시기 바랍니다. 이 AI 툴은 규정에 맞춰 사진을 생성하지만, 최종 승인은 접수처에서 이루어집니다.</p>
      </div>
    </div>
  );
};
