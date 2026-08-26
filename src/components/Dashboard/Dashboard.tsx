import IMAGES from "../../img/images";
import "./dashboard.css";
import { useReadLocalStorage } from "usehooks-ts";

export const Dashboard = () => {
  const username: string | null = useReadLocalStorage("username");

  return (
    <>
      <h1>Welcome, {username}</h1>
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
