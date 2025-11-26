import React from 'react';

interface GradientLoaderProps {
  title: string;
  subtitle: string;
}

export const GradientLoader: React.FC<GradientLoaderProps> = ({ title, subtitle }) => {
  return (
    <div className="gradient-loader-container k-d-flex k-flex-column k-gap-6 k-align-items-center k-py-8">
      <h2 
        className="gradient-heading gradient-loader-heading k-text-center !k-mb-0"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <div className="gradient-loader"></div>
      <p className="gradient-loader-subtitle !k-mb-0">
        {subtitle}
      </p>
    </div>
  );
};
