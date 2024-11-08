"use client"
import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai'; // Example React Icon for Close Button
import { FaAngleDown } from 'react-icons/fa';

interface ModalProps {
  isOpen: boolean; // Indicates whether the modal is open
  onClose: () => void; // Function to close the modal
  // Add any other props you need, e.g., content, title, etc.
  title?: string;
  content?: string;
}

const Modalmail: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  // Modal visibility based on the isOpen prop
  if (!isOpen) return null;

  return (
    <>
    <div
      className="fixed top-0 left-0 right-0 z-50 md:ml-[100%] flex justify-center items-center w-[800%] h-full md:h-[100%] bg-black bg-opacity-50"
      aria-hidden={!isOpen}
      >
      <div className=" md:relative p-4 w-full max-w-2xl bg-white rounded-lg shadow dark:bg-gray-700">
        {/* Modal header */}
        <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Mail
          </h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:text-white"
            onClick={onClose}
            >
            <AiOutlineClose className="w-5 h-5" />
            <span className="sr-only">Close modal</span>
          </button>
        </div>

        {/* Modal body */}
        <div className="mb-3">
        <input
          type="text"
          placeholder="To"
          className="w-full border-b pb-2 focus:outline-none text-gray-800 placeholder-gray-500"
        />
      </div>

      {/* Subject Field */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Subject"
          className="w-full border-b pb-2 focus:outline-none text-gray-800 placeholder-gray-500"
          />
      </div>

      {/* Message Body */}
      <div className="mb-4">
        <textarea
          placeholder="Compose your message..."
          className="w-full h-40 focus:outline-none text-gray-800 placeholder-gray-500"
          ></textarea>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t pt-2">
       <div className=" flex items-center bg-gray-600 gap-2 p-1 rounded-3xl">

        <button className="bg-gray-600 flex items-center gap-2 rounded-full text-white px-4 py-2  hover:bg-gray-600 focus:ring-4 focus:outline-none">
          Send
        </button>
        <span className=''><FaAngleDown /></span>
       </div>
        <div className="flex space-x-2">
          {/* Formatting and other icons */}
          <button className="text-gray-500 hover:text-gray-700">A</button>
          <button className="text-gray-500 hover:text-gray-700">📎</button>
          <button className="text-gray-500 hover:text-gray-700">😊</button>
          <button className="text-gray-500 hover:text-gray-700">🚫</button>
        </div>
        </div>
        {/* Modal footer */}
       
      </div>
    </div>
            </>
  );
};

export default Modalmail;