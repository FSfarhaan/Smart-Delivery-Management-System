import React from 'react'

const Navbar = (props: { page : string}) => {
  return (
    <header className="md:p-6 p-4 pb-4 md:static fixed w-full z-10 bg-gray-100 shadow md:shadow-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">{props.page}</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full" style={{backgroundImage: "url(/avatar.png)", backgroundPosition: "center", 
                backgroundSize: "cover"}} />
              <span>Farhaan</span>
            </div>
          </div>
        </div>
      </header>
  )
}

export default Navbar
