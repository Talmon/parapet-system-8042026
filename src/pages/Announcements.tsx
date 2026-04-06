import { useState } from 'react';
import { announcements, Announcement } from '@/data/hrData';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';

export default function Announcements() {
  const [items, setItems] = useState<Announcement[]>(announcements);
  const [showNew, setShowNew] = useState(false);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={() => setShowNew(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
          <Plus size={16} /> New Announcement
        </button>
      </div>

      <div className="space-y-4">
        {items.map(a => (
          <div key={a.id} className="bg-card rounded-lg border p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={a.priority === 'high' ? 'badge-rejected' : a.priority === 'medium' ? 'badge-pending' : 'badge-active'}>{a.priority}</span>
                  <span className="badge-info">{a.category}</span>
                </div>
                <h3 className="font-semibold text-lg">{a.title}</h3>
              </div>
              <span className="text-xs text-muted-foreground">{a.date}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{a.content}</p>
            <p className="text-xs text-muted-foreground">Posted by {a.author}</p>
          </div>
        ))}
      </div>

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-card rounded-lg border p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4"><h3 className="font-semibold">New Announcement</h3><button onClick={() => setShowNew(false)}><X size={20} /></button></div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div><label className="text-sm font-medium">Title</label><input name="title" required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              <div><label className="text-sm font-medium">Content</label><textarea name="content" rows={3} required className="w-full mt-1 px-3 py-2 rounded-md border text-sm" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium">Priority</label>
                  <select name="priority" className="w-full mt-1 px-3 py-2 rounded-md border text-sm"><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select>
                </div>
                <div><label className="text-sm font-medium">Category</label>
                  <select name="category" className="w-full mt-1 px-3 py-2 rounded-md border text-sm"><option>General</option><option>Payroll</option><option>Compliance</option><option>IT</option><option>Wellness</option></select>
                </div>
              </div>
              <button type="submit" className="w-full py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">Publish</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
