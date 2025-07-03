import './Home.css';
import React from 'react';

function Home() {
  return (
    <>
      <video className="bg-video" autoPlay muted loop>
        <source src="/videos/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="overlay"></div>

      <div className="content-card">
        <h2>🎓 Welcome to CEP</h2>
        <br></br>
        <p></p>
        <div className="btn-group">
          <a href="/register" className="btn-tech">Register</a>
          <br></br>
          <a href="/login" className="btn-tech">Login</a>
        </div>
      </div>
    </>
  );
}

export default Home;

