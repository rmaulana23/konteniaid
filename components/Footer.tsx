import React from 'react';

interface FooterProps {
    onOpenTerms: () => void;
    onOpenPrivacy: () => void;
    onOpenSaran: () => void;
    hasAccessCode?: boolean;
}

const Footer: React.FC<FooterProps> = ({ onOpenTerms, onOpenPrivacy, onOpenSaran, hasAccessCode }) => {
    return (
        <footer className="w-full pt-8 pb-6 px-4 sm:px-6 lg:px-8 border-t border-gray-200 bg-white">
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between max-w-6xl text-sm text-gray-500">
                <p>&copy; 2025 Kontenia. All rights reserved.</p>
                {/* Hide on mobile, show on sm and up */}
                <div className="hidden sm:flex items-center gap-4 mt-2 sm:mt-0">
                    {hasAccessCode && (
                        <button 
                            onClick={onOpenSaran}
                            className="hover:text-brand-primary transition-colors"
                        >
                            Saran & Masukan
                        </button>
                    )}
                    <button 
                        onClick={onOpenTerms}
                        className="hover:text-brand-primary transition-colors"
                    >
                        Syarat & Ketentuan
                    </button>
                    <button 
                        onClick={onOpenPrivacy}
                        className="hover:text-brand-primary transition-colors"
                    >
                        Kebijakan Privasi
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;