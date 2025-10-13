import React from 'react';
import { Plus, Filter, Download, ChevronDown, MoreHorizontal, Search } from 'lucide-react';
import AIAssistant from './AIAssistant';
import { Link, useNavigate } from 'react-router-dom';

const DashboardPage = ({ isMobile, isTablet, closePanels }) => {
    const navigate = useNavigate();
  const statCards = [
    { title: 'Total Leads', value: '247', change: '+12%', arrow: 'up' },
    { title: 'New This Week', value: '32', change: '+8%', arrow: 'up' },
    { title: 'Qualified Leads', value: '86', change: '-3%', arrow: 'down' },
    { title: 'Conversion Rate', value: '24.8%', change: '+5%', arrow: 'up' },
  ];

  const leads = [
    { name: 'Sarah Johnson', title: 'Buyer', email: 'sarah.j@example.com', phone: '(555) 123-4567', status: 'Qualified', source: 'Website', lastContact: 'Aug 12, 2025', avatar: 'SJ' },
    { name: 'Michael Chen', title: 'Seller', email: 'm.chen@example.com', phone: '(555) 987-6543', status: 'Nurturing', source: 'Referral', lastContact: 'Aug 10, 2025', avatar: 'MC' },
    { name: 'Alex Rodriguez', title: 'Investor', email: 'arod@example.com', phone: '(555) 234-5678', status: 'New', source: 'Social Media', lastContact: 'Aug 8, 2025', avatar: 'AR' },
    { name: 'Emily Taylor', title: 'Buyer', email: 'e.taylor@example.com', phone: '(555) 876-5432', status: 'Cold', source: 'Zillow', lastContact: 'Aug 5, 2025', avatar: 'ET' },
  ];

  const tasks = [
    { title: 'Call Sarah Johnson about offer details', time: '10:30 AM', priority: 'High' },
    { title: 'Prepare listing presentation', time: '1:00 PM', priority: 'Medium' },
    { title: 'Submit paperwork for closing', time: '9:00 AM', priority: 'Done' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#0B0B0B] p-3 md:p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 space-y-3 md:space-y-0">
        <h1 className={`font-medium text-white ${isMobile ? 'text-xl' : 'text-2xl'}`}>Dashboard</h1>
        <div className="flex items-center space-x-2 md:space-x-3 overflow-x-auto no-scrollbar">
          <button
            className={`text-slate-400 text-sm flex items-center space-x-2 border border-slate-600 rounded hover:bg-slate-800 whitespace-nowrap ${
              isMobile ? 'px-2 py-1' : 'px-3 py-2'
            }`}
          >
            <Filter size={14} />
            <span>Filter</span>
          </button>
          <button
            className={`text-slate-400 text-sm flex items-center space-x-2 border border-slate-600 rounded hover:bg-slate-800 whitespace-nowrap ${
              isMobile ? 'px-2 py-1' : 'px-3 py-2'
            }`}
          >
            <Download size={14} />
            <span>Export</span>
          </button>
          <Link to="/add-lead" className="flex-shrink-0">
            <button
              className={`bg-[#222222] text-white text-sm rounded font-medium hover:bg-slate-500 flex items-center space-x-2 whitespace-nowrap ${
                isMobile ? 'px-2 py-1' : 'px-4 py-2'
              }`}
            >
              <Plus size={14} />
              <span>Add Lead</span>
            </button>
          </Link>
          <button
    onClick={() => navigate("/upload-pdf")}
    className={`text-slate-400 text-sm flex items-center space-x-2 border border-slate-600 rounded hover:bg-slate-800 whitespace-nowrap ${
      isMobile ? 'px-2 py-1' : 'px-3 py-2'
    }`}
  >
    <Download size={14} />
    <span>PDF → Excel</span>
  </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-[#1e1e1e] p-3 md:p-4 rounded border border-slate-700 min-w-[120px] flex flex-col justify-between"
          >
            <div className={`text-slate-500 mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>{card.title}</div>
            <div className="flex items-end justify-between">
              <div className={`font-medium text-white ${isMobile ? 'text-lg' : 'text-2xl'}`}>{card.value}</div>
              <div
                className={`flex items-center ${
                  card.arrow === 'up' ? 'text-slate-300' : 'text-slate-400'
                } ${isMobile ? 'text-xs' : 'text-sm'}`}
              >
                <span>{card.arrow === 'up' ? '↑' : '↓'}</span>
                <span className="ml-1">{card.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Assistant & Tasks */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <AIAssistant isMobile={isMobile} />
        </div>
        <div className="flex-1 min-w-0 bg-[#0B0B0B] rounded border border-slate-700 p-3 md:p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-white ${isMobile ? 'text-base' : 'text-lg'}`}>Today's Tasks</h2>
            <button
              className={`bg-slate-600 text-white text-sm rounded font-medium hover:bg-slate-500 flex items-center space-x-1 ${
                isMobile ? 'px-2 py-1' : 'px-3 py-1'
              }`}
            >
              <Plus size={12} />
              <span>Add</span>
            </button>
          </div>
          <div className="space-y-2 md:space-y-3 overflow-y-auto max-h-[320px]">
            {tasks.map((task, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-2 md:p-3 bg-[#1e1e1e] rounded border border-slate-600"
              >
                <input
                  type="checkbox"
                  className="mt-1 rounded border-slate-500 bg-slate-600"
                  defaultChecked={task.priority === 'Done'}
                />
                <div className="flex-1 min-w-0">
                  <div
                    className={`${
                      task.priority === 'Done' ? 'line-through text-slate-500' : 'text-white'
                    } ${isMobile ? 'text-xs' : 'text-sm'}`}
                  >
                    {task.title}
                  </div>
                  <div className="text-slate-500 mt-1 text-xs">{task.time}</div>
                </div>
                <span className="text-xs px-2 py-1 rounded text-slate-300 border border-slate-500 bg-slate-600 whitespace-nowrap">
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lead Overview */}
      <div className="mt-9 bg-[#1e1e1e] rounded border border-slate-700 p-3 md:p-4 mb-4 md:mb-6 pb-20">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 space-y-3 md:space-y-0">
          <h2 className={`text-white ${isMobile ? 'text-base' : 'text-lg'}`}>Lead Overview</h2>
          <div className="relative w-full md:w-60">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search leads..."
              className="bg-slate-900 text-white text-sm rounded py-2 pl-9 pr-3 border border-slate-600 focus:outline-none focus:border-slate-500 w-full"
            />
          </div>
        </div>

        {isMobile ? (
          <div className="space-y-3">
            {leads.map((lead, index) => (
              <div key={index} className="bg-slate-700 p-3 rounded border border-slate-600">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-sm text-white">
                      {lead.avatar}
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{lead.name}</div>
                      <div className="text-slate-400 text-xs">{lead.title}</div>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded text-xs border border-slate-500 text-slate-300 bg-slate-600">
                    {lead.status}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-400 break-words">
                  <div>{lead.email}</div>
                  <div>{lead.phone}</div>
                  <div className="flex justify-between">
                    <span>Source: {lead.source}</span>
                    <span>{lead.lastContact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="text-left text-slate-500 text-sm border-b border-slate-700">
                  <th className="pb-3 pr-4">
                    <input type="checkbox" className="rounded border-slate-600 bg-slate-700" />
                  </th>
                  <th className="pb-3 pr-4 cursor-pointer hover:text-slate-300">
                    <div className="flex items-center space-x-1">
                      <span>Name</span>
                      <ChevronDown size={14} />
                    </div>
                  </th>
                  <th className="pb-3 pr-4 cursor-pointer hover:text-slate-300">
                    <div className="flex items-center space-x-1">
                      <span>Email</span>
                      <ChevronDown size={14} />
                    </div>
                  </th>
                  {!isTablet && <th className="pb-3 pr-4">Phone</th>}
                  <th className="pb-3 pr-4 cursor-pointer hover:text-slate-300">
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      <ChevronDown size={14} />
                    </div>
                  </th>
                  {!isTablet && <th className="pb-3 pr-4">Source</th>}
                  {!isTablet && <th className="pb-3 pr-4">Last Contact</th>}
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, index) => (
                  <tr key={index} className="border-b border-slate-700 hover:bg-slate-750">
                    <td className="py-3 pr-4">
                      <input type="checkbox" className="rounded border-slate-600 bg-slate-700" />
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs text-white">
                          {lead.avatar}
                        </div>
                        <div>
                          <div className="text-white text-sm">{lead.name}</div>
                          <div className="text-slate-500 text-xs">{lead.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-slate-400 text-sm break-words">{lead.email}</td>
                    {!isTablet && <td className="py-3 pr-4 text-slate-400 text-sm">{lead.phone}</td>}
                    <td className="py-3 pr-4">
                      <span className="px-2 py-1 rounded text-xs border border-slate-500 text-slate-300 bg-slate-700">
                        {lead.status}
                      </span>
                    </td>
                    {!isTablet && <td className="py-3 pr-4 text-slate-400 text-sm">{lead.source}</td>}
                    {!isTablet && <td className="py-3 pr-4 text-slate-400 text-sm">{lead.lastContact}</td>}
                    <td className="py-3">
                      <button className="text-slate-400 hover:text-white">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-4 text-sm text-slate-500 space-y-2 md:space-y-0">
          <div>Showing 1 to 4 of 247 results</div>
          <div className="flex items-center justify-center space-x-2">
            <button
              className="w-8 h-8 flex items-center justify-center rounded border border-slate-600 hover:bg-slate-700"
              aria-label="Previous page"
            >
              {'<'}
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-slate-600 text-white" aria-current="page">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-600 hover:bg-slate-700">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-600 hover:bg-slate-700">3</button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded border border-slate-600 hover:bg-slate-700"
              aria-label="Next page"
            >
              {'>'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;