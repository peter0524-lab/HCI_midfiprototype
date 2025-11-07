import React from 'react';
import { LogoIcon } from '../common/Icons';

interface LoginScreenProps {
  onLogin: () => void;
}

const AppleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
    <path d="M13.753 11.373c.234-1.291.688-2.628 1.688-3.582-1.079-1.337-2.875-1.531-3.625-1.531-1.604 0-3.01.995-3.812.995-.823 0-2.021-.933-3.438-.933-1.833 0-3.375 1.119-4.25 2.875-.938 1.833-.25 4.542 1.062 6.188.854.995 1.833 1.552 2.938 1.552.958 0 1.583-.438 3.125-.438 1.521 0 2.062.438 3.125.438 1.188 0 2.146-.625 2.917-1.563.854-1.104 1.125-2.229 1.146-2.25l-.021-.01zm-3.146-6.447c.75-.896 1.25-2.125.104-3.125-1.062.063-2.229.771-3.062 1.708-.688.813-1.313 2.063-.354 3.021.98.105 2.126-.582 3.312-1.604z"/>
  </svg>
);

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/>
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.223 0-9.657-3.657-11.303-8.584l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C41.389 36.057 44 30.607 44 24c0-1.341-.138-2.65-.389-3.917z"/>
  </svg>
);

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="absolute inset-0 bg-white text-gray-800 flex flex-col items-center justify-center p-8 rounded-lg">
      <div className="w-full max-w-xs text-center">
        <LogoIcon className="h-16 w-16 mx-auto text-violet-600" />
        <p className="mt-4 text-sm text-gray-600">선물 추천을 위한 최고의 선택, GPT-4b</p>

        <form className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 bg-gray-100 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 bg-gray-100 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <div className="flex items-center justify-between text-xs text-gray-500">
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-violet-600 rounded focus:ring-violet-500" />
              <span className="ml-2">Remember me</span>
            </label>
            <a href="#" className="font-medium text-violet-600 hover:text-violet-500">Forgot password?</a>
          </div>
          <button
            type="button"
            onClick={onLogin}
            className="w-full bg-violet-600 text-white font-bold py-3 rounded-lg hover:bg-violet-700 transition-colors"
          >
            로그인
          </button>
           <div className="flex items-center justify-between text-xs mt-2">
            <a href="#" className="font-medium text-gray-500 hover:text-gray-700">아이디 / 비밀번호 찾기</a>
            <a href="#" className="font-medium text-violet-600 hover:text-violet-500">신규 가입하기</a>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full flex items-center justify-center py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
            <AppleIcon />
            Sign in with Apple
          </button>
          <button className="w-full flex items-center justify-center py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
            <GoogleIcon />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};
