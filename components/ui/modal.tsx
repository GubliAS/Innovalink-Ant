"use client";

import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footerChildren?: React.ReactNode;
  showCloseButton?: boolean;
  modalClassName?: string;
  bgClassName?: string;
  closeClassName?: string;
  enableDrag?: boolean;
  dragY?: any;
  dragOpacity?: any;
  onDragEnd?: (event: any, info: any) => void;
  dragHandle?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  footerChildren,
  showCloseButton = true,
  modalClassName,
  bgClassName,
  closeClassName,
  enableDrag = false,
  dragY,
  dragOpacity,
  onDragEnd,
  dragHandle,
}) => {
  const [mounted, setMounted] = useState(false);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  // Motion values for drag-to-close on mobile (use provided or create default)
  const defaultY = useMotionValue(0);
  const defaultOpacity = useTransform(defaultY, [0, 250], [1, 0]);
  const y = dragY || defaultY;
  const opacity = dragOpacity || defaultOpacity;

  const handleDragEnd =
    onDragEnd ||
    ((_: any, info: any) => {
      if (info.offset.y > 100) {
        onClose();
      } else {
        (dragY || defaultY).set(0);
      }
    });

  // Setup portal root and check if mobile
  const [isMobile, setIsMobile] = useState(false);
  const [canDrag, setCanDrag] = useState(true);
  const scrollableContentRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const touchStartScrollTop = useRef<number>(0);
  const isDraggingFromContent = useRef<boolean>(false);

  useEffect(() => {
    let root = document.getElementById("modal-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "modal-root";
      document.body.appendChild(root);
    }
    setPortalRoot(root);
    setMounted(true);

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle drag start - check if content is scrollable and at top
  const handleDragStart = (event: any) => {
    if (!enableDrag || !isMobile) return;

    // If dragging from the handle area, always allow drag
    const target = event?.target as HTMLElement;
    if (target) {
      const isHandleArea = target.closest("[data-drag-handle]");
      if (isHandleArea) {
        // Always allow drag from handle, regardless of scroll
        setCanDrag(true);
        return;
      }
    }

    // Otherwise, check if scrollable content is at the top
    if (scrollableContentRef.current) {
      setCanDrag(scrollableContentRef.current.scrollTop === 0);
    } else {
      setCanDrag(true);
    }
  };

  // Enhanced drag end handler
  const enhancedHandleDragEnd = (event: any, info: any) => {
    if (!canDrag && info.offset.y < 0) {
      // If can't drag and user tried to drag up, just reset
      (dragY || defaultY).set(0);
      return;
    }
    handleDragEnd(event, info);
  };

  // ESC key close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Reset drag state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCanDrag(true);
      (dragY || defaultY).set(0);
    }
  }, [isOpen, dragY, defaultY]);

  // Scroll lock for background
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted || !portalRoot) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`min-w-[320px] fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden ${bgClassName}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <motion.div
            onClick={onClose}
            className="absolute inset-0 bg-black/50 dark:bg-black/65 backdrop-blur-[6px] "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal container */}
          <motion.div
            style={{
              opacity,
              y,
              touchAction: enableDrag && isMobile ? "pan-y" : "auto",
            }}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            drag={enableDrag && isMobile ? "y" : false}
            whileDrag={{ cursor: "grabbing" }}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            dragMomentum={false}
            dragDirectionLock={true}
            dragPropagation={false}
            dragListener={true}
            onDragStart={handleDragStart}
            onDragEnd={
              enableDrag && isMobile ? enhancedHandleDragEnd : undefined
            }
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-h-[85vh] bg-neutral-1 dark:bg-neutral-7 rounded-[28px] z-10 flex flex-col ${modalClassName}`}
          >
            {/* Close Button (Desktop) */}
            {showCloseButton && (
              <button
                onClick={onClose}
                className={`${closeClassName} cursor-pointer absolute -top-2.5 -right-2.5 bg-neutral-1 hover:bg-neutral-2 dark:bg-neutral-6 dark:hover:bg-neutral-5 border border-neutral-4 dark:border-neutral-7 p-2  rounded-full transition-colors`}
                aria-label="Close Modal"
              >
                <X className="w-4 h-4 text-neutral-4 dark:text-neutral-0" />
              </button>
            )}

            {/* Drag Handle Area - Fixed at top, triggers modal drag */}
            {enableDrag && isMobile && dragHandle && (
              <div
                data-drag-handle
                style={{
                  touchAction: "pan-y",
                  WebkitTouchCallout: "none",
                  WebkitUserSelect: "none",
                  userSelect: "none",
                  position: "relative",
                  zIndex: 50,
                  flexShrink: 0,
                  cursor: "grab",
                  pointerEvents: "auto",
                }}
                className="md:hidden active:cursor-grabbing"
              >
                {dragHandle}
              </div>
            )}

            {/* Scrollable Content */}
            <div
              ref={scrollableContentRef}
              className="flex-1 overflow-y-auto"
              style={{
                // Allow pan-y for scrolling, but we'll handle drag manually when at top
                touchAction: "pan-y",
                WebkitOverflowScrolling: "touch",
              }}
              onScroll={(e) => {
                // Update canDrag based on scroll position
                if (enableDrag && isMobile) {
                  const target = e.target as HTMLElement;
                  const isAtTop = target.scrollTop === 0;
                  setCanDrag(isAtTop);

                  // If we were dragging from content but user scrolled, cancel the drag
                  if (!isAtTop && isDraggingFromContent.current) {
                    isDraggingFromContent.current = false;
                    (dragY || defaultY).set(0);
                  }
                }
              }}
              onTouchStart={(e) => {
                if (!enableDrag || !isMobile || !scrollableContentRef.current)
                  return;

                const scrollTop = scrollableContentRef.current.scrollTop;
                const touch = e.touches[0];

                touchStartY.current = touch.clientY;
                touchStartScrollTop.current = scrollTop;

                // If at the top, we might want to drag the modal
                if (scrollTop === 0) {
                  // Store that we're potentially dragging from content
                  isDraggingFromContent.current = true;
                }
              }}
              onTouchMove={(e) => {
                if (!enableDrag || !isMobile || !scrollableContentRef.current)
                  return;

                const touch = e.touches[0];
                const deltaY = touch.clientY - touchStartY.current;
                const currentScrollTop = scrollableContentRef.current.scrollTop;

                // Only proceed if we started dragging from content area
                if (!isDraggingFromContent.current) return;

                // Check if we started at the top (using the stored value, not current)
                const startedAtTop = touchStartScrollTop.current === 0;

                // If we started at the top and user is dragging down
                if (startedAtTop && deltaY > 0 && currentScrollTop === 0) {
                  // If user has dragged down more than a threshold, start modal drag
                  if (deltaY > 15) {
                    // Prevent default scrolling and page bounce
                    e.preventDefault();
                    e.stopPropagation();

                    // Update modal position
                    y.set(deltaY);
                  }
                } else if (
                  deltaY < 0 ||
                  currentScrollTop > touchStartScrollTop.current
                ) {
                  // User is dragging up or content scrolled - cancel modal drag and allow scrolling
                  isDraggingFromContent.current = false;
                  y.set(0);
                }
              }}
              onTouchEnd={(e) => {
                if (!enableDrag || !isMobile) return;

                if (isDraggingFromContent.current) {
                  const currentY = y.get();

                  // Check if we should close the modal
                  if (currentY > 100) {
                    onClose();
                  } else {
                    // Spring back to original position
                    (dragY || defaultY).set(0);
                  }

                  isDraggingFromContent.current = false;
                  touchStartY.current = 0;
                }
              }}
              onTouchCancel={(e) => {
                // Reset on touch cancel
                if (isDraggingFromContent.current) {
                  isDraggingFromContent.current = false;
                  (dragY || defaultY).set(0);
                  touchStartY.current = 0;
                }
              }}
            >
              {children}
            </div>

            {/* footer content */}
            {footerChildren && (
              <div className="border-t md:border-none border-neutral-2 dark:border-neutral-6/40 shadow-s, shadow-neutral-6 bg-neutral-1 dark:bg-neutral-7">
                {footerChildren}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    portalRoot
  );
};

export default Modal;
