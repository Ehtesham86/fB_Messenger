"use client";

import ModalChats from './ModalChats';
import Chat from './page';
import { useState } from 'react';

const Chats: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleModal = (): void => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="">
        {/* Modal toggle */}
        <button
          onClick={toggleModal}
          className="block text-white bg-gray-800 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
        >
          Open Chat
        </button>

        {/* Main modal */}
        {isOpen && (
          <div
            tabIndex={-1}
            aria-hidden={!isOpen}
            className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto`}
          >
            {/* Use a wrapper to manage modal content positioning */}
            <div className={`relative md:ml-[1250px] w-full max-w-xl ${window.innerWidth < 768 ? 'mt-2' : 'mt-0'}`}>
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                {/* Modal header */}
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Chat
                  </h3>
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
                {/* Modal body */}
                <div className="p-4 md:p-5 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                  <ModalChats />
                </div>
                {/* Modal footer */}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Chats;
