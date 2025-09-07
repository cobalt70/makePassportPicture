import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUploader } from './components/FileUploader';
import { ImageEditor } from './components/ImageEditor';
import { LoadingView } from './components/LoadingView';
import { ResultView } from './components/ResultView';
import { generatePassportPhoto } from './services/geminiService';
import { AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.UPLOADING);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setAppState(AppState.EDITING);
      setError(null);
    };
    reader.onerror = () => {
        setError('사진을 읽는 중 오류가 발생했습니다. 다른 파일을 시도해 주세요.');
        setAppState(AppState.UPLOADING);
    }
    reader.readAsDataURL(file);
  };

  const handleGenerate = async (editedImageBase64: string) => {
    setAppState(AppState.PROCESSING);
    setError(null);
    try {
      // API 키는 이제 서비스 레벨에서 환경 변수로부터 직접 읽어옵니다.
      const result = await generatePassportPhoto(editedImageBase64);
      if (result) {
        setProcessedImage(`data:image/png;base64,${result}`);
        setAppState(AppState.RESULT);
      } else {
        throw new Error('AI 모델이 이미지를 반환하지 않았습니다.');
      }
    } catch (err) {
      console.error(err);
      let errorMessage = '알 수 없는 오류가 발생했습니다.';
      if (err instanceof Error) {
        errorMessage = err.message;
        if (err.message.includes('API key not valid')) {
            errorMessage = '유효하지 않은 API 키입니다. 환경 변수를 확인해주세요.';
        }
      }
      setError(`사진 생성에 실패했습니다: ${errorMessage}`);
      setAppState(AppState.EDITING);
    }
  };

  const handleReset = useCallback(() => {
    setAppState(AppState.UPLOADING);
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
  }, []);

  const renderContent = () => {
    // API 키 입력 UI를 제거하고 바로 업로드 화면을 보여줍니다.
    switch (appState) {
      case AppState.UPLOADING:
        return <FileUploader onFileSelect={handleFileSelect} />;
      case AppState.EDITING:
        if (originalImage) {
          return <ImageEditor imageSrc={originalImage} onGenerate={handleGenerate} onCancel={handleReset} error={error} />;
        }
        // Fallback if image is null
        handleReset();
        return null;
      case AppState.PROCESSING:
        return <LoadingView />;
      case AppState.RESULT:
        if (processedImage && originalImage) {
          return <ResultView originalImageSrc={originalImage} processedImageSrc={processedImage} onReset={handleReset} />;
        }
        // Fallback if processed image is null
        handleReset();
        return null;
      default:
        return <FileUploader onFileSelect={handleFileSelect} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900 font-sans">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-5xl mx-auto">
          {renderContent()}
        </div>
      </main>
      <footer className="text-center p-4 text-xs text-gray-500">
        © {new Date().getFullYear()} AI 한국 여권 사진 생성기. 모든 권리 보유.
      </footer>
    </div>
  );
};

export default App;