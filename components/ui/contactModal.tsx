import Modal from "./modal";
import { useState, useEffect } from "react";
import Button from "./../button";
import { X, FileImage, FileText, CircleAlert } from "lucide-react";
import SuccessContactModal from "./successContactModal";
import { getCalApi } from "@calcom/embed-react";
import { useMotionValue, useTransform } from "framer-motion";
import Link from "next/link";
import { showToast } from "./toast";
import FormInput from "@/components/ui/FormInput";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FieldErrors {
  fullName?: string;
  email?: string;
  subject?: string;
  projectDetails?: string;
  files?: string;
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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
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

  useEffect(() => {
    if (isOpen) {
      (async function () {
        const cal = await getCalApi({ namespace: "scheduleameeting" });
        cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
      })();
    }
  }, [isOpen]);

  // Reset y position when modal closes
  useEffect(() => {
    if (!isOpen) {
      y.set(0);
    }
  }, [isOpen, y]);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setFieldErrors({});
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
    const id = file.name;

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
    const baseName = name.substring(0, maxLength - 3);
    return `${baseName}... .${extension}`;
  };

  const MAX_FILES = 3;

  const handleFiles = (newFiles: File[]) => {
    const updatedFiles = [...files, ...newFiles];

    if (updatedFiles.length > MAX_FILES) {
      setFieldErrors((prev) => ({
        ...prev,
        files: `You cannot upload more than ${MAX_FILES} files.`,
      }));
      setTimeout(() => {
        setFieldErrors((prev) => ({ ...prev, files: undefined }));
      }, 5000);
      return;
    }

    setFiles(updatedFiles);
    setFieldErrors((prev) => ({ ...prev, files: undefined }));
    newFiles.forEach((file) => simulateProgress(file));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
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
    setFieldErrors({});

    // Client-side validation - check which fields are empty
    const errors: FieldErrors = {};
    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    }
    if (!formData.subject.trim()) {
      errors.subject = "Subject is required";
    }
    if (!formData.projectDetails.trim()) {
      errors.projectDetails = "Project details are required";
    }

    // If there are validation errors, show them and stop
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("fullName", formData.fullName.trim());
      data.append("email", formData.email.trim());
      data.append("subject", formData.subject.trim());
      data.append("projectDetails", formData.projectDetails.trim());
      data.append("contactType", formData.contactType.trim());
      if (files.length > 0) {
        files.forEach((file) => data.append("attachments", file));
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (result.success) {
        showToast(result.message || "Message sent successfully!", "success");
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
          setIsSuccessModal(false);
        }, 5000);
      } else {
        // Handle different types of errors
        const errorMessage = result.message;

        // Backend/Database errors (show as toast)
        if (
          errorMessage.includes("Something went wrong") ||
          errorMessage.includes("server") ||
          errorMessage.includes("database") ||
          errorMessage.includes("connection")
        ) {
          showToast(errorMessage, "error");
        } else if (
          errorMessage.includes("email") &&
          errorMessage.includes("valid")
        ) {
          setFieldErrors({ email: "Please enter a valid email address" });
        } else if (errorMessage.includes("email provider")) {
          setFieldErrors({
            email:
              "Please use a valid email provider (e.g., Gmail, iCloud, Outlook, Yahoo)",
          });
        } else if (errorMessage.includes("contact type")) {
          showToast("Invalid contact type selected", "error");
        } else if (
          errorMessage.includes("file") ||
          errorMessage.includes("upload")
        ) {
          setFieldErrors({ files: errorMessage });
        } else if (
          errorMessage.includes("exceeds") ||
          errorMessage.includes("25MB")
        ) {
          setFieldErrors({ files: errorMessage });
        } else if (errorMessage.includes("not an allowed file type")) {
          setFieldErrors({ files: errorMessage });
        } else {
          // Generic error - show as toast
          showToast(errorMessage, "error");
        }
      }
    } catch (error) {
      // Network or unexpected errors - show as toast
      showToast("Something went wrong. Please try again.", "error");
      console.error("Contact form error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      modalClassName="md:max-w-[900px] md:max-h-[95vh] md:mt-10 relative lg:max-w-[1000px] xl:max-w-6xl w-full md:overflow-visible scrollbar-hide rounded-b-none md:rounded-[28px]"
      showCloseButton={true}
      bgClassName="p-0 md:p-4 flex items-end md:items-center"
      closeClassName="hidden md:block"
      enableDrag={true}
      dragY={y}
      dragOpacity={opacity}
      onDragEnd={handleDragEnd}
      footerChildren={
        <div className="md:hidden px-5 sm:px-8 py-5">
          <Button
            type="submit"
            form="contactForm"
            disabled={loading}
            className="bg-linear-to-r from-[#09C00E] to-[#045A07] w-full hover:opacity-80 focus:opacity-80 text-neutral-0 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
            text={loading ? "Sending..." : "Submit Inquiry"}
          />
        </div>
      }
      dragHandle={
        <div className="flex items-center justify-center pt-2 pb-2">
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
          <ul className="bg-linear-to-br from-[#09C00E] to-[#045A07] rounded-3xl p-6 flex flex-col justify-between flex-1 min-h-[150px] w-[90%]">
            <li className="text-neutral-0 font-medium text-base sm:text-lg">
              Busy schedule? Pick a time that works best for you.
            </li>
            <Link href="https://cal.com/binarybond/scheduleameeting">
              <Button
                text="Book a free call"
                onClick={() => {
                  onClose();
                }}
                className="text-foundation-black bg-neutral-0 hover:bg-neutral-2 transition"
              />
            </Link>
          </ul>
        </div>

        {/* Left Side - Call to Action */}
        <div className="hidden md:flex bg-linear-to-br from-[#09C00E] to-[#045A07] rounded-3xl p-8 lg:p-12 flex-col justify-between w-[40%] min-h-[600px]">
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
            <Link href="https://cal.com/binarybond/scheduleameeting">
              <Button
                text="Book a free call"
                onClick={() => {
                  onClose();
                }}
                className="text-foundation-black bg-neutral-0 hover:bg-neutral-2 transition"
              />
            </Link>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-2 w-full p-0 md:p-5">
          <form id="contactForm" onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full name *"
                error={fieldErrors.fullName}
                disabled={loading}
              />

              <FormInput
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email *"
                error={fieldErrors.email}
                disabled={loading}
              />
            </div>

            {/* Subject */}
            <FormInput
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject *"
              error={fieldErrors.subject}
              disabled={loading}
            />

            {/* Project Details - Textarea */}
            <FormInput
              as="textarea"
              name="projectDetails"
              value={formData.projectDetails}
              onChange={handleChange}
              placeholder="Project details *"
              error={fieldErrors.projectDetails}
              disabled={loading}
              rows={5}
            />

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
                    : fieldErrors.files
                    ? "border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/10"
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
              {fieldErrors.files && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.files}</p>
              )}

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
                        <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-neutral-4 dark:text-neutral-1" />
                      )}

                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <p className="text-xs font-medium truncate text-neutral-6 dark:text-neutral-0">
                          {truncateFileName(file.name, 15)}
                        </p>
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
                        className="cursor-pointer absolute -top-2.5 -right-2.5 border dark:border-none border-neutral-2 bg-neutral-1 dark:bg-neutral-6 hover:bg-neutral-2 dark:hover:bg-neutral-7 p-1 rounded-full transition-all duration-300"
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
              <label className="block text-[15px] lg:text-base mb-3 md:mb-4 text-neutral-5 dark:text-neutral-0 font-medium">
                Contacting as*
              </label>
              <div className="flex gap-6 text-sm lg:text-base">
                <label className="flex items-center cursor-pointer text-neutral-5 dark:text-neutral-2">
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
              className="hidden text-center md:flex justify-center bg-linear-to-r from-[#09C00E] to-[#045A07] w-full hover:opacity-80 focus:opacity-80 text-neutral-0 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
              text={loading ? "Sending..." : "Submit Inquiry"}
            />
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
