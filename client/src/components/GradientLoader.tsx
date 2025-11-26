import React from 'react';

interface GradientLoaderProps {
  title: string;
  subtitle: string;
}

export const GradientLoader: React.FC<GradientLoaderProps> = ({ title, subtitle }) => {
  return (
    <div className="k-d-flex k-flex-column k-gap-6 k-align-items-center k-py-8">
      <h2 
        className="gradient-heading k-text-center k-mb-0" 
        style={{ 
          fontSize: '36px', 
          lineHeight: '1', 
          fontWeight: 500, 
          letterSpacing: 'normal' 
        }}
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <div className="gradient-loader"></div>
      <p 
        className="k-mb-0" 
        style={{ 
          fontSize: '16px', 
          lineHeight: '1.5', 
          color: '#323130' 
        }}
      >
        {subtitle}
      </p>
    </div>
  );
};
