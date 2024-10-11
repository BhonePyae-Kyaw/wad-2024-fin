"use client";

import { useEffect, useState } from "react";

export default function Home({ params }) {
  const [customerDetails, setCustomer] = useState(null); // Initialize as null since you're expecting an object
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  const fetchCustomer = async () => {
    try {
      const res = await fetch(`${API_BASE}/customer/${params.id}`);

      if (!res.ok) {
        throw new Error(`Failed to fetch customer data: ${res.statusText}`);
      }

      const customer = await res.json();
      setCustomer(customer);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Format DateOfBirth only if it exists
  const formatDate = customerDetails?.DateOfBirth
    ? new Date(customerDetails.DateOfBirth).toISOString().split("T")[0]
    : "N/A"; // Fallback if DateOfBirth is missing

  return (
    <div className="m-4">
      <h1 className="font-bold text-3xl mb-2">Customer Details</h1>
      <p className="font-bold text-xl text-blue-800">
        Name: {customerDetails?.Name}
      </p>
      <p>Member Number: {customerDetails?.Member_Number}</p>
      <p>Date of Birth: {formatDate}</p>
      <p>Interests: {customerDetails?.Interests}</p>
    </div>
  );
}
