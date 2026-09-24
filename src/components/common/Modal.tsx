import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-[390px]',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 60% matte dark scrim */}
      <div
        className="fixed inset-0 bg-[#0F172A] bg-opacity-60 transition-opacity"
        onClick={onClose}
      />

      {/* Level 2 Modal Card: Pure white, 2px Primary Deep Teal border */}
      <div
        className={`relative w-full ${maxWidth} bg-white rounded-[6px] border-2 border-brand p-5 shadow-2xl z-10`}
      >
        {title && <div className="mb-4">{title}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
};
