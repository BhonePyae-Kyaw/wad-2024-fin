export default async function Home({ params }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  const res = await fetch(`${API_BASE}/customer/${params.id}`, {
    cache: "no-store",
  });
  const customer = await res.json();

  // Format DateOfBirth only if it exists
  const formatDate = customer.DateOfBirth
    ? new Date(customer.DateOfBirth).toISOString().split("T")[0]
    : "N/A"; // Fallback if DateOfBirth is missing

  return (
    <div className="m-4">
      <h1 className="font-bold text-3xl mb-2">Customer Details</h1>
      <p className="font-bold text-xl text-blue-800">Name: {customer.Name}</p>
      <p>Member Number: {customer.Member_Number}</p>
      <p> Date of Birth: {formatDate}</p>
      <p>Interests: {customer.Interests}</p>
    </div>
  );
}
