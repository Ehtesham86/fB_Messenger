"use client";

// components/Sidebar.tsx
import { useState } from "react";
import { RiMenuFold2Fill, RiMenuFold3Fill } from "react-icons/ri"; // Import react-icons

import { FaPen } from "react-icons/fa";
import Modalmail from "./Modalmail";


interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
  }
const Sidebar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  return (
    <div>
      {/* Toggle Button for Opening Sidebar */}
      <button
        onClick={toggleSidebar}
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-00 rounded-lg sm:hidden hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        style={{ zIndex: 50 }} // Added to ensure the icon stays on top
      >
        <span className="sr-only">Toggle sidebar</span>
        {isSidebarOpen ? (
          <RiMenuFold3Fill className="w-6 h-6 text-black" aria-hidden="true" />
        ) : (
          <RiMenuFold2Fill className="w-6 h-6 text-white" aria-hidden="true" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 rounded-r-lg bg-gradient-to-t from-slate-500 via-black to-gray-700 text-white transition-all`}
        aria-label="Sidebar"
      >
        {/* Close Button Inside Sidebar */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
          <span className="sr-only">Close sidebar</span>
          <RiMenuFold3Fill className="w-6 h-6 text-black" aria-hidden="true" />
        </button>

        {/* Sidebar Content */}
        <div className="h-full px-3 py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">

          <li>

          <div className="p-8">
      {/* Button to toggle modal */}
      <button
        onClick={toggleModal}
        className="text-white flex items-center gap-1 bg-gray-600 hover:bg-black transition-all focus:ring-4 focus:outline-none focus:ring--300 font-medium rounded-lg text-sm px-5 py-2.5"
      >
       <FaPen /> Compose
      </button>

      {/* Modal Component */}
      <Modalmail isOpen={isModalOpen} onClose={toggleModal} />
    </div>
             
            </li>

            <li>
              <a
                href="/mail/Inbox"
                className="flex items-center p-2 text-gray-100  hover:text-black  rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="ms-3">Inbox</span>
              </a>
            </li>
            <li>
              <button
                className="flex items-center w-full p-2 text-gray-100 hover:text-black  transition duration-75 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                aria-controls="dropdown-example"
                data-collapse-toggle="dropdown-example"
              >
                <span className="flex-1 ms-3 text-left">Starred</span>
              </button>
              <ul className="hidden py-2 space-y-2">
                <li>
                  <a
                    href="/starred"
                    className="flex items-center w-full p-2 text-gray-900 rounded-lg pl-11 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                  Starred
                  </a>
                </li>
                <li>
                  <a
                    href="/send"
                    className="flex items-center w-full p-2 text-gray-900 rounded-lg pl-11 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >Send
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
