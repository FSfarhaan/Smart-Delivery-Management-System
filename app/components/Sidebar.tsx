import React from "react";
import { LogOut, LayoutGrid, Users, Package, ClipboardCheck, Truck, Route } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-64 p-4 fixed text-black h-full bg-green-50">
      <nav className="space-y-4">
        <div className="font-semibold mb-4 flex items-center">
            <Route className="h-8 w-8 mr-3" /> 
            <span>TrackFlow</span>
        </div>
        {[
          { label: "Dashboard", icon: <LayoutGrid className="h-5 w-5" /> },
          { label: "Partners", icon: <Users className="h-5 w-5" /> },
          { label: "Orders", icon: <Package className="h-5 w-5" /> },
          { label: "Assignments", icon: <ClipboardCheck className="h-5 w-5" /> }
        ].map((item) => (
          <div
            key={item.label}
            className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${
              item.label === "Dashboard"
                ? "bg-green-700 text-white"
                : "hover:bg-green-200"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="absolute bottom-4">
        <button className=" flex items-center text-red-600 space-x-2 p-2 rounded-lg hover:bg-red-200">
          <LogOut className="h-5 w-5" color="red" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
