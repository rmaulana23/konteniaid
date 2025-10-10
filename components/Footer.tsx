import React, { useState } from 'react';
import TermsModal from './TermsModal';
import PrivacyPolicyModal from './PrivacyPolicyModal'; // Import the new modal

const Footer: React.FC = () => {
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);

    return (
        <>
            <footer className="w-full pt-8 pb-6 px-4 sm:px-6 lg:px-8 border-t border-gray-200 bg-white">
                <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between max-w-7xl text-sm text-gray-500">
                    <p>&copy; 2025 Kontenia. All rights reserved.</p>
                    <div className="flex items-center gap-4 mt-2 sm:mt-0">
                        <button 
                            onClick={() => setIsTermsOpen(true)}
                            className="hover:text-brand-primary transition-colors"
                        >
                            Syarat & Ketentuan
                        </button>
                        <button 
                            onClick={() => setIsPrivacyPolicyOpen(true)}
                            className="hover:text-brand-primary transition-colors"
                        >
                            Kebijakan Privasi
                        </button>
                    </div>
                </div>
            </footer>
            <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
            <PrivacyPolicyModal isOpen={isPrivacyPolicyOpen} onClose={() => setIsPrivacyPolicyOpen(false)} />
        </>
    );
};

export default Footer;