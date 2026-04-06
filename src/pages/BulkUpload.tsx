import { Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function BulkUpload() {
  const handleUpload = () => {
    toast.success('File upload simulation — in production this would process your CSV/Excel file');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-card rounded-lg border p-8 text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Upload size={28} className="text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg mb-2">Upload Employee Data</h3>
        <p className="text-muted-foreground text-sm mb-6">Upload a CSV or Excel file to bulk import employee records, leave balances, or attendance data.</p>
        <div className="border-2 border-dashed rounded-lg p-8 mb-4 hover:border-primary/50 cursor-pointer transition-colors" onClick={handleUpload}>
          <p className="text-sm text-muted-foreground">Drag & drop your file here, or click to browse</p>
          <p className="text-xs text-muted-foreground mt-1">Supported: .csv, .xlsx (max 10MB)</p>
        </div>
        <div className="text-left space-y-2">
          <h4 className="font-medium text-sm">Available Templates:</h4>
          <button className="text-sm text-info hover:underline block">📄 Employee Import Template (.csv)</button>
          <button className="text-sm text-info hover:underline block">📄 Leave Balance Template (.csv)</button>
          <button className="text-sm text-info hover:underline block">📄 Attendance Import Template (.csv)</button>
        </div>
      </div>
    </div>
  );
}
