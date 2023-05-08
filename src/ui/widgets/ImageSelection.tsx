// src/components/ImageSelector.tsx

import React from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

// ImageStore
class ImageStore {
  selectedImage: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  selectImage(url: string) {
    this.selectedImage = url;
  }
}

const imageStore = new ImageStore();

// ImageGrid
const imageGridStyles: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(33.33%, 1fr))",
  gridGap: "10px",
  padding: "10px",
};

// ImageItem
const imageWrapperStyles: React.CSSProperties = {
  cursor: "pointer",
  position: "relative",
};

const imageStyles: React.CSSProperties = {
  width: "100%",
  height: "auto",
  objectFit: "cover",
};

const selectedImageStyles: React.CSSProperties = {
  border: "3px solid #aaa",
  borderRadius: "5px",
};

const hoverImageStyles: React.CSSProperties = {
  border: "3px solid #ccc",
  borderRadius: "5px",
};

interface ImageItemProps {
  url: string;
  onClick: (url: string) => void;
  isSelected: boolean;
}

const ImageItem: React.FC<ImageItemProps> = ({ url, onClick, isSelected }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      style={imageWrapperStyles}
      onClick={() => onClick(url)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={url}
        alt="Image"
        style={
          isSelected
            ? { ...imageStyles, ...selectedImageStyles }
            : isHovered
            ? { ...imageStyles, ...hoverImageStyles }
            : imageStyles
        }
      />
    </div>
  );
};

// ImageSelection
interface ImageSelectionProps {
  urls: string[];
  get: () => boolean;
  set: (url: string) => void;
}

export const ImageSelection: React.FC<ImageSelectionProps> = observer(({ urls, get, set }) => {
  const handleClick = (url: string) => {
    imageStore.selectImage(url);
    set(url);
  };

  return (
    <div style={imageGridStyles}>
      {urls.map((url, index) => (
        <ImageItem
          key={index}
          url={url}
          onClick={handleClick}
          isSelected={url === imageStore.selectedImage}
        />
      ))}
    </div>
  );
});
