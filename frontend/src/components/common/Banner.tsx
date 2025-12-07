import React from 'react';
import './Banner.css';

interface BannerProps {
  title: string;
  subtitle?: string;
}

/**
 * Componente de cabeçalho de página (Banner).
 */
const Banner: React.FC<BannerProps> = ({ title, subtitle }) => {
  return (
    <div className="banner">
      <div className="banner-background" />
      <div className="banner-content">
        <h1 className="banner-title">{title}</h1>
        {subtitle && <p className="banner-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};

export default Banner;
