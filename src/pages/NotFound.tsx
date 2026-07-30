import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
      <h2 className="text-4xl font-bold text-gray-800">404</h2>
      <p className="text-gray-600">The requested operational view does not exist.</p>
      <Link 
        to="/dashboard" 
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
      >
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
