import React from 'react';
import { HiPlus } from 'react-icons/hi';

const FloatingActionButton = ({ onClick, icon: Icon = HiPlus }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 lg:bottom-8 lg:right-8 w-14 h-14 lg:w-16 lg:h-16 bg-primary-600 hover:bg-primary-700 rounded-full shadow-2xl border-4 border-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 z-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
      aria-label="Add activity"
    >
      <Icon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
    </button>
  );
};

export default FloatingActionButton;
