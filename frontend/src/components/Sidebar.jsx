// import React from 'react';
// import { TrendingUp, User, Phone, Briefcase, Activity, Calendar, ClipboardList, CircleUser, Settings, HelpCircle, X, LogOut } from 'lucide-react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';

// const menuItems = [
//   { name: 'Dashboard', icon: <TrendingUp size={18} />, link: '/dashboard' },
//   { name: 'Leads', icon: <User size={18} />, link: '/leads' },
//   { name: 'Workflows', icon: <Briefcase size={18} />, link: '/workflows' },
//   { name: 'Appointments', icon: <Calendar size={18} />, link: '/appointments' },
//   { name: 'Phone agent', icon: <Phone size={18} />, link: '/ai/phone-agent' },
//   { name: 'Market insights', icon: <Activity size={18} />, link: '/ai/market-insights' },
//   {
//     name: 'Analytics',
//     subItems: [
//       { name: 'Performance', icon: <TrendingUp size={18} />, link: '/analytics/performance' },
//       { name: 'Reports', icon: <ClipboardList size={18} />, link: '/analytics/reports' },
//     ]
//   },
// ];

// const settingsItems = [
//   { name: 'Preferences', icon: <HelpCircle size={18} />, link: '/settings/preferences' },
//   { name: 'Account', icon: <CircleUser size={18} />, link: '/settings/account' },
//   // { name: 'AI Settings', icon: <Settings size={18} />, link: '/settings/ai' },
// ];

// const aiItems = [
//   { name: 'Configure AI', icon: <Settings size={18} />, link: '/ai/configurations' },
// ];

// const Sidebar = ({ isSidebarOpen, closePanels, isMobile, isTablet, toggleSidebar }) => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const isActive = (path) => location.pathname.startsWith(path);

//   const handleLogout = () => {
//     localStorage.clear();
//     sessionStorage.clear();
//     navigate('/login');
//   };

//   return (
//     <>
//       {/* Mobile backdrop when sidebar is open */}
//       <div
//         className={`fixed inset-0 bg-black/50 transition-opacity md:hidden
//           ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
//         onClick={toggleSidebar}
//         aria-hidden="true"
//       />

//       <div
//         className={`flex flex-col bg-black border-r border-slate-700 z-50
//           transition-all duration-300 ease-in-out
//           ${isMobile || isTablet
//             // Drawer on small screens
//             ? `fixed top-0 left-0 h-full w-64 transform
//                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
//             // Fixed rail on larger screens (keep your widths)
//             : `${isSidebarOpen ? 'w-60' : 'w-0 overflow-hidden'} sticky top-0 h-screen`
//           }`}
//         role="navigation"
//         aria-label="Sidebar"
//       >
//         {(isMobile || isTablet) && (
//           <div className="flex items-center justify-between p-4 border-b border-slate-700">
//             <div className="text-base sm:text-lg font-bold text-white">AgentSuit</div>
//             <button onClick={toggleSidebar} className="p-2 text-white hover:text-slate-300" aria-label="Close sidebar">
//               <X size={18} />
//             </button>
//           </div>
//         )}

//         {/* Header label */}
//         <div className="p-4">
//           <div className="text-xs sm:text-sm text-white mb-2">MAIN MENU</div>
//         </div>

//         {/* Scrollable nav column */}
//         <nav className="flex-1 px-2 pb-4 overflow-y-auto">
//           <div className="space-y-1">
//             {menuItems.map((item, index) => (
//               <div key={index}>
//                 {item.subItems ? (
//                   <>
//                     <div className="text-xs sm:text-sm text-white px-3 py-2 mt-4 uppercase tracking-wider">{item.name}</div>
//                     {item.subItems.map((subItem, subIndex) => (
//                       <Link
//                         to={subItem.link}
//                         key={subIndex}
//                         className={`flex items-center space-x-3 px-3 py-2 rounded text-sm
//                           ${isActive(subItem.link) ? 'bg-slate-700 text-white' : 'text-white hover:bg-slate-800'}`}
//                         onClick={closePanels}
//                       >
//                         <span className="shrink-0">{subItem.icon}</span>
//                         <span className="truncate">{subItem.name}</span>
//                       </Link>
//                     ))}
//                   </>
//                 ) : (
//                   <Link
//                     to={item.link}
//                     className={`flex items-center space-x-3 px-3 py-2 rounded text-sm
//                       ${isActive(item.link) ? 'bg-[#222222] text-white' : 'text-white hover:bg-slate-800'}`}
//                     onClick={closePanels}
//                   >
//                     <span className="shrink-0">{item.icon}</span>
//                     <span className="truncate">{item.name}</span>
//                   </Link>
//                 )}
//               </div>
//             ))}
//           </div>

//           <div className="border-t border-slate-700 my-4" />
//           <div className="text-xs sm:text-sm text-white px-3 py-2 uppercase tracking-wider">Settings</div>

//           <div className="space-y-1">
//             {settingsItems.map((item, index) => (
//               <Link
//                 to={item.link}
//                 key={index}
//                 className={`flex items-center space-x-3 px-3 py-2 rounded text-sm
//                   ${isActive(item.link) ? 'bg-slate-700 text-white' : 'text-white hover:bg-slate-800'}`}
//                 onClick={closePanels}
//               >
//                 <span className="shrink-0">{item.icon}</span>
//                 <span className="truncate">{item.name}</span>
//               </Link>
//             ))}
//             {/* Keep your commented logout snippet */}
//           </div>

//           {/* AI Assistant card WITH Configure AI inside (kept as-is, minor responsive tweaks) */}
//           <div className="mt-2 mx-3">
//             <div className="bg-slate-800 p-3 rounded" style={{background:'#222222'}}>
//               <div className="text-white text-sm font-medium mb-2">AI Assistant</div>
//               <div className="text-white text-xs mb-3">
//                 Leverage AI to qualify leads and automate follow-ups.
//               </div>
//               <Link
//                 to="/ai/configurations"
//                 onClick={closePanels}
//                 className="block w-full text-center bg-black text-white text-sm font-medium rounded px-3 py-2 hover:bg-slate-900 border border-slate-700"
//               >
//                 Configure AI
//               </Link>
//             </div>
//           </div>

//           {/* Logout */}
//           <button
//             onClick={handleLogout}
//             className="mt-2 w-full flex items-center space-x-3 px-3 py-2 rounded text-sm text-white hover:bg-slate-800"
//           >
//             <span><LogOut size={18} /></span>
//             <span className="truncate">Log out</span>
//           </button>
//         </nav>
//       </div>
//     </>
//   );
// };

// export default Sidebar;
