import { useState } from 'react'
import AdminSidebar from '../../admin/home/AdminSidebar'
import AdminDashboard from '../../admin/home/AdminDashboard'

function Admin() {
  const [activeComponent, setActiveComponent] = useState('account')

  return (
    <div className='flex gap-3 border-r-2 border-[#000000]'>
      <AdminSidebar setActiveComponent={setActiveComponent} />
      <div className='flex-1 h-screen'>
        <AdminDashboard activeComponent={activeComponent} />
      </div>
    </div>
  )
}

export default Admin
