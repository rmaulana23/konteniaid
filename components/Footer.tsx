import React, { useState } from 'react';
import TermsModal from './TermsModal';

const Footer: React.FC = () => {
    const [isTermsOpen, setIsTermsOpen] = useState(false);

    return (
        <>
            <footer className="w-full py-3 px-4 sm:px-6 lg:px-8 border-t border-gray-200 mt-6 bg-white">
                <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between max-w-7xl text-sm text-gray-500">
                    <p>&copy; 2025 Kontenia. All rights reserved.</p>
                    <button 
                        onClick={() => setIsTermsOpen(true)}
                        className="mt-2 sm:mt-0 hover:text-gray-900 transition-colors"
                    >
                        Syarat & Ketentuan Penggunaan
                    </button>
                </div>
            </footer>
            <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
        </>
    );
};

export default Footer;