import { useState } from 'react';
import { Car, Wrench, MapPin, Plus, Fuel, Calendar, AlertTriangle, CheckCircle, Clock, X } from 'lucide-react';
import { toast } from 'sonner';

interface Vehicle {
  id: string;
  registration: string;
  make: string;
  model: string;
  year: number;
  type: 'Sedan' | 'SUV' | 'Pickup' | 'Van' | 'Bus';
  status: 'Available' | 'In Use' | 'Maintenance' | 'Decommissioned';
  assignedTo: string | null;
  department: string;
  mileage: number;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  lastService: string;
  nextService: string;
  insuranceExpiry: string;
  location: string;
}

const initialVehicles: Vehicle[] = [
  { id: 'V001', registration: 'KDA 001A', make: 'Toyota', model: 'Land Cruiser', year: 2024, type: 'SUV', status: 'In Use', assignedTo: 'John Kamau', department: 'Operations', mileage: 24500, fuelType: 'Diesel', lastService: '2026-02-15', nextService: '2026-05-15', insuranceExpiry: '2026-12-31', location: 'Nairobi HQ' },
  { id: 'V002', registration: 'KDB 234B', make: 'Toyota', model: 'Hilux', year: 2023, type: 'Pickup', status: 'Available', assignedTo: null, department: 'Field Ops', mileage: 45200, fuelType: 'Diesel', lastService: '2026-03-01', nextService: '2026-06-01', insuranceExpiry: '2026-11-15', location: 'Mombasa Office' },
  { id: 'V003', registration: 'KCC 567C', make: 'Nissan', model: 'NV350', year: 2022, type: 'Van', status: 'Maintenance', assignedTo: null, department: 'Logistics', mileage: 78300, fuelType: 'Diesel', lastService: '2026-03-20', nextService: '2026-04-20', insuranceExpiry: '2027-01-10', location: 'Nairobi Workshop' },
  { id: 'V004', registration: 'KDE 890D', make: 'Toyota', model: 'Corolla', year: 2025, type: 'Sedan', status: 'In Use', assignedTo: 'Mary Wanjiku', department: 'HR', mileage: 8900, fuelType: 'Hybrid', lastService: '2026-01-10', nextService: '2026-07-10', insuranceExpiry: '2027-03-01', location: 'Nairobi HQ' },
  { id: 'V005', registration: 'KDF 112E', make: 'Isuzu', model: 'FRR', year: 2021, type: 'Van', status: 'In Use', assignedTo: 'Peter Ochieng', department: 'Logistics', mileage: 112000, fuelType: 'Diesel', lastService: '2026-03-05', nextService: '2026-04-05', insuranceExpiry: '2026-08-20', location: 'Kisumu Depot' },
  { id: 'V006', registration: 'KDG 445F', make: 'Toyota', model: 'Probox', year: 2023, type: 'Sedan', status: 'Available', assignedTo: null, department: 'Sales', mileage: 32100, fuelType: 'Petrol', lastService: '2026-02-28', nextService: '2026-05-28', insuranceExpiry: '2026-10-15', location: 'Nairobi HQ' },
  { id: 'V007', registration: 'KDH 778G', make: 'Rosa', model: 'Bus 33-Seater', year: 2022, type: 'Bus', status: 'In Use', assignedTo: 'Staff Transport', department: 'Admin', mileage: 95400, fuelType: 'Diesel', lastService: '2026-03-15', nextService: '2026-04-15', insuranceExpiry: '2026-09-30', location: 'Nairobi HQ' },
  { id: 'V008', registration: 'KDJ 991H', make: 'Mitsubishi', model: 'Pajero', year: 2024, type: 'SUV', status: 'Decommissioned', assignedTo: null, department: 'Security', mileage: 156000, fuelType: 'Diesel', lastService: '2025-12-01', nextService: '-', insuranceExpiry: '2026-04-01', location: 'Nairobi Yard' },
];

const statusColor: Record<string, string> = {
  'Available': 'badge-approved',
  'In Use': 'badge-info',
  'Maintenance': 'badge-pending',
  'Decommissioned': 'badge-rejected',
};

const statusIcon: Record<string, React.ReactNode> = {
  'Available': <CheckCircle size={14} />,
  'In Use': <Car size={14} />,
  'Maintenance': <Wrench size={14} />,
  'Decommissioned': <AlertTriangle size={14} />,
};

export default function FleetManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [filter, setFilter] = useState<string>('All');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    registration: '', make: '', model: '', year: 2026, type: 'Sedan' as Vehicle['type'],
    fuelType: 'Petrol' as Vehicle['fuelType'], department: '', location: '',
  });

  const filtered = filter === 'All' ? vehicles : vehicles.filter(v => v.status === filter);

  const stats = {
    total: vehicles.length,
    available: vehicles.filter(v => v.status === 'Available').length,
    inUse: vehicles.filter(v => v.status === 'In Use').length,
    maintenance: vehicles.filter(v => v.status === 'Maintenance').length,
  };

  const handleAdd = () => {
    if (!form.registration || !form.make || !form.model) {
      toast.error('Please fill in all required fields');
      return;
    }
    const newVehicle: Vehicle = {
      id: `V${String(vehicles.length + 1).padStart(3, '0')}`,
      ...form,
      status: 'Available',
      assignedTo: null,
      mileage: 0,
      lastService: '-',
      nextService: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
      insuranceExpiry: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    };
    setVehicles([newVehicle, ...vehicles]);
    setShowAdd(false);
    setForm({ registration: '', make: '', model: '', year: 2026, type: 'Sedan', fuelType: 'Petrol', department: '', location: '' });
    toast.success(`Vehicle ${form.registration} added successfully`);
  };

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card"><div><p className="stat-label">Total Vehicles</p><p className="stat-value">{stats.total}</p></div><Car size={22} className="text-muted-foreground" /></div>
        <div className="stat-card cursor-pointer" onClick={() => setFilter('Available')}><div><p className="stat-label">Available</p><p className="stat-value text-green-600">{stats.available}</p></div><CheckCircle size={22} className="text-green-600" /></div>
        <div className="stat-card cursor-pointer" onClick={() => setFilter('In Use')}><div><p className="stat-label">In Use</p><p className="stat-value text-blue-600">{stats.inUse}</p></div><MapPin size={22} className="text-blue-600" /></div>
        <div className="stat-card cursor-pointer" onClick={() => setFilter('Maintenance')}><div><p className="stat-label">In Maintenance</p><p className="stat-value text-amber-600">{stats.maintenance}</p></div><Wrench size={22} className="text-amber-600" /></div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {['All', 'Available', 'In Use', 'Maintenance', 'Decommissioned'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-md text-sm font-medium border ${filter === s ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-muted'}`}>{s}</button>
          ))}
        </div>
        <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
          <Plus size={16} /> Add Vehicle
        </button>
      </div>

      {/* Add Vehicle Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-card rounded-lg border p-6 w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Add New Vehicle</h3>
              <button onClick={() => setShowAdd(false)}><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium">Registration *</label><input value={form.registration} onChange={e => setForm({...form, registration: e.target.value})} placeholder="e.g. KDA 001A" className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
                <div><label className="text-sm font-medium">Year</label><input type="number" value={form.year} onChange={e => setForm({...form, year: +e.target.value})} className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium">Make *</label><input value={form.make} onChange={e => setForm({...form, make: e.target.value})} placeholder="e.g. Toyota" className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
                <div><label className="text-sm font-medium">Model *</label><input value={form.model} onChange={e => setForm({...form, model: e.target.value})} placeholder="e.g. Land Cruiser" className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium">Type</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value as Vehicle['type']})} className="w-full mt-1 px-3 py-2 rounded-md border text-sm">
                    {['Sedan','SUV','Pickup','Van','Bus'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div><label className="text-sm font-medium">Fuel</label>
                  <select value={form.fuelType} onChange={e => setForm({...form, fuelType: e.target.value as Vehicle['fuelType']})} className="w-full mt-1 px-3 py-2 rounded-md border text-sm">
                    {['Petrol','Diesel','Electric','Hybrid'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
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

      {/* Vehicle Table */}
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/50">
              <th className="text-left py-3 px-4 font-medium">Registration</th>
              <th className="text-left py-3 px-4 font-medium">Vehicle</th>
              <th className="text-left py-3 px-4 font-medium">Type</th>
              <th className="text-left py-3 px-4 font-medium">Status</th>
              <th className="text-left py-3 px-4 font-medium">Assigned To</th>
              <th className="text-left py-3 px-4 font-medium">Department</th>
              <th className="text-right py-3 px-4 font-medium">Mileage</th>
              <th className="text-left py-3 px-4 font-medium">Fuel</th>
              <th className="text-left py-3 px-4 font-medium">Location</th>
              <th className="text-left py-3 px-4 font-medium">Next Service</th>
              <th className="text-left py-3 px-4 font-medium">Insurance</th>
            </tr></thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.id} className="border-b hover:bg-muted/30">
                  <td className="py-3 px-4 font-mono font-medium">{v.registration}</td>
                  <td className="py-3 px-4">{v.make} {v.model} ({v.year})</td>
                  <td className="py-3 px-4">{v.type}</td>
                  <td className="py-3 px-4"><span className={`inline-flex items-center gap-1 ${statusColor[v.status]}`}>{statusIcon[v.status]} {v.status}</span></td>
                  <td className="py-3 px-4">{v.assignedTo || <span className="text-muted-foreground">—</span>}</td>
                  <td className="py-3 px-4">{v.department}</td>
                  <td className="py-3 px-4 text-right">{v.mileage.toLocaleString()} km</td>
                  <td className="py-3 px-4"><span className="inline-flex items-center gap-1"><Fuel size={14} /> {v.fuelType}</span></td>
                  <td className="py-3 px-4"><span className="inline-flex items-center gap-1"><MapPin size={14} /> {v.location}</span></td>
                  <td className="py-3 px-4"><span className="inline-flex items-center gap-1"><Calendar size={14} /> {v.nextService}</span></td>
                  <td className="py-3 px-4"><span className={`inline-flex items-center gap-1 ${new Date(v.insuranceExpiry) < new Date('2026-06-01') ? 'text-destructive font-medium' : ''}`}><Clock size={14} /> {v.insuranceExpiry}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
