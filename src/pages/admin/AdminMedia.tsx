import { useEffect, useState } from 'react';
import { Upload, Trash2, Copy, Check, FolderPlus, X } from 'lucide-react';
import { AdminHeader, EmptyState } from '@/components/admin/AdminUI';
import { fetchMedia, deleteMedia, renameMedia } from '@/lib/api';
import { optimizeAndUpload } from '@/lib/image';
import { supabase, MEDIA_BUCKET } from '@/lib/supabase';
import { useToast } from '@/lib/toast';
import type { MediaItem } from '@/types/database';

export default function AdminMedia() {
  const toast = useToast();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [activeFolder, setActiveFolder] = useState('all');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [newFolder, setNewFolder] = useState('');
  const [renaming, setRenaming] = useState<MediaItem | null>(null);

  useEffect(() => {
    load();
  }, []);

  function load() {
    setLoading(true);
    fetchMedia()
      .then((m) => {
        setItems(m);
        setFolders(['all', ...Array.from(new Set(m.map((x) => x.folder)))]);
      })
      .finally(() => setLoading(false));
  }

  const getMediaUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
      return path;
    }
    return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
  };

  async function handleUpload(files: FileList) {
    setUploading((u) => u + files.length);
    for (const f of Array.from(files)) {
      try {
        await optimizeAndUpload(f, activeFolder === 'all' ? 'general' : activeFolder);
      } catch (err) {
        toast((err as Error).message, 'error');
      }
      setUploading((u) => u - 1);
    }
    toast('Upload complete');
    load();
  }

  async function remove(item: MediaItem) {
    if (!confirm('Delete this image?')) return;
    try {
      await deleteMedia(item.id, item.path);
      setItems((m) => m.filter((x) => x.id !== item.id));
      toast('Image deleted');
    } catch (err) {
      toast((err as Error).message, 'error');
    }
  }

  async function copyUrl(url: string, id: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(id);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // ignore
    }
  }

  async function saveRename() {
    if (!renaming) return;
    try {
      await renameMedia(renaming.id, renaming.name, renaming.alt ?? '');
      setItems((m) => m.map((x) => (x.id === renaming.id ? renaming : x)));
      toast('Renamed');
      setRenaming(null);
    } catch (err) {
      toast((err as Error).message, 'error');
    }
  }

  const visible = activeFolder === 'all' ? items : items.filter((x) => x.folder === activeFolder);

  return (
    <div>
      <AdminHeader title="Media Library" subtitle="Upload, organise and manage all your images." />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <label className="btn-primary cursor-pointer">
          <Upload className="h-4 w-4" /> {uploading > 0 ? `Uploading ${uploading}...` : 'Upload Images'}
          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleUpload(e.target.files)} />
        </label>
        <div className="flex items-center gap-2">
          <input value={newFolder} onChange={(e) => setNewFolder(e.target.value)} placeholder="New folder name" className="input w-48 py-2" />
          <button
            onClick={() => {
              if (newFolder.trim()) {
                setFolders((f) => [...new Set([...f, newFolder.trim()])]);
                setActiveFolder(newFolder.trim());
                setNewFolder('');
              }
            }}
            className="btn-outline"
          >
            <FolderPlus className="h-4 w-4" /> Add
          </button>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {folders.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFolder(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeFolder === f ? 'bg-ink-900 text-white' : 'bg-white text-ink-600 ring-1 ring-ink-200 hover:bg-ink-50'
            }`}
          >
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{Array.from({ length: 10 }).map((_, i) => <div key={i} className="skeleton aspect-square rounded-2xl" />)}</div>
      ) : visible.length === 0 ? (
        <EmptyState message="No images in this folder yet." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {visible.map((m) => {
            const mediaUrl = getMediaUrl(m.path);
            return (
              <div key={m.id} className="card overflow-hidden">
                <div className="relative aspect-square bg-ink-100">
                  <img src={mediaUrl} alt={m.alt ?? m.name} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-medium text-ink-900">{m.name}</p>
                  <p className="text-xs text-ink-400">{m.folder} · {m.width}×{m.height}</p>
                  <div className="mt-2 flex items-center gap-1">
                    <button onClick={() => copyUrl(mediaUrl, m.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 hover:bg-ink-100" aria-label="Copy URL">
                      {copied === m.id ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                    <button onClick={() => setRenaming(m)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 hover:bg-ink-100" aria-label="Rename">✎</button>
                    <button onClick={() => remove(m)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {renaming && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-lift">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-lg font-medium">Rename Image</h3>
              <button onClick={() => setRenaming(null)} aria-label="Close"><X className="h-5 w-5 text-ink-500" /></button>
            </div>
            <div className="space-y-3">
              <input value={renaming.name} onChange={(e) => setRenaming({ ...renaming, name: e.target.value })} className="input" placeholder="Name" />
              <input value={renaming.alt ?? ''} onChange={(e) => setRenaming({ ...renaming, alt: e.target.value })} className="input" placeholder="Alt text" />
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setRenaming(null)} className="btn-ghost">Cancel</button>
              <button onClick={saveRename} className="btn-primary">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
