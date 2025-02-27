import React from 'react';

interface SearchFilterProps {
  productCodeFilter: string;
  locationFilter: string;
  onProductCodeChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSearch: () => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  productCodeFilter,
  locationFilter,
  onProductCodeChange,
  onLocationChange,
  onSearch
}) => {
  return (
    <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Search Records</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <input
          type="text"
          placeholder="Product Code"
          className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
          value={productCodeFilter}
          onChange={(e) => onProductCodeChange(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
          value={locationFilter}
          onChange={(e) => onLocationChange(e.target.value)}
        />
        <button
          onClick={onSearch}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md"
        >
          Search Records
        </button>
      </div>
    </div>
  );
};

export default SearchFilter;
