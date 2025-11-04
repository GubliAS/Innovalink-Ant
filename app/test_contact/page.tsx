"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    projectDetails: "",
    contactType: "Individual",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
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

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
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
      if (file) {
        data.append("attachment", file);
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
        setFile(null);
        const form = e.target as HTMLFormElement;
        form.reset();
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
    <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8">
        {/* Left Side - Call to Action */}
        <div className="bg-linear-to-br from-green-500 to-green-600 rounded-3xl p-12 flex flex-col justify-between">
          <div>
            <p className="text-sm mb-2">No need to wait to get started</p>
            <h1 className="text-5xl font-bold mb-4">
              Get In Touch
              <br />
              With Us !
            </h1>
          </div>

          <div>
            <p className="text-sm mb-4">
              Busy schedule? Pick a time
              <br />
              that works best for you.
            </p>
            <button className="bg-white text-green-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
              Book a free call
            </button>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="bg-gray-800 rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name and Email Row */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full name *"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500 text-white placeholder-gray-400"
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
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500 text-white placeholder-gray-400"
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
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500 text-white placeholder-gray-400"
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
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500 text-white placeholder-gray-400 resize-none"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm mb-2">Attach a file</label>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
                  dragActive
                    ? "border-green-500 bg-gray-700"
                    : "border-gray-600 bg-gray-750"
                }`}
              >
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  disabled={loading}
                  accept=".pdf,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png"
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <p className="text-gray-300 mb-1">
                    {file ? file.name : "Choose a file or drag and drop here"}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Supported formats: PDF, PPT, XLS, JPG (max. 25MB)
                  </p>
                </label>
              </div>
            </div>

            {/* Contact Type */}
            <div>
              <label className="block text-sm mb-3">Contacting as*</label>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="contactType"
                    value="Individual"
                    checked={formData.contactType === "Individual"}
                    onChange={handleChange}
                    disabled={loading}
                    className="mr-2 w-4 h-4 accent-green-500"
                  />
                  <span>Individual</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="contactType"
                    value="Business"
                    checked={formData.contactType === "Business"}
                    onChange={handleChange}
                    disabled={loading}
                    className="mr-2 w-4 h-4 accent-green-500"
                  />
                  <span>Business</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white py-4 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Sending..." : "Submit Inquiry"}
            </button>

            {/* Success/Error Message */}
            {message.text && (
              <p
                className={`text-center ${
                  message.type === "success" ? "text-green-400" : "text-red-400"
                }`}
              >
                {message.text}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
