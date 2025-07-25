import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { getAllUser, setUser } from "./Services/UserServices";
import { useNavigate } from "react-router-dom";

const UsernameCard = () => {
    const [username, setUsername] = useState("");
    const navigate = useNavigate()
    //   const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        try {
            const data = await setUser({ username });
            const Users = await getAllUser();
            const otherUsers = Users.filter(user => user.username !== username);
            console.log("User saved:", otherUsers);
            navigate("/chat-box",{state:{otherUsers,username}})
        } catch (err) {
            console.error("Error saving user:", err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 transition-all duration-300">
                <div className="flex flex-col items-center mb-6">
                    <FaUserCircle className="text-indigo-500 text-5xl mb-2" />
                    <h2 className="text-2xl font-bold text-indigo-600">Enter Your Username</h2>
                </div>

                <input
                    type="text"
                    placeholder="Enter username..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />

                <button
                    onClick={handleSubmit}
                    disabled={!username.trim()}
                    className={`w-full py-2 rounded-xl font-semibold text-white transition cursor-pointer
            ${username.trim()
                            ? "bg-indigo-600 hover:bg-indigo-700"
                            : "bg-indigo-300 cursor-not-allowed"}`}
                >
                    Submit
                </button>

                <p className="mt-5 text-center text-gray-600">
                    Your username:{" "}
                    <span className="text-black font-medium">
                        {username || "None"}
                    </span>
                </p>

                {/* {submitted && (
          <div className="mt-3 text-sm text-green-600 text-center animate-bounce">
            ✅ Submitted successfully!
          </div>
        )} */}
            </div>
        </div>
    );
};

export default UsernameCard;
