import { useState } from 'react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState('Parapet Ltd');
  const [currency, setCurrency] = useState('KES');
  const [payDay, setPayDay] = useState('25');

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-card rounded-lg border p-6">
        <h3 className="font-semibold mb-4">Company Settings</h3>
        <div className="space-y-4">
          <div><label className="text-sm font-medium">Company Name</label><input value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-medium">Currency</label>
              <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-md border text-sm">
                <option value="KES">KES - Kenya Shilling</option><option value="USD">USD - US Dollar</option><option value="EUR">EUR - Euro</option>
              </select>
            </div>
            <div><label className="text-sm font-medium">Pay Day</label>
              <select value={payDay} onChange={e => setPayDay(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-md border text-sm">
                {Array.from({ length: 28 }, (_, i) => <option key={i + 1} value={String(i + 1)}>{i + 1}th</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h3 className="font-semibold mb-4">Statutory Rates</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-sm font-medium">SHIF Rate (%)</label><input defaultValue="2.75" className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
          <div><label className="text-sm font-medium">NSSF Rate (%)</label><input defaultValue="6" className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
          <div><label className="text-sm font-medium">Housing Levy (%)</label><input defaultValue="1.5" className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
          <div><label className="text-sm font-medium">WHT Consultants (%)</label><input defaultValue="5" className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h3 className="font-semibold mb-4">Leave Policy</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-sm font-medium">Annual Leave (days)</label><input defaultValue="21" className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
          <div><label className="text-sm font-medium">Sick Leave (days)</label><input defaultValue="10" className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
          <div><label className="text-sm font-medium">Maternity Leave (days)</label><input defaultValue="90" className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
          <div><label className="text-sm font-medium">Paternity Leave (days)</label><input defaultValue="14" className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
        </div>
      </div>

      <button onClick={handleSave} className="w-full py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Save Settings</button>
    </div>
  );
}
