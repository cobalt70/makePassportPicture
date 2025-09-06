
import React, { useCallback, useState } from 'react';
import { UploadIcon } from './Icons';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">여권 사진 생성 시작하기</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">얼굴이 잘 나온 고화질 사진을 업로드하세요.</p>
      
      <label
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative block w-full border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors duration-300 ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'}`}
      >
        <div className="flex flex-col items-center justify-center">
          <UploadIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">파일을 드래그 앤 드롭하거나 클릭하여 업로드하세요.</span>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">PNG, JPG, WEBP (최대 10MB)</p>
        </div>
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
          onChange={handleFileChange} 
          accept="image/png, image/jpeg, image/webp" 
        />
      </label>
      
      <div className="mt-8 text-left text-sm text-gray-600 dark:text-gray-400">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">사진 촬영 Tip:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>밝고 균일한 조명에서 촬영하세요.</li>
          <li>정면을 바라보고 자연스러운 표정을 지으세요.</li>
          <li>안경, 모자, 액세서리는 벗는 것이 좋습니다.</li>
          <li>흰색 배경에서 촬영하면 AI가 더 잘 인식합니다.</li>
        </ul>
      </div>
    </div>
  );
};
