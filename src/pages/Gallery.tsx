import { useState } from 'react';
import { galleryImages } from '@/data/mockData';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', ...new Set(galleryImages.map((img) => img.category))];
  const filteredImages = filter === 'All' 
    ? galleryImages 
    : galleryImages.filter((img) => img.category === filter);

  return (
    <div>
      {/* Hero Section */}
      <section className="gradient-secondary py-20">
        <div className="container-school text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-secondary-foreground mb-4 animate-fade-in">
            Photo Gallery
          </h1>
          <p className="text-secondary-foreground/90 text-lg max-w-2xl mx-auto">
            Explore moments captured from our vibrant school life
          </p>
        </div>
      </section>

      {/* Filter & Gallery */}
      <section className="section-padding">
        <div className="container-school">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={cn(
                  'px-6 py-2 rounded-full font-medium transition-all duration-300',
                  filter === category
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => setSelectedImage(image.src)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-all duration-300 flex items-end">
                  <div className="p-4 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                    <p className="font-medium text-sm">{image.alt}</p>
                    <span className="text-xs opacity-80">{image.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center hover:bg-card/40 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6 text-primary-foreground" />
          </button>
          <img
            src={selectedImage}
            alt="Gallery preview"
            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default Gallery;
