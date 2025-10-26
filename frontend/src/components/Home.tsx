import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

export default function Home() {
  const user = useSelector((s: RootState) => s.auth.user);

  const [content, setContent] = useState<string>("");

  useEffect(() => {
    let cancelled = false;


    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto px-4 max-w-4xl">
      <h1 className="text-2xl font-semibold">Welcome</h1>
      <div className="mt-4">
        {user ? (
          <p className="text-gray-700">
            Glad to see you back, <span className="font-medium">{user.username}</span>.
          </p>
        ) : (
          <p className="text-gray-700">You are viewing the public page.</p>
        )}
      </div>

      {content && (
        <div className="mt-6">
          <p className="text-gray-600">{content}</p>
        </div>
      )}
    </div>
  );
}
