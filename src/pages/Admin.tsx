import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, Bell, Image, Mail, LogOut, Plus, Trash2, Edit2, 
  Eye, EyeOff, Menu, X, Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { notices as initialNotices, galleryImages as initialGallery, contactMessages as initialMessages, Notice, GalleryImage, ContactMessage } from '@/data/mockData';

type AdminTab = 'notices' | 'gallery' | 'messages';

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<AdminTab>('notices');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  // State for managing data
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [gallery, setGallery] = useState<GalleryImage[]>(initialGallery);
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);

  // Edit states
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [newNotice, setNewNotice] = useState({ title: '', isNew: true });
  const [newImage, setNewImage] = useState({ src: '', alt: '', category: '' });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate('/');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder authentication - Backend integration point
    if (loginData.username && loginData.password) {
      setIsAuthenticated(true);
      toast({ title: 'Welcome!', description: 'You have logged in successfully.' });
    }
  };

  const tabs = [
    { id: 'notices' as AdminTab, label: 'Notices', icon: Bell, count: notices.length },
    { id: 'gallery' as AdminTab, label: 'Gallery', icon: Image, count: gallery.length },
    { id: 'messages' as AdminTab, label: 'Messages', icon: Mail, count: messages.filter(m => !m.isRead).length },
  ];

  // Notice Management
  const addNotice = () => {
    if (!newNotice.title.trim()) return;
    const notice: Notice = {
      id: Date.now().toString(),
      title: newNotice.title,
      date: new Date().toISOString().split('T')[0],
      isNew: newNotice.isNew,
    };
    setNotices([notice, ...notices]);
    setNewNotice({ title: '', isNew: true });
    toast({ title: 'Notice Added', description: 'New notice has been published.' });
  };

  const updateNotice = () => {
    if (!editingNotice) return;
    setNotices(notices.map(n => n.id === editingNotice.id ? editingNotice : n));
    setEditingNotice(null);
    toast({ title: 'Notice Updated', description: 'Notice has been updated successfully.' });
  };

  const deleteNotice = (id: string) => {
    setNotices(notices.filter(n => n.id !== id));
    toast({ title: 'Notice Deleted', description: 'Notice has been removed.' });
  };

  // Gallery Management
  const addImage = () => {
    if (!newImage.src.trim() || !newImage.alt.trim()) return;
    const image: GalleryImage = {
      id: Date.now().toString(),
      src: newImage.src,
      alt: newImage.alt,
      category: newImage.category || 'General',
      date: new Date().toISOString().split('T')[0],
    };
    setGallery([image, ...gallery]);
    setNewImage({ src: '', alt: '', category: '' });
    toast({ title: 'Image Added', description: 'New image has been added to gallery.' });
  };

  const deleteImage = (id: string) => {
    setGallery(gallery.filter(img => img.id !== id));
    toast({ title: 'Image Deleted', description: 'Image has been removed from gallery.' });
  };

  // Message Management
  const toggleMessageRead = (id: string) => {
    setMessages(messages.map(m => m.id === id ? { ...m, isRead: !m.isRead } : m));
  };

  const deleteMessage = (id: string) => {
    setMessages(messages.filter(m => m.id !== id));
    toast({ title: 'Message Deleted', description: 'Message has been removed.' });
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground mt-2">The Rising English Secondary Boarding School</p>
          </div>

          <form onSubmit={handleLogin} className="bg-card rounded-xl p-8 shadow-school">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter username"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full mt-6">
              Login
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd> to go back
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={cn(
        'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform duration-300',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              {isSidebarOpen && (
                <div>
                  <h2 className="font-heading font-bold text-foreground">Admin</h2>
                  <p className="text-xs text-muted-foreground">TRESBS</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <tab.icon className="w-5 h-5" />
                {isSidebarOpen && (
                  <>
                    <span className="flex-1 text-left">{tab.label}</span>
                    {tab.count > 0 && (
                      <span className={cn(
                        'px-2 py-0.5 rounded-full text-xs font-medium',
                        activeTab === tab.id ? 'bg-primary-foreground/20' : 'bg-primary/10 text-primary'
                      )}>
                        {tab.count}
                      </span>
                    )}
                  </>
                )}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={() => navigate('/')}
            >
              <Home className="w-5 h-5" />
              {isSidebarOpen && 'Back to Site'}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-destructive hover:text-destructive"
              onClick={() => setIsAuthenticated(false)}
            >
              <LogOut className="w-5 h-5" />
              {isSidebarOpen && 'Logout'}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <h1 className="font-heading text-xl font-bold text-foreground capitalize">
                {activeTab} Management
              </h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* Notices Tab */}
          {activeTab === 'notices' && (
            <div className="space-y-6">
              {/* Add Notice Form */}
              <div className="bg-card rounded-xl p-6 shadow-md">
                <h3 className="font-semibold text-foreground mb-4">Add New Notice</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    placeholder="Enter notice title..."
                    value={newNotice.title}
                    onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                    className="flex-1"
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={newNotice.isNew}
                      onChange={(e) => setNewNotice({ ...newNotice, isNew: e.target.checked })}
                      className="rounded border-border"
                    />
                    Mark as New
                  </label>
                  <Button onClick={addNotice}>
                    <Plus className="w-4 h-4" />
                    Add Notice
                  </Button>
                </div>
              </div>

              {/* Edit Notice Modal */}
              {editingNotice && (
                <div className="bg-card rounded-xl p-6 shadow-md border-2 border-primary">
                  <h3 className="font-semibold text-foreground mb-4">Edit Notice</h3>
                  <div className="space-y-4">
                    <Input
                      value={editingNotice.title}
                      onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })}
                    />
                    <div className="flex gap-4">
                      <Button onClick={updateNotice}>Save Changes</Button>
                      <Button variant="outline" onClick={() => setEditingNotice(null)}>Cancel</Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notices List */}
              <div className="bg-card rounded-xl shadow-md overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">All Notices ({notices.length})</h3>
                </div>
                <div className="divide-y divide-border">
                  {notices.map((notice) => (
                    <div key={notice.id} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {notice.isNew && (
                            <span className="px-2 py-0.5 bg-school-gold text-school-dark text-xs font-bold rounded">
                              NEW
                            </span>
                          )}
                          <p className="text-foreground truncate">{notice.title}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{notice.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setEditingNotice(notice)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteNotice(notice.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              {/* Add Image Form */}
              <div className="bg-card rounded-xl p-6 shadow-md">
                <h3 className="font-semibold text-foreground mb-4">Add New Image</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <Input
                    placeholder="Image URL"
                    value={newImage.src}
                    onChange={(e) => setNewImage({ ...newImage, src: e.target.value })}
                  />
                  <Input
                    placeholder="Image description"
                    value={newImage.alt}
                    onChange={(e) => setNewImage({ ...newImage, alt: e.target.value })}
                  />
                  <Input
                    placeholder="Category"
                    value={newImage.category}
                    onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
                  />
                </div>
                <Button onClick={addImage} className="mt-4">
                  <Plus className="w-4 h-4" />
                  Add Image
                </Button>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.map((image) => (
                  <div key={image.id} className="relative group rounded-xl overflow-hidden shadow-md">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteImage(image.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-foreground/80 text-primary-foreground">
                      <p className="text-sm truncate">{image.alt}</p>
                      <p className="text-xs opacity-70">{image.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="bg-card rounded-xl p-12 text-center">
                  <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No messages yet</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'bg-card rounded-xl p-6 shadow-md transition-all',
                      !message.isRead && 'border-l-4 border-primary'
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">{message.name}</h3>
                          {!message.isRead && (
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">
                              Unread
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{message.email} • {message.phone}</p>
                        <p className="text-foreground mt-3">{message.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">{message.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleMessageRead(message.id)}
                          title={message.isRead ? 'Mark as unread' : 'Mark as read'}
                        >
                          {message.isRead ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => deleteMessage(message.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Admin;
