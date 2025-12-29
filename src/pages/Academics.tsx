import { BookOpen, Users, Clock, Award, FlaskConical, Monitor, Library, Dumbbell } from 'lucide-react';
import { classes, subjects } from '@/data/mockData';
import PageHero from '@/components/shared/PageHero';

const Academics = () => {
  const academicFeatures = [
    { icon: BookOpen, title: 'Comprehensive Curriculum', description: 'Following the national curriculum with enhanced teaching methodologies' },
    { icon: Users, title: 'Expert Teachers', description: 'Highly qualified and experienced teachers for quality education' },
    { icon: Clock, title: 'Extended Hours', description: 'Additional study hours and remedial classes for weak students' },
    { icon: Award, title: 'Regular Assessments', description: 'Continuous evaluation through tests, projects, and examinations' },
  ];

  const labFacilities = [
    { icon: FlaskConical, title: 'Science Laboratory', description: 'Fully equipped Physics, Chemistry, and Biology labs for hands-on learning' },
    { icon: Monitor, title: 'Computer Laboratory', description: 'Modern computers with high-speed internet and latest software' },
    { icon: Library, title: 'Digital Library', description: 'E-library access with thousands of digital resources and books' },
    { icon: Dumbbell, title: 'Sports Facilities', description: 'Indoor and outdoor sports facilities for physical development' },
  ];

  return (
    <div>
      <PageHero 
        title="Academics" 
        subtitle="Discover our comprehensive academic programs designed to nurture young minds"
        breadcrumbs={[{ label: 'Academics' }]}
      />

      {/* Classes Offered */}
      <section className="section-padding">
        <div className="container-school">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Programs</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              Classes We Offer
            </h2>
            <p className="text-muted-foreground">
              From early childhood education to secondary level, we provide quality education at every stage.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Pre-Primary */}
            <div className="bg-card rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-t-4 border-primary">
              <h3 className="font-heading text-xl font-bold text-foreground mb-4">Pre-Primary Level</h3>
              <ul className="space-y-2">
                {classes.slice(0, 3).map((cls) => (
                  <li key={cls} className="flex items-center gap-3 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    {cls}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                Play-based learning with focus on motor skills, language, and social development.
              </p>
            </div>

            {/* Primary */}
            <div className="bg-card rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-t-4 border-secondary">
              <h3 className="font-heading text-xl font-bold text-foreground mb-4">Primary Level</h3>
              <ul className="space-y-2">
                {classes.slice(3, 8).map((cls) => (
                  <li key={cls} className="flex items-center gap-3 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                    {cls}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                Foundation building with emphasis on reading, writing, and mathematical skills.
              </p>
            </div>

            {/* Secondary */}
            <div className="bg-card rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-t-4 border-school-gold">
              <h3 className="font-heading text-xl font-bold text-foreground mb-4">Secondary Level</h3>
              <ul className="space-y-2">
                {classes.slice(8, 12).map((cls) => (
                  <li key={cls} className="flex items-center gap-3 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-school-gold" />
                    {cls}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                Preparation for board examinations with career guidance and counseling.
              </p>
            </div>

            {/* +2 Level */}
            <div className="bg-card rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-t-4 border-primary md:col-span-3">
              <h3 className="font-heading text-xl font-bold text-foreground mb-4">+2 Level (Higher Secondary)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {classes.slice(12).map((cls) => (
                  <div key={cls} className="flex items-center gap-3 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    {cls}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Specialized streams including Management, Hotel Management, Computer Science, and Business Studies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="section-padding bg-muted">
        <div className="container-school">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Curriculum</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              Subjects Overview
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-xl p-8 shadow-md">
              <h3 className="font-heading text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </span>
                Primary Level Subjects
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {subjects.primary.map((subject) => (
                  <div key={subject} className="bg-accent rounded-lg p-3 text-center text-sm font-medium text-foreground">
                    {subject}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-xl p-8 shadow-md">
              <h3 className="font-heading text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-secondary" />
                </span>
                Secondary Level Subjects
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {subjects.secondary.map((subject) => (
                  <div key={subject} className="bg-secondary/10 rounded-lg p-3 text-center text-sm font-medium text-foreground">
                    {subject}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teaching Approach */}
      <section className="section-padding">
        <div className="container-school">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Approach</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              Teaching Methodology
            </h2>
            <p className="text-muted-foreground">
              We employ modern teaching methods that make learning engaging and effective.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {academicFeatures.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-accent flex items-center justify-center mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lab Facilities */}
      <section className="section-padding bg-muted">
        <div className="container-school">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Facilities</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              Academic Facilities
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {labFacilities.map((facility, index) => (
              <div 
                key={index} 
                className="bg-card rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex gap-4"
              >
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <facility.icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{facility.title}</h3>
                  <p className="text-muted-foreground text-sm">{facility.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Academics;
