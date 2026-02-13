import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, Bell, Image, Mail, LogOut, Plus, Trash2, Edit2,
  Eye, EyeOff, Menu, X, Home, Check, FileText, Upload, UserPlus, Loader2, KeyRound
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Notice, GalleryEvent, GalleryEventPhoto, ContactMessage, AdmissionForm, NoticeAttachmentData } from '@/data/mockData';
import NoticeAttachment from '@/components/shared/NoticeAttachment';
import MultiFileUploader, { FileWithPreview } from '@/components/admin/MultiFileUploader';
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
import { Link } from 'lucide-react';

import { API_BASE_URL, getUploadUrl } from '@/lib/api';

type AdminTab = 'notices' | 'gallery' | 'messages' | 'admissions';

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<AdminTab>('notices');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  // Get auth headers for API requests
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('adminToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }, []);

  // State for managing data
  const [notices, setNotices] = useState<Notice[]>([]);
  const [galleryEvents, setGalleryEvents] = useState<GalleryEvent[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [admissions, setAdmissions] = useState<AdmissionForm[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingAdmissions, setIsLoadingAdmissions] = useState(false);
  const [isLoadingNotices, setIsLoadingNotices] = useState(false);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);

  // Fetch messages from API (admin only)
  const fetchMessages = useCallback(async () => {
    setIsLoadingMessages(true);
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({ title: 'Error', description: 'Failed to load messages', variant: 'destructive' });
    } finally {
      setIsLoadingMessages(false);
    }
  }, [toast, getAuthHeaders]);

  // Fetch admissions from API (admin only)
  const fetchAdmissions = useCallback(async () => {
    setIsLoadingAdmissions(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admissions`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (data.success) {
        setAdmissions(data.data);
      }
    } catch (error) {
      console.error('Error fetching admissions:', error);
      toast({ title: 'Error', description: 'Failed to load admissions', variant: 'destructive' });
    } finally {
      setIsLoadingAdmissions(false);
    }
  }, [toast, getAuthHeaders]);

  // Fetch notices from API
  const fetchNotices = useCallback(async () => {
    setIsLoadingNotices(true);
    try {
      const response = await fetch(`${API_BASE_URL}/notices`);
      const data = await response.json();
      if (data.success) {
        setNotices(data.data);
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
      toast({ title: 'Error', description: 'Failed to load notices', variant: 'destructive' });
    } finally {
      setIsLoadingNotices(false);
    }
  }, [toast]);

  // Fetch gallery events from API
  const fetchGallery = useCallback(async () => {
    setIsLoadingGallery(true);
    try {
      const response = await fetch(`${API_BASE_URL}/gallery`);
      const data = await response.json();
      if (data.success) {
        setGalleryEvents(data.data);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
      toast({ title: 'Error', description: 'Failed to load gallery', variant: 'destructive' });
    } finally {
      setIsLoadingGallery(false);
    }
  }, [toast]);

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages();
      fetchAdmissions();
      fetchNotices();
      fetchGallery();
    }
  }, [isAuthenticated, fetchMessages, fetchAdmissions, fetchNotices, fetchGallery]);

  // Form visibility states
  const [showAddNoticeForm, setShowAddNoticeForm] = useState(false);
  const [showAddEventForm, setShowAddEventForm] = useState(false);

  // Edit states
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [newNotice, setNewNotice] = useState({
    title: '',
    description: '',
    fullContent: '',
    isNew: true
  });

  // Multiple notice attachments (images and PDFs)
  // TODO: Backend Integration - Replace Object URLs with actual upload API
  const [noticeAttachments, setNoticeAttachments] = useState<FileWithPreview[]>([]);

  // For editing - track existing attachments to remove
  const [editingNoticeAttachments, setEditingNoticeAttachments] = useState<NoticeAttachmentData[]>([]);
  const [newEditAttachments, setNewEditAttachments] = useState<FileWithPreview[]>([]);

  // Gallery event state with multi-file upload support
  // TODO: Backend Integration - Replace Object URLs with actual upload API
  const [newEvent, setNewEvent] = useState({ eventName: '', description: '' });
  const [eventPhotos, setEventPhotos] = useState<{ file: File; preview: string; alt: string }[]>([]);

  // Edit event states
  const [editingEvent, setEditingEvent] = useState<GalleryEvent | null>(null);
  const [editEventPhotos, setEditEventPhotos] = useState<GalleryEventPhoto[]>([]);
  const [newEditEventPhotos, setNewEditEventPhotos] = useState<{ file: File; preview: string; alt: string }[]>([]);

  // Message modal state
  const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(null);

  // Admission modal state
  const [viewingAdmission, setViewingAdmission] = useState<AdmissionForm | null>(null);

  // Verify token on page load (auto-login if valid token exists)
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      try {
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('adminToken');
        }
      } catch {
        localStorage.removeItem('adminToken');
      }
    };
    verifyToken();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate('/');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginData.username, password: loginData.password }),
      });
      const data = await response.json();

      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        setLoginData({ username: '', password: '' });
        toast({ title: 'Welcome!', description: 'You have logged in successfully.' });
      } else {
        setLoginError(data.message || 'Invalid username or password');
      }
    } catch {
      setLoginError('Unable to connect to server. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setLoginData({ username: '', password: '' });
    toast({ title: 'Logged Out', description: 'You have been logged out.' });
  };

  // Change password
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setShowChangePassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        toast({ title: 'Password Changed', description: 'Your password has been updated successfully.' });
      } else {
        setPasswordError(data.message || 'Failed to change password');
      }
    } catch {
      setPasswordError('Unable to connect to server.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const tabs = [
    { id: 'notices' as AdminTab, label: 'Notices', icon: Bell, count: notices.length },
    { id: 'gallery' as AdminTab, label: 'Gallery', icon: Image, count: galleryEvents.length },
    { id: 'messages' as AdminTab, label: 'Messages', icon: Mail, count: messages.filter(m => !m.isRead).length },
    { id: 'admissions' as AdminTab, label: 'Admissions', icon: UserPlus, count: admissions.filter(a => a.status === 'pending').length },
  ];

  // Clear all notice attachments
  const clearNoticeAttachments = () => {
    noticeAttachments.forEach(f => URL.revokeObjectURL(f.preview));
    setNoticeAttachments([]);
  };

  // Clear edit mode attachments
  const clearEditAttachments = () => {
    newEditAttachments.forEach(f => URL.revokeObjectURL(f.preview));
    setNewEditAttachments([]);
    setEditingNoticeAttachments([]);
  };

  // Remove existing attachment from edit mode
  const removeExistingAttachment = (id: string) => {
    setEditingNoticeAttachments(prev => prev.filter(a => a.id !== id));
  };

  // Notice Management
  const addNotice = async () => {
    if (!newNotice.title.trim()) return;

    try {
      // Use FormData to upload files
      const formData = new FormData();
      formData.append('title', newNotice.title);
      formData.append('description', newNotice.description || newNotice.title);
      formData.append('fullContent', newNotice.fullContent || newNotice.description || newNotice.title);
      formData.append('date', new Date().toISOString().split('T')[0]);
      formData.append('isNew', String(newNotice.isNew));

      // Append files
      noticeAttachments.forEach(f => {
        if (f.file) {
          formData.append('files', f.file);
        }
      });

      const response = await fetch(`${API_BASE_URL}/notices`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setNotices([data.data, ...notices]);
        setNewNotice({ title: '', description: '', fullContent: '', isNew: true });
        clearNoticeAttachments();
        setShowAddNoticeForm(false);
        toast({ title: 'Notice Added', description: 'New notice has been published.' });
      } else {
        toast({ title: 'Error', description: data.message || 'Failed to add notice', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error adding notice:', error);
      toast({ title: 'Error', description: 'Failed to add notice', variant: 'destructive' });
    }
  };

  // Start editing a notice
  const startEditingNotice = (notice: Notice) => {
    setEditingNotice(notice);
    setEditingNoticeAttachments(notice.attachments || []);
    setNewEditAttachments([]);
  };

  const updateNotice = async () => {
    if (!editingNotice) return;

    try {
      // Use FormData to upload files
      const formData = new FormData();
      formData.append('title', editingNotice.title);
      formData.append('description', editingNotice.description);
      formData.append('fullContent', editingNotice.fullContent);
      formData.append('date', editingNotice.date);
      formData.append('isNew', String(editingNotice.isNew));

      // IDs of existing attachments to keep
      const keepIds = editingNoticeAttachments.map(a => a.id);
      formData.append('keepAttachmentIds', JSON.stringify(keepIds));

      // Append new files
      newEditAttachments.forEach(f => {
        if (f.file) {
          formData.append('files', f.file);
        }
      });

      const response = await fetch(`${API_BASE_URL}/notices/${editingNotice.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setNotices(notices.map(n => n.id === editingNotice.id ? data.data : n));
        setEditingNotice(null);
        clearEditAttachments();
        toast({ title: 'Notice Updated', description: 'Notice has been updated successfully.' });
      } else {
        toast({ title: 'Error', description: data.message || 'Failed to update notice', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error updating notice:', error);
      toast({ title: 'Error', description: 'Failed to update notice', variant: 'destructive' });
    }
  };

  const deleteNotice = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notices/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (data.success) {
        setNotices(notices.filter(n => n.id !== id));
        toast({ title: 'Notice Deleted', description: 'Notice has been removed.' });
      } else {
        toast({ title: 'Error', description: data.message || 'Failed to delete notice', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error deleting notice:', error);
      toast({ title: 'Error', description: 'Failed to delete notice', variant: 'destructive' });
    }
  };

  // Gallery Event Management - Multi-file upload with Object URLs for frontend-only operation
  // TODO: Backend Integration - Replace Object URLs with actual upload API
  const handleEventPhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newFiles = files.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        alt: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') // Default alt from filename
      }));
      setEventPhotos([...eventPhotos, ...newFiles]);
    }
    // Reset input to allow selecting same files again
    e.target.value = '';
  };

  const updateEventPhotoAlt = (index: number, alt: string) => {
    setEventPhotos(eventPhotos.map((f, i) => i === index ? { ...f, alt } : f));
  };

  const removeEventPhoto = (index: number) => {
    URL.revokeObjectURL(eventPhotos[index].preview);
    setEventPhotos(eventPhotos.filter((_, i) => i !== index));
  };

  const clearEventForm = () => {
    eventPhotos.forEach(f => URL.revokeObjectURL(f.preview));
    setEventPhotos([]);
    setNewEvent({ eventName: '', description: '' });
    setShowAddEventForm(false);
  };

  const addEvent = async () => {
    if (!newEvent.eventName.trim()) {
      toast({ title: 'Error', description: 'Please enter an event name.', variant: 'destructive' });
      return;
    }
    if (eventPhotos.length === 0) {
      toast({ title: 'Error', description: 'Please add at least one photo.', variant: 'destructive' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('eventName', newEvent.eventName);
      formData.append('description', newEvent.description || newEvent.eventName);
      formData.append('date', new Date().toISOString().split('T')[0]);

      // Append photos
      eventPhotos.forEach(photo => {
        if (photo.file) {
          formData.append('photos', photo.file);
        }
      });

      const response = await fetch(`${API_BASE_URL}/gallery`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setGalleryEvents([data.data, ...galleryEvents]);
        setNewEvent({ eventName: '', description: '' });
        eventPhotos.forEach(f => URL.revokeObjectURL(f.preview));
        setEventPhotos([]);
        setShowAddEventForm(false);
        toast({
          title: 'Event Added',
          description: `Event "${data.data.eventName}" added with ${data.data.photos.length} photo(s).`
        });
      } else {
        toast({ title: 'Error', description: data.message || 'Failed to add event', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error adding event:', error);
      toast({ title: 'Error', description: 'Failed to add event', variant: 'destructive' });
    }
  };

  // Start editing an event
  const startEditingEvent = (event: GalleryEvent) => {
    setEditingEvent(event);
    setEditEventPhotos([...event.photos]);
    setNewEditEventPhotos([]);
  };

  // Handle new photos for editing
  const handleEditEventPhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newFiles = files.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        alt: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
      }));
      setNewEditEventPhotos([...newEditEventPhotos, ...newFiles]);
    }
    e.target.value = '';
  };

  const removeExistingEventPhoto = (id: string) => {
    setEditEventPhotos(editEventPhotos.filter(p => p.id !== id));
  };

  const removeNewEditEventPhoto = (index: number) => {
    URL.revokeObjectURL(newEditEventPhotos[index].preview);
    setNewEditEventPhotos(newEditEventPhotos.filter((_, i) => i !== index));
  };

  const clearEditEventForm = () => {
    newEditEventPhotos.forEach(f => URL.revokeObjectURL(f.preview));
    setNewEditEventPhotos([]);
    setEditEventPhotos([]);
    setEditingEvent(null);
  };

  const updateEvent = async () => {
    if (!editingEvent) return;

    const totalPhotos = editEventPhotos.length + newEditEventPhotos.length;
    if (totalPhotos === 0) {
      toast({ title: 'Error', description: 'Event must have at least one photo.', variant: 'destructive' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('eventName', editingEvent.eventName);
      formData.append('description', editingEvent.description);
      formData.append('date', editingEvent.date);

      // IDs of existing photos to keep
      const keepIds = editEventPhotos.map(p => p.id);
      formData.append('keepPhotoIds', JSON.stringify(keepIds));

      // Append new photos
      newEditEventPhotos.forEach(photo => {
        if (photo.file) {
          formData.append('photos', photo.file);
        }
      });

      const response = await fetch(`${API_BASE_URL}/gallery/${editingEvent.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setGalleryEvents(galleryEvents.map(e => e.id === editingEvent.id ? data.data : e));
        clearEditEventForm();
        toast({ title: 'Event Updated', description: 'Event has been updated successfully.' });
      } else {
        toast({ title: 'Error', description: data.message || 'Failed to update event', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error updating event:', error);
      toast({ title: 'Error', description: 'Failed to update event', variant: 'destructive' });
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (data.success) {
        setGalleryEvents(galleryEvents.filter(e => e.id !== id));
        toast({ title: 'Event Deleted', description: 'Event has been removed from gallery.' });
      } else {
        toast({ title: 'Error', description: data.message || 'Failed to delete event', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({ title: 'Error', description: 'Failed to delete event', variant: 'destructive' });
    }
  };

  // Message Management
  const toggleMessageRead = async (id: string) => {
    const message = messages.find(m => m.id === id);
    if (!message) return;

    try {
      const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ isRead: !message.isRead }),
      });
      const data = await response.json();
      if (data.success) {
        setMessages(messages.map(m => m.id === id ? { ...m, isRead: !m.isRead } : m));
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update message', variant: 'destructive' });
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (data.success) {
        setMessages(messages.filter(m => m.id !== id));
        setViewingMessage(null);
        toast({ title: 'Message Deleted', description: 'Message has been removed.' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete message', variant: 'destructive' });
    }
  };

  // Admission Management
  const updateAdmissionStatus = async (id: string, status: AdmissionForm['status']) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admissions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (data.success) {
        setAdmissions(admissions.map(a => a.id === id ? { ...a, status } : a));
        if (viewingAdmission?.id === id) {
          setViewingAdmission({ ...viewingAdmission, status });
        }
        toast({ title: 'Status Updated', description: `Admission status updated to ${status}.` });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update admission status', variant: 'destructive' });
    }
  };

  const deleteAdmission = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admissions/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (data.success) {
        setAdmissions(admissions.filter(a => a.id !== id));
        setViewingAdmission(null);
        toast({ title: 'Admission Deleted', description: 'Admission record has been removed.' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete admission', variant: 'destructive' });
    }
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
              {loginError && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">
                  {loginError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground font-medium">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter username"
                  value={loginData.username}
                  onChange={(e) => { setLoginData({ ...loginData, username: e.target.value }); setLoginError(''); }}
                  required
                  disabled={isLoggingIn}
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
                  onChange={(e) => { setLoginData({ ...loginData, password: e.target.value }); setLoginError(''); }}
                  required
                  disabled={isLoggingIn}
                  className="h-12"
                />
              </div>
            </div>
            <Button type="submit" className="w-full mt-6 h-12 text-base font-semibold" disabled={isLoggingIn}>
              {isLoggingIn ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Logging in...</> : 'Login to Dashboard'}
            </Button>
            <div className="text-center">
              <a href="/" className="text-center text-sm text-muted-foreground mt-4">Go To Home Page</a>
            </div>

          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform duration-300 h-screen overflow-y-auto',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
      )}>
        <div className="flex flex-col h-full sticky top-0">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-11 h-10  flex items-center justify-center">
                <img src="public/images/logo1.png" alt="School Logo" className="w-6 h-6" />
              </div>
              {isSidebarOpen && (
                <div>
                  <h2 className="font-heading font-bold text-foreground">Admin</h2>
                  <p className="text-xs text-muted-foreground">The Rising English Secondary Boarding School</p>
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
                        activeTab === tab.id ? 'bg-red-600 text-white' : 'bg-red-600 text-white'
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
              className="w-full justify-start gap-3"
              onClick={() => setShowChangePassword(true)}
            >
              <KeyRound className="w-5 h-5" />
              {isSidebarOpen && 'Change Password'}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              {isSidebarOpen && 'Logout'}
            </Button>
          </div>
        </div>
      </aside>

      {/* Change Password Dialog */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Enter your current password and choose a new one.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4">
            {passwordError && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {passwordError}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => { setPasswordData({ ...passwordData, currentPassword: e.target.value }); setPasswordError(''); }}
                required
                disabled={isChangingPassword}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => { setPasswordData({ ...passwordData, newPassword: e.target.value }); setPasswordError(''); }}
                required
                disabled={isChangingPassword}
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => { setPasswordData({ ...passwordData, confirmPassword: e.target.value }); setPasswordError(''); }}
                required
                disabled={isChangingPassword}
                minLength={6}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowChangePassword(false)} disabled={isChangingPassword}>
                Cancel
              </Button>
              <Button type="submit" disabled={isChangingPassword}>
                {isChangingPassword ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Change Password'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <main className={cn(
        'flex-1 min-h-screen transition-all duration-300',
        isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
      )}>
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
                <div className="bg-card rounded-xl p-4 sm:p-6 shadow-md border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Add New Notice</h3>
                    <Button variant="ghost" size="icon" onClick={() => {
                      setShowAddNoticeForm(false);
                      clearNoticeAttachments();
                    }}>
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
                        rows={6}
                      />
                    </div>

                    {/* Multi-File Upload for Images and PDFs */}
                    <MultiFileUploader
                      files={noticeAttachments}
                      onChange={setNoticeAttachments}
                      label="Attachments (Multiple Images & PDFs)"
                    />

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={newNotice.isNew}
                          onChange={(e) => setNewNotice({ ...newNotice, isNew: e.target.checked })}
                          className="rounded border-border"
                        />
                        Mark as New
                      </label>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button variant="outline" onClick={() => {
                          setShowAddNoticeForm(false);
                          clearNoticeAttachments();
                        }} className="flex-1 sm:flex-none">
                          Cancel
                        </Button>
                        <Button onClick={addNotice} disabled={!newNotice.title.trim()} className="flex-1 sm:flex-none">
                          <Plus className="w-4 h-4" />
                          Add Notice
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Edit Notice Form - Full View */}
              {editingNotice && (
                <div className="bg-card rounded-xl p-4 sm:p-6 shadow-md border-2 border-primary">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-foreground text-lg">Edit Notice</h3>
                    <Button variant="ghost" size="icon" onClick={() => {
                      setEditingNotice(null);
                      clearEditAttachments();
                    }}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-6">
                    {/* Title */}
                    <div>
                      <Label className="block mb-2">Title *</Label>
                      <Input
                        value={editingNotice.title}
                        onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })}
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <Label className="block mb-2">Short Description</Label>
                      <Input
                        value={editingNotice.description}
                        onChange={(e) => setEditingNotice({ ...editingNotice, description: e.target.value })}
                      />
                    </div>

                    {/* Full Content - Larger textarea for full view */}
                    <div>
                      <Label className="block mb-2">Full Content</Label>
                      <Textarea
                        value={editingNotice.fullContent}
                        onChange={(e) => setEditingNotice({ ...editingNotice, fullContent: e.target.value })}
                        rows={10}
                        className="min-h-[200px]"
                      />
                    </div>

                    {/* Multi-File Upload for Attachments */}
                    <MultiFileUploader
                      files={newEditAttachments}
                      onChange={setNewEditAttachments}
                      existingAttachments={editingNoticeAttachments}
                      onRemoveExisting={removeExistingAttachment}
                      label="Attachments (Images & PDFs)"
                    />

                    {/* Mark as New */}
                    <div>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={editingNotice.isNew}
                          onChange={(e) => setEditingNotice({ ...editingNotice, isNew: e.target.checked })}
                          className="rounded border-border"
                        />
                        Mark as New
                      </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                      <Button onClick={updateNotice} className="flex-1 sm:flex-none">
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => {
                        setEditingNotice(null);
                        clearEditAttachments();
                      }} className="flex-1 sm:flex-none">
                        Cancel
                      </Button>
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
                  {isLoadingNotices ? (
                    <div className="p-8 text-center">
                      <Loader2 className="w-8 h-8 mx-auto text-primary animate-spin" />
                      <p className="text-muted-foreground mt-2">Loading notices...</p>
                    </div>
                  ) : notices.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No notices yet. Add your first notice!</p>
                    </div>
                  ) : (
                    notices.map((notice) => (
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
                          <Button variant="ghost" size="icon" onClick={() => startEditingNotice(notice)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteNotice(notice.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              {/* Add Event Button */}
              {!showAddEventForm && !editingEvent && (
                <Button onClick={() => setShowAddEventForm(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add New Event
                </Button>
              )}

              {/* Add Event Form */}
              {showAddEventForm && (
                <div className="bg-card rounded-xl p-6 shadow-md border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Add New Event</h3>
                    <Button variant="ghost" size="icon" onClick={clearEventForm}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {/* Event Name */}
                    <div>
                      <Label htmlFor="event-name" className="block mb-2">Event Name *</Label>
                      <Input
                        id="event-name"
                        placeholder="Enter event name (e.g., Annual Sports Day 2024)"
                        value={newEvent.eventName}
                        onChange={(e) => setNewEvent({ ...newEvent, eventName: e.target.value })}
                      />
                    </div>

                    {/* Event Description */}
                    <div>
                      <Label htmlFor="event-desc" className="block mb-2">Description (for identification)</Label>
                      <Textarea
                        id="event-desc"
                        placeholder="Brief description of the event for admin reference..."
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        rows={2}
                      />
                    </div>

                    {/* File Input for Multiple Photo Selection */}
                    <div>
                      <Label htmlFor="event-photos" className="block mb-2 text-sm font-medium">
                        Event Photos (Multiple) *
                      </Label>
                      <Input
                        id="event-photos"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleEventPhotosChange}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        First photo will be used as the cover image. You can add more photos by clicking again.
                      </p>
                    </div>

                    {/* Selected Photos Preview */}
                    {eventPhotos.length > 0 && (
                      <div>
                        <Label className="block mb-2 text-sm font-medium">
                          Selected Photos ({eventPhotos.length})
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {eventPhotos.map((file, index) => (
                            <div key={index} className="relative group">
                              <div className={`aspect-square rounded-lg overflow-hidden border-2 ${index === 0 ? 'border-primary' : 'border-border'}`}>
                                <img
                                  src={file.preview}
                                  alt={file.alt}
                                  className="w-full h-full object-cover"
                                />
                                {index === 0 && (
                                  <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                                    Cover
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => removeEventPhoto(index)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-md hover:bg-destructive/90 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <Input
                                placeholder="Photo description"
                                value={file.alt}
                                onChange={(e) => updateEventPhotoAlt(index, e.target.value)}
                                className="mt-2 text-xs h-8"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" onClick={clearEventForm}>
                        Cancel
                      </Button>
                      <Button onClick={addEvent} disabled={!newEvent.eventName.trim() || eventPhotos.length === 0}>
                        <Plus className="w-4 h-4" />
                        Add Event
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      * Photos are stored locally in this session. Backend integration required for permanent storage.
                    </p>
                  </div>
                </div>
              )}

              {/* Edit Event Form */}
              {editingEvent && (
                <div className="bg-card rounded-xl p-6 shadow-md border-2 border-primary">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-foreground text-lg">Edit Event</h3>
                    <Button variant="ghost" size="icon" onClick={clearEditEventForm}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {/* Event Name */}
                    <div>
                      <Label className="block mb-2">Event Name *</Label>
                      <Input
                        value={editingEvent.eventName}
                        onChange={(e) => setEditingEvent({ ...editingEvent, eventName: e.target.value })}
                      />
                    </div>

                    {/* Event Description */}
                    <div>
                      <Label className="block mb-2">Description (for identification)</Label>
                      <Textarea
                        value={editingEvent.description}
                        onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                        rows={2}
                      />
                    </div>

                    {/* Existing Photos */}
                    {editEventPhotos.length > 0 && (
                      <div>
                        <Label className="block mb-2 text-sm font-medium">
                          Existing Photos ({editEventPhotos.length})
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {editEventPhotos.map((photo, index) => (
                            <div key={photo.id} className="relative group">
                              <div className={`aspect-square rounded-lg overflow-hidden border-2 ${index === 0 ? 'border-primary' : 'border-border'}`}>
                                <img
                                  src={getUploadUrl(photo.src)}
                                  alt={photo.alt}
                                  className="w-full h-full object-cover"
                                />
                                {index === 0 && (
                                  <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                                    Cover
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => removeExistingEventPhoto(photo.id)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-md hover:bg-destructive/90 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <p className="mt-2 text-xs text-muted-foreground truncate">{photo.alt}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add More Photos */}
                    <div>
                      <Label htmlFor="edit-event-photos" className="block mb-2 text-sm font-medium">
                        Add More Photos
                      </Label>
                      <Input
                        id="edit-event-photos"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleEditEventPhotosChange}
                        className="cursor-pointer"
                      />
                    </div>

                    {/* New Photos Preview */}
                    {newEditEventPhotos.length > 0 && (
                      <div>
                        <Label className="block mb-2 text-sm font-medium">
                          New Photos ({newEditEventPhotos.length})
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {newEditEventPhotos.map((file, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square rounded-lg overflow-hidden border-2 border-green-500">
                                <img
                                  src={file.preview}
                                  alt={file.alt}
                                  className="w-full h-full object-cover"
                                />
                                <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded">
                                  New
                                </span>
                              </div>
                              <button
                                onClick={() => removeNewEditEventPhoto(index)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-md hover:bg-destructive/90 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <Input
                                placeholder="Photo description"
                                value={file.alt}
                                onChange={(e) => setNewEditEventPhotos(newEditEventPhotos.map((f, i) => i === index ? { ...f, alt: e.target.value } : f))}
                                className="mt-2 text-xs h-8"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-border">
                      <Button onClick={updateEvent}>
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={clearEditEventForm}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Events List */}
              <div className="bg-card rounded-xl shadow-md overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">All Events ({galleryEvents.length})</h3>
                </div>
                <div className="divide-y divide-border">
                  {isLoadingGallery ? (
                    <div className="p-8 text-center">
                      <Loader2 className="w-8 h-8 mx-auto text-primary animate-spin" />
                      <p className="text-muted-foreground mt-2">Loading gallery events...</p>
                    </div>
                  ) : galleryEvents.length === 0 ? (
                    <div className="p-12 text-center">
                      <Image className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No events added yet</p>
                    </div>
                  ) : (
                    galleryEvents.map((event) => (
                      <div key={event.id} className="p-4 flex items-center gap-4">
                        {/* Cover Photo Thumbnail */}
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={getUploadUrl(event.coverPhoto)}
                            alt={event.eventName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Event Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground truncate">{event.eventName}</h4>
                          <p className="text-sm text-muted-foreground truncate">{event.description}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span>{event.date}</span>
                            <span>{event.photos.length} photo(s)</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 flex-shrink-0">
                          <Button variant="ghost" size="icon" onClick={() => startEditingEvent(event)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteEvent(event.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
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

          {/* Admissions Tab */}
          {activeTab === 'admissions' && (
            <div className="space-y-4">
              {/* Admissions List Header */}
              <div className="bg-card rounded-xl shadow-md overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">
                    Admission Submissions ({admissions.length})
                    {admissions.filter(a => a.status === 'pending').length > 0 && (
                      <span className="ml-2 text-sm font-normal text-muted-foreground">
                        ({admissions.filter(a => a.status === 'pending').length} pending)
                      </span>
                    )}
                  </h3>
                </div>

                {admissions.length === 0 ? (
                  <div className="p-12 text-center">
                    <UserPlus className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No admission submissions yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    {/* Desktop Table View */}
                    <table className="w-full hidden md:table">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
                          <th className="text-left p-4 font-medium text-muted-foreground">Class</th>
                          <th className="text-left p-4 font-medium text-muted-foreground">Contact</th>
                          <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                          <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                          <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {admissions.map((admission) => (
                          <tr key={admission.id} className="hover:bg-muted/30 transition-colors">
                            <td className="p-4">
                              <p className="font-semibold text-foreground">{admission.name}</p>
                              <p className="text-sm text-muted-foreground truncate max-w-[200px]">{admission.email}</p>
                            </td>
                            <td className="p-4 text-foreground">{admission.classApplying}</td>
                            <td className="p-4">
                              <p className="text-foreground">{admission.phone}</p>
                            </td>
                            <td className="p-4 text-muted-foreground">{admission.date}</td>
                            <td className="p-4">
                              <span className={cn(
                                'px-2 py-1 text-xs font-medium rounded capitalize',
                                admission.status === 'pending' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                                admission.status === 'reviewed' && 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
                                admission.status === 'approved' && 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                                admission.status === 'rejected' && 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              )}>
                                {admission.status}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2 justify-end">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="icon"
                                      className="bg-primary hover:bg-primary/90"
                                      onClick={() => setViewingAdmission(admission)}
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>View Details</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                      onClick={() => deleteAdmission(admission.id)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Delete</TooltipContent>
                                </Tooltip>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-border">
                      {admissions.map((admission) => (
                        <div key={admission.id} className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-semibold text-foreground">{admission.name}</h4>
                              <p className="text-sm text-muted-foreground">{admission.classApplying}</p>
                            </div>
                            <span className={cn(
                              'px-2 py-1 text-xs font-medium rounded capitalize shrink-0',
                              admission.status === 'pending' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                              admission.status === 'reviewed' && 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
                              admission.status === 'approved' && 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                              admission.status === 'rejected' && 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            )}>
                              {admission.status}
                            </span>
                          </div>
                          <div className="text-sm space-y-1">
                            <p className="text-muted-foreground truncate">{admission.email}</p>
                            <p className="text-muted-foreground">{admission.phone}</p>
                            <p className="text-muted-foreground text-xs">{admission.date}</p>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              className="flex-1 gap-1"
                              onClick={() => setViewingAdmission(admission)}
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => deleteAdmission(admission.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
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

      {/* Admission Detail Modal */}
      <Dialog open={!!viewingAdmission} onOpenChange={(open) => !open && setViewingAdmission(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Admission Application</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Submitted on {viewingAdmission?.date}
            </DialogDescription>
          </DialogHeader>

          {viewingAdmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Name</p>
                  <p className="text-foreground font-medium">{viewingAdmission.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Class Applying For</p>
                  <p className="text-foreground font-medium">{viewingAdmission.classApplying}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Email</p>
                  <p className="text-foreground font-medium break-all">{viewingAdmission.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Phone</p>
                  <p className="text-foreground font-medium">{viewingAdmission.phone}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-muted-foreground mb-1">Address</p>
                  <p className="text-foreground font-medium">{viewingAdmission.address}</p>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground mb-2 text-sm">Message</p>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-foreground whitespace-pre-wrap">{viewingAdmission.message}</p>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground mb-2 text-sm">Status</p>
                <div className="flex flex-wrap gap-2">
                  {(['pending', 'reviewed', 'approved', 'rejected'] as const).map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={viewingAdmission.status === status ? 'default' : 'outline'}
                      className={cn(
                        'capitalize',
                        viewingAdmission.status === status && status === 'pending' && 'bg-yellow-600 hover:bg-yellow-700',
                        viewingAdmission.status === status && status === 'reviewed' && 'bg-blue-600 hover:bg-blue-700',
                        viewingAdmission.status === status && status === 'approved' && 'bg-green-600 hover:bg-green-700',
                        viewingAdmission.status === status && status === 'rejected' && 'bg-red-600 hover:bg-red-700'
                      )}
                      onClick={() => updateAdmissionStatus(viewingAdmission.id, status)}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => viewingAdmission && deleteAdmission(viewingAdmission.id)}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Application
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