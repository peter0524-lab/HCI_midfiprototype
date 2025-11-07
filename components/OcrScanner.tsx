import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, CameraIcon } from './Icons';
import { extractContactInfoFromImage } from '../services/geminiService';
import type { OcrData } from '../types';

interface OcrScannerProps {
  onBack: () => void;
  onScanComplete: (data: OcrData) => void;
}

export const OcrScanner: React.FC<OcrScannerProps> = ({ onBack, onScanComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let stream: MediaStream;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("카메라에 접근할 수 없습니다. 권한을 확인해주세요.");
      }
    };
    startCamera();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsLoading(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    
    const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];
    
    try {
        const data = await extractContactInfoFromImage(base64Image);
        onScanComplete(data);
    } catch (apiError) {
        setError("명함 정보 추출에 실패했습니다. 다시 시도해주세요.");
        setIsLoading(false);
    }
  };

  return (
    <motion.div
      key="ocrScanner"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute inset-0 bg-black flex flex-col text-white"
    >
      <header className="p-4 flex items-center flex-shrink-0 z-10">
        <button onClick={onBack} className="p-2 mr-2 bg-black/30 rounded-full">
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold">명함 스캔</h1>
      </header>

      <main className="flex-grow relative flex items-center justify-center bg-black">
        {error ? (
          <div className="text-center p-4">
            <p className="text-red-400">{error}</p>
            <button onClick={onBack} className="mt-4 bg-violet-600 px-4 py-2 rounded-lg">돌아가기</button>
          </div>
        ) : (
          <>
            <video ref={videoRef} autoPlay playsInline className="absolute top-0 left-0 w-full h-full object-cover" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 h-1/2 border-4 border-dashed border-white/70 rounded-lg"/>
            <canvas ref={canvasRef} className="hidden" />
          </>
        )}
      </main>

      {isLoading && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
              <div className="w-16 h-16 border-4 border-t-violet-500 border-gray-600 rounded-full animate-spin"></div>
              <p className="mt-4">명함 정보를 분석중입니다...</p>
          </div>
      )}
      
      {!error && (
        <footer className="p-8 flex-shrink-0 z-10 bg-black/30">
          <button
            onClick={handleCapture}
            disabled={isLoading}
            className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center border-4 border-gray-400 disabled:opacity-50"
            aria-label="Capture business card"
          >
            <CameraIcon className="w-8 h-8 text-gray-800"/>
          </button>
        </footer>
      )}
    </motion.div>
  );
};
