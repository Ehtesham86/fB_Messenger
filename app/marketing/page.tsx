"use client"
// components/MarketingCard.tsx

import { FaChevronRight } from 'react-icons/fa';
import { useState } from 'react';
import Pop from './Pop';

const Marketing = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });

  const openModal = (title: string, content: string) => {
    setModalContent({ title, content });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-5 text-white shadow-md rounded-lg ">
      <h2 className="text-5xl text-white font-bold mb-4 text-center">Marketing</h2>
      
      <ul className="space-y-4">
        {['Campaign 1', 'Campaign 2', 'Campaign 3', 'Campaign 4', 'Campaign 5', 'Campaign 6'].map((campaign, index) => (
          <li key={index} className="flex justify-between items-center hover:text-black border p-4 rounded-lg hover:bg-gradient-to-r hover:from-white hover:via-black hover:to-white">
            <div className="flex items-center space-x-4">
              <img
                src="https://img.freepik.com/premium-photo/adsiz-4500-5400-piksel-450tiger-logo0-4500-piksel-76_780593-1515.jpg"
                alt="Logo"
                className="w-10 h-10"
              />
              <span className="font-medium text-lg">{campaign}</span>
            </div>
            <button
              onClick={() => openModal(`Details for ${campaign}`, `Here are the details for ${campaign}. This is some content about the campaign.`)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700 focus:outline-none"
            >
              Learn More
              <FaChevronRight className="ml-2 inline" />
            </button>
          </li>
        ))}
      </ul>

      {/* Modal Component */}
      <Pop 
      
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={modalContent.title} 
        content={modalContent.content} 
      />
    </div>
  );
};

export default Marketing;
