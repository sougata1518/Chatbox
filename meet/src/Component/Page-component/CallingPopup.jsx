// CallingPopup.jsx
import React from "react";

const CallingPopup = ({ callee, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg text-center space-y-4">
        <h2 className="text-lg font-semibold">Calling {callee}...</h2>
        <p className="text-gray-500">Waiting for response</p>
        <button
          onClick={onCancel}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full"
        >
          Cancel Call
        </button>
      </div>
    </div>
  );
};

export default CallingPopup;
