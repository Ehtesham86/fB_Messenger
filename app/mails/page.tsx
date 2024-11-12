"use client";
import { useState } from 'react';
import { BsFillPenFill } from "react-icons/bs";
import { RiInboxArchiveFill, RiMenuFold2Fill, RiMenuFold3Fill } from "react-icons/ri";
import { RiSendPlaneFill } from "react-icons/ri";
import Modalmail from './Modalmail';

const Mails: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Send"); // Default tab is 'Inbox'
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State to manage modal visibility
  const [isHovered, setIsHovered] = useState<boolean>(false); // State to manage hover
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true); // State to manage sidebar visibility

  // Define tab content for each tab manually
  const getTabContent = (tab: string) => {
    switch (tab) {
      case 'Compose':
        return <Modalmail isOpen={isModalOpen} onClose={closeModal} />;
      case 'Send':
        return 'This is some placeholder content for the Send tab.';
      case 'Inbox':
        return 'This is some placeholder content for the Inbox tab.';
      default:
        return '';
    }
  };

  // Functions to open and close the modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="md:flex  p-5 transition-all h-screen gap-4">
      {/* Sidebar with Icons */}
      <div
        className={`relative p-12 transition-all items-center bg-gradient-to-t from-gray-400 via-slate-950 to-cyan-950 rounded-xl  ${isSidebarOpen ? "w-64" : "w-24"} `}
        onMouseEnter={() => setIsHovered(true)} // Show menu when mouse enters
        onMouseLeave={() => setIsHovered(false)}
        // Hide menu when mouse leaves
      >
        <ul
          className={`space-y-4  text-lg font-serif font-medium w-[20%] text-gray-500  md:me-4 mb-4 md:mb-0   transition-all duration-300`}
        >
                 {/* Toggle Sidebar Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-4 right-2 text-white text-4xl"
        >
          {isSidebarOpen ? <RiMenuFold3Fill /> : <RiMenuFold2Fill/>}
        </button>

 

          {/* Compose Tab */}
          <li className=''>
            <button
              onClick={() => {
                setActiveTab('Compose');
                openModal(); // Open the modal when Compose is clicked
              }}
              className={`inline-flex items-center text-xl px-2 py-1 rounded-lg  400 ${
                activeTab === 'Compose'
                  ? 'text-white bg-gray-700 dark:bg-gray-600'
                  : 'hover:text-gray-900  hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
            >
              <BsFillPenFill />
              {isHovered && "Compose"}
            </button>
          </li>

          {/* Inbox Tab */}
          <li>
            <button
              onClick={() => setActiveTab('Inbox')}
              className={`inline-flex gap-3 items-center px-2 text-xl rounded-lg  ${
                activeTab === 'Inbox'
                  ? 'text-white bg-gray-700 dark:bg-gray-600'
                  : 'hover:text-gray-900  hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
            >
              <RiInboxArchiveFill />
              {isHovered && "Inbox"}
            </button>
          </li>

          {/* Send Tab */}
          <li >
            <button
              onClick={() => setActiveTab('Send')}
              className={`inline-flex  items-center px-2 gap-4 text-xl rounded-lg   ${
                activeTab === 'Send'
                  ? 'text-white bg-gray-700 dark:bg-gray-600'
                  : 'hover:text-gray-900  hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
            >
              <RiSendPlaneFill />
              {isHovered && "Send"}
            </button>
          </li>
        </ul>

        {/* Icon for the menu */}
        {/* {!isHovered && (
          <div className="absolute top-2 left-2">
            <BsFillPenFill className="text-2xl cursor-pointer" />
            <RiInboxArchiveFill className="text-2xl cursor-pointer" />
            <BsFillPenFill className="text-2xl cursor-pointer" />
          </div>
        )} */}
      </div>

      {/* Content */}
      <div className="p-4 text-center bg-gradient-to-r from-gray-700 via-white to-slate-800 text-medium text-gray-100 dark:text-gray-200 dark:bg-gray-800 rounded-lg w-[95%]">
      <h3 className="text-lg font-bold text-gray-100 dark:text-white mb-2">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Tab
        </h3>
        <p className="text-xl text-black text-center">{getTabContent(activeTab)}</p>
      </div>
    </div>
  );
};

export default Mails;
