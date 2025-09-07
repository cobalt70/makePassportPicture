import React from 'react';
import { DownloadIcon, RestartIcon } from './Icons';

interface ResultViewProps {
  originalImageSrc: string;
  processedImageSrc: string;
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ originalImageSrc, processedImageSrc, onReset }) => {

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = processedImageSrc;
    link.download = 'korean_passport_photo.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">여권 사진 완성!</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">AI가 변환한 사진을 원본과 비교해 보세요. 만족스러우면 다운로드하세요.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">Before</h3>
          <div className="aspect-[3.5/4.5] w-full max-w-[350px] mx-auto rounded-lg shadow-md overflow-hidden bg-gray-200 dark:bg-gray-700">
             <img src={originalImageSrc} alt="Original user photo" className="w-full h-full object-contain" />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">After</h3>
          <div className="aspect-[3.5/4.5] w-full max-w-[350px] mx-auto rounded-lg shadow-md overflow-hidden border-4 border-blue-500">
             <img src={processedImageSrc} alt="Generated Passport Photo" className="w-full h-full object-cover" />
          </div>
        </div>
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