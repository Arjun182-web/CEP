// src/common/AnimatedPageWrapper.jsx
import React from "react";
import "./AnimatedPageWrapper.css"; // make sure you create this too

const AnimatedPageWrapper = ({ children }) => {
  return (
    <div className="animated-wrapper">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="background-video"
      >
        <source src="/videos/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="overlay" />
      <div className="content">{children}</div>
    </div>
  );
};

export default AnimatedPageWrapper;
