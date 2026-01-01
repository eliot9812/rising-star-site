/**
 * Mock data for the school website - Backend Ready Structure
 * 
 * BACKEND INTEGRATION NOTES:
 * ==========================
 * All data models below are designed to be compatible with a database schema.
 * Each model has a unique `id` field for database primary keys.
 * 
 * API Integration Points:
 * - GET /api/notices - Fetch all notices
 * - GET /api/notices/:id - Fetch single notice
 * - POST /api/notices - Create notice (admin)
 * - PUT /api/notices/:id - Update notice (admin)
 * - DELETE /api/notices/:id - Delete notice (admin)
 * 
 * - GET /api/gallery - Fetch all gallery images
 * - POST /api/gallery - Upload image (admin)
 * - DELETE /api/gallery/:id - Delete image (admin)
 * 
 * - POST /api/contact - Submit contact form
 * - GET /api/contact - Fetch messages (admin)
 * - PUT /api/contact/:id - Mark as read (admin)
 * 
 * - POST /api/admission - Submit admission form
 * - GET /api/admission - Fetch submissions (admin)
 * - PUT /api/admission/:id - Update status (admin)
 */

/**
 * Attachment interface for notice files (images and PDFs)
 * TODO: Backend Integration - Replace Object URLs with permanent storage URLs
 */
export interface NoticeAttachmentData {
  id: string; // Unique ID for each attachment
  url: string; // File URL (Object URL for frontend, storage URL for backend)
  type: 'image' | 'pdf';
  name: string; // Original filename for display
}

export interface Notice {
  id: string; // Primary key - UUID recommended for production
  title: string;
  description: string;
  fullContent: string;
  date: string; // ISO 8601 format - can be converted to Date type
  // Multiple attachments support (images and PDFs)
  // TODO: Backend Integration - Upload files to storage and store permanent URLs
  attachments?: NoticeAttachmentData[];
  // Legacy single attachment fields (kept for backward compatibility)
  attachment?: string;
  attachmentType?: 'image' | 'pdf';
  attachmentName?: string;
  isNew: boolean;
  // TODO: Add createdAt, updatedAt timestamps
}

export interface GalleryImage {
  id: string; // Primary key - UUID recommended for production
  src: string; // TODO: Backend Integration - Use file storage service URL
  alt: string;
  date: string; // ISO 8601 format
  // TODO: Add category, tags for filtering
}

export interface GalleryEventPhoto {
  id: string;
  src: string;
  alt: string;
}

export interface GalleryEvent {
  id: string; // Primary key - UUID recommended for production
  eventName: string; // Event name/title
  description: string; // Event description for admin identification
  coverPhoto: string; // Cover image for the event grid display
  photos: GalleryEventPhoto[]; // All photos from this event
  date: string; // ISO 8601 format - event date
}

export interface ContactMessage {
  id: string; // Primary key - UUID recommended for production
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string; // ISO 8601 format - createdAt timestamp
  isRead: boolean;
  // TODO: Add respondedAt, respondedBy for tracking
}

export interface AdmissionForm {
  id: string; // Primary key - UUID recommended for production
  name: string;
  phone: string;
  email: string;
  address: string;
  classApplying: string;
  message: string;
  date: string; // ISO 8601 format - submittedAt timestamp
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  // TODO: Add reviewedBy, reviewedAt, notes for admin tracking
}

export const notices: Notice[] = [
  { 
    id: '1', 
    title: '📚 Annual Examination Schedule Released - Check Academic Calendar', 
    description: 'The examination schedule for the upcoming annual exams has been released. Students and parents are requested to check the academic calendar for detailed timing.',
    fullContent: 'The examination schedule for the upcoming annual exams has been released. Students and parents are requested to check the academic calendar for detailed timing.\n\nThe examinations will commence from January 20, 2025, and will continue till February 15, 2025. All students are advised to prepare well and follow the schedule strictly.\n\nKey Points:\n- Hall tickets will be distributed from January 15, 2025\n- Students must report 30 minutes before the exam\n- Carry necessary stationery items\n- Mobile phones are strictly prohibited in the examination hall\n\nFor any queries, please contact the examination cell.',
    date: '2024-12-20', 
    attachment: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
    attachmentType: 'image',
    isNew: true 
  },
  { 
    id: '2', 
    title: '🏆 Congratulations to our students for winning Inter-School Sports Championship!', 
    description: 'Our school has won the prestigious Inter-School Sports Championship. Congratulations to all participating students and coaches.',
    fullContent: 'We are proud to announce that our school has won the prestigious Inter-School Sports Championship held at the National Stadium from December 10-15, 2024.\n\nOur students secured first position in multiple events including:\n- Basketball (Senior Category)\n- Football (Junior Category)\n- Athletics - 100m and 200m races\n- Table Tennis (Boys and Girls)\n\nSpecial congratulations to:\n- Rajan Sharma - Best Athlete Award\n- Anita Gurung - Best Football Player\n- The Basketball Team - Undefeated Champions\n\nWe thank all the coaches, parents, and staff for their continuous support. This victory is a testament to our commitment to holistic education.',
    date: '2024-12-18', 
    attachment: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    attachmentType: 'image',
    isNew: true 
  },
  { 
    id: '3', 
    title: '📅 Winter Vacation: December 25, 2024 - January 5, 2025', 
    description: 'The school will remain closed for winter vacation from December 25, 2024, to January 5, 2025. Classes resume on January 6, 2025.',
    fullContent: 'The school will remain closed for winter vacation from December 25, 2024, to January 5, 2025. Classes will resume on January 6, 2025.\n\nDuring the vacation period:\n- The school office will remain open from 10 AM to 2 PM for urgent matters\n- Library will remain closed\n- Hostel students can either stay or go home with written permission from parents\n\nWe wish all students and their families a joyful holiday season!\n\nNote: Students are encouraged to complete their holiday assignments and revise for the upcoming examinations.',
    date: '2024-12-15', 
    isNew: false 
  },
  { 
    id: '4', 
    title: '🎭 Annual Cultural Program on January 15, 2025 - Parents are cordially invited', 
    description: 'The Annual Cultural Program 2025 will be held on January 15, 2025. All parents and guardians are cordially invited to attend.',
    fullContent: 'We are pleased to invite all parents and guardians to our Annual Cultural Program 2025.\n\nEvent Details:\n- Date: January 15, 2025\n- Time: 10:00 AM onwards\n- Venue: School Auditorium\n\nProgram Highlights:\n- Welcome Dance by Pre-Primary Students\n- Drama: "The Value of Education"\n- Musical Performance by School Band\n- Traditional Dance Performances\n- Prize Distribution Ceremony\n- Annual Report Presentation\n\nPlease confirm your attendance by January 10, 2025, at the school office or through the class teacher.\n\nWe look forward to your gracious presence!',
    date: '2024-12-10', 
    attachment: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=800',
    attachmentType: 'image',
    isNew: false 
  },
  { 
    id: '5', 
    title: '📝 Admission Open for Academic Year 2025-2026 - Apply Now!', 
    description: 'Admissions are now open for the academic year 2025-2026 for classes Nursery to Class 10. Apply now to secure your child\'s future.',
    fullContent: 'Admissions are now open for the academic year 2025-2026 for classes Nursery to Class 10.\n\nKey Dates:\n- Application Start: December 1, 2024\n- Application Deadline: February 28, 2025\n- Entrance Test: March 10-15, 2025\n- Results: March 25, 2025\n\nDocuments Required:\n- Birth Certificate\n- Previous Academic Records\n- Character Certificate (for Class 6 and above)\n- Passport-size photographs (4 copies)\n- Parents\' ID proof\n\nWhy Choose Us:\n- Experienced and dedicated faculty\n- Modern infrastructure and facilities\n- Focus on holistic development\n- Excellent academic track record\n- Safe and nurturing environment\n\nFor more information, visit our Admission page or contact the school office.',
    date: '2024-12-05', 
    attachment: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800',
    attachmentType: 'image',
    isNew: true 
  },
];

export const galleryImages: GalleryImage[] = [
  { id: '1', src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800', alt: 'School Building', date: '2024-12-01' },
  { id: '2', src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800', alt: 'Students in Classroom', date: '2024-11-28' },
  { id: '3', src: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800', alt: 'Sports Day', date: '2024-11-25' },
  { id: '4', src: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800', alt: 'Library', date: '2024-11-20' },
  { id: '5', src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800', alt: 'Science Lab', date: '2024-11-15' },
  { id: '6', src: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=800', alt: 'Cultural Event', date: '2024-11-10' },
  { id: '7', src: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800', alt: 'Award Ceremony', date: '2024-11-05' },
  { id: '8', src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800', alt: 'Computer Lab', date: '2024-11-01' },
];

export const galleryEvents: GalleryEvent[] = [
  {
    id: '1',
    eventName: 'Annual Sports Day 2024',
    description: 'Inter-house sports competition with track and field events',
    coverPhoto: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    date: '2024-11-25',
    photos: [
      { id: '1-1', src: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800', alt: 'Sports Day Opening' },
      { id: '1-2', src: 'https://images.unsplash.com/photo-1461896836934- voices-2d68a7c5f8e?w=800', alt: '100m Race' },
      { id: '1-3', src: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800', alt: 'Long Jump Competition' },
      { id: '1-4', src: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800', alt: 'Basketball Match' },
      { id: '1-5', src: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800', alt: 'Football Tournament' },
      { id: '1-6', src: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800', alt: 'Prize Distribution' },
    ]
  },
  {
    id: '2',
    eventName: 'Cultural Program 2024',
    description: 'Annual cultural event featuring dance, music and drama performances',
    coverPhoto: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=800',
    date: '2024-11-10',
    photos: [
      { id: '2-1', src: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=800', alt: 'Cultural Dance Performance' },
      { id: '2-2', src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', alt: 'Music Performance' },
      { id: '2-3', src: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800', alt: 'Traditional Dance' },
      { id: '2-4', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', alt: 'Stage Performance' },
      { id: '2-5', src: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800', alt: 'Group Dance' },
    ]
  },
  {
    id: '3',
    eventName: 'Science Exhibition 2024',
    description: 'Student science projects and experiments showcase',
    coverPhoto: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    date: '2024-11-15',
    photos: [
      { id: '3-1', src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800', alt: 'Science Exhibition Opening' },
      { id: '3-2', src: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800', alt: 'Chemistry Experiments' },
      { id: '3-3', src: 'https://images.unsplash.com/photo-1576319155264-99536e0be1ee?w=800', alt: 'Physics Projects' },
      { id: '3-4', src: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=800', alt: 'Student Presentations' },
    ]
  },
  {
    id: '4',
    eventName: 'Award Ceremony 2024',
    description: 'Annual academic excellence and achievement awards',
    coverPhoto: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800',
    date: '2024-11-05',
    photos: [
      { id: '4-1', src: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800', alt: 'Award Ceremony Stage' },
      { id: '4-2', src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800', alt: 'Students Receiving Awards' },
      { id: '4-3', src: 'https://images.unsplash.com/photo-1627556704302-624286467c65?w=800', alt: 'Top Achievers' },
      { id: '4-4', src: 'https://images.unsplash.com/photo-1559234938-b60fff04894d?w=800', alt: 'Group Photo Winners' },
    ]
  },
  {
    id: '5',
    eventName: 'School Infrastructure',
    description: 'Campus facilities and infrastructure photos',
    coverPhoto: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800',
    date: '2024-12-01',
    photos: [
      { id: '5-1', src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800', alt: 'School Building' },
      { id: '5-2', src: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800', alt: 'Library' },
      { id: '5-3', src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800', alt: 'Computer Lab' },
      { id: '5-4', src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800', alt: 'Classroom' },
    ]
  },
];

export const contactMessages: ContactMessage[] = [
  { id: '1', name: 'Ram Sharma', email: 'ram@example.com', phone: '+977-9841234567', message: 'I would like to know about the admission process for Class 5.', date: '2024-12-20', isRead: false },
  { id: '2', name: 'Sita Thapa', email: 'sita@example.com', phone: '+977-9851234567', message: 'What are the school timings and transportation facilities?', date: '2024-12-19', isRead: true },
  { id: '3', name: 'Hari Prasad', email: 'hari@example.com', phone: '+977-9861234567', message: 'Please share the fee structure for boarding students.', date: '2024-12-18', isRead: false },
];

export const admissionForms: AdmissionForm[] = [
  { id: '1', name: 'Arun Kumar', phone: '+977-9801234567', email: 'arun@example.com', address: 'Biratnagar-10, Morang', classApplying: 'Class 5', message: 'Looking for admission for my son in the upcoming academic year.', date: '2024-12-20', status: 'pending' },
  { id: '2', name: 'Sunita Rai', phone: '+977-9812345678', email: 'sunita@example.com', address: 'Dharan-5, Sunsari', classApplying: 'Class 8', message: 'We are relocating from Kathmandu and would like to know about hostel facilities.', date: '2024-12-19', status: 'reviewed' },
  { id: '3', name: 'Bikash Limbu', phone: '+977-9823456789', email: 'bikash@example.com', address: 'Itahari-8, Sunsari', classApplying: 'Nursery', message: 'I want to enroll my daughter in nursery for the 2025 session.', date: '2024-12-18', status: 'approved' },
];

export const schoolInfo = {
  name: 'The Rising English Secondary Boarding School',
  shortName: 'TRESBS',
  tagline: 'Nurturing Minds, Building Futures',
  address: 'Sundar Haricha-10,Morang, Nepal',
  phone: '+977-021-547985',
  email: 'therisingenglishschool@gmail.com',
  website: '',
  established: '1992',
  students: '1200+',
  teachers: '80+',
  branches: '2',
};

export const principal = {
  name: 'Gopal Prasad Pathak',
  position: 'Principal',
  image: 'public/images/principal.png',
  message: `Welcome to The Rising English Secondary Boarding School. For over two decades, we have been committed to providing quality education that nurtures young minds and prepares them for the challenges of tomorrow.

Our school believes in holistic development, combining academic excellence with character building, sports, and extracurricular activities. We strive to create an environment where every student can discover their potential and grow into responsible citizens.

I am proud of our dedicated faculty, state-of-the-art facilities, and the achievements of our students who have excelled in various fields. Together, we continue to uphold our motto of "Nurturing Minds, Building Futures."`,
};

export const vicePrincipal = {
  name: 'Parshuram Guragain',
  position: 'Vice Principal',
  image: 'public/images/viceprincipal.jpg',
  message: `As the Vice Principal, I am honored to be part of an institution that prioritizes both academic excellence and personal growth. Our approach to education goes beyond textbooks – we focus on developing critical thinking, creativity, and compassion in our students.

We maintain a supportive learning environment where students feel encouraged to explore, question, and innovate. Our comprehensive curriculum, combined with modern teaching methodologies, ensures that every child receives the best possible education.

I invite parents to partner with us in this beautiful journey of education. Together, we can help your children achieve their dreams and become the leaders of tomorrow.`,
};

export const classes = [
  // Pre-Primary to Class 9
  'Nursery', 'LKG', 'UKG', 
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 
  'Class 6', 'Class 7', 'Class 8', 'Class 9',
  // +2 Level
  'Management', ' Hotel Management', 
  ' Computer Science', ' Business Studies',
  
];

export const subjects = {
  primary: ['English', 'Nepali', 'Mathematics', 'Science', 'Social Studies', 'Computer', 'Health & Physical Education'],
  secondary: ['English', 'Nepali', 'Mathematics', 'Science', 'Social Studies', 'Computer', 'Optional Mathematics', 'Account', 'Health & Physical Education'],
};

export const facilities = [
  { icon: '🏫', title: 'Modern Classrooms', description: 'Spacious, well-ventilated classrooms with smart boards' },
  { icon: '🔬', title: 'Science Labs', description: 'Fully equipped Physics, Chemistry, and Biology laboratories' },
  { icon: '💻', title: 'Computer Lab', description: 'Latest computers with high-speed internet' },
  { icon: '📚', title: 'Library', description: 'Extensive collection of books, journals, and digital resources' },
  { icon: '🏀', title: 'Sports Complex', description: 'Basketball court, football ground, and indoor games' },
  { icon: '🏠', title: 'Day Bodus', description: 'Day Bodus facilities with proper supervision' },
];
