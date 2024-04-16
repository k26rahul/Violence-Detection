import "./style.css";

export const OutputSection = () => {
  return (
    <section>
      <div className="output-wrapper">
        <div className="output-header">
          <div className="dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <h3>Notifications</h3>
        </div>
        {/* Embed the notifications in the below Div - */}
        <div id="notifications-section" className="notifications-wrapper"></div>
      </div>
    </section>
  );
};
