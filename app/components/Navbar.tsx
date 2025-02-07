import { Bell } from 'lucide-react'
import React from 'react'

const Navbar = (props: any) => {
  return (
    <header className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">{props.page}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="h-6 w-6" />
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gray-300" />
              <span>Farhaan</span>
            </div>
          </div>
        </div>
      </header>
  )
}

export default Navbar
