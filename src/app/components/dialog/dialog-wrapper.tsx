"use client";

import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

export type DialogWrapperProps = {
  headline: ReactNode;
  content: ReactNode;
  footer: ReactNode;
  onClose?: () => void;
};

export default function Dialog({
  headline,
  content,
  footer,
  onClose,
}: DialogWrapperProps) {
  const isClosable = onClose !== undefined;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isClosable) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isClosable, onClose]);

  return createPortal(
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-white/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
          <div className="relative overflow-hidden text-left bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg">
            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3
                  className="text-base font-semibold leading-6 text-gray-900"
                  id="modal-title"
                >
                  {headline}
                </h3>
                <div className="mt-2">{content}</div>
              </div>
            </div>
            <div className="gap-2 px-4 py-3 bg-gray-50 sm:flex sm:flex-row-reverse sm:px-6">
              {footer}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
