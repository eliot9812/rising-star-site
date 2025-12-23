import { Link } from 'react-router-dom';
import { ArrowRight, Users, BookOpen, Award, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { schoolInfo, facilities } from '@/data/mockData';
import heroImage from '@/assets/hero-school.jpg';

const Index = () => {
  const stats = [
    { icon: Users, value: schoolInfo.students, label: 'Students' },
    { icon: BookOpen, value: schoolInfo.teachers, label: 'Teachers' },
    { icon: Award, value: '25+', label: 'Years of Excellence' },
    { icon: GraduationCap, value: '95%', label: 'Pass Rate' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-foreground/50" />
          <div className="absolute inset-0 gradient-hero" />
        </div>
        
        <div className="container-school relative z-10 py-20">
          <div className="max-w-3xl animate-fade-in">
            <span className="inline-block px-4 py-2 bg-primary-foreground/20 backdrop-blur-sm rounded-full text-primary-foreground text-sm font-medium mb-6">
              ✨ Admissions Open for 2025-2026
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              {schoolInfo.name}
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
              {schoolInfo.tagline}. We provide quality education that transforms lives and builds bright futures.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/admission">
                  Apply Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-0 relative z-10 -mt-16">
        <div className="container-school">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-card rounded-xl p-6 shadow-school text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-accent flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="font-heading text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="section-padding">
        <div className="container-school">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">About Us</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                Welcome to The Rising English Secondary Boarding School
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Established in {schoolInfo.established}, The Rising English Secondary Boarding School has been a beacon of educational excellence in Nepal. Our commitment to holistic development ensures that every student receives not just academic knowledge, but also the values and skills needed for life.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                With state-of-the-art facilities, experienced faculty, and a nurturing environment, we prepare our students to face the challenges of tomorrow with confidence and competence.
              </p>
              <Button variant="maroon" size="lg" asChild>
                <Link to="/about">
                  Read More About Us
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400"
                alt="School Building"
                className="rounded-xl shadow-school w-full h-48 object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400"
                alt="Students Learning"
                className="rounded-xl shadow-school w-full h-48 object-cover mt-8"
              />
              <img 
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400"
                alt="Science Lab"
                className="rounded-xl shadow-school w-full h-48 object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=400"
                alt="Library"
                className="rounded-xl shadow-school w-full h-48 object-cover mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="section-padding bg-muted">
        <div className="container-school">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Facilities</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              World-Class Infrastructure
            </h2>
            <p className="text-muted-foreground">
              We provide modern facilities to ensure the best learning environment for our students.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility, index) => (
              <div 
                key={index}
                className="bg-card rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="text-4xl mb-4">{facility.icon}</div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {facility.title}
                </h3>
                <p className="text-muted-foreground text-sm">{facility.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding gradient-primary">
        <div className="container-school text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Join The Rising Family?
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
            Take the first step towards a brighter future. Apply for admission today and become part of our growing family of achievers.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="hero" size="xl" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" asChild>
              <Link to="/admission">Apply for Admission</Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
