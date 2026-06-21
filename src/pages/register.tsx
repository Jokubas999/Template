import { CircleUser, Lock } from "lucide-react";
import React, { useState } from "react";

export function App() {
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

      localStorage.setItem("username", values.username);
      window.location.href = "/";
    } catch (error) {
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <form
        className="w-full min-h-screen rounded bg-white shadow-md flex flex-col gap-4 p-10"
        onSubmit={handleSubmit}
      >
        <p className="text-xl font-bold w-full text-center">Sign up</p>

        <div className="relative w-full">
          <CircleUser
            className="absolute left-2 top-4.5 -translate-y-1/2 text-gray-800"
            size={20}
          />

          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleInput}
            className="w-full rounded py-2 px-8 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white border-b-2 border-slate-500"
          />
        </div>

        <div className="relative w-full">
          <Lock
            className="absolute left-2 top-4.5 -translate-y-1/2 text-gray-800"
            size={20}
          />

          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleInput}
            className="w-full rounded py-2 px-8 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white border-b-2 border-slate-500"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-gray-200 hover:bg-gray-300 font-bold w-84 py-1 px-1 rounded text-sm"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

export default App;
