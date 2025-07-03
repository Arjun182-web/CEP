import React from 'react';

function Layout({ children }) {
  return (
    <>
      {/* 🔹 Background Video */}
      <video
        className="bg-video"
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -2,
        }}
      >
        <source src="/videos/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🔹 Dark Overlay */}
      <div
        className="overlay"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: -1,
        }}
      ></div>

      {/* 🔹 Page Content */}
      <main>{children}</main>
    </>
  );
}

export default Layout;
