import React from 'react';

const Categories = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-green-800 mb-12">Product Categories</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Category cards */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold mb-4">Accessories</h2>
            {/* Add category content */}
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold mb-4">Dresses</h2>
            {/* Add category content */}
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold mb-4">Outerwear</h2>
            {/* Add category content */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories; 