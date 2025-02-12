"use client";
import React, { useEffect, useState } from "react";
import PartnersTable from "@/app/components/PartnersTable";
import axios from "axios";
import Navbar from "../components/Navbar";
import PieChart from "@/app/components/PartnersPie";
import BarGraph from "@/app/components/BarGraph";
import { fetchPartners, getPartnersArea } from "../api/partner";
import { IPartner, PartnersArea } from "@/models/Partner";
import Sidebar from "../components/Sidebar";

interface PartnerMetrics {
  totalActive: number;
  avgRating: number;
  topAreas: string;
}

export default function PartnersPage() {
  const [data, setData] = useState<{
    partners: IPartner[];
    metrics: PartnerMetrics;
    area: PartnersArea[];
  } | null>(null);

  const [editingPartner, setEditingPartner] = useState<IPartner | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPartners();
  
        const totalActive = data.filter((p: IPartner) => p.status === "active").length;
  
        const avgRating =
          data.length > 0
            ? Math.floor(data.reduce((sum: number, p: IPartner) => sum + p.metrics.rating, 0) / data.length)
            : 0;
  
        const areaCount: Record<string, number> = {};
        data.forEach((p: IPartner) => {
          p.area?.forEach((area: string) => {
            areaCount[area] = (areaCount[area] || 0) + 1;
          });
        });
        
        const topAreas = Object.entries(areaCount)
          .sort((a, b) => b[1] - a[1])  // Sort by count in descending order
          .slice(0, 1)  // Get the top area
          .map(([area]) => area)[0];  // Access the first element (top area)
            
            

        const area = await getPartnersArea();
        setData({
          partners: data,
          metrics: { totalActive, avgRating, topAreas },
          area: area,
        });

      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
  
    fetchData();
  }, []);
  

  const openEditModal = (partner: IPartner | null) => {
    if (partner) {
      setEditingPartner({ ...partner });
      setIsAdding(false);
    } else {
      setEditingPartner({
        _id: null,
        name: "",
        email: "",
        phone: "",
        status: "active",
        area: [],
        shift: { start: "", end: "" },
        metrics: { rating: 0, completedOrders: 0, cancelledOrders: 0 },
        currentLoad: 0,
      });
      setIsAdding(true);
    }
  };

  const closeEditModal = () => {
    setEditingPartner(null);
    setIsAdding(false);
  };

  const savePartner = async () => {
    if (!editingPartner) return;

    const method = isAdding ? "post" : "put";
    const url = isAdding
      ? "/api/partners"
      : `/api/partners/${editingPartner._id}`;

    const { _id, ...restData } = editingPartner;
    console.log(_id);

    try {
      const res = await axios({
        method,
        url,
        data: restData,
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 200 || res.status === 201) {
        setData((prevData) =>
          prevData
            ? {
                ...prevData,
                partners: isAdding
                  ? [...prevData.partners, editingPartner] // Add new partner
                  : prevData.partners.map((partner) =>
                      partner._id === editingPartner._id
                        ? editingPartner
                        : partner
                    ), // Update existing partner
              }
            : null
        );

        closeEditModal();
      }
    } catch (error) {
      console.error("Error updating partner:", error);
    }
  };

  const closeAssignModal = () => {

  }

  return (
    <div className="flex justify-between">
      <Sidebar pathname={"partners"}/>
      <div className="md:ml-64 w-full overflow-y-scroll md:overflow-y-hidden">
        <Navbar page="Partners" />

        <div className="flex justify-between md:mt-0 mt-16 md:flex-row flex-col">
          <main className="md:p-6 md:w-3/4 md:pt-0 md:pr-0 p-4">

            <div className="md:grid md:grid-cols-4 gap-4 mb-6 max-w-full overflow-x-auto flex-nowrap flex">
              <div className="bg-white p-4 rounded-lg shadow whitespace-nowrap">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Total Partners</span>
                  <span className="text-sm text-green-500">+5%</span>
                </div>
                <div className="text-2xl font-bold">{data?.partners.length}</div>
                <div className="text-sm text-gray-500">+5 than last month</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow whitespace-nowrap">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Total Active</span>
                  <span className="text-sm text-red-500">-1%</span>
                </div>
                <div className="text-2xl font-bold">
                  {data?.metrics.totalActive}
                </div>
                <div className="text-sm text-gray-500">-1 than last month</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow whitespace-nowrap">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Average Rating</span>
                  <span className="text-sm text-green-500">100%</span>
                </div>
                <div className="text-2xl font-bold">
                  {data?.metrics.avgRating}
                </div>
                <div className="text-sm text-gray-500">+100% than last month</div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow whitespace-nowrap">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Top Areas</span>
                  <span className="text-sm text-green-500">+3</span>
                </div>
                <div className="text-2xl font-bold">{data?.metrics?.topAreas ? data?.metrics?.topAreas : "Thane"}</div>
                <div className="text-sm text-gray-500">+300 than last month</div>
              </div>
            </div>

            {/* Table for partners data */}
            <div className="rounded-lg shadow bg-white p-4">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Total Partners</h2>
                  <h5 className="text-gray-500 md:text-sm text-xs mb-3">Here can be seen the complete list of partners involved in this app.</h5>
                </div>
                <button
                  onClick={() => openEditModal(null)}
                  className="bg-green-500 text-white px-3 py-1 rounded mb-4 text-sm"
                >
                  Add Partner
                </button>
              </div>
              <div className="w-full overflow-x-scroll md:overflow-x-hidden">
                <PartnersTable
                  couriers={data && data?.partners}
                  openEditModal={openEditModal}
                  showMinified={false}
                  closeAssignModal={closeAssignModal}
                />
              </div>
            </div>
          </main>

          {/* Right Section */}
          <div className="flex-1 h-screen gap-6 md:px-6 px-4 flex flex-col pb-24 md:pb-16">
            <PieChart showText={false} />
            {data && <BarGraph data={data?.area} type={"partners"} />}
          </div>
        </div>

        {editingPartner && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg overflow-scroll md:h-auto md:w-auto md:overflow-hidden w-[80vw] h-[50vh]">
              <h2 className="text-xl font-bold mb-4">
                {isAdding ? "Add Partner" : "Edit Partner"}
              </h2>
              <input
                className="border p-2 w-full mb-2"
                placeholder="Name"
                value={editingPartner.name}
                onChange={(e) =>
                  setEditingPartner({ ...editingPartner, name: e.target.value })
                }
              />
              <input
                className="border p-2 w-full mb-2"
                placeholder="Email"
                value={editingPartner.email}
                onChange={(e) =>
                  setEditingPartner({ ...editingPartner, email: e.target.value })
                }
              />
              <input
                className="border p-2 w-full mb-2"
                placeholder="Phone"
                value={editingPartner.phone}
                onChange={(e) =>
                  setEditingPartner({ ...editingPartner, phone: e.target.value })
                }
              />

              <h3 className="text-lg font-semibold mt-4">Delivery Areas</h3>
              <select
                multiple
                className="border p-2 w-full mb-2"
                value={editingPartner.area}
                onChange={(e) =>
                  setEditingPartner({
                    ...editingPartner,
                    area: Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    ),
                  })
                }
              >
                <option value="Thane">Thane</option>
                <option value="Dombivli">Dombivli</option>
                <option value="Vashi">Vashi</option>
                <option value="Borivali">Borivali</option>
                <option value="Mulund">Mulund</option>
                <option value="Dadar">Dadar</option>
              </select>

              <h3 className="text-lg font-semibold mt-4">Shift Timing</h3>
              <input
                className="border p-2 w-full mb-2"
                type="time"
                value={editingPartner.shift.start}
                onChange={(e) =>
                  setEditingPartner({
                    ...editingPartner,
                    shift: { ...editingPartner.shift, start: e.target.value },
                  })
                }
              />
              <input
                className="border p-2 w-full mb-2"
                type="time"
                value={editingPartner.shift.end}
                onChange={(e) =>
                  setEditingPartner({
                    ...editingPartner,
                    shift: { ...editingPartner.shift, end: e.target.value },
                  })
                }
              />

              <div className="flex justify-end gap-4">
                <button
                  onClick={closeEditModal}
                  className="bg-gray-500 text-white px-3 py-1 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={savePartner}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div> 
    </div>
  );
}
