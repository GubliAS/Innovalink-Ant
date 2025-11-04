"use client";
import { useEffect, useState } from "react";
import { Modal } from "./modal";
import { Check } from "lucide-react";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose }) => {
  const [waitlist, setWaitlist] = useState<{
    count: number;
    initials: string[];
  }>({
    count: 0,
    initials: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/waitlist");
      const data = await res.json();
      if (data.success)
        setWaitlist({ count: data.count, initials: data.initials });
    };
    fetchData();
  }, []);

  const getRandomColor = () => {
    const colors = [
      "#16a34a",
      "#2563eb",
      "#d97706",
      "#dc2626",
      "#7c3aed",
      "#0891b2",
      "#4ade80",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      modalClassName="max-w-[365px] px-[42px] py-[60px] "
    >
      <div className="grid grid-cols-1 gap-10 items-center justify-center">
        <div>
          <Check />
        </div>
        <div>
          <p className="text-center text-2xl text-neutral-0">
            You have been added to our{" "}
            <span className=" text-primary-5">waitlist!</span>
          </p>
          <p className="text-neutral-0 text-sm">
            Thank You for joining, you’ll be the first to know when we are live!
          </p>
        </div>

        <div>
          {/* Circles with initials */}
          <div className="flex mt-6 space-x-2">
            {waitlist.initials.slice(0, 5).map((letter, idx) => {
              const color = getRandomColor();
              return (
                <div
                  key={idx}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                  style={{
                    border: `2px solid ${color}`,
                    color: color,
                    backgroundColor: "transparent",
                  }}
                >
                  {letter}
                </div>
              );
            })}
          </div>
          {/* Count message */}
          <p className="mt-3 text-gray-400 text-sm">
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
