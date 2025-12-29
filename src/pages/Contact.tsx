import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { schoolInfo } from '@/data/mockData';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import PageHero from '@/components/shared/PageHero';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast({
      title: 'Message Sent!',
      description: 'Thank you for contacting us. We will get back to you soon.',
    });
    setFormData({ name: '', email: '', phone: '', message: '' });
    setIsSubmitting(false);
  };

  const contactInfo = [
    { icon: MapPin, title: 'Address', content: schoolInfo.address, link: null },
    { icon: Phone, title: 'Phone', content: schoolInfo.phone, link: `tel:${schoolInfo.phone}` },
    { icon: Mail, title: 'Email', content: schoolInfo.email, link: `mailto:${schoolInfo.email}` },
    { icon: Clock, title: 'Office Hours', content: 'Sun-Fri: 10:00 AM - 5:00 PM', link: null },
  ];

  return (
    <div className="min-h-screen">
      <PageHero 
        title="Contact Us" 
        subtitle="We'd love to hear from you. Get in touch with us today."
        breadcrumbs={[{ label: 'Contact' }]}
      />

      {/* Contact Section */}
      <section className="section-padding">
        <div className="container-school">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Info */}
            <div className="w-full">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Get in Touch</span>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4 sm:mb-6">
                Contact Information
              </h2>
              <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
                Have questions about admissions, academics, or anything else? 
                Reach out to us through any of the following channels.
              </p>

              <div className="space-y-4 sm:space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base">{info.title}</h3>
                      {info.link ? (
                        <a 
                          href={info.link} 
                          className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base break-all"
                        >
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-muted-foreground text-sm sm:text-base">{info.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Section */}
              <div className="mt-6 sm:mt-8 bg-muted rounded-xl h-48 sm:h-64 overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1782.622257587441!2d87.37826406955722!3d26.672661268316972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef6f007df59963%3A0x9937a6eebe9c4906!2sThe%20rising%20english%20boarding%20school!5e0!3m2!1sen!2snp!4v1766397407651!5m2!1sen!2snp"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="School Location Map"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>

            {/* Contact Form */}
            <div className="w-full">
              <div className="bg-card rounded-xl p-4 sm:p-6 lg:p-8 shadow-school">
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
                  Send us a Message
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm sm:text-base">Your Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="h-10 sm:h-11"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm sm:text-base">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="h-10 sm:h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm sm:text-base">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+977-98XXXXXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="h-10 sm:h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm sm:text-base">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="How can we help you?"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="min-h-[100px] sm:min-h-[120px]"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full h-11 sm:h-12 text-sm sm:text-base"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
