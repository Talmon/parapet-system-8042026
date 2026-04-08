import { Upload, FileText, CheckCircle, AlertTriangle, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import ProcessGuide from '@/components/ProcessGuide';
import { useAuth } from '@/contexts/AuthContext';

const bulkUploadWorkflowSteps = [
  { step: 1, title: 'Download Template', who: 'HR Manager', description: 'Download the official Parapet HRMIS template (Excel or CSV) to ensure correct column formatting.' },
  { step: 2, title: 'Prepare Data', who: 'HR Manager', description: 'Fill in employee data following the template guide. Validate mandatory fields: name, ID, department, job title, gross pay.' },
  { step: 3, title: 'Upload File', who: 'HR Manager', description: 'Upload the completed file. The system validates format, checks for duplicates, and flags errors.' },
  { step: 4, title: 'Review Validation Results', who: 'HR Manager', description: 'Review any validation errors or warnings flagged by the system before proceeding.' },
  { step: 5, title: 'Confirm & Import', who: 'Admin', description: 'After reviewing, admin confirms the import. Records are created/updated in HRMIS.', branch: { condition: 'Validation passed', yes: 'Records imported successfully', no: 'Fix errors and re-upload' } },
  { step: 6, title: 'Post-Import Verification', who: 'HR Manager', description: 'Spot-check imported records to confirm accuracy. Run a post-import report.' },
];

export default function BulkUpload() {
  const { hasRole } = useAuth();
  const [uploadStep, setUploadStep] = useState<'idle' | 'uploading' | 'validating' | 'done'>('idle');

  const handleUpload = () => {
    setUploadStep('uploading');
    setTimeout(() => { setUploadStep('validating'); }, 800);
    setTimeout(() => { setUploadStep('done'); toast.success('File processed successfully — 47 records imported, 2 warnings'); }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ProcessGuide
        title="Bulk Upload"
        description="6-step process for bulk importing employee data"
        steps={bulkUploadWorkflowSteps}
        tips={[
          'Always use the official template to avoid import errors.',
          'Mandatory fields: Full Name, Email, Department, Job Title, Gross Pay.',
          'Duplicate employee IDs will be rejected — check before uploading.',
          'Maximum 1,000 records per upload batch.',
          'Run a post-import spot check on at least 10% of records.',
        ]}
      />

      <div className="bg-card rounded-lg border p-8 text-center">
        <div className={`h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 ${uploadStep === 'done' ? 'bg-green-100' : 'bg-muted'}`}>
          {uploadStep === 'done' ? <CheckCircle size={28} className="text-green-600" /> : uploadStep === 'uploading' || uploadStep === 'validating' ? <div className="h-7 w-7 border-4 border-primary border-t-transparent rounded-full animate-spin" /> : <Upload size={28} className="text-muted-foreground" />}
        </div>
        <h3 className="font-semibold text-lg mb-2">
          {uploadStep === 'idle' && 'Upload Employee Data'}
          {uploadStep === 'uploading' && 'Uploading...'}
          {uploadStep === 'validating' && 'Validating Records...'}
          {uploadStep === 'done' && 'Import Complete!'}
        </h3>
        <p className="text-muted-foreground text-sm mb-6">
          {uploadStep === 'done' ? '47 records imported successfully · 2 warnings (duplicate emails)' : 'Upload a CSV or Excel file to bulk import employee records, leave balances, or attendance data.'}
        </p>

        {uploadStep === 'idle' && (
          <div className="border-2 border-dashed rounded-lg p-8 mb-4 hover:border-primary/50 cursor-pointer transition-colors" onClick={handleUpload}>
            <p className="text-sm text-muted-foreground">Drag & drop your file here, or click to browse</p>
            <p className="text-xs text-muted-foreground mt-1">Supported: .csv, .xlsx (max 10MB)</p>
          </div>
        )}

        {uploadStep === 'done' && (
          <div className="mb-4 space-y-2">
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700"><CheckCircle size={16} /> 47 records imported</div>
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700"><AlertTriangle size={16} /> 2 warnings: duplicate email addresses</div>
            <button onClick={() => setUploadStep('idle')} className="w-full py-2 rounded-md border text-sm mt-2">Upload Another File</button>
          </div>
        )}

        <div className="text-left space-y-2">
          <h4 className="font-medium text-sm flex items-center gap-2"><Download size={14} /> Download Templates:</h4>
          <button onClick={() => toast.success('Template downloaded')} className="text-sm text-primary hover:underline block flex items-center gap-1.5"><FileText size={13} /> Employee Import Template (.csv)</button>
          <button onClick={() => toast.success('Template downloaded')} className="text-sm text-primary hover:underline block flex items-center gap-1.5"><FileText size={13} /> Leave Balance Template (.csv)</button>
          <button onClick={() => toast.success('Template downloaded')} className="text-sm text-primary hover:underline block flex items-center gap-1.5"><FileText size={13} /> Attendance Import Template (.csv)</button>
        </div>
      </div>
    </div>
  );
}
