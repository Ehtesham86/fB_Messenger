"use client"
import React, { useState } from 'react';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import Mailchimp from '../Mailchimp/page';  

const integrations = [
  { name: 'Mailchimp', logo: '/logos/mailchimp.png' },
  { name: 'GetResponse', logo: '/logos/getresponse.png' },
  { name: 'AWeber', logo: '/logos/aweber.png' },
  { name: 'ConvertKit', logo: '/logos/convertkit.png' },
  { name: 'ActiveCampaign', logo: '/logos/activecampaign.png' },
  { name: 'Sendinblue', logo: '/logos/sendinblue.png' },
  { name: 'HubSpot', logo: '/logos/hubspot.png' },
  { name: 'Constant Contact', logo: '/logos/constantcontact.png' },
  { name: 'ActiveTrail', logo: '/logos/activetrail.png' },
];

const MailchimpForm: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const handleConnectClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      {/* Main content */}
      <section>
        <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-600 mb-4 md:mb-6 text-center">
            Select and Connect Email Marketing Automations
          </h1>
          <div className="space-y-4">
            {integrations.map((integration) => (
              <div
                key={integration.name}
                className="flex flex-col md:flex-row justify-between items-center p-4 md:p-6 hover:bg-purple-50 rounded-lg transition duration-300"
              >
                <div className="flex items-center mb-4 md:mb-0">
                  <img
                    src={integration.logo}
                    alt={`${integration.name} logo`}
                    className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 mr-3 md:mr-4 object-contain"
                  />
                  <span className="text-lg md:text-xl font-semibold text-purple-800">
                    {integration.name}
                  </span>
                </div>
                <button
                  onClick={handleConnectClick}
                  className="w-full md:w-auto bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition duration-300 text-sm md:text-base"
                >
                  Connect
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center text-purple-600">
            <p className="text-sm md:text-base">
              Let us know your favorite autoresponder by sending us an email!
            </p>
          </div>

          {/* Conditionally render the Mailchimp modal */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-80 md:w-96 relative">
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                >
                  &times;
                </button>
                <Mailchimp closeModal={closeModal} />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MailchimpForm;
