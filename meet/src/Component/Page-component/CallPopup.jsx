import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPhone, FaPhoneSlash } from "react-icons/fa";

const CallPopup = ({ caller, onRespond }) => {
  return (
    <AnimatePresence>
      {caller && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl p-6 w-80 text-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <h2 className="text-lg font-semibold mb-6 text-gray-800">
              {caller} is calling you <FaPhone className="inline ml-2 text-pink-600" />
            </h2>
            <div className="flex justify-around">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full flex items-center gap-2"
                onClick={() => onRespond(true)}
              >
                <FaPhone /> Accept
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full flex items-center gap-2"
                onClick={() => onRespond(false)}
              >
                <FaPhoneSlash /> Decline
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CallPopup;
