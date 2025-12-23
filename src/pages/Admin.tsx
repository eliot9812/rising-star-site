import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, Bell, Image, Mail, LogOut, Plus, Trash2, Edit2, 
  Eye, EyeOff, Menu, X, Home, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { notices as initialNotices, galleryImages as initialGallery, contactMessages as initialMessages, Notice, GalleryImage, ContactMessage } from '@/data/mockData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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

  // Form visibility states
  const [showAddNoticeForm, setShowAddNoticeForm] = useState(false);
  const [showAddImageForm, setShowAddImageForm] = useState(false);

  // Edit states
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [newNotice, setNewNotice] = useState({ title: '', description: '', fullContent: '', image: '', isNew: true });
  
  // Gallery state with multi-file upload support
  // TODO: Backend Integration - Replace Object URLs with actual upload API
  const [selectedFiles, setSelectedFiles] = useState<{ file: File; preview: string; alt: string }[]>([]);

  // Message modal state
  const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(null);

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
      description: newNotice.description || newNotice.title,
      fullContent: newNotice.fullContent || newNotice.description || newNotice.title,
      date: new Date().toISOString().split('T')[0],
      image: newNotice.image || undefined,
      isNew: newNotice.isNew,
    };
    setNotices([notice, ...notices]);
    setNewNotice({ title: '', description: '', fullContent: '', image: '', isNew: true });
    setShowAddNoticeForm(false);
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

  // Gallery Management - Multi-file upload with Object URLs for frontend-only operation
  // TODO: Backend Integration - Replace Object URLs with actual upload API
  const handleImageFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newFiles = files.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        alt: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') // Default alt from filename
      }));
      setSelectedFiles([...selectedFiles, ...newFiles]);
    }
    // Reset input to allow selecting same files again
    e.target.value = '';
  };

  const updateFileAlt = (index: number, alt: string) => {
    setSelectedFiles(selectedFiles.map((f, i) => i === index ? { ...f, alt } : f));
  };

  const removeSelectedFile = (index: number) => {
    URL.revokeObjectURL(selectedFiles[index].preview);
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const addImages = () => {
    if (selectedFiles.length === 0) {
      toast({ title: 'Error', description: 'Please select at least one image.', variant: 'destructive' });
      return;
    }

    // TODO: Backend Integration - Upload files to server/storage and get permanent URLs
    // Currently using Object URLs which work for current session only
    const newImages: GalleryImage[] = selectedFiles.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      src: file.preview, // In production, replace with uploaded file URL
      alt: file.alt || `Image ${index + 1}`,
      date: new Date().toISOString().split('T')[0],
    }));

    setGallery([...newImages, ...gallery]);
    setSelectedFiles([]);
    setShowAddImageForm(false);
    toast({ 
      title: 'Images Added', 
      description: `${newImages.length} image(s) added to gallery.` 
    });
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
    setViewingMessage(null);
    toast({ title: 'Message Deleted', description: 'Message has been removed.' });
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-primary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary flex items-center justify-center mb-4 shadow-lg">
              <GraduationCap className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground mt-2">The Rising English Secondary Boarding School</p>
          </div>

          <form onSubmit={handleLogin} className="bg-card rounded-xl p-8 shadow-school border border-border">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground font-medium">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter username"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  required
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                  className="h-12"
                />
              </div>
            </div>
            <Button type="submit" className="w-full mt-6 h-12 text-base font-semibold">
              Login to Dashboard
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Press <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Esc</kbd> to go back to website
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
              {/* Add Notice Button */}
              {!showAddNoticeForm && !editingNotice && (
                <Button onClick={() => setShowAddNoticeForm(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Notice
                </Button>
              )}

              {/* Add Notice Form */}
              {showAddNoticeForm && (
                <div className="bg-card rounded-xl p-6 shadow-md border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Add New Notice</h3>
                    <Button variant="ghost" size="icon" onClick={() => setShowAddNoticeForm(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="notice-title" className="block mb-2">Title *</Label>
                      <Input
                        id="notice-title"
                        placeholder="Enter notice title..."
                        value={newNotice.title}
                        onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="notice-desc" className="block mb-2">Short Description</Label>
                      <Input
                        id="notice-desc"
                        placeholder="Brief description for listing..."
                        value={newNotice.description}
                        onChange={(e) => setNewNotice({ ...newNotice, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="notice-content" className="block mb-2">Full Content</Label>
                      <Textarea
                        id="notice-content"
                        placeholder="Full notice content... (Use empty lines to separate paragraphs)"
                        value={newNotice.fullContent}
                        onChange={(e) => setNewNotice({ ...newNotice, fullContent: e.target.value })}
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="notice-image" className="block mb-2">Image URL (optional)</Label>
                      <Input
                        id="notice-image"
                        placeholder="https://example.com/image.jpg"
                        value={newNotice.image}
                        onChange={(e) => setNewNotice({ ...newNotice, image: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={newNotice.isNew}
                          onChange={(e) => setNewNotice({ ...newNotice, isNew: e.target.checked })}
                          className="rounded border-border"
                        />
                        Mark as New
                      </label>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setShowAddNoticeForm(false)}>
                          Cancel
                        </Button>
                        <Button onClick={addNotice} disabled={!newNotice.title.trim()}>
                          <Plus className="w-4 h-4" />
                          Add Notice
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Edit Notice Form */}
              {editingNotice && (
                <div className="bg-card rounded-xl p-6 shadow-md border-2 border-primary">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Edit Notice</h3>
                    <Button variant="ghost" size="icon" onClick={() => setEditingNotice(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="block mb-2">Title</Label>
                      <Input
                        value={editingNotice.title}
                        onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label className="block mb-2">Description</Label>
                      <Input
                        value={editingNotice.description}
                        onChange={(e) => setEditingNotice({ ...editingNotice, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label className="block mb-2">Full Content</Label>
                      <Textarea
                        value={editingNotice.fullContent}
                        onChange={(e) => setEditingNotice({ ...editingNotice, fullContent: e.target.value })}
                        rows={4}
                      />
                    </div>
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
              {/* Add Image Button */}
              {!showAddImageForm && (
                <Button onClick={() => setShowAddImageForm(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Gallery Images
                </Button>
              )}

              {/* Add Images Form - Multi-file Upload */}
              {showAddImageForm && (
                <div className="bg-card rounded-xl p-6 shadow-md border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Add New Images</h3>
                    <Button variant="ghost" size="icon" onClick={() => {
                      setShowAddImageForm(false);
                      selectedFiles.forEach(f => URL.revokeObjectURL(f.preview));
                      setSelectedFiles([]);
                    }}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* File Input for Multiple Image Selection */}
                  <div className="mb-4">
                    <Label htmlFor="image-upload" className="block mb-2 text-sm font-medium">
                      Select Images (Multiple)
                    </Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageFilesChange}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      You can select multiple images at once. Click again to add more.
                    </p>
                    {/* TODO: Backend Integration - Connect to file upload API */}
                  </div>

                  {/* Selected Images Preview */}
                  {selectedFiles.length > 0 && (
                    <div className="mb-4">
                      <Label className="block mb-2 text-sm font-medium">
                        Selected Images ({selectedFiles.length})
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border-2 border-border">
                              <img 
                                src={file.preview} 
                                alt={file.alt} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              onClick={() => removeSelectedFile(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-md hover:bg-destructive/90 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <Input
                              placeholder="Description"
                              value={file.alt}
                              onChange={(e) => updateFileAlt(index, e.target.value)}
                              className="mt-2 text-xs h-8"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => {
                      setShowAddImageForm(false);
                      selectedFiles.forEach(f => URL.revokeObjectURL(f.preview));
                      setSelectedFiles([]);
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={addImages} disabled={selectedFiles.length === 0}>
                      <Plus className="w-4 h-4" />
                      Add {selectedFiles.length > 0 ? `${selectedFiles.length} Image${selectedFiles.length > 1 ? 's' : ''}` : 'Images'}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    * Images are stored locally in this session. Backend integration required for permanent storage.
                  </p>
                </div>
              )}

              {/* Gallery Grid */}
              <div className="bg-card rounded-xl shadow-md overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">All Images ({gallery.length})</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
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
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              {/* Messages List Header */}
              <div className="bg-card rounded-xl shadow-md overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">
                    Contact Messages ({messages.length}) 
                    {messages.filter(m => !m.isRead).length > 0 && (
                      <span className="ml-2 text-sm font-normal text-muted-foreground">
                        ({messages.filter(m => !m.isRead).length} unread)
                      </span>
                    )}
                  </h3>
                </div>

                {messages.length === 0 ? (
                  <div className="p-12 text-center">
                    <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No messages yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          'p-4 flex items-center justify-between gap-4 transition-all',
                          !message.isRead && 'bg-primary/5'
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-foreground">{message.name}</h4>
                            {!message.isRead && (
                              <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{message.email}</p>
                          <p className="text-sm text-foreground truncate mt-1">{message.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{message.date}</p>
                        </div>
                        
                        {/* Action Buttons - Right aligned with icons and tooltips */}
                        <div className="flex gap-2 shrink-0">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                className="bg-primary hover:bg-primary/90"
                                onClick={() => setViewingMessage(message)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>View Message</TooltipContent>
                          </Tooltip>
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                                className={cn(
                                  message.isRead 
                                    ? 'border-muted-foreground text-muted-foreground hover:bg-muted' 
                                    : 'border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950'
                                )}
                                onClick={() => toggleMessageRead(message.id)}
                              >
                                {message.isRead ? <EyeOff className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {message.isRead ? 'Mark as Unread' : 'Mark as Read'}
                            </TooltipContent>
                          </Tooltip>
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => deleteMessage(message.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete Message</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Message Detail Modal */}
      <Dialog open={!!viewingMessage} onOpenChange={(open) => !open && setViewingMessage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">Message from {viewingMessage?.name}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Received on {viewingMessage?.date}
            </DialogDescription>
          </DialogHeader>
          
          {viewingMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Email</p>
                  <p className="text-foreground font-medium">{viewingMessage.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Phone</p>
                  <p className="text-foreground font-medium">{viewingMessage.phone}</p>
                </div>
              </div>
              
              <div>
                <p className="text-muted-foreground mb-2 text-sm">Message</p>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-foreground whitespace-pre-wrap">{viewingMessage.message}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (viewingMessage) {
                  toggleMessageRead(viewingMessage.id);
                  setViewingMessage({ ...viewingMessage, isRead: !viewingMessage.isRead });
                }
              }}
              className="gap-2"
            >
              {viewingMessage?.isRead ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  Mark as Unread
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Mark as Read
                </>
              )}
            </Button>
            <Button
              variant="destructive"
              onClick={() => viewingMessage && deleteMessage(viewingMessage.id)}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
