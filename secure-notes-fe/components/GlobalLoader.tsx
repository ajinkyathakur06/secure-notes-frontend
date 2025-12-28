"use client";

import React, { useEffect, useState } from "react";
import Loader from "./Loader";

export default function GlobalLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a short delay or wait for hydration/initial load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second loader visibility

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return <Loader fullScreen={true} message="Loading Secure Notes..." showMessage={true} />;
}
