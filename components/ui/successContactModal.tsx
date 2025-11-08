"use client";
import { useEffect, useState } from "react";
import Modal from "./modal";
import { FaCheck } from 'react-icons/fa6';

interface SuccessContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessContactModal: React.FC<SuccessContactModalProps> = ({
  isOpen,
  onClose,
}) => {   
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      modalClassName="max-w-[365px] px-[42px] py-10 dark:border-2 dark:border-primary-7/60 flex-shrink-0"
      bgClassName="p-4"
    >
      <div className="grid grid-cols-1 gap-8 items-center justify-center">
        <div className="space-y-5">
          <div className="bg-[rgba(4,90,7,0.25)] p-2.5 w-fit rounded-full mx-auto">
            <div className="rounded-full w-fit p-4 md:p-6 bg-linear-to-br from-[#045A07] to-[#09C00E] overflow-hidden">
              <FaCheck className="w-8 h-8 text-neutral-0 " />
            </div>
          </div>

          <div className="text-center space-y-4">
            <p className="text-[22px] sm:text-2xl text-neutral-6 dark:text-neutral-0 font-semibold leading-tight">
              Submitted <br /> Successfully
            </p>
            <p className="text-neutral-5 dark:text-neutral-0 text-sm leading-tight">
              Thank You for joining, you’ll be the first to know when we are
              live!
            </p>
          </div>
        </div>

      </div>
    </Modal>
  );
};
export default SuccessContactModal;
