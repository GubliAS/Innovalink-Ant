"use client";
import { useEffect, useState } from "react";
import Modal from "./modal";
import { FaCheck } from 'react-icons/fa6';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose }) => {
  const [waitlist, setWaitlist] = useState<{
    count: number;
  }>({
    count: 0,
  });

  useEffect(() => {
    if (!isOpen) return;
    const fetchData = async () => {
      const res = await fetch("/api/waitlist");
      const data = await res.json();
      if (data.success)
        setWaitlist({ count: data.count });
    };
    fetchData();
  }, []);

  const dummyImages = [
    "https://i.pinimg.com/1200x/b9/af/d2/b9afd2925b48ae6891138f8b4de78413.jpg",
    "https://i.pinimg.com/736x/7e/83/0e/7e830e9c49dee63d546ba2b376523d30.jpg",
    "https://i.pinimg.com/736x/ff/6c/e3/ff6ce308bb9e5d2cc514116aa1d33815.jpg",
    "https://i.pinimg.com/736x/2d/11/01/2d1101af52ac9ef6a7be4cd0acf5fdf3.jpg",
    "https://i.pinimg.com/736x/5f/d4/bb/5fd4bbf49dbf74fe45c019567f348a0b.jpg",
  ];
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
              You have been added to our{" "}
              <span className=" text-primary-5">waitlist!</span>
            </p>
            <p className="text-neutral-5 dark:text-neutral-0 text-sm leading-tight">
              Thank You for joining, you’ll be the first to know when we are
              live!
            </p>
          </div>
        </div>

        <div>
          {/* Circles with initials */}
          <div className="flex -space-x-2 justify-center items-center">
            {dummyImages.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={src}
                className="object-cover object-top w-7 h-7 rounded-full "
              />
            ))}
          </div>
          {/* Count message */}
          <p className="mt-1 text-gray-400 text-sm text-center">
            You’re not alone,{" "}
            <span className="text-green-500 font-semibold">
              {waitlist.count}+ people
            </span>{" "}
            joined!
          </p>
        </div>
      </div>
    </Modal>
  );
};
export default WaitlistModal;
