
import React from 'react';
import { MEDICAL_DISCLAIMER_TEXT } from '../constants';

interface DisclaimerModalProps {
  onAccept: () => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ onAccept }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            ⚖️
          </div>
          <h2 className="text-2xl font-bold text-gray-900">اتفاقية المسؤولية الطبية</h2>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 whitespace-pre-line leading-relaxed text-gray-700">
          {MEDICAL_DISCLAIMER_TEXT}
        </div>

        <button
          onClick={onAccept}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-200"
        >
          أوافق وأتعهد بالالتزام
        </button>
        
        <p className="text-center text-xs text-gray-400 mt-4">
          بالضغط على موافق، أنت تقر بقراءة وفهم جميع البنود أعلاه.
        </p>
      </div>
    </div>
  );
};

export default DisclaimerModal;
