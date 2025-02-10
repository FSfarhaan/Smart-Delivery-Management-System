interface IPartner {
  _id: string;
  name: string;
  email: string;
  phone: string;
  shift: { start: string; end: string };
  metrics: {
    rating: number;
    completedOrders: number;
    cancelledOrders: number;
  };
  currentLoad: number;
  areas: string[];
  status: "active" | "inactive";
}


export default function PartnersTable({ couriers, openEditModal }: { couriers: IPartner[], openEditModal: any }) {  

  return (
    <>
    
      {/* Partners List */}
      <table className="w-full">
      <thead>
        <tr className="text-gray-500 md:text-md text-sm">
          <th className="text-left pb-4">Name</th>
          <th className="text-left pb-4">Status</th>
          {/* <th className="text-left pb-4">Phone</th> */}
          {/* <th className="text-left pb-4">Shift</th> */}
          <th className="text-left pb-4">Rating</th>
          <th className="text-left pb-4">Completed</th>
          <th className="text-left pb-4">Cancelled</th>
          <th className="text-left pb-4">Current Load</th>
          <th className="text-left pb-4">Areas</th>
          <th className="text-right pb-4">Action</th>
        </tr>
      </thead>
      <tbody>
        {couriers && couriers.map((courier, index) => (
          <tr key={index} className="border-t md:text-md text-sm" >
            <td className="py-3 pr-10">{courier.name}</td>
            <td className="pr-8">
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  courier.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {courier.status}
              </span>
            </td>
            {/* <td className="">{courier.phone.slice(0, 4)}...</td> */}
            {/* <td className="">{courier.shift.start} - {courier.shift.end}</td> */}
            <td className="text-center pr-16">{courier.metrics.rating}</td>
            <td className="text-center pr-20">{courier.metrics.completedOrders}</td>
            <td className="text-center pr-20">{courier.metrics.cancelledOrders}</td>
            <td className="text-center pr-28">{courier.currentLoad}</td>
            <td className="">{courier.areas.join(", ")}</td>
            
            <td className="pl-10">
              <button onClick={() => openEditModal(courier)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

      
    </>
  );
}
