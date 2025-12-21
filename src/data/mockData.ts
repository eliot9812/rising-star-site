// Mock data for the school website - Backend ready structure

export interface Notice {
  id: string;
  title: string;
  date: string;
  isNew: boolean;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
  date: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface AdmissionForm {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  classApplying: string;
  message: string;
  date: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
}

export const notices: Notice[] = [
  { id: '1', title: '📚 Annual Examination Schedule Released - Check Academic Calendar', date: '2024-12-20', isNew: true },
  { id: '2', title: '🏆 Congratulations to our students for winning Inter-School Sports Championship!', date: '2024-12-18', isNew: true },
  { id: '3', title: '📅 Winter Vacation: December 25, 2024 - January 5, 2025', date: '2024-12-15', isNew: false },
  { id: '4', title: '🎭 Annual Cultural Program on January 15, 2025 - Parents are cordially invited', date: '2024-12-10', isNew: false },
  { id: '5', title: '📝 Admission Open for Academic Year 2025-2026 - Apply Now!', date: '2024-12-05', isNew: true },
];

export const galleryImages: GalleryImage[] = [
  { id: '1', src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800', alt: 'School Building', category: 'Campus', date: '2024-12-01' },
  { id: '2', src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800', alt: 'Students in Classroom', category: 'Academics', date: '2024-11-28' },
  { id: '3', src: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800', alt: 'Sports Day', category: 'Sports', date: '2024-11-25' },
  { id: '4', src: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800', alt: 'Library', category: 'Facilities', date: '2024-11-20' },
  { id: '5', src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800', alt: 'Science Lab', category: 'Academics', date: '2024-11-15' },
  { id: '6', src: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=800', alt: 'Cultural Event', category: 'Events', date: '2024-11-10' },
  { id: '7', src: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800', alt: 'Award Ceremony', category: 'Events', date: '2024-11-05' },
  { id: '8', src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800', alt: 'Computer Lab', category: 'Facilities', date: '2024-11-01' },
];

export const contactMessages: ContactMessage[] = [
  { id: '1', name: 'Ram Sharma', email: 'ram@example.com', phone: '+977-9841234567', message: 'I would like to know about the admission process for Class 5.', date: '2024-12-20', isRead: false },
  { id: '2', name: 'Sita Thapa', email: 'sita@example.com', phone: '+977-9851234567', message: 'What are the school timings and transportation facilities?', date: '2024-12-19', isRead: true },
  { id: '3', name: 'Hari Prasad', email: 'hari@example.com', phone: '+977-9861234567', message: 'Please share the fee structure for boarding students.', date: '2024-12-18', isRead: false },
];

export const schoolInfo = {
  name: 'The Rising English Secondary Boarding School',
  shortName: 'TRESBS',
  tagline: 'Nurturing Minds, Building Futures',
  address: 'Kathmandu, Nepal',
  phone: '+977-1-4567890',
  email: 'info@risingschool.edu.np',
  website: 'www.risingschool.edu.np',
  established: '1995',
  students: '1200+',
  teachers: '80+',
  branches: '2',
};

export const principal = {
  name: 'Dr. Ramesh Kumar Shrestha',
  position: 'Principal',
  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  message: `Welcome to The Rising English Secondary Boarding School. For over two decades, we have been committed to providing quality education that nurtures young minds and prepares them for the challenges of tomorrow.

Our school believes in holistic development, combining academic excellence with character building, sports, and extracurricular activities. We strive to create an environment where every student can discover their potential and grow into responsible citizens.

I am proud of our dedicated faculty, state-of-the-art facilities, and the achievements of our students who have excelled in various fields. Together, we continue to uphold our motto of "Nurturing Minds, Building Futures."`,
};

export const vicePrincipal = {
  name: 'Mrs. Sunita Adhikari',
  position: 'Vice Principal',
  image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
  message: `As the Vice Principal, I am honored to be part of an institution that prioritizes both academic excellence and personal growth. Our approach to education goes beyond textbooks – we focus on developing critical thinking, creativity, and compassion in our students.

We maintain a supportive learning environment where students feel encouraged to explore, question, and innovate. Our comprehensive curriculum, combined with modern teaching methodologies, ensures that every child receives the best possible education.

I invite parents to partner with us in this beautiful journey of education. Together, we can help your children achieve their dreams and become the leaders of tomorrow.`,
};

export const classes = [
  'Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 
  'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'
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
  { icon: '🏠', title: 'Hostel', description: 'Comfortable boarding facilities with 24/7 supervision' },
];
