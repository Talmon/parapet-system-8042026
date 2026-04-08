import { useState } from 'react';
import {
  initialVehicles, initialDrivers, initialRequests, initialTrips, initialFuelLogs, initialMaintenance, initialIncidents,
  type Vehicle, type Driver, type VehicleRequest, type Trip, type FuelLog, type MaintenanceRecord, type Incident
} from '@/data/fleetData';
import { Car, Wrench, MapPin, Plus, Fuel, Calendar, AlertTriangle, CheckCircle, Clock, X, Users, Route, Shield, Star } from 'lucide-react';
import { toast } from 'sonner';

const statusColor: Record<string, string> = { 'Available': 'badge-active', 'In Use': 'badge-info', 'Maintenance': 'badge-pending', 'Decommissioned': 'badge-rejected' };

export default function FleetManagement() {
  const [tab, setTab] = useState<'vehicles' | 'drivers' | 'requests' | 'trips' | 'fuel' | 'maintenance' | 'incidents'>('vehicles');
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [drivers] = useState<Driver[]>(initialDrivers);
  const [requests, setRequests] = useState<VehicleRequest[]>(initialRequests);
  const [trips] = useState<Trip[]>(initialTrips);
  const [fuelLogs] = useState<FuelLog[]>(initialFuelLogs);
  const [maintenance] = useState<MaintenanceRecord[]>(initialMaintenance);
  const [incidents] = useState<Incident[]>(initialIncidents);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState('All');
  const [form, setForm] = useState({ registration: '', make: '', model: '', year: 2026, type: 'Sedan' as Vehicle['type'], fuelType: 'Petrol' as Vehicle['fuelType'], department: '', location: '' });

  const stats = {
    total: vehicles.length,
    available: vehicles.filter(v => v.status === 'Available').length,
    inUse: vehicles.filter(v => v.status === 'In Use').length,
    maintenance: vehicles.filter(v => v.status === 'Maintenance').length,
  };

  const handleAdd = () => {
    if (!form.registration || !form.make || !form.model) { toast.error('Fill required fields'); return; }
    const nv: Vehicle = { id: `V${String(vehicles.length + 1).padStart(3, '0')}`, ...form, status: 'Available', assignedTo: null, mileage: 0, lastService: '-', nextService: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0], insuranceExpiry: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0] };
    setVehicles([nv, ...vehicles]); setShowAdd(false); toast.success('Vehicle added');
  };

  const approveRequest = (id: string, action: 'approve' | 'reject') => {
    if (action === 'approve') {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: r.status === 'pending' ? 'supervisor_approved' : r.status === 'supervisor_approved' ? 'fleet_approved' : 'allocated' } : r));
      toast.success('Request approved');
    } else {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' as const } : r));
      toast.error('Request rejected');
    }
  };

  const filtered = filter === 'All' ? vehicles : vehicles.filter(v => v.status === filter);

  const tabs = [
    { key: 'vehicles' as const, label: 'Vehicles', icon: Car },
    { key: 'drivers' as const, label: 'Drivers', icon: Users },
    { key: 'requests' as const, label: 'Requests', icon: FileText },
    { key: 'trips' as const, label: 'Trips', icon: Route },
    { key: 'fuel' as const, label: 'Fuel', icon: Fuel },
    { key: 'maintenance' as const, label: 'Maintenance', icon: Wrench },
    { key: 'incidents' as const, label: 'Incidents', icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card"><div><p className="stat-label">Total Fleet</p><p className="stat-value">{stats.total}</p></div><Car size={22} className="text-muted-foreground" /></div>
        <div className="stat-card"><div><p className="stat-label">Available</p><p className="stat-value text-green-600">{stats.available}</p></div><CheckCircle size={22} className="text-green-600" /></div>
        <div className="stat-card"><div><p className="stat-label">On Trip</p><p className="stat-value text-blue-600">{stats.inUse}</p></div><MapPin size={22} className="text-blue-600" /></div>
        <div className="stat-card"><div><p className="stat-label">In Maintenance</p><p className="stat-value text-amber-600">{stats.maintenance}</p></div><Wrench size={22} className="text-amber-600" /></div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1 border-b overflow-x-auto">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`px-3 py-2 text-sm font-medium border-b-2 whitespace-nowrap inline-flex items-center gap-1.5 ${tab === t.key ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground'}`}>
              <t.icon size={14} />{t.label}
            </button>
          ))}
        </div>
        {tab === 'vehicles' && <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium"><Plus size={16} /> Add Vehicle</button>}
      </div>

      {/* VEHICLES */}
      {tab === 'vehicles' && (
        <>
          <div className="flex gap-2">
            {['All', 'Available', 'In Use', 'Maintenance', 'Decommissioned'].map(s => (
              <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-md text-sm font-medium border ${filter === s ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-muted'}`}>{s}</button>
            ))}
          </div>
          <div className="bg-card rounded-lg border overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Registration</th><th>Vehicle</th><th>Type</th><th>Status</th><th>Assigned</th><th>Dept</th><th>Mileage</th><th>Fuel</th><th>Location</th><th>Next Service</th><th>Insurance</th></tr></thead>
              <tbody>
                {filtered.map(v => (
                  <tr key={v.id}>
                    <td className="font-mono font-medium">{v.registration}</td>
                    <td>{v.make} {v.model} ({v.year})</td>
                    <td>{v.type}</td>
                    <td><span className={statusColor[v.status]}>{v.status}</span></td>
                    <td>{v.assignedTo || <span className="text-muted-foreground">—</span>}</td>
                    <td>{v.department}</td>
                    <td className="text-right">{v.mileage.toLocaleString()} km</td>
                    <td>{v.fuelType}</td>
                    <td>{v.location}</td>
                    <td>{v.nextService}</td>
                    <td><span className={new Date(v.insuranceExpiry) < new Date('2026-06-01') ? 'text-destructive font-medium' : ''}>{v.insuranceExpiry}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* DRIVERS */}
      {tab === 'drivers' && (
        <div className="bg-card rounded-lg border overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Driver</th><th>License No.</th><th>Class</th><th>License Expiry</th><th>Phone</th><th>Status</th><th>Assigned Vehicle</th><th>Trips</th><th>Rating</th></tr></thead>
            <tbody>
              {drivers.map(d => (
                <tr key={d.id}>
                  <td className="font-medium">{d.name}</td>
                  <td className="font-mono text-xs">{d.licenseNumber}</td>
                  <td>{d.licenseClass}</td>
                  <td><span className={new Date(d.licenseExpiry) < new Date('2026-12-31') ? 'text-amber-600 font-medium' : ''}>{d.licenseExpiry}</span></td>
                  <td className="text-sm">{d.phone}</td>
                  <td><span className={d.status === 'available' ? 'badge-active' : d.status === 'on_trip' ? 'badge-info' : d.status === 'off_duty' ? 'badge-pending' : 'badge-rejected'}>{d.status.replace('_', ' ')}</span></td>
                  <td>{d.assignedVehicle ? vehicles.find(v => v.id === d.assignedVehicle)?.registration : '—'}</td>
                  <td>{d.totalTrips}</td>
                  <td><span className="flex items-center gap-1"><Star size={12} className="fill-amber-400 text-amber-400" />{d.rating}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VEHICLE REQUESTS */}
      {tab === 'requests' && (
        <div className="bg-card rounded-lg border overflow-x-auto">
          <div className="p-4 border-b"><h3 className="font-semibold">Vehicle Request Workflow</h3></div>
          <table className="data-table">
            <thead><tr><th>Requested By</th><th>Purpose</th><th>Destination</th><th>Trip Date</th><th>Passengers</th><th>Status</th><th>Vehicle</th><th>Driver</th><th>Actions</th></tr></thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id}>
                  <td><div><p className="font-medium">{r.requestedBy}</p><p className="text-xs text-muted-foreground">{r.department}</p></div></td>
                  <td className="text-sm max-w-[200px]">{r.purpose}</td>
                  <td>{r.destination}</td>
                  <td className="text-sm">{r.tripDate} → {r.returnDate}</td>
                  <td className="text-center">{r.passengers}</td>
                  <td><span className={r.status === 'completed' ? 'badge-active' : r.status === 'allocated' || r.status === 'fleet_approved' ? 'badge-info' : r.status === 'rejected' ? 'badge-rejected' : 'badge-pending'}>{r.status.replace(/_/g, ' ')}</span></td>
                  <td>{r.allocatedVehicle || '—'}</td>
                  <td>{r.allocatedDriver || '—'}</td>
                  <td>
                    {(r.status === 'pending' || r.status === 'supervisor_approved' || r.status === 'fleet_approved') && (
                      <div className="flex gap-1">
                        <button onClick={() => approveRequest(r.id, 'approve')} className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200">Approve</button>
                        <button onClick={() => approveRequest(r.id, 'reject')} className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200">Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TRIPS */}
      {tab === 'trips' && (
        <div className="bg-card rounded-lg border overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Trip ID</th><th>Vehicle</th><th>Driver</th><th>Destination</th><th>Purpose</th><th>Date</th><th>Mileage</th><th>Fuel Used</th><th>Status</th></tr></thead>
            <tbody>
              {trips.map(t => (
                <tr key={t.id}>
                  <td className="font-mono">{t.id}</td>
                  <td className="font-medium">{t.vehicleReg}</td>
                  <td>{t.driverName}</td>
                  <td>{t.destination}</td>
                  <td className="text-sm">{t.purpose}</td>
                  <td className="text-sm">{t.startDate}{t.endDate ? ` → ${t.endDate}` : ''}</td>
                  <td>{t.endMileage ? `${(t.endMileage - t.startMileage).toLocaleString()} km` : 'In progress'}</td>
                  <td>{t.fuelUsed ? `${t.fuelUsed}L` : '—'}</td>
                  <td><span className={t.status === 'completed' ? 'badge-active' : t.status === 'in_progress' ? 'badge-info' : 'badge-rejected'}>{t.status.replace('_', ' ')}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* FUEL */}
      {tab === 'fuel' && (
        <div className="bg-card rounded-lg border overflow-x-auto">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">Fuel Log</h3>
            <div className="text-sm text-muted-foreground">Total: KES {fuelLogs.reduce((s, f) => s + f.totalCost, 0).toLocaleString()}</div>
          </div>
          <table className="data-table">
            <thead><tr><th>Date</th><th>Vehicle</th><th>Station</th><th>Litres</th><th>Rate/L</th><th>Total Cost</th><th>Mileage</th><th>Filled By</th></tr></thead>
            <tbody>
              {fuelLogs.map(f => (
                <tr key={f.id}>
                  <td>{f.date}</td>
                  <td className="font-medium">{f.vehicleReg}</td>
                  <td>{f.station}</td>
                  <td>{f.litres}L</td>
                  <td>KES {f.costPerLitre.toFixed(2)}</td>
                  <td className="font-bold">KES {f.totalCost.toLocaleString()}</td>
                  <td>{f.mileageAtFill.toLocaleString()} km</td>
                  <td>{f.filledBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MAINTENANCE */}
      {tab === 'maintenance' && (
        <div className="bg-card rounded-lg border overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Vehicle</th><th>Type</th><th>Description</th><th>Vendor</th><th>Cost</th><th>Date</th><th>Mileage</th><th>Status</th></tr></thead>
            <tbody>
              {maintenance.map(m => (
                <tr key={m.id}>
                  <td className="font-medium">{m.vehicleReg}</td>
                  <td><span className="badge-info">{m.type}</span></td>
                  <td className="text-sm max-w-[250px]">{m.description}</td>
                  <td>{m.vendor}</td>
                  <td className="font-bold">KES {m.cost.toLocaleString()}</td>
                  <td className="text-sm">{m.startDate}{m.endDate ? ` → ${m.endDate}` : ''}</td>
                  <td>{m.mileageAtService.toLocaleString()} km</td>
                  <td><span className={m.status === 'completed' ? 'badge-active' : m.status === 'in_progress' ? 'badge-pending' : 'badge-info'}>{m.status.replace('_', ' ')}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* INCIDENTS */}
      {tab === 'incidents' && (
        <div className="space-y-3">
          {incidents.map(inc => (
            <div key={inc.id} className={`bg-card rounded-lg border p-4 border-l-4 ${inc.severity === 'major' ? 'border-l-red-500' : inc.severity === 'moderate' ? 'border-l-amber-500' : 'border-l-blue-400'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={inc.severity === 'major' ? 'badge-rejected' : inc.severity === 'moderate' ? 'badge-pending' : 'badge-info'}>{inc.type}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${inc.severity === 'major' ? 'bg-red-100 text-red-700' : inc.severity === 'moderate' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{inc.severity}</span>
                    <span className="badge-info">{inc.status}</span>
                  </div>
                  <p className="text-sm font-medium">{inc.vehicleReg} — {inc.driverName}</p>
                  <p className="text-xs text-muted-foreground">{inc.date} · {inc.location}</p>
                </div>
                <span className="font-bold text-sm">KES {inc.estimatedCost.toLocaleString()}</span>
              </div>
              <p className="text-sm mt-2">{inc.description}</p>
              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                {inc.injuries && <span className="text-destructive font-medium">⚠ Injuries reported</span>}
                {inc.policeCaseNo && <span>Police Case: {inc.policeCaseNo}</span>}
                {inc.insuranceClaim && <span>Insurance claim filed</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD VEHICLE MODAL */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-card rounded-lg border p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-lg">Add New Vehicle</h3><button onClick={() => setShowAdd(false)}><X size={20} /></button></div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium">Registration *</label><input value={form.registration} onChange={e => setForm({...form, registration: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
                <div><label className="text-sm font-medium">Year</label><input type="number" value={form.year} onChange={e => setForm({...form, year: +e.target.value})} className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium">Make *</label><input value={form.make} onChange={e => setForm({...form, make: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
                <div><label className="text-sm font-medium">Model *</label><input value={form.model} onChange={e => setForm({...form, model: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium">Type</label><select value={form.type} onChange={e => setForm({...form, type: e.target.value as Vehicle['type']})} className="w-full mt-1 px-3 py-2 rounded-md border text-sm">{['Sedan','SUV','Pickup','Van','Bus'].map(t => <option key={t}>{t}</option>)}</select></div>
                <div><label className="text-sm font-medium">Fuel</label><select value={form.fuelType} onChange={e => setForm({...form, fuelType: e.target.value as Vehicle['fuelType']})} className="w-full mt-1 px-3 py-2 rounded-md border text-sm">{['Petrol','Diesel','Electric','Hybrid'].map(t => <option key={t}>{t}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium">Department</label><input value={form.department} onChange={e => setForm({...form, department: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
                <div><label className="text-sm font-medium">Location</label><input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-md border text-sm">Cancel</button>
              <button onClick={handleAdd} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">Add Vehicle</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Need this for the requests tab icon reference
const FileText = ({ size, className }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
);
