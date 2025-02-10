import React from "react";
import { LogOut, LayoutGrid, Users, Package, ClipboardCheck, Truck, Route } from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  pathname: string;
}

const Sidebar: React.FC<SidebarProps> = ({ pathname }) => {
  return (
    <>
      <aside className="w-64 p-4 text-black h-full bg-green-50 hidden md:block md:fixed">
        <nav className="space-y-6 ">
          <div className="font-semibold mb-8 flex items-center">
              <Route className="h-8 w-8 mr-3" /> 
              <span>TrackFlow</span>
          </div>
          {[
            { label: "Dashboard", icon: <LayoutGrid className="h-5 w-5" /> },
            { label: "Partners", icon: <Users className="h-5 w-5" /> },
            { label: "Orders", icon: <Package className="h-5 w-5" /> },
            { label: "Assignments", icon: <ClipboardCheck className="h-5 w-5" /> }
          ].map((item) => (
            <Link 
              key={item.label} 
              href={item.label.toLowerCase() === "dashboard" ? "/" : `/${item.label.toLowerCase()}`}
            >

            <div
              className={`flex items-center space-x-2 p-2 mb-4 rounded-lg cursor-pointer ${
                item.label.toLowerCase() === pathname
                  ? "bg-green-700 text-white"
                  : "hover:bg-green-200"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
            </Link>
          ))}
        </nav>
      </aside>

      <aside className="w-full px-4 pt-3 pb-2 text-black bg-green-50 md:hidden fixed bottom-0 z-20 border border-t-gray-300 shadow">
        <nav className="flex justify-between">

        {[
            { label: "Dashboard", icon: <LayoutGrid className="md:h-5 md:w-5 w-full" /> },
            { label: "Partners", icon: <Users className="md:h-5 md:w-5 w-full" /> },
            { label: "Orders", icon: <Package className="md:h-5 md:w-5 w-full" /> },
            { label: "Assignments", icon: <ClipboardCheck className="md:h-5 md:w-5 w-full" /> }
          ].map((item) => (
            <Link 
              key={item.label} 
              href={item.label.toLowerCase() === "dashboard" ? "/" : `/${item.label.toLowerCase()}`}
            >
            <div
              className={`flex-col-reverse text-center justify-center rounded-lg cursor-pointer ${
                item.label.toLowerCase() === pathname
                  ? "text-green-700"
                  : "hover:bg-green-200"
              }`}
            >
              
              {item.icon}
              <span className="text-xs ml-0">{item.label}</span>
            </div>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
