"use client";

import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const sendEmail = async (emails: string[], subject: string, text: string) => {
  try {
    const response = await fetch("/api/sendEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: emails,
        subject,
        text,
      }),
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

const validationSchema = Yup.object({
  subject: Yup.string().required("Subject is required"),
  text: Yup.string().required("Text is required"),
});

const EmailForm = () => {
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");

  const addEmail = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  const removeEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Send Email</h2>
        <Formik
          initialValues={{ subject: "", text: "" }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            const allEmails = emailInput.trim()
              ? [...emails, emailInput.trim()]
              : emails;

            if (allEmails.length === 0) {
              alert("Please enter at least one email address.");
              setSubmitting(false);
              return;
            }

            sendEmail(allEmails, values.subject, values.text);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-gray-600 font-medium mb-2">To</label>
                <div className="flex items-center border border-gray-300 rounded-md p-2">
                  {emails.map((email, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full mr-2 flex items-center"
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
                    className="outline-none text-black flex-grow bg-transparent"
                  />
                </div>
              </div>

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

              <button
                type="submit"
                disabled={isSubmitting || (emails.length === 0 && emailInput.trim() === "")}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition-colors"
              >
                {isSubmitting ? "Sending..." : "Send Email"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

const validateEmail = (email: string) => {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  return emailRegex.test(email);
};

export default EmailForm;
