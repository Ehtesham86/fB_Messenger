"use client";

import React, { useState, useRef } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaAngleDown } from "react-icons/fa";

// Function to handle sending the email
const sendEmail = async (emails: any, subject: string, text: string, files: any) => {
  try {
    const formData = new FormData();
    formData.append("to", emails);
    formData.append("subject", subject);
    formData.append("text", text);

    // Append each file to the formData
    files.forEach((file: any) => {
      formData.append("files", file);
    });

    const response = await fetch("/api/resend", {
      method: "POST",
      body: formData, // Use formData directly as the body
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Success:", data.message);
  } catch (error) {
    console.error("Request failed:", error);
  }
};

// Validation schema using Yup
const validationSchema = Yup.object({
  subject: Yup.string().required("Subject is required"),
  text: Yup.string().required("Text is required"),
});

const EmailForm = () => {
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref for file input

  // Add email to the list
  const addEmail = (e: any) => {
    if (e.key === "Enter" && emailInput.trim() !== "") {
      e.preventDefault();
      if (validateEmail(emailInput.trim())) {
        setEmails([...emails, emailInput.trim()]);
        setEmailInput("");
      } else {
        alert("Invalid email address.");
      }
    }
  };

  // Remove email from the list
  const removeEmail = (index: any) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  return (
    <div className="md:min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Send Email</h2>
        <Formik
          initialValues={{ subject: "", text: "", files: [] }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            const allEmails = emailInput.trim() ? [...emails, emailInput.trim()] : emails;

            if (allEmails.length === 0) {
              alert("Please enter at least one email address.");
              setSubmitting(false);
              return;
            }

            sendEmail(allEmails, values.subject, values.text, values.files);
            setSubmitting(false);
          }}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form>
              {/* Email Input */}
              <div className="mb-4">
                <label className="block text-gray-600 font-medium mb-2">To</label>
                <div className="flex flex-wrap items-center border border-gray-300 rounded-md p-2">
                  {emails.map((email, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full mr-2 mb-2 flex items-center"
                    >
                      {email}
                      <button
                        type="button"
                        onClick={() => removeEmail(index)}
                        className="ml-2 text-red-500"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Enter email and press Enter"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={addEmail}
                    className="outline-none text-black flex-grow bg-transparent mb-2"
                  />
                </div>
              </div>

              {/* Subject Input */}
              <div className="mb-4">
                <label className="block text-gray-600 font-medium mb-2" htmlFor="subject">
                  Subject
                </label>
                <Field
                  name="subject"
                  type="text"
                  className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
                <ErrorMessage name="subject" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Message Textarea */}
              <div className="mb-4">
                <label className="block text-gray-600 font-medium mb-2" htmlFor="text">
                  Message
                </label>
                <Field
                  name="text"
                  as="textarea"
                  rows="6"
                  className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
                <ErrorMessage name="text" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* File Upload - Hidden behind 📎 Icon */}
              <input
                ref={fileInputRef}  // Ref for file input field
                type="file"
                name="files"
                onChange={(event) => {
                  const files = event.currentTarget.files;
                  if (files) {
                    setFieldValue("files", Array.from(files));
                  }
                }}
                className="hidden"
                multiple
              />

              {/* Submit Button and Icon Section */}
              <div className="flex items-center justify-between border-t pt-2">
                <div className="flex items-center bg-gray-600 gap-2 p-1 rounded-3xl">
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || (emails.length === 0 && emailInput.trim() === "")}
                    className="bg-gray-600 flex items-center gap-2 rounded-full text-white px-4 py-2 hover:bg-gray-600 focus:ring-4 focus:outline-none"
                  >
                    {isSubmitting ? "Sending..." : "Send Email"}
                  </button>

                  {/* Arrow Icon */}
                  <span className="cursor-pointer">
                    <FaAngleDown />
                  </span>
                </div>

                {/* Icon Buttons */}
                <div className="flex space-x-2">
                  <button className="text-gray-500 hover:text-gray-700" type="button">
                    A
                  </button>
                  {/* 📎 Icon that triggers the file input */}
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => fileInputRef.current?.click()}  // Trigger file input click
                  >
                    📎
                  </button>
                  <button className="text-gray-500 hover:text-gray-700" type="button">
                    😊
                  </button>
                  <button className="text-gray-500 hover:text-gray-700" type="button">
                    🚫
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

// Function to validate email
const validateEmail = (email: string) => {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  return emailRegex.test(email);
};

export default EmailForm;
