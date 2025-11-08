import Modal from "./modal";
import { useState, useEffect } from "react";
import Button from "./../button";
import { X, FileImage, FileText } from "lucide-react";
import SuccessContactModal from "./successContactModal";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    projectDetails: "",
    contactType: "Individual",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );

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

  // Reset y position when modal closes
  useEffect(() => {
    if (!isOpen) {
      y.set(0);
    }
  }, [isOpen, y]);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
        setFiles([]);
        setFormData({
          fullName: "",
          email: "",
          subject: "",
          projectDetails: "",
          contactType: "Individual",
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const simulateProgress = (file: File) => {
    let percent = 0;
    const id = file.name; // use filename as key

    const interval = setInterval(() => {
      percent += Math.random() * 15;
      if (percent >= 100) {
        percent = 100;
        clearInterval(interval);
      }
      setUploadProgress((prev) => ({ ...prev, [id]: percent }));
    }, 200);
  };

  const truncateFileName = (name: string, maxLength = 12) => {
    if (name.length <= maxLength) return name;
    const extension = name.split(".").pop();
    const baseName = name.substring(0, maxLength - 3); // reserve space for "..."
    return `${baseName}... .${extension}`;
  };

  const MAX_FILES = 3;

  const handleFiles = (newFiles: File[]) => {
    const updatedFiles = [...files, ...newFiles];

    if (updatedFiles.length > MAX_FILES) {
      setMessage({
        type: "error",
        text: `You cannot upload more than ${MAX_FILES} files.`,
      });
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
      return;
    }

    setFiles(updatedFiles);
    newFiles.forEach((file) => simulateProgress(file));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    handleFiles(newFiles);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleFiles(droppedFiles);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("subject", formData.subject);
      data.append("projectDetails", formData.projectDetails);
      data.append("contactType", formData.contactType);
      if (files.length > 0) {
        files.forEach((file) => data.append("attachments", file));
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: "success", text: result.message });
        // Reset form
        setFormData({
          fullName: "",
          email: "",
          subject: "",
          projectDetails: "",
          contactType: "Individual",
        });
        setFiles([]);
        setIsSuccessModal(true);
        setTimeout(() => {
          setMessage({ type: "", text: "" });
          setIsSuccessModal(false);
        }, 5000);
      } else {
        setMessage({ type: "error", text: result.message });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      modalClassName="md:max-w-[900px] md:max-h-[95vh] relative lg:max-w-[1000px] xl:max-w-6xl w-full md:overflow-visible scrollbar-hide rounded-b-none md:rounded-[28px]"
      showCloseButton={true}
      bgClassName="p-0 md:p-4 flex items-end md:items-center"
      closeClassName="hidden md:block"
      enableDrag={true}
      dragY={y}
      dragOpacity={opacity}
      onDragEnd={handleDragEnd}
      footerChildren={
        <div className="md:hidden px-5 sm:px-8 py-5">
          {/* Submit Button */}
          <Button
            type="submit"
            form="contactForm"
            disabled={loading}
            className="bg-linear-to-r from-[#09C00E] to-[#045A07] w-full hover:opacity-80 focus:opacity-80 text-neutral-0 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
            text={loading ? "Sending..." : "Submit Inquiry"}
          />

          {/* Success/Error Message */}
          {message.text && (
            <p
              className={`text-center mt-2 text-sm md:text-base ${
                message.type === "success" ? "text-green-400" : "text-red-400"
              }`}
            >
              {message.text}
            </p>
          )}
        </div>
      }
      dragHandle={
        <div className="flex items-center justify-center pt-4 pb-2">
          <div className="rounded-[11px] bg-neutral-6 h-1.5 w-1/5" />
        </div>
      }
    >
      <div className="flex flex-col md:flex-row gap-4 px-5 sm:px-8 py-4 md:py-10">
        {/* mobile screen addition */}
        <div className="md:hidden space-y-4 mb-6">
          <ul>
            <li className="text-sm dark:text-neutral-0 text-neutral-5">
              No need to wait to get started.
            </li>
            <li className="text-2xl font-semibold dark:text-primary-1 text-neutral-6">
              Get In Touch With Us !
            </li>
          </ul>
          <ul className="bg-linear-to-br from-[#09C00E] to-[#045A07] rounded-3xl p-6 flex flex-col justify-between flex-1  min-h-[150px] w-[90%]">
            <li className="text-neutral-0 font-medium text-base sm:text-lg">
              Busy schedule? Pick a time that works best for you.
            </li>
            <Button
              text="Book a free call"
              className="w-fit text-foundation-black bg-neutral-0 hover:bg-neutral-1 transition"
            />
          </ul>
        </div>
        {/* Left Side - Call to Action */}
        <div className="hidden md:flex bg-linear-to-br from-[#09C00E] to-[#045A07] rounded-3xl p-8 lg:p-12  flex-col justify-between w-[40%] min-h-[600px]">
          <div className="text-neutral-0">
            <p className="text-sm mb-2">No need to wait to get started</p>
            <h1 className="text-3xl lg:text-[40px] leading-tight font-bold mb-4">
              Get In Touch
              <br />
              With Us !
            </h1>
          </div>

          <div className="text-neutral-0">
            <p className="text-sm mb-4">
              Busy schedule? Pick a time
              <br />
              that works best for you.
            </p>
            <Button
              text="Book a free call"
              className="text-foundation-black bg-neutral-0 hover:bg-neutral-1 transition"
            />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-2 w-full p-0 md:p-5">
          <form id="contactForm" onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full name *"
                  required
                  disabled={loading}
                  className="text-sm lg:text-base w-full px-3.5 py-2.5 bg-neutral-0 dark:bg-neutral-6 rounded-lg focus:outline-none border-[1.5px] dark:border-transparent border-neutral-2 dark:focus:border-neutral-0 focus:border-neutral-3 text-neutral-6 dark:text-neutral-0 placeholder-neutral-4 transition"
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email *"
                  required
                  disabled={loading}
                  className="text-sm lg:text-base w-full px-3.5 py-2.5 bg-neutral-0 dark:bg-neutral-6 rounded-lg focus:outline-none border-[1.5px] dark:border-transparent border-neutral-2 dark:focus:border-neutral-0 focus:border-neutral-3 text-neutral-6 dark:text-neutral-0 placeholder-neutral-4 transition"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject *"
                required
                disabled={loading}
                className="text-sm lg:text-base w-full px-3.5 py-2.5 bg-neutral-0 dark:bg-neutral-6 rounded-lg focus:outline-none border-[1.5px] dark:border-transparent border-neutral-2 dark:focus:border-neutral-0 focus:border-neutral-3 text-neutral-6 dark:text-neutral-0 placeholder-neutral-4 transition"
              />
            </div>

            {/* Project Details */}
            <div>
              <textarea
                name="projectDetails"
                value={formData.projectDetails}
                onChange={handleChange}
                placeholder="Project details"
                required
                disabled={loading}
                rows={5}
                className="text-sm lg:text-base w-full px-3.5 py-2.5 bg-neutral-0 dark:bg-neutral-6 rounded-lg focus:outline-none border-[1.5px] dark:border-transparent border-neutral-2 dark:focus:border-neutral-0 focus:border-neutral-3 text-neutral-6 dark:text-neutral-0 placeholder-neutral-4 transition resize-none"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-[15px] lg:text-base mb-3 md:mb-4 text-neutral-5 dark:text-neutral-0 font-medium">
                Attach a file
              </label>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl py-7 px-4 text-center cursor-pointer transition ${
                  dragActive
                    ? "border-green-500 bg-neutral-0 dark:bg-neutral-6"
                    : "border-neutral-4 dark:border-neutral-2 bg-neutral-2 dark:bg-[#161515]"
                }`}
              >
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  disabled={loading}
                  accept=".pdf,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png"
                  multiple
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <p className="text-neutral-5 dark:text-neutral-0 text-sm mb-1 font-medium">
                    Choose a file or drag and drop here
                  </p>
                  <p className="text-neutral-4 dark:text-neutral-4 text-xs">
                    Supported formats: PDF, PPT, XLS, JPG (max. 25MB)
                  </p>
                </label>
              </div>
              {/* File List */}
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2.5 mt-4">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      style={{
                        boxShadow: "0 1px 2px 0 rgba(10, 13, 18, 0.05)",
                      }}
                      className="relative flex items-center gap-2 bg-neutral-0 dark:bg-neutral-5 border border-neutral-2 dark:border-neutral-4 rounded-[10px] px-3 py-2.5"
                    >
                      {/\.(png|jpg|jpeg)$/i.test(file.name) ? (
                        <FileImage className="w-8 h-8 sm:w-10 sm:h-10 text-neutral-1" />
                      ) : (
                        <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-neutral-4 dark:text-neutral-1 " />
                      )}

                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <p className="text-xs font-medium truncate text-neutral-6 dark:text-neutral-0">
                          {truncateFileName(file.name, 15)}
                        </p>
                        {/* Progress or size */}
                        {uploadProgress[file.name] !== undefined &&
                        uploadProgress[file.name] < 100 ? (
                          <div className="flex flex-col gap-1 items-start">
                            <p className="text-[11px] text-neutral-4 dark:text-neutral-0">
                              {(
                                (uploadProgress[file.name] / 100) *
                                (file.size / 1024 / 1024)
                              ).toFixed(1)}
                              MB / {(file.size / 1024 / 1024).toFixed(1)}MB
                            </p>
                            <div className="w-full bg-neutral-2 dark:bg-neutral-1 h-2 rounded-full mt-1">
                              <div
                                className="bg-primary-5 h-2 rounded-full transition-all duration-200"
                                style={{
                                  width: `${uploadProgress[file.name]}%`,
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-neutral-4 dark:text-neutral-0">
                            {(file.size / 1024 / 1024).toFixed(1)}MB
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setFiles((prev) => prev.filter((_, i) => i !== index))
                        }
                        className={`cursor-pointer absolute -top-2.5 -right-2.5 border dark:border-none border-neutral-2 bg-neutral-1 dark:bg-neutral-6 hover:bg-neutral-2 dark:hover:bg-neutral-7  p-1  rounded-full transition-all duration-300`}
                        aria-label="Remove file upload"
                      >
                        <X className="w-3.5 h-3.5 text-neutral-4 dark:text-neutral-0" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Type */}
            <div>
              <label className="block text-[15px] lg:text-base  mb-3 md:mb-4 text-neutral-5 dark:text-neutral-0 font-medium">
                Contacting as*
              </label>
              <div className="flex gap-6 text-sm lg:text-base">
                <label className="flex items-center cursor-pointer text-neutral-5 dark:text-neutral-2 ">
                  <input
                    type="radio"
                    name="contactType"
                    value="Individual"
                    checked={formData.contactType === "Individual"}
                    onChange={handleChange}
                    disabled={loading}
                    className="mr-2 w-4 h-4 dark:accent-green-500 accent-primary-6"
                  />
                  <span>Individual</span>
                </label>
                <label className="flex items-center cursor-pointer text-neutral-5 dark:text-neutral-2">
                  <input
                    type="radio"
                    name="contactType"
                    value="Business"
                    checked={formData.contactType === "Business"}
                    onChange={handleChange}
                    disabled={loading}
                    className="mr-2 w-4 h-4 dark:accent-green-500 accent-primary-6"
                  />
                  <span>Business</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="hidden md:flex bg-linear-to-r from-[#09C00E] to-[#045A07] w-full hover:opacity-80 focus:opacity-80 text-neutral-0  font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
              text={loading ? "Sending..." : "Submit Inquiry"}
            />

            {/* Success/Error Message */}
            {message.text && (
              <p
                className={`hidden md:flex text-center ${
                  message.type === "success" ? "text-green-400" : "text-red-400"
                }`}
              >
                {message.text}
              </p>
            )}
          </form>
        </div>
      </div>

      <SuccessContactModal
        isOpen={isSuccessModal}
        onClose={() => setIsSuccessModal(false)}
      />
    </Modal>
  );
};

export default ContactModal;
