import IMAGES from "../../img/images";
import "./dashboard.css";

export const Dashboard = () => {
  return (
    <>
      <div id="main-content">
        <img
          src={IMAGES.rockPaperScissor}
          style={{ maxWidth: "100%" }}
          alt="rock paper scissors with space background"
        ></img>
        {/* <p>
          Welcome to Online Rock-Paper-Scissors! Play against others online to
          become the greatest player in the World!
        </p> */}
      </div>
    </>
  );
};
