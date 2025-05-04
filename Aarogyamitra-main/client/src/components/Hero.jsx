import React from "react";
import image from "../images/heroimg.jpg";
import "../styles/hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
        Your Wellness  <br />
        Our Commitment
        </h1>
        <p>
          AarogyaMitra is a comprehensive healthcare platform that connects
          patients with expert doctors, offers hassle-free appointment bookings,
          personalized health tracking, and ensures better care management.
        </p>
      </div>
      <div className="hero-img">
        <img src={image} alt="hero" />
      </div>
    </section>
  );
};

export default Hero;
