// Fleet Management Module Data — Full Workflow

export interface Vehicle {
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

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  licenseExpiry: string;
  licenseClass: string;
  phone: string;
  status: 'available' | 'on_trip' | 'off_duty' | 'suspended';
  assignedVehicle: string | null;
  totalTrips: number;
  rating: number;
}

export interface VehicleRequest {
  id: string;
  requestedBy: string;
  department: string;
  purpose: string;
  destination: string;
  passengers: number;
  requestDate: string;
  tripDate: string;
  returnDate: string;
  status: 'pending' | 'supervisor_approved' | 'fleet_approved' | 'allocated' | 'rejected' | 'completed';
  allocatedVehicle: string | null;
  allocatedDriver: string | null;
  approvedBy: string | null;
  notes: string;
}

export interface Trip {
  id: string;
  vehicleId: string;
  vehicleReg: string;
  driverId: string;
  driverName: string;
  requestId: string;
  requestedBy: string;
  destination: string;
  purpose: string;
  startDate: string;
  endDate: string | null;
  startMileage: number;
  endMileage: number | null;
  fuelUsed: number | null;
  status: 'in_progress' | 'completed' | 'cancelled';
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  vehicleReg: string;
  date: string;
  station: string;
  litres: number;
  costPerLitre: number;
  totalCost: number;
  mileageAtFill: number;
  filledBy: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehicleReg: string;
  type: 'Scheduled Service' | 'Repair' | 'Tyre Replacement' | 'Body Work' | 'Inspection';
  description: string;
  vendor: string;
  cost: number;
  startDate: string;
  endDate: string | null;
  status: 'scheduled' | 'in_progress' | 'completed';
  mileageAtService: number;
}

export interface Incident {
  id: string;
  vehicleId: string;
  vehicleReg: string;
  driverName: string;
  date: string;
  location: string;
  type: 'Accident' | 'Breakdown' | 'Theft' | 'Traffic Offence' | 'Near Miss';
  severity: 'minor' | 'moderate' | 'major';
  description: string;
  injuries: boolean;
  policeCaseNo: string | null;
  insuranceClaim: boolean;
  estimatedCost: number;
  status: 'reported' | 'investigating' | 'resolved' | 'closed';
}

export const initialVehicles: Vehicle[] = [
  { id: 'V001', registration: 'KDA 001A', make: 'Toyota', model: 'Land Cruiser', year: 2024, type: 'SUV', status: 'In Use', assignedTo: 'John Kamau', department: 'Operations', mileage: 24500, fuelType: 'Diesel', lastService: '2026-02-15', nextService: '2026-05-15', insuranceExpiry: '2026-12-31', location: 'Nairobi HQ' },
  { id: 'V002', registration: 'KDB 234B', make: 'Toyota', model: 'Hilux', year: 2023, type: 'Pickup', status: 'Available', assignedTo: null, department: 'Field Ops', mileage: 45200, fuelType: 'Diesel', lastService: '2026-03-01', nextService: '2026-06-01', insuranceExpiry: '2026-11-15', location: 'Mombasa Office' },
  { id: 'V003', registration: 'KCC 567C', make: 'Nissan', model: 'NV350', year: 2022, type: 'Van', status: 'Maintenance', assignedTo: null, department: 'Logistics', mileage: 78300, fuelType: 'Diesel', lastService: '2026-03-20', nextService: '2026-04-20', insuranceExpiry: '2027-01-10', location: 'Nairobi Workshop' },
  { id: 'V004', registration: 'KDE 890D', make: 'Toyota', model: 'Corolla', year: 2025, type: 'Sedan', status: 'In Use', assignedTo: 'Mary Wanjiku', department: 'HR', mileage: 8900, fuelType: 'Hybrid', lastService: '2026-01-10', nextService: '2026-07-10', insuranceExpiry: '2027-03-01', location: 'Nairobi HQ' },
  { id: 'V005', registration: 'KDF 112E', make: 'Isuzu', model: 'FRR', year: 2021, type: 'Van', status: 'In Use', assignedTo: 'Peter Ochieng', department: 'Logistics', mileage: 112000, fuelType: 'Diesel', lastService: '2026-03-05', nextService: '2026-04-05', insuranceExpiry: '2026-08-20', location: 'Kisumu Depot' },
  { id: 'V006', registration: 'KDG 445F', make: 'Toyota', model: 'Probox', year: 2023, type: 'Sedan', status: 'Available', assignedTo: null, department: 'Sales', mileage: 32100, fuelType: 'Petrol', lastService: '2026-02-28', nextService: '2026-05-28', insuranceExpiry: '2026-10-15', location: 'Nairobi HQ' },
  { id: 'V007', registration: 'KDH 778G', make: 'Rosa', model: 'Bus 33-Seater', year: 2022, type: 'Bus', status: 'In Use', assignedTo: 'Staff Transport', department: 'Admin', mileage: 95400, fuelType: 'Diesel', lastService: '2026-03-15', nextService: '2026-04-15', insuranceExpiry: '2026-09-30', location: 'Nairobi HQ' },
  { id: 'V008', registration: 'KDJ 991H', make: 'Mitsubishi', model: 'Pajero', year: 2024, type: 'SUV', status: 'Decommissioned', assignedTo: null, department: 'Security', mileage: 156000, fuelType: 'Diesel', lastService: '2025-12-01', nextService: '-', insuranceExpiry: '2026-04-01', location: 'Nairobi Yard' },
];

export const initialDrivers: Driver[] = [
  { id: 'DRV-001', name: 'John Kamau', licenseNumber: 'DL-KE-2019-001234', licenseExpiry: '2027-06-15', licenseClass: 'BCE', phone: '+254712000001', status: 'on_trip', assignedVehicle: 'V001', totalTrips: 145, rating: 4.8 },
  { id: 'DRV-002', name: 'Peter Ochieng', licenseNumber: 'DL-KE-2020-005678', licenseExpiry: '2027-03-20', licenseClass: 'BCE', phone: '+254712000002', status: 'on_trip', assignedVehicle: 'V005', totalTrips: 210, rating: 4.5 },
  { id: 'DRV-003', name: 'Stephen Kiptoo', licenseNumber: 'DL-KE-2018-009012', licenseExpiry: '2026-12-31', licenseClass: 'BCDE', phone: '+254712000003', status: 'available', assignedVehicle: null, totalTrips: 320, rating: 4.9 },
  { id: 'DRV-004', name: 'Moses Wafula', licenseNumber: 'DL-KE-2021-003456', licenseExpiry: '2028-01-10', licenseClass: 'BC', phone: '+254712000004', status: 'off_duty', assignedVehicle: null, totalTrips: 88, rating: 4.2 },
  { id: 'DRV-005', name: 'Daniel Rono', licenseNumber: 'DL-KE-2017-007890', licenseExpiry: '2026-09-15', licenseClass: 'BCDE', phone: '+254712000005', status: 'on_trip', assignedVehicle: 'V007', totalTrips: 450, rating: 4.7 },
  { id: 'DRV-006', name: 'Henry Sang', licenseNumber: 'DL-KE-2022-002345', licenseExpiry: '2028-05-20', licenseClass: 'BC', phone: '+254712000006', status: 'suspended', assignedVehicle: null, totalTrips: 56, rating: 3.1 },
];

export const initialRequests: VehicleRequest[] = [
  { id: 'VR-001', requestedBy: 'Grace Muthoni', department: 'Engineering', purpose: 'Client site visit — Mombasa data center', destination: 'Mombasa', passengers: 3, requestDate: '2026-04-05', tripDate: '2026-04-10', returnDate: '2026-04-11', status: 'fleet_approved', allocatedVehicle: null, allocatedDriver: null, approvedBy: 'James Otieno', notes: 'Requires SUV for equipment transport' },
  { id: 'VR-002', requestedBy: 'David Ochieng', department: 'Sales', purpose: 'Quarterly client visits — Western region', destination: 'Kisumu / Eldoret', passengers: 2, requestDate: '2026-04-06', tripDate: '2026-04-14', returnDate: '2026-04-16', status: 'pending', allocatedVehicle: null, allocatedDriver: null, approvedBy: null, notes: '' },
  { id: 'VR-003', requestedBy: 'Amina Hassan', department: 'Finance', purpose: 'KRA office visit — tax clearance', destination: 'Times Tower, Nairobi', passengers: 1, requestDate: '2026-04-04', tripDate: '2026-04-08', returnDate: '2026-04-08', status: 'allocated', allocatedVehicle: 'KDG 445F', allocatedDriver: 'Stephen Kiptoo', approvedBy: 'John Maina', notes: '' },
  { id: 'VR-004', requestedBy: 'Jane Wanjiku', department: 'HR', purpose: 'University career fair — Strathmore', destination: 'Strathmore University', passengers: 4, requestDate: '2026-04-03', tripDate: '2026-04-07', returnDate: '2026-04-07', status: 'completed', allocatedVehicle: 'KDE 890D', allocatedDriver: 'Moses Wafula', approvedBy: 'Jane Wanjiku', notes: 'Collected recruitment materials' },
  { id: 'VR-005', requestedBy: 'Samuel Kiprop', department: 'IT', purpose: 'Server room inspection — Nakuru branch', destination: 'Nakuru', passengers: 2, requestDate: '2026-04-06', tripDate: '2026-04-12', returnDate: '2026-04-12', status: 'supervisor_approved', allocatedVehicle: null, allocatedDriver: null, approvedBy: 'Samuel Kiprop', notes: 'Urgent — server downtime reported' },
  { id: 'VR-006', requestedBy: 'Peter Kamau', department: 'Operations', purpose: 'Warehouse audit', destination: 'Athi River', passengers: 5, requestDate: '2026-04-02', tripDate: '2026-04-06', returnDate: '2026-04-06', status: 'rejected', allocatedVehicle: null, allocatedDriver: null, approvedBy: null, notes: 'No vehicles available on requested date' },
];

export const initialTrips: Trip[] = [
  { id: 'TR-001', vehicleId: 'V001', vehicleReg: 'KDA 001A', driverId: 'DRV-001', driverName: 'John Kamau', requestId: 'VR-003', requestedBy: 'Peter Kamau', destination: 'Mombasa — Port Operations', purpose: 'Monthly port inspection', startDate: '2026-04-05', endDate: null, startMileage: 24200, endMileage: null, fuelUsed: null, status: 'in_progress' },
  { id: 'TR-002', vehicleId: 'V005', vehicleReg: 'KDF 112E', driverId: 'DRV-002', driverName: 'Peter Ochieng', requestId: 'VR-004', requestedBy: 'Lucy Akinyi', destination: 'Kisumu — Client Delivery', purpose: 'Product delivery', startDate: '2026-04-04', endDate: null, startMileage: 111800, endMileage: null, fuelUsed: null, status: 'in_progress' },
  { id: 'TR-003', vehicleId: 'V004', vehicleReg: 'KDE 890D', driverId: 'DRV-004', driverName: 'Moses Wafula', requestId: 'VR-004', requestedBy: 'Jane Wanjiku', destination: 'Strathmore University', purpose: 'Career fair', startDate: '2026-04-07', endDate: '2026-04-07', startMileage: 8700, endMileage: 8740, fuelUsed: 5, status: 'completed' },
  { id: 'TR-004', vehicleId: 'V007', vehicleReg: 'KDH 778G', driverId: 'DRV-005', driverName: 'Daniel Rono', requestId: '-', requestedBy: 'Admin', destination: 'Nairobi Routes', purpose: 'Staff morning shuttle', startDate: '2026-04-07', endDate: '2026-04-07', startMileage: 95200, endMileage: 95280, fuelUsed: 18, status: 'completed' },
];

export const initialFuelLogs: FuelLog[] = [
  { id: 'FL-001', vehicleId: 'V001', vehicleReg: 'KDA 001A', date: '2026-04-04', station: 'Total Energies — Westlands', litres: 65, costPerLitre: 182.50, totalCost: 11862.5, mileageAtFill: 24200, filledBy: 'John Kamau' },
  { id: 'FL-002', vehicleId: 'V005', vehicleReg: 'KDF 112E', date: '2026-04-03', station: 'Shell — Kisumu', litres: 80, costPerLitre: 180.00, totalCost: 14400, mileageAtFill: 111500, filledBy: 'Peter Ochieng' },
  { id: 'FL-003', vehicleId: 'V007', vehicleReg: 'KDH 778G', date: '2026-04-06', station: 'Rubis — Industrial Area', litres: 95, costPerLitre: 179.50, totalCost: 17052.5, mileageAtFill: 95100, filledBy: 'Daniel Rono' },
  { id: 'FL-004', vehicleId: 'V006', vehicleReg: 'KDG 445F', date: '2026-04-01', station: 'Total Energies — Karen', litres: 40, costPerLitre: 185.00, totalCost: 7400, mileageAtFill: 32000, filledBy: 'Stephen Kiptoo' },
  { id: 'FL-005', vehicleId: 'V004', vehicleReg: 'KDE 890D', date: '2026-03-28', station: 'Shell — Lavington', litres: 35, costPerLitre: 183.00, totalCost: 6405, mileageAtFill: 8650, filledBy: 'Moses Wafula' },
];

export const initialMaintenance: MaintenanceRecord[] = [
  { id: 'MNT-001', vehicleId: 'V003', vehicleReg: 'KCC 567C', type: 'Repair', description: 'Transmission overhaul — gearbox replacement', vendor: 'Autoxpress Nairobi', cost: 185000, startDate: '2026-03-25', endDate: null, status: 'in_progress', mileageAtService: 78300 },
  { id: 'MNT-002', vehicleId: 'V001', vehicleReg: 'KDA 001A', type: 'Scheduled Service', description: '25,000 km service — oil, filters, brake pads', vendor: 'Toyota Kenya', cost: 28000, startDate: '2026-05-15', endDate: null, status: 'scheduled', mileageAtService: 25000 },
  { id: 'MNT-003', vehicleId: 'V007', vehicleReg: 'KDH 778G', type: 'Tyre Replacement', description: 'Full set of 6 tyres — Bridgestone commercial', vendor: 'Tyre World', cost: 156000, startDate: '2026-04-01', endDate: '2026-04-03', status: 'completed', mileageAtService: 95000 },
  { id: 'MNT-004', vehicleId: 'V005', vehicleReg: 'KDF 112E', type: 'Scheduled Service', description: 'Overdue 100k service — comprehensive check', vendor: 'Isuzu EA', cost: 45000, startDate: '2026-04-15', endDate: null, status: 'scheduled', mileageAtService: 112000 },
  { id: 'MNT-005', vehicleId: 'V006', vehicleReg: 'KDG 445F', type: 'Inspection', description: 'Annual NTSA inspection', vendor: 'NTSA Inspection Centre', cost: 3500, startDate: '2026-04-20', endDate: null, status: 'scheduled', mileageAtService: 32100 },
];

export const initialIncidents: Incident[] = [
  { id: 'INC-001', vehicleId: 'V002', vehicleReg: 'KDB 234B', driverName: 'Stephen Kiptoo', date: '2026-03-18', location: 'Mombasa Road — Near JKIA', type: 'Accident', severity: 'minor', description: 'Rear-ended by matatu at traffic light. Minor bumper damage.', injuries: false, policeCaseNo: 'OB/52/2026', insuranceClaim: true, estimatedCost: 45000, status: 'resolved' },
  { id: 'INC-002', vehicleId: 'V005', vehicleReg: 'KDF 112E', driverName: 'Peter Ochieng', date: '2026-03-25', location: 'Nakuru-Kisumu Highway', type: 'Breakdown', severity: 'moderate', description: 'Engine overheating. Coolant leak detected. Towed to nearest garage.', injuries: false, policeCaseNo: null, insuranceClaim: false, estimatedCost: 28000, status: 'resolved' },
  { id: 'INC-003', vehicleId: 'V006', vehicleReg: 'KDG 445F', driverName: 'Moses Wafula', date: '2026-04-02', location: 'Uhuru Highway, Nairobi', type: 'Traffic Offence', severity: 'minor', description: 'Speeding ticket — 82km/h in 50km/h zone.', injuries: false, policeCaseNo: null, insuranceClaim: false, estimatedCost: 10000, status: 'closed' },
  { id: 'INC-004', vehicleId: 'V008', vehicleReg: 'KDJ 991H', driverName: 'Henry Sang', date: '2026-01-15', location: 'Nairobi — Thika Superhighway', type: 'Accident', severity: 'major', description: 'Head-on collision. Vehicle written off. Driver sustained injuries.', injuries: true, policeCaseNo: 'OB/12/2026', insuranceClaim: true, estimatedCost: 2500000, status: 'investigating' },
];
