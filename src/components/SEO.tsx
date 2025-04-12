import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Handwritten Notes Hub - Share and Download PDF Notes',
  description = 'A platform for sharing and downloading handwritten notes, programming notes, software development notes, and educational PDFs. Free access to high-quality study materials.',
  keywords = [
    'handwritten notes',
    'pdf notes',
    'programming notes',
    'software notes',
    'study materials',
    'educational pdfs',
    'free notes',
    'computer science notes',
    'engineering notes',
    'programming tutorials',
    'software development resources',
    'coding notes',
    'technical notes',
    'academic notes',
    'study resources'
  ],
  image = '/logo.png',
  url = 'https://handwrittennoteshub.com'
}) => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content="Sagar Gondaliya" />
      <meta name="robots" content="index, follow" />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Handwritten Notes Hub",
          "description": description,
          "url": url,
          "applicationCategory": "EducationalApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "author": {
            "@type": "Person",
            "name": "Sagar Gondaliya",
            "url": "https://github.com/sagargondaliya"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEO; 