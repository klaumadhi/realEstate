import { useEffect, useRef, useState } from "react";
import "./slider.scss";

function Slider({ images }) {
  const [imageIndex, setImageIndex] = useState(null);
  const touchStartX = useRef(null);

  const changeSlide = (direction) => {
    if (direction === "left") {
      if (imageIndex === 0) {
        setImageIndex(images.length - 1);
      } else {
        setImageIndex(imageIndex - 1);
      }
    } else {
      if (imageIndex === images.length - 1) {
        setImageIndex(0);
      } else {
        setImageIndex(imageIndex + 1);
      }
    }
  };

  useEffect(() => {
    if (imageIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") changeSlide("left");
      if (e.key === "ArrowRight") changeSlide("right");
      if (e.key === "Escape") setImageIndex(null);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageIndex]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      changeSlide(delta > 0 ? "left" : "right");
    }
    touchStartX.current = null;
  };

  return (
    <div className="slider">
      {imageIndex !== null && (
        <div
          className="fullSlider"
          onClick={() => setImageIndex(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="arrow"
            onClick={(e) => {
              e.stopPropagation();
              changeSlide("left");
            }}
          >
            <img src="/arrow.png" alt="" />
          </div>
          <div className="imgContainer" onClick={(e) => e.stopPropagation()}>
            <img src={images[imageIndex]} alt="" />
          </div>
          <div
            className="arrow"
            onClick={(e) => {
              e.stopPropagation();
              changeSlide("right");
            }}
          >
            <img src="/arrow.png" className="right" alt="" />
          </div>
          <div className="close" onClick={() => setImageIndex(null)}>
            X
          </div>
        </div>
      )}
      <div className="bigImage">
        <img src={images[0]} alt="" onClick={() => setImageIndex(0)} />
      </div>
      <div className="smallImages">
        {images.slice(1).map((image, index) => (
          <img
            src={image}
            alt=""
            key={index}
            onClick={() => setImageIndex(index + 1)}
          />
        ))}
      </div>
    </div>
  );
}

export default Slider;
