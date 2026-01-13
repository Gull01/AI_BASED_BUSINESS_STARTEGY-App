import React from 'react';

const LocationQueryModal = ({ isOpen, onClose, onSelect, location }) => {
  if (!isOpen) return null;

  const options = [
    {
      id: 'business-general',
      title: '💼 Business Opportunities',
      description: 'General business opportunities and market overview for this location',
      icon: '💼'
    },
    {
      id: 'specific-business',
      title: '🏪 Specific Business Type',
      description: 'Detailed insights for a specific business (restaurant, retail, etc.)',
      icon: '🏪',
      requiresInput: true
    },
    {
      id: 'demographics',
      title: '👥 Demographics & Market',
      description: 'Population data, income levels, and consumer behavior',
      icon: '👥'
    },
    {
      id: 'real-estate',
      title: '🏢 Real Estate & Costs',
      description: 'Property prices, rental rates, and operational costs',
      icon: '🏢'
    }
  ];

  const handleSelect = (optionId) => {
    if (optionId === 'specific-business') {
      const businessType = prompt('What type of business? (e.g., Restaurant, Coffee Shop, Retail Store)');
      if (businessType) {
        onSelect(optionId, businessType);
      }
    } else {
      onSelect(optionId);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold mb-2">📍 Location Selected</h3>
              <p className="text-indigo-100 text-sm">
                {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Unknown'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-6 text-center font-medium">
            What would you like to know about this location?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className="group relative p-6 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl hover:border-indigo-400 hover:shadow-lg transition-all duration-200 text-left hover:scale-105 active:scale-95"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform">
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                      {option.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {option.description}
                    </p>
                  </div>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <p className="text-sm text-indigo-900 text-center">
              <span className="font-semibold">💡 Tip:</span> Select an option to get AI-powered insights for this exact location
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationQueryModal;
