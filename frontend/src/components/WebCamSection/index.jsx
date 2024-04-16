import PropTypes from "prop-types";
import "./style.css";
import frame from "./frame1.png";
import { useEffect, useRef } from "react";

export const WebCamSection = ({ setVideoElement }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      // console.log(videoRef.current);
      setVideoElement(videoRef.current);
    }
  }, []);

  return (
    <section className="webcam-section-wrapper">
      <div className="webcam-wrapper">
        <img className="frame" src={frame} alt="" />
        <video className="video" ref={videoRef} autoPlay></video>
      </div>
    </section>
  );
};

WebCamSection.propTypes = {
  setVideoElement: PropTypes.func,
};
