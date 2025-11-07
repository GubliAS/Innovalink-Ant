"use client";

import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  showCloseButton?: boolean;
  modalClassName?: string;
  bgClassName?: string;
  closeClassName?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  showCloseButton = true,
  modalClassName,
  bgClassName,
  closeClassName,
}) => {
  const [mounted, setMounted] = useState(false);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  // Motion values for drag-to-close on mobile
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 250], [1, 0]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.y > 100) {
      onClose();
    } else {
      y.set(0);
    }
  };

  // Setup portal root
  useEffect(() => {
    let root = document.getElementById("modal-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "modal-root";
      document.body.appendChild(root);
    }
    setPortalRoot(root);
    setMounted(true);
  }, []);

  // ESC key close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Scroll lock for background
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollY) window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted || !portalRoot) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed inset-0 z-[9999] flex items-end md:items-center justify-center overflow-hidden ${bgClassName}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <motion.div
            onClick={onClose}
            className="absolute inset-0 bg-black/50 dark:bg-black/65 backdrop-blur-[6px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal container */}
          <motion.div
            style={{ opacity, y }}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-h-[80vh] bg-neutral-1 dark:bg-neutral-7 rounded-t-[28px] md:rounded-[28px] z-10 flex flex-col overflow-hidden ${modalClassName}`}
          >
            {/* Drag Notch Area */}
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              style={{ y }}
              className="relative md:hidden flex flex-col items-center justify-center pb-3 cursor-grab active:cursor-grabbing"
            >
              <div className="bg-neutral-6 h-1.5 w-1/5 rounded-[11px]" />
            </motion.div>

            {/* Close Button (Desktop) */}
            {showCloseButton && (
              <button
                onClick={onClose}
                className={`${closeClassName} hidden md:flex items-center justify-center cursor-pointer absolute -top-2.5 -right-2.5 bg-neutral-1 hover:bg-neutral-2 dark:bg-neutral-6 dark:hover:bg-neutral-5 border border-neutral-4 dark:border-neutral-7 p-2 rounded-full transition-colors`}
                aria-label="Close Modal"
              >
                <X className="w-4 h-4 text-neutral-4 dark:text-neutral-0" />
              </button>
            )}

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 pb-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    portalRoot
  );
};

export default Modal;
