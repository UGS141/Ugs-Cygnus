import React from "react";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showWordmarkText?: boolean;
}

/**
 * UGS Brand Logo Component.
 * Preserves the uploaded asset exactly without distortion, redrawing, or changing proportions.
 * Directly references /assets/aistudio/ChatGPT_Image_Oct_17__2026__04_41_57_PM_92b6e04c.jpg
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = "",
  size = "md",
}) => {
  // Height presets respecting the 1:3.6 logo aspect ratio without distortion
  const sizeClasses = {
    sm: "h-7",
    md: "h-9",
    lg: "h-12",
    xl: "h-16",
  };

  return (
    <div className={`inline-flex items-center shrink-0 ${className}`}>
      <img
        src="/assets/aistudio/ChatGPT_Image_Oct_17__2026__04_41_57_PM_92b6e04c.jpg"
        alt="UGS Logo - Universal Global Solutions"
        className={`${sizeClasses[size]} w-auto object-contain select-none`}
        loading="eager"
      />
    </div>
  );
};

export default BrandLogo;
