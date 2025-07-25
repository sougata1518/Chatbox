import React, { useEffect, useRef } from 'react'
import { MdCallEnd } from 'react-icons/md';

const VideoCallUI = ({ currentUser, callee, remoteVideoRef, onHangUp }) => {
  const localVideoRef = useRef(null);

  useEffect(() => {
    const getLocalStream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = stream;
    };
    getLocalStream();
  }, []);


  return (
    <div className="fixed inset-0 bg-black z-50 flex justify-center items-center">
      <video
        ref={remoteVideoRef}
        autoPlay
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-sm px-3 py-1 rounded">
        {callee}
      </div>
      <div className="absolute bottom-4 right-4 w-48 h-36 bg-black rounded overflow-hidden shadow-lg">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-sm px-2 py-1 rounded">
          {currentUser} (You)
        </div>
      </div>
      <div className="absolute bottom-6 flex justify-center w-full">
        <button
          onClick={onHangUp}
          className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg cursor-pointer"
        >
          <MdCallEnd size={24} />
        </button>
      </div>
    </div>
  );
};

export default VideoCallUI