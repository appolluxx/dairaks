
import React from 'react';
import { Leaf } from 'lucide-react';

const LoadingScreen: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center animate-fade-in">
            <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <Leaf className="w-12 h-12 text-primary" strokeWidth={2.5} />
                </div>
                <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight mb-2">SaveRaks</h1>
                <p className="text-gray-500 font-medium text-sm tracking-wide uppercase">Sustainable Mindset</p>

                <div className="mt-12 flex space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-ping delay-75"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-ping delay-150"></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
