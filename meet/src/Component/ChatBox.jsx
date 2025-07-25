import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { MdVideoCall } from "react-icons/md";
import { clearCall, getStatus, requestCall, responseCall } from "./Services/UserServices";
import CallPopup from "./Page-component/CallPopup";
import CallingPopup from "./Page-component/CallingPopup";
import VideoCallUI from "./Page-component/VideoCallUI";
import { CgFontSpacing } from "react-icons/cg";

const ChatBox = () => {
  const location = useLocation();
  const contacts = location.state?.otherUsers || [];
  const currentUser = location.state?.username || "guest";

  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const stompClientRef = useRef(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [calling, setCalling] = useState(false);
  const [inCall, setInCall] = useState(false);

  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  // const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  // const remoteStreamRef = useRef(null);
  const callTargetRef = useRef(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedContact]);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/chat");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ WebSocket connected");

        stompClient.subscribe(`/user/${currentUser}/queue/message`, (msg) => {
          const body = JSON.parse(msg.body);
          const newMsg = {
            text: body.content,
            sender: body.sender,
            time: body.msgTime,
          };
          setMessages((prev) => ({
            ...prev,
            [body.sender]: [...(prev[body.sender] || []), newMsg],
          }));
        });

        stompClient.subscribe(`/user/${currentUser}/queue/video`, (msg) => {
          const data = JSON.parse(msg.body);
          handleSignal(data);
        });
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
      peerConnectionRef.current?.close();
      // localStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [currentUser]);

  useEffect(() => {
    if (!selectedContact) return;
    fetch(`http://localhost:8080/chatHistory/${currentUser}/${selectedContact.username}`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((msg) => ({
          text: msg.content,
          sender: msg.sender === currentUser ? "me" : msg.sender,
          time: msg.msgTime,
        }));
        setMessages((prev) => ({
          ...prev,
          [selectedContact.username]: formatted,
        }));
      });
  }, [selectedContact, currentUser]);

  useEffect(() => {
    if (!currentUser || currentUser === "guest") return;
    const interval = setInterval(async () => {
      try {
        const res = await getStatus(currentUser);
        if (res?.sender && !res.accept && !res.decline) {
          setIncomingCall(res);
        } else {
          setIncomingCall(null);
        }
      } catch (err) {
        console.error("❌ Error in polling call status", err);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const handleSend = () => {
    if (!input.trim() || !selectedContact || !stompClientRef.current?.connected) return;
    const contactUsername = selectedContact.username;
    const newMessage = {
      text: input,
      sender: "me",
      time: new Date().toISOString(),
    };
    setMessages((prev) => ({
      ...prev,
      [contactUsername]: [...(prev[contactUsername] || []), newMessage],
    }));
    stompClientRef.current.publish({
      destination: "/app/private-message",
      body: JSON.stringify({
        sender: currentUser,
        recipient: contactUsername,
        content: input,
        msgTime: newMessage.time,
      }),
    });
    setInput("");
  };

  const handleVideoCallRequest = async () => {
    setCalling(true);
    const request = {
      sender: currentUser,
      recipient: selectedContact.username,
      accept: false,
      decline: false,
    };
    await requestCall(request);

    const interval = setInterval(async () => {
      const response = await getStatus(selectedContact.username);
      if (response) {
        if (response.accept) {
          clearInterval(interval);
          clearTimeout(timeout);
          await clearCall(selectedContact.username);
          setCalling(false);
          startCall();
        } else if (response.decline) {
          clearInterval(interval);
          clearTimeout(timeout);
          await clearCall(selectedContact.username);
          setCalling(false);
          alert("❌ Call Declined");
        }
      }
    }, 1000);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setCalling(false);
      clearCall(selectedContact.username);
      alert("⏳ No response. Call timed out.");
    }, 30000);

    setCancelCall(() => () => {
      clearInterval(interval);
      clearTimeout(timeout);
      setCalling(false);
      clearCall(selectedContact.username);
    });
  };

  const [cancelCall, setCancelCall] = useState(() => () => { });

  const createPeerConnection = () => {
    peerConnectionRef.current = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    localStreamRef.current.getTracks().forEach(track => {
      peerConnectionRef.current.addTrack(track, localStreamRef.current);
    });

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal({
          type: "ice-candidate",
          to: callTargetRef.current,
          from: currentUser,
          candidate: event.candidate
        });
      }
    };

    peerConnectionRef.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    }
  };


  const getLocalStream = async () => {
    localStreamRef.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  }

  const sendSignal = (data) => {
    stompClientRef.current.publish({
      destination: "/app/video-signal",
      body: JSON.stringify(data),
    });
  };

  const handleSignal = async (data) => {

    switch (data.type) {
      case "offer":
        await getLocalStream();
        createPeerConnection();
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        callTargetRef.current = data.from;
        sendSignal({
          type: "answer",
          from: currentUser,
          to: data.from,
          answer: answer,
        });
        setInCall(true);
        break;

      case "answer":
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        setInCall(true);
        break;

      case "ice-candidate":
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        break;

      case "hangup":
        console.log("📴 Call ended by peer");
        cleanupCall();
        break;

      default:
        console.warn("Unknown signal type", data);
    }
  };

  const startCall = async () => {
    callTargetRef.current = selectedContact.username;
    await getLocalStream();
    createPeerConnection();

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);

    setInCall(true);

    sendSignal({
      type: "offer",
      from: currentUser,
      to: selectedContact.username,
      offer: offer,
    });
  };

  const handleHangUp = () => {
    sendSignal({
      type: "hangup",
      from: currentUser,
      to: callTargetRef.current,
    });

    cleanupCall();
  };

  const cleanupCall = () => {
    setInCall(false);

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    if (remoteVideoRef.current?.srcObject) {
      remoteVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      remoteVideoRef.current.srcObject = null;
    }
  };



  return (
    <div className="h-screen flex bg-gray-200">
      <div className="w-1/4 bg-white shadow-md overflow-y-auto border-r border-gray-300">
        <h2 className="text-lg font-bold p-4 border-b bg-indigo-600 text-white">{currentUser}(You)</h2>
        {contacts.length === 0 ? (
          <p className="p-4 text-gray-500">No contacts available</p>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`p-4 cursor-pointer hover:bg-indigo-100 border-b ${selectedContact?.id === contact.id ? "bg-indigo-50 font-semibold" : ""
                }`}
            >
              {contact.username}
            </div>
          ))
        )}
      </div>
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            <div className="bg-white px-6 py-4 shadow flex justify-between items-center border-b">
              <h2 className="text-xl font-semibold">{selectedContact.username}</h2>
              <MdVideoCall
                size={48}
                className="text-indigo-600 cursor-pointer hover:text-indigo-800"
                onClick={handleVideoCallRequest}
              />
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-2 bg-gray-100">
              {(messages[selectedContact.username] || []).map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-[70%] px-4 py-2 rounded-xl ${msg.sender === "me"
                    ? "bg-indigo-500 text-white self-end ml-auto"
                    : "bg-white text-black self-start mr-auto"
                    }`}
                >
                  {msg.text}
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(msg.time).toLocaleTimeString()}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="bg-white p-4 flex items-center gap-3 border-t">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message"
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                onClick={handleSend}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
            Select a contact to start chatting
          </div>
        )}
      </div>

      {incomingCall && (
        <CallPopup
          caller={incomingCall.sender}
          onRespond={async (accepted) => {
            await responseCall({
              sender: incomingCall.sender,
              recipient: incomingCall.recipient,
              accept: accepted,
              decline: !accepted,
            });
            if (accepted) {
              callTargetRef.current = incomingCall.sender;
              localStreamRef.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
              createPeerConnection();

              if (peerConnectionRef.current.getSenders().length === 0) {
                localStreamRef.current.getTracks().forEach((track) => peerConnectionRef.addTrack(track, localStreamRef.current));
              }

              setInCall(true);
            }
            setIncomingCall(null);
          }}
        />
      )}

      {calling && (
        <CallingPopup
          callee={selectedContact?.username}
          onCancel={cancelCall}
        />
      )}

      {inCall && (
        <VideoCallUI
          currentUser={currentUser}
          callee={callTargetRef.current}
          // localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          onHangUp={handleHangUp}
        // remoteStreamRef={remoteStreamRef}
        // onHangUp={handleHangUp}
        />
      )}
    </div>
  );
};

export default ChatBox;
