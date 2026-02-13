import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
}

const SEO = ({
    title,
    description = "The Rising English Boarding School, Sundarharaincha-10, Morang — a top boarding school near Biratchowk. Quality education from Nursery to +2 with 33+ years of academic excellence.",
    keywords = "best school in sundarharaincha, top school in biratchowk, rising english boarding school, boarding school morang, english school sundarharaincha, best school morang nepal, TRESBS",
    image = "https://therisingenglishschool.com/images/school-cover.jpg",
    url = "https://therisingenglishschool.com",
    type = "website"
}: SEOProps) => {
    const siteTitle = "The Rising English Boarding School";
    const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />
        </Helmet>
    );
};

export default SEO;
