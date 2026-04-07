import { useState } from 'react';
import { FileText, FolderOpen, Upload, Download, Search, Plus, Trash2, Eye, X, File, Image, FileSpreadsheet, FilePlus } from 'lucide-react';
import { toast } from 'sonner';

interface Document {
  id: string;
  name: string;
  category: string;
  type: 'PDF' | 'DOCX' | 'XLSX' | 'PNG' | 'JPG' | 'CSV' | 'PPTX' | 'TXT';
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  department: string;
  tags: string[];
  description: string;
}

const categories = [
  'All Documents', 'Policies & Procedures', 'Contracts & Agreements', 'Employee Records',
  'Compliance & Legal', 'Financial Reports', 'Templates', 'Training Materials',
];

const initialDocs: Document[] = [
  { id: 'D001', name: 'Employee Handbook 2026.pdf', category: 'Policies & Procedures', type: 'PDF', size: '4.2 MB', uploadedBy: 'HR Admin', uploadedAt: '2026-01-15', department: 'HR', tags: ['policy', 'handbook'], description: 'Official employee handbook for FY 2026' },
  { id: 'D002', name: 'Annual Leave Policy.pdf', category: 'Policies & Procedures', type: 'PDF', size: '1.1 MB', uploadedBy: 'HR Admin', uploadedAt: '2026-01-10', department: 'HR', tags: ['leave', 'policy'], description: 'Company annual leave policy document' },
  { id: 'D003', name: 'Employment Contract Template.docx', category: 'Templates', type: 'DOCX', size: '245 KB', uploadedBy: 'Legal Team', uploadedAt: '2025-11-20', department: 'Legal', tags: ['template', 'contract'], description: 'Standard employment contract template' },
  { id: 'D004', name: 'Q1 2026 Financial Report.xlsx', category: 'Financial Reports', type: 'XLSX', size: '3.8 MB', uploadedBy: 'Finance Manager', uploadedAt: '2026-04-01', department: 'Finance', tags: ['finance', 'quarterly'], description: 'First quarter financial performance report' },
  { id: 'D005', name: 'OSHA Compliance Certificate.pdf', category: 'Compliance & Legal', type: 'PDF', size: '890 KB', uploadedBy: 'Compliance Officer', uploadedAt: '2026-02-28', department: 'Legal', tags: ['compliance', 'safety'], description: 'Occupational safety and health compliance certificate' },
  { id: 'D006', name: 'IT Security Policy.pdf', category: 'Policies & Procedures', type: 'PDF', size: '2.3 MB', uploadedBy: 'IT Admin', uploadedAt: '2026-03-01', department: 'IT', tags: ['security', 'IT', 'policy'], description: 'Information security and acceptable use policy' },
  { id: 'D007', name: 'Payroll Summary Apr 2026.xlsx', category: 'Financial Reports', type: 'XLSX', size: '5.1 MB', uploadedBy: 'Payroll Manager', uploadedAt: '2026-04-05', department: 'Finance', tags: ['payroll', 'monthly'], description: 'April 2026 payroll summary for all employees' },
  { id: 'D008', name: 'NDA Template.docx', category: 'Templates', type: 'DOCX', size: '180 KB', uploadedBy: 'Legal Team', uploadedAt: '2025-09-15', department: 'Legal', tags: ['template', 'NDA', 'legal'], description: 'Non-disclosure agreement template' },
  { id: 'D009', name: 'Fire Safety Training.pptx', category: 'Training Materials', type: 'PPTX', size: '12.4 MB', uploadedBy: 'Safety Officer', uploadedAt: '2026-01-20', department: 'Admin', tags: ['training', 'safety'], description: 'Fire safety and emergency evacuation training slides' },
  { id: 'D010', name: 'Company Org Chart.png', category: 'Employee Records', type: 'PNG', size: '1.6 MB', uploadedBy: 'HR Admin', uploadedAt: '2026-03-15', department: 'HR', tags: ['org-chart', 'structure'], description: 'Current organizational structure chart' },
  { id: 'D011', name: 'KRA Compliance Report.pdf', category: 'Compliance & Legal', type: 'PDF', size: '3.2 MB', uploadedBy: 'Tax Manager', uploadedAt: '2026-03-31', department: 'Finance', tags: ['tax', 'KRA', 'compliance'], description: 'Kenya Revenue Authority compliance filing report' },
  { id: 'D012', name: 'Vendor Contracts Master.xlsx', category: 'Contracts & Agreements', type: 'XLSX', size: '2.7 MB', uploadedBy: 'Procurement', uploadedAt: '2026-02-10', department: 'Procurement', tags: ['vendor', 'contract'], description: 'Master list of all active vendor contracts' },
];

const typeIcons: Record<string, React.ReactNode> = {
  'PDF': <FileText size={18} className="text-red-500" />,
  'DOCX': <File size={18} className="text-blue-500" />,
  'XLSX': <FileSpreadsheet size={18} className="text-green-600" />,
  'CSV': <FileSpreadsheet size={18} className="text-green-600" />,
  'PNG': <Image size={18} className="text-purple-500" />,
  'JPG': <Image size={18} className="text-purple-500" />,
  'PPTX': <FilePlus size={18} className="text-orange-500" />,
  'TXT': <FileText size={18} className="text-muted-foreground" />,
};

export default function DocumentHub() {
  const [docs, setDocs] = useState<Document[]>(initialDocs);
  const [activeCategory, setActiveCategory] = useState('All Documents');
  const [search, setSearch] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadForm, setUploadForm] = useState({ name: '', category: 'Policies & Procedures', type: 'PDF' as Document['type'], department: '', description: '', tags: '' });

  const filtered = docs.filter(d => {
    const matchCat = activeCategory === 'All Documents' || d.category === activeCategory;
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const stats = {
    total: docs.length,
    policies: docs.filter(d => d.category === 'Policies & Procedures').length,
    contracts: docs.filter(d => d.category === 'Contracts & Agreements' || d.category === 'Compliance & Legal').length,
    templates: docs.filter(d => d.category === 'Templates').length,
  };

  const handleUpload = () => {
    if (!uploadForm.name) { toast.error('Please provide a file name'); return; }
    const newDoc: Document = {
      id: `D${String(docs.length + 1).padStart(3, '0')}`,
      name: uploadForm.name,
      category: uploadForm.category,
      type: uploadForm.type,
      size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
      uploadedBy: 'HR Admin',
      uploadedAt: new Date().toISOString().split('T')[0],
      department: uploadForm.department || 'HR',
      tags: uploadForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      description: uploadForm.description,
    };
    setDocs([newDoc, ...docs]);
    setShowUpload(false);
    setUploadForm({ name: '', category: 'Policies & Procedures', type: 'PDF', department: '', description: '', tags: '' });
    toast.success('Document uploaded successfully');
  };

  const handleDelete = (id: string) => {
    setDocs(docs.filter(d => d.id !== id));
    toast.success('Document deleted');
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card"><div><p className="stat-label">Total Documents</p><p className="stat-value">{stats.total}</p></div><FolderOpen size={22} className="text-muted-foreground" /></div>
        <div className="stat-card cursor-pointer" onClick={() => setActiveCategory('Policies & Procedures')}><div><p className="stat-label">Policies</p><p className="stat-value">{stats.policies}</p></div><FileText size={22} className="text-blue-600" /></div>
        <div className="stat-card cursor-pointer" onClick={() => setActiveCategory('Contracts & Agreements')}><div><p className="stat-label">Contracts & Compliance</p><p className="stat-value">{stats.contracts}</p></div><File size={22} className="text-amber-600" /></div>
        <div className="stat-card cursor-pointer" onClick={() => setActiveCategory('Templates')}><div><p className="stat-label">Templates</p><p className="stat-value">{stats.templates}</p></div><FilePlus size={22} className="text-green-600" /></div>
      </div>

      {/* Search & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents or tags..." className="w-full pl-9 pr-3 py-2 rounded-md border text-sm bg-card" />
        </div>
        <button onClick={() => setShowUpload(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
          <Upload size={16} /> Upload Document
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(c => (
          <button key={c} onClick={() => setActiveCategory(c)} className={`px-3 py-1.5 rounded-md text-sm font-medium border ${activeCategory === c ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-muted'}`}>{c}</button>
        ))}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-card rounded-lg border p-6 w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Upload Document</h3>
              <button onClick={() => setShowUpload(false)}><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <div><label className="text-sm font-medium">File Name *</label><input value={uploadForm.name} onChange={e => setUploadForm({...uploadForm, name: e.target.value})} placeholder="e.g. Leave Policy 2026.pdf" className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium">Category</label>
                  <select value={uploadForm.category} onChange={e => setUploadForm({...uploadForm, category: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-md border text-sm">
                    {categories.filter(c => c !== 'All Documents').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div><label className="text-sm font-medium">File Type</label>
                  <select value={uploadForm.type} onChange={e => setUploadForm({...uploadForm, type: e.target.value as Document['type']})} className="w-full mt-1 px-3 py-2 rounded-md border text-sm">
                    {['PDF','DOCX','XLSX','CSV','PNG','JPG','PPTX','TXT'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="text-sm font-medium">Department</label><input value={uploadForm.department} onChange={e => setUploadForm({...uploadForm, department: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              <div><label className="text-sm font-medium">Description</label><textarea value={uploadForm.description} onChange={e => setUploadForm({...uploadForm, description: e.target.value})} rows={2} className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              <div><label className="text-sm font-medium">Tags (comma-separated)</label><input value={uploadForm.tags} onChange={e => setUploadForm({...uploadForm, tags: e.target.value})} placeholder="e.g. policy, HR, 2026" className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>

              <div className="border-2 border-dashed rounded-lg p-6 text-center text-muted-foreground">
                <Upload size={32} className="mx-auto mb-2" />
                <p className="text-sm">Drag & drop file here or click to browse</p>
                <p className="text-xs mt-1">Max 20MB · PDF, DOCX, XLSX, PNG, JPG, PPTX</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => setShowUpload(false)} className="px-4 py-2 rounded-md border text-sm">Cancel</button>
              <button onClick={handleUpload} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">Upload</button>
            </div>
          </div>
        </div>
      )}

      {/* Document List */}
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/50">
              <th className="text-left py-3 px-4 font-medium">Document</th>
              <th className="text-left py-3 px-4 font-medium">Category</th>
              <th className="text-left py-3 px-4 font-medium">Department</th>
              <th className="text-left py-3 px-4 font-medium">Size</th>
              <th className="text-left py-3 px-4 font-medium">Uploaded By</th>
              <th className="text-left py-3 px-4 font-medium">Date</th>
              <th className="text-left py-3 px-4 font-medium">Tags</th>
              <th className="text-center py-3 px-4 font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id} className="border-b hover:bg-muted/30">
                  <td className="py-3 px-4"><div className="flex items-center gap-2">{typeIcons[d.type]}<div><p className="font-medium">{d.name}</p><p className="text-xs text-muted-foreground">{d.description}</p></div></div></td>
                  <td className="py-3 px-4">{d.category}</td>
                  <td className="py-3 px-4">{d.department}</td>
                  <td className="py-3 px-4">{d.size}</td>
                  <td className="py-3 px-4">{d.uploadedBy}</td>
                  <td className="py-3 px-4">{d.uploadedAt}</td>
                  <td className="py-3 px-4"><div className="flex flex-wrap gap-1">{d.tags.map(t => <span key={t} className="px-1.5 py-0.5 rounded bg-muted text-xs">{t}</span>)}</div></td>
                  <td className="py-3 px-4"><div className="flex items-center justify-center gap-2">
                    <button className="p-1 hover:bg-muted rounded" title="View"><Eye size={16} /></button>
                    <button className="p-1 hover:bg-muted rounded" title="Download" onClick={() => toast.success(`Downloading ${d.name}`)}><Download size={16} /></button>
                    <button className="p-1 hover:bg-muted rounded text-destructive" title="Delete" onClick={() => handleDelete(d.id)}><Trash2 size={16} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="p-8 text-center text-muted-foreground">No documents found</div>}
      </div>
    </div>
  );
}
