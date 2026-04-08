import { useState } from 'react';
import { announcements, Announcement } from '@/data/hrData';
import { Plus, X, Pencil, Trash2, Eye, Megaphone, Bell, Tag } from 'lucide-react';
import { toast } from 'sonner';
import ProcessGuide from '@/components/ProcessGuide';
import { useAuth } from '@/contexts/AuthContext';

const announcementWorkflowSteps = [
  { step: 1, title: 'Draft Announcement', who: 'HR Manager', description: 'HR or Admin drafts the announcement with title, content, category, and priority level.' },
  { step: 2, title: 'Review & Approval', who: 'Admin', description: 'For urgent or policy announcements, a senior manager reviews the content before publishing.' },
  { step: 3, title: 'Publish to HRMIS', who: 'HR Manager', description: 'Announcement is published on the HRMIS portal, visible to all relevant employees.' },
  { step: 4, title: 'Notification Sent', who: 'System', description: 'System sends push/email notifications to employees based on target audience.' },
  { step: 5, title: 'Employee Acknowledgement', who: 'Employee', description: 'Employees read and acknowledge critical announcements (policy changes, compliance notices).' },
  { step: 6, title: 'Archive', who: 'System', description: 'Announcements are archived after their validity period for record keeping.' },
];

export default function Announcements() {
  const { hasRole, user } = useAuth();
  const canManage = hasRole('admin', 'hr_manager');
  const [items, setItems] = useState<Announcement[]>(announcements);
  const [showNew, setShowNew] = useState(false);
  const [editItem, setEditItem] = useState<Announcement | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<Announcement | null>(null);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newAnn: Announcement = {
      id: `ANN-${String(items.length + 1).padStart(3, '0')}`,
      title: fd.get('title') as string,
      content: fd.get('content') as string,
      author: 'HR Admin',
      date: new Date().toISOString().split('T')[0],
      priority: fd.get('priority') as Announcement['priority'],
      category: fd.get('category') as string,
    };
    setItems(prev => [newAnn, ...prev]);
    setShowNew(false);
    toast.success('Announcement published');
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editItem) return;
    const fd = new FormData(e.currentTarget);
    setItems(prev => prev.map(a => a.id === editItem.id ? { ...a, title: fd.get('title') as string, content: fd.get('content') as string, priority: fd.get('priority') as Announcement['priority'], category: fd.get('category') as string } : a));
    setEditItem(null);
    toast.success('Announcement updated');
  };

  return (
    <div className="space-y-6">
      <ProcessGuide
        title="Announcements"
        description="6-step process from draft to publication and archival"
        steps={announcementWorkflowSteps}
        tips={[
          'High priority announcements require manager approval before publishing.',
          'Compliance announcements must be acknowledged by all employees.',
          'Use categories to target the right audience.',
          'Schedule announcements for off-peak hours for maximum visibility.',
        ]}
      />

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {['All', 'high', 'medium', 'low'].map(p => (
            <button key={p} className="text-xs px-3 py-1.5 rounded-full border hover:bg-muted capitalize font-medium">{p === 'All' ? 'All' : p + ' Priority'}</button>
          ))}
        </div>
        {canManage && (
          <button onClick={() => setShowNew(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
            <Plus size={16} /> New Announcement
          </button>
        )}
      </div>

      <div className="space-y-4">
        {items.map(a => (
          <div key={a.id} className="bg-card rounded-lg border p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={a.priority === 'high' ? 'badge-rejected' : a.priority === 'medium' ? 'badge-pending' : 'badge-active'}>{a.priority}</span>
                  <span className="badge-info">{a.category}</span>
                </div>
                <h3 className="font-semibold text-lg">{a.title}</h3>
              </div>
              <div className="flex items-center gap-2 ml-4 shrink-0">
                <span className="text-xs text-muted-foreground">{a.date}</span>
                <button onClick={() => setViewItem(a)} className="p-1 hover:bg-muted rounded"><Eye size={15} className="text-muted-foreground" /></button>
                {canManage && <button onClick={() => setEditItem(a)} className="p-1 hover:bg-muted rounded"><Pencil size={15} className="text-muted-foreground" /></button>}
                {canManage && <button onClick={() => setDeleteConfirm(a.id)} className="p-1 hover:bg-destructive/10 rounded"><Trash2 size={15} className="text-destructive" /></button>}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{a.content}</p>
            <p className="text-xs text-muted-foreground">Posted by {a.author}</p>
          </div>
        ))}
      </div>

      {(showNew || editItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-card rounded-lg border p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{editItem ? 'Edit Announcement' : 'New Announcement'}</h3>
              <button onClick={() => { setShowNew(false); setEditItem(null); }}><X size={20} /></button>
            </div>
            <form onSubmit={editItem ? handleEdit : handleCreate} className="space-y-4">
              <div><label className="text-sm font-medium">Title</label><input name="title" defaultValue={editItem?.title} required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              <div><label className="text-sm font-medium">Content</label><textarea name="content" defaultValue={editItem?.content} rows={3} required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium">Priority</label>
                  <select name="priority" defaultValue={editItem?.priority} className="w-full mt-1 px-3 py-2 rounded-md border text-sm"><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select>
                </div>
                <div><label className="text-sm font-medium">Category</label>
                  <select name="category" defaultValue={editItem?.category} className="w-full mt-1 px-3 py-2 rounded-md border text-sm"><option>General</option><option>Payroll</option><option>Compliance</option><option>IT</option><option>Wellness</option></select>
                </div>
              </div>
              <button type="submit" className="w-full py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">{editItem ? 'Save Changes' : 'Publish'}</button>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-card rounded-lg border p-6 w-full max-w-sm text-center">
            <Trash2 size={32} className="text-destructive mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Delete Announcement?</h3>
            <p className="text-sm text-muted-foreground mb-4">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2 rounded-md border text-sm">Cancel</button>
              <button onClick={() => { setItems(prev => prev.filter(a => a.id !== deleteConfirm)); setDeleteConfirm(null); toast.success('Deleted'); }} className="flex-1 px-4 py-2 rounded-md bg-destructive text-destructive-foreground text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}

      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-card rounded-lg border p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">Announcement</h3><button onClick={() => setViewItem(null)}><X size={20}/></button></div>
            <div className="flex items-center gap-2 mb-3">
              <span className={viewItem.priority === 'high' ? 'badge-rejected' : viewItem.priority === 'medium' ? 'badge-pending' : 'badge-active'}>{viewItem.priority}</span>
              <span className="badge-info">{viewItem.category}</span>
            </div>
            <h2 className="text-xl font-semibold mb-3">{viewItem.title}</h2>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{viewItem.content}</p>
            <p className="text-xs text-muted-foreground">Posted by {viewItem.author} on {viewItem.date}</p>
          </div>
        </div>
      )}
    </div>
  );
}
