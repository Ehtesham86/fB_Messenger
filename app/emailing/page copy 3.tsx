// pages/index.tsx

"use client";

import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const sendEmail = async (values: { to: string; subject: string; text: string; files: File[] }) => {
  const formData = new FormData();

  // Append all fields to FormData
  formData.append("to", values.to);
  formData.append("subject", values.subject);
  formData.append("text", values.text);

  // Append files to FormData
  for (const file of values.files) {
    formData.append("files", file); // Appending files to formData
  }

  try {
    const response = await fetch("/api/sendEmail", {
      method: "POST",
      body: formData,
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
  to: Yup.string().email("Invalid email address").required("Email is required"),
  subject: Yup.string().required("Subject is required"),
  text: Yup.string().required("Text is required"),
  files: Yup.array().of(Yup.mixed().required("A file is required")).required("Please select at least one file"),
});

const EmailForm = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Send Email</h2>
        <Formik
          initialValues={{ to: "", subject: "", text: "", files: [] }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            sendEmail(values);
            setSubmitting(false);
          }}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-gray-600 font-medium mb-2" htmlFor="to">To</label>
                <Field
                  name="to"
                  type="email"
                  className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
                <ErrorMessage name="to" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 font-medium mb-2" htmlFor="subject">Subject</label>
                <Field
                  name="subject"
                  type="text"
                  className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
                <ErrorMessage name="subject" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 font-medium mb-2" htmlFor="text">Message</label>
                <Field
                  name="text"
                  as="textarea"
                  rows="6"
                  className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
                <ErrorMessage name="text" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 font-medium mb-2" htmlFor="files">Upload Files</label>
                <input
                  type="file"
                  name="files"
                  onChange={(event) => {
                    const files = event.currentTarget.files;
                    if (files) {
                      setFieldValue("files", Array.from(files));
                    }
                  }}
                  className="w-full border border-gray-300 rounded-md p-2"
                  multiple
                />
                <ErrorMessage name="files" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600"
              >
                Send Email
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EmailForm;
