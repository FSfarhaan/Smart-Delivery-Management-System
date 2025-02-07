"use client";
import { usePartnerContext } from "@/context/PartnerContext";
import { useState } from "react";

// ✅ Define Partner Type
interface Partner {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  areas: string[];
  shift: { start: string; end: string };
}

export default function PartnersPage() {
  const { partners, loading, fetchPartners } = usePartnerContext();
  
  // ✅ Explicitly define `editingPartner` type
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [updatedPartner, setUpdatedPartner] = useState<Partner>({
    _id: "", // ✅ Provide default empty values
    name: "",
    email: "",
    phone: "",
    status: "active",
    areas: [],
    shift: { start: "", end: "" },
  });

  // ✅ Open Edit Modal
  const openEditModal = (partner: Partner) => {
    setEditingPartner(partner);
    setUpdatedPartner({ ...partner });
  };

  // ✅ Close Edit Modal
  const closeEditModal = () => {
    setEditingPartner(null);
  };

  // ✅ Update Partner in Database
  const updatePartner = async () => {
    if (!editingPartner) return; // ✅ Prevents errors

    const res = await fetch(`/api/partners/${editingPartner._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPartner),
    });

    if (res.ok) {
      fetchPartners();
      closeEditModal();
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Delivery Partners</h1>

      {/* Partners List */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {partners.map((partner) => (
            <tr key={partner._id} className="text-center">
              <td className="border p-2">{partner.name}</td>
              <td className="border p-2">{partner.email}</td>
              <td className="border p-2">{partner.phone}</td>
              <td className="border p-2">
                <button onClick={() => openEditModal(partner)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Partner Modal */}
      {editingPartner && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Edit Partner</h2>
            <input className="border p-2 w-full mb-2" placeholder="Name" value={updatedPartner.name} onChange={(e) => setUpdatedPartner({ ...updatedPartner, name: e.target.value })} />
            <input className="border p-2 w-full mb-2" placeholder="Email" value={updatedPartner.email} onChange={(e) => setUpdatedPartner({ ...updatedPartner, email: e.target.value })} />
            <input className="border p-2 w-full mb-2" placeholder="Phone" value={updatedPartner.phone} onChange={(e) => setUpdatedPartner({ ...updatedPartner, phone: e.target.value })} />

            {/* Areas Selection */}
            <h3 className="text-lg font-semibold mt-4">Delivery Areas</h3>
            <select multiple className="border p-2 w-full mb-2" value={updatedPartner.areas} onChange={(e) => setUpdatedPartner({ ...updatedPartner, areas: Array.from(e.target.selectedOptions, (option) => option.value) })}>
              <option value="New York">New York</option>
              <option value="Los Angeles">Los Angeles</option>
              <option value="San Francisco">San Francisco</option>
              <option value="Chicago">Chicago</option>
            </select>

            {/* Shift Timing */}
            <h3 className="text-lg font-semibold mt-4">Shift Timing</h3>
            <input className="border p-2 w-full mb-2" type="time" value={updatedPartner.shift?.start || ""} onChange={(e) => setUpdatedPartner({ ...updatedPartner, shift: { ...updatedPartner.shift, start: e.target.value } })} />
            <input className="border p-2 w-full mb-2" type="time" value={updatedPartner.shift?.end || ""} onChange={(e) => setUpdatedPartner({ ...updatedPartner, shift: { ...updatedPartner.shift, end: e.target.value } })} />

            <div className="flex justify-end gap-4">
              <button onClick={closeEditModal} className="bg-gray-500 text-white px-3 py-1 rounded">Cancel</button>
              <button onClick={updatePartner} className="bg-green-500 text-white px-3 py-1 rounded">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
