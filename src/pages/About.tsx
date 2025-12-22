import { principal, vicePrincipal, schoolInfo } from '@/data/mockData';
import { Target, Eye, Heart, Award } from 'lucide-react';
import PageHero from '@/components/shared/PageHero';

const About = () => {
  return (
    <div>
      <PageHero 
        title="About Us" 
        subtitle={`Learn about our journey, vision, and the dedicated team behind ${schoolInfo.shortName}`}
        breadcrumbs={[{ label: 'About Us' }]}
      />

      {/* School Introduction */}
      <section className="section-padding">
        <div className="container-school">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                A Legacy of Excellence Since {schoolInfo.established}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Rising English Secondary Boarding School was founded with a vision to provide quality education that goes beyond textbooks. Over the years, we have grown from a small institution to one of the most respected schools in the region.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our approach to education combines rigorous academics with character development, sports, and extracurricular activities. We believe that every child has unique potential, and our role is to help them discover and nurture it.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                With {schoolInfo.students} students and {schoolInfo.teachers} dedicated teachers, we continue to uphold our commitment to educational excellence and holistic development.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600"
                alt="School Campus"
                className="rounded-xl shadow-school w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-secondary text-secondary-foreground p-6 rounded-xl shadow-lg">
                <div className="font-heading text-4xl font-bold">{new Date().getFullYear() - parseInt(schoolInfo.established)}+</div>
                <div className="text-sm">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding bg-muted">
        <div className="container-school">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be a leading educational institution that nurtures globally competent individuals equipped with knowledge, skills, and values to make meaningful contributions to society.
              </p>
            </div>
            <div className="bg-card rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To provide a stimulating learning environment that encourages intellectual curiosity, creativity, and critical thinking while developing the whole child.
              </p>
            </div>
          </div>
          
          {/* Core Values */}
          <div className="mt-12">
            <h3 className="font-heading text-2xl font-bold text-foreground text-center mb-8">Our Core Values</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Heart, title: 'Integrity', desc: 'Honesty in all actions' },
                { icon: Award, title: 'Excellence', desc: 'Striving for the best' },
                { icon: Target, title: 'Discipline', desc: 'Self-control & focus' },
                { icon: Eye, title: 'Respect', desc: 'Valuing everyone' },
              ].map((value, index) => (
                <div key={index} className="text-center p-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-accent flex items-center justify-center mb-3">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">{value.title}</h4>
                  <p className="text-sm text-muted-foreground">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Principal Message */}
      <section className="section-padding">
        <div className="container-school">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Leadership</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2">
              Messages from Our Leaders
            </h2>
          </div>

          {/* Principal */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <img 
                  src={principal.image}
                  alt={principal.name}
                  className="w-full rounded-xl shadow-school mb-4"
                />
                <div className="text-center">
                  <h3 className="font-heading text-xl font-bold text-foreground">{principal.name}</h3>
                  <p className="text-primary font-medium">{principal.position}</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-accent/50 rounded-xl p-8">
                <h3 className="font-heading text-2xl font-bold text-foreground mb-6">
                  Message from the Principal
                </h3>
                {principal.message.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Vice Principal */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 lg:order-2">
              <div className="sticky top-24">
                <img 
                  src={vicePrincipal.image}
                  alt={vicePrincipal.name}
                  className="w-full rounded-xl shadow-school mb-4"
                />
                <div className="text-center">
                  <h3 className="font-heading text-xl font-bold text-foreground">{vicePrincipal.name}</h3>
                  <p className="text-secondary font-medium">{vicePrincipal.position}</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 lg:order-1">
              <div className="bg-secondary/10 rounded-xl p-8">
                <h3 className="font-heading text-2xl font-bold text-foreground mb-6">
                  Message from the Vice Principal
                </h3>
                {vicePrincipal.message.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;