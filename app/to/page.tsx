"use client";

import { useState, useEffect } from 'react';

import ModalChats from './ModalChats';
import { SiMessenger } from "react-icons/si";

const To: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);

  useEffect(() => {
    console.log(window,'_______window')
    // Run on client only and set initial value for mobile view
    setIsMobileView(window.innerWidth < 768);

    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleModal = (): void => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={toggleModal}
        className="block text-white bg-gray-800 hover:bg-gray-600 focus:ring-4 md:ml-[90%] focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
       <SiMessenger size={35} />
      </button>

      {isOpen && (
        <div
          tabIndex={-1}
          aria-hidden={!isOpen}
          className="fixed inset-0 z-50 flex items-center p-5 justify-center overflow-y-auto"
        >
          <div className={`relative ${isMobileView ? 'mt-2' : 'mt-0'} w-full max-w-xl`}>
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Chat</h3>
                <button
                  type="button"
                  onClick={toggleModal}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3 hover:text-red-600"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4 md:p-5 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                {/* Replace with actual chat content */}
               <ModalChats/>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default To;
