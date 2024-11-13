"use client"
// components/Sidebar.tsx
import { useState } from "react";
import Link from "next/link"; // Import Link from Next.js
import { RiMenuFold2Fill, RiMenuFold3Fill } from "react-icons/ri"; // Import react-icons
import { FaPen } from "react-icons/fa";
import Modalmail from "./Modalmail";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  return (
    <div>
      {/* Toggle Button for Opening Sidebar */}
      <button
        onClick={toggleSidebar}
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-00 rounded-lg sm:hidden hover:bg-gray-800 z-50 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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
        className={`fixed top-0 left-0 p-4 z-40 w-64 h-screen transition-transform ${
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
                <button
                  onClick={toggleModal}
                  className="text-white flex items-center gap-1 bg-gray-600 hover:bg-black transition-all focus:ring-4 focus:outline-none focus:ring--300 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                  <FaPen /> Compose
                </button>
                <Modalmail isOpen={isModalOpen} onClose={toggleModal} />
              </div>
            </li>

            <li>
              <Link className="text-white" href="/Inbox" passHref>
                Inbox
              </Link>
            </li>

            <li>
              <Link className="text-white" href="/Send" passHref>
                Send
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
