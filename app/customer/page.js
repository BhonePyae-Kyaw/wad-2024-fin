"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

export default function Home() {
  const APIBASE = process.env.NEXT_PUBLIC_API_BASE;
  const { register, handleSubmit, reset } = useForm();
  const [editMode, setEditMode] = useState(false);

  //customer
  const [customer, setCustomer] = useState([]);

  const startEdit = (customer) => async () => {
    console.log(customer);

    // Format the date to "YYYY-MM-DD" if DateOfBirth exists
    if (customer.DateOfBirth) {
      const date = new Date(customer.DateOfBirth);
      customer.DateOfBirth = date.toISOString().split("T")[0]; // Format date to "YYYY-MM-DD"
    }

    setEditMode(true);
    reset(customer); // Reset the form with the customer data
  };

  //customer fetch
  async function fetchCustomer() {
    const data = await fetch(`${APIBASE}/customer`);
    const c = await data.json();
    setCustomer(c);
  }

  /**Customer create or update */
  const createCustomerOrUpdate = async (data) => {
    if (editMode) {
      const response = await fetch(`${APIBASE}/customer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        alert(`Failed to update customer: ${response.status}`);
      }
      alert("Customer updated successfully");
      reset({
        Name: "",
        Member_Number: "",
        DateOfBirth: "",
        Interests: "",
      });
      setEditMode(false);
      fetchCustomer();
      return;
    }

    const response = await fetch(`${APIBASE}/customer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    try {
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      alert("Customer added successfully");

      reset({
        Name: "",
        Member_Number: "",
        DateOfBirth: "",
        Interests: "",
      });
      fetchCustomer();
    } catch (error) {
      alert(`Failed to add customer: ${error.message}`);
      console.error(error);
    }
  };

  /**Delete Customer */

  const deleteCustomerById = (id) => async () => {
    if (!confirm("Are you sure?")) return;

    const response = await fetch(`${APIBASE}/customer/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert(`Failed to delete customer: ${response.status}`);
    }
    alert("Customer deleted successfully");

    fetchCustomer();
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  return (
    <>
      <div className="flex flex-row gap-4">
        <div className="flex-1 md:w-64 border border-cyan-800 m-4 ">
          <form onSubmit={handleSubmit(createCustomerOrUpdate)}>
            <div className="grid grid-cols-2 gap-4 m-4 md:w-1/2 w-full">
              <div>Name:</div>
              <div>
                <input
                  name="Name"
                  type="text"
                  {...register("Name", { required: true })}
                  className="border border-cyan w-full h-12"
                />
              </div>
              <div>Date of Birth:</div>
              <div>
                <input
                  name="DateOfBirth"
                  type="date"
                  {...register("DateOfBirth", { required: true })}
                  className="border border-cyan w-full h-12"
                />
              </div>
              <div>Member Number:</div>
              <div>
                <textarea
                  name="Member_Number"
                  {...register("Member_Number", { required: false })}
                  className="border border-cyan w-full h-12"
                />
              </div>
              <div>Interests:</div>
              <div>
                <input
                  name="Interests"
                  type="text"
                  {...register("Interests", { required: true })}
                  className="border border-cyan w-full h-12"
                />
              </div>

              <div className="col-span-2">
                {editMode ? (
                  <input
                    type="submit"
                    value="Update"
                    className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  />
                ) : (
                  <input
                    type="submit"
                    value="Add"
                    className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                  />
                )}
                {editMode && (
                  <button
                    onClick={() => {
                      reset({
                        Name: "",
                        Member_Number: "",
                        DateOfBirth: "",
                        Interests: "",
                      });
                      setEditMode(false);
                    }}
                    className="ml-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="m-4">
        <h1 className="text-xl text-bold">Customers</h1>
        <div>
          {customer.map((c) => (
            <div key={c._id} className="mt-4 bg-slate-300 w-96 rounded p-4">
              <div className="mb-4 mt-4">
                <div className="mb-2">
                  Name:
                  <Link href={`/customer/${c._id}`} className="font-bold">
                    {c.Name}
                  </Link>
                </div>
                <div>Member Number: {c.Member_Number}</div>
              </div>
              <button
                className="w-24 bg-cyan-800 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-full"
                onClick={startEdit(c)}
              >
                Edit
              </button>{" "}
              <button
                className="w-24 bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
                onClick={deleteCustomerById(c._id)}
              >
                Delete
              </button>{" "}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

{
  /* <Link href={`/product/${p._id}`} className="font-bold">
                  {p.name}
                </Link>{" "} */
}
