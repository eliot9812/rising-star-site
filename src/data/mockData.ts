// Mock data for the school website - Backend ready structure

export interface Notice {
  id: string;
  title: string;
  description: string;
  fullContent: string;
  date: string;
  image?: string;
  isNew: boolean;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
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
  { 
    id: '1', 
    title: '📚 Annual Examination Schedule Released - Check Academic Calendar', 
    description: 'The examination schedule for the upcoming annual exams has been released. Students and parents are requested to check the academic calendar for detailed timing.',
    fullContent: 'The examination schedule for the upcoming annual exams has been released. Students and parents are requested to check the academic calendar for detailed timing.\n\nThe examinations will commence from January 20, 2025, and will continue till February 15, 2025. All students are advised to prepare well and follow the schedule strictly.\n\nKey Points:\n- Hall tickets will be distributed from January 15, 2025\n- Students must report 30 minutes before the exam\n- Carry necessary stationery items\n- Mobile phones are strictly prohibited in the examination hall\n\nFor any queries, please contact the examination cell.',
    date: '2024-12-20', 
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
    isNew: true 
  },
  { 
    id: '2', 
    title: '🏆 Congratulations to our students for winning Inter-School Sports Championship!', 
    description: 'Our school has won the prestigious Inter-School Sports Championship. Congratulations to all participating students and coaches.',
    fullContent: 'We are proud to announce that our school has won the prestigious Inter-School Sports Championship held at the National Stadium from December 10-15, 2024.\n\nOur students secured first position in multiple events including:\n- Basketball (Senior Category)\n- Football (Junior Category)\n- Athletics - 100m and 200m races\n- Table Tennis (Boys and Girls)\n\nSpecial congratulations to:\n- Rajan Sharma - Best Athlete Award\n- Anita Gurung - Best Football Player\n- The Basketball Team - Undefeated Champions\n\nWe thank all the coaches, parents, and staff for their continuous support. This victory is a testament to our commitment to holistic education.',
    date: '2024-12-18', 
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
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
    image: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=800',
    isNew: false 
  },
  { 
    id: '5', 
    title: '📝 Admission Open for Academic Year 2025-2026 - Apply Now!', 
    description: 'Admissions are now open for the academic year 2025-2026 for classes Nursery to Class 10. Apply now to secure your child\'s future.',
    fullContent: 'Admissions are now open for the academic year 2025-2026 for classes Nursery to Class 10.\n\nKey Dates:\n- Application Start: December 1, 2024\n- Application Deadline: February 28, 2025\n- Entrance Test: March 10-15, 2025\n- Results: March 25, 2025\n\nDocuments Required:\n- Birth Certificate\n- Previous Academic Records\n- Character Certificate (for Class 6 and above)\n- Passport-size photographs (4 copies)\n- Parents\' ID proof\n\nWhy Choose Us:\n- Experienced and dedicated faculty\n- Modern infrastructure and facilities\n- Focus on holistic development\n- Excellent academic track record\n- Safe and nurturing environment\n\nFor more information, visit our Admission page or contact the school office.',
    date: '2024-12-05', 
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800',
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

export const contactMessages: ContactMessage[] = [
  { id: '1', name: 'Ram Sharma', email: 'ram@example.com', phone: '+977-9841234567', message: 'I would like to know about the admission process for Class 5.', date: '2024-12-20', isRead: false },
  { id: '2', name: 'Sita Thapa', email: 'sita@example.com', phone: '+977-9851234567', message: 'What are the school timings and transportation facilities?', date: '2024-12-19', isRead: true },
  { id: '3', name: 'Hari Prasad', email: 'hari@example.com', phone: '+977-9861234567', message: 'Please share the fee structure for boarding students.', date: '2024-12-18', isRead: false },
];

export const schoolInfo = {
  name: 'The Rising English Secondary Boarding School',
  shortName: 'TRESBS',
  tagline: 'Nurturing Minds, Building Futures',
  address: 'Sundar Haricha-10,Morang, Nepal',
  phone: '+977-021-547985',
  email: 'therisingenglishschool@gmail.com',
  website: '',
  established: '1995',
  students: '1200+',
  teachers: '80+',
  branches: '2',
};

export const principal = {
  name: 'Gopal Prasad Pathak',
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
  { icon: '🏠', title: 'Day Bodus', description: 'Day Bodus facilities with proper supervision' },
];
