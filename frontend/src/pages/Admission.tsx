import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { classes, schoolInfo } from '@/data/mockData';
import { FileText, Calendar, CreditCard, CheckCircle } from 'lucide-react';
import PageHero from '@/components/shared/PageHero';

const Admission = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    classApplying: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast({
      title: 'Application Submitted!',
      description: 'We have received your admission inquiry. Our team will contact you soon.',
    });
    setFormData({ name: '', phone: '', email: '', address: '', classApplying: '', message: '' });
    setIsSubmitting(false);
  };

  const admissionSteps = [
    { icon: FileText, title: 'Submit Application', description: 'Fill out the admission form with required details' },
    { icon: Calendar, title: 'Schedule Test', description: 'Appear for entrance test and interview' },
    { icon: CreditCard, title: 'Pay Fees', description: 'Complete fee payment upon selection' },
    { icon: CheckCircle, title: 'Get Enrolled', description: 'Complete admission and start your journey' },
  ];

  const eligibility = [
    { level: 'Nursery', age: '3+ years', requirement: 'No formal education required' },
    { level: 'LKG', age: '4+ years', requirement: 'Nursery completion preferred' },
    { level: 'UKG', age: '5+ years', requirement: 'LKG completion required' },
    { level: 'Class 1-5', age: 'Age appropriate', requirement: 'Previous class completion certificate' },
    { level: 'Class 6-8', age: 'Age appropriate', requirement: 'Transfer certificate & marksheet' },
    { level: 'Class 9-10', age: 'Age appropriate', requirement: 'Class 8/9 marksheet & TC' },
    { level: '+2 Level', age: '16+ years', requirement: 'Class 10 marksheet & TC' },
  ];

  return (
    <div className="min-h-screen">
      <PageHero 
        title="Admissions" 
        subtitle={`Join the ${schoolInfo.shortName} family and embark on a journey of excellence`}
        breadcrumbs={[{ label: 'Admissions' }]}
      />

      {/* Admission Process */}
      <section className="section-padding">
        <div className="container-school">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">How to Apply</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              Admission Process
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {admissionSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-card rounded-xl p-6 shadow-md text-center h-full">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-4 text-2xl font-bold">
                    {index + 1}
                  </div>
                  <step.icon className="w-8 h-8 mx-auto text-primary mb-3" />
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                {index < admissionSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="section-padding bg-muted">
        <div className="container-school">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Requirements</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              Eligibility Criteria
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-card rounded-xl shadow-md overflow-hidden">
              <thead className="bg-primary text-primary-foreground">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Level</th>
                  <th className="px-6 py-4 text-left font-semibold">Age Requirement</th>
                  <th className="px-6 py-4 text-left font-semibold">Documents Required</th>
                </tr>
              </thead>
              <tbody>
                {eligibility.map((item, index) => (
                  <tr key={index} className="border-b border-border last:border-0">
                    <td className="px-6 py-4 font-medium text-foreground">{item.level}</td>
                    <td className="px-6 py-4 text-muted-foreground">{item.age}</td>
                    <td className="px-6 py-4 text-muted-foreground">{item.requirement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Admission Form */}
      <section className="section-padding">
        <div className="container-school">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Apply Now</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                Admission Inquiry Form
              </h2>
              <p className="text-muted-foreground">
                Fill out the form below and our admission team will get in touch with you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-card rounded-xl p-8 shadow-school">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter student's full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+977-98XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="parent@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class">Class Applying For *</Label>
                  <Select
                    value={formData.classApplying}
                    onValueChange={(value) => setFormData({ ...formData, classApplying: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  placeholder="Enter your complete address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="mt-6 space-y-2">
                <Label htmlFor="message">Additional Message</Label>
                <Textarea
                  id="message"
                  placeholder="Any specific queries or information..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <Button 
                type="submit" 
                variant="maroon" 
                size="lg" 
                className="w-full mt-8"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Admission;
