import { useEffect, useRef, useState } from "react";
import "./slider.scss";

function Slider({ images }) {
  const [imageIndex, setImageIndex] = useState(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const justSwiped = useRef(false);

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
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      changeSlide(deltaX > 0 ? "left" : "right");
      // A swipe triggers a trailing click on mobile browsers; swallow it so
      // it doesn't immediately close the viewer right after navigating.
      justSwiped.current = true;
      setTimeout(() => {
        justSwiped.current = false;
      }, 300);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleBackdropClick = () => {
    if (justSwiped.current) return;
    setImageIndex(null);
  };

  return (
    <div className="slider">
      {imageIndex !== null && (
        <div
          className="fullSlider"
          onClick={handleBackdropClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="counter">
            {imageIndex + 1} / {images.length}
          </div>
          <div className="close" onClick={() => setImageIndex(null)}>
            X
          </div>
          <div
            className="arrow left"
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
            className="arrow right"
            onClick={(e) => {
              e.stopPropagation();
              changeSlide("right");
            }}
          >
            <img src="/arrow.png" className="right" alt="" />
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
