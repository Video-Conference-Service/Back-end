import { Box } from "@mui/material";
import React, { FC } from "react";
import "./LandingPage.css";
import { Link } from "react-router-dom";
import "animate.css";
import "aos/dist/aos.css";

interface IProps {}

/**
 * @author
 * @function @LandingPage
 **/

export const LandingPage: FC<IProps> = (props) => {
  return (
    <div>
      <Box className="landing">
        <Link to="/login">
          <h1 className="landing--h1">
            <span className="landing--h1--span">A</span>
            <span className="landing--h1--span">V</span>
            <span className="landing--h1--span">A</span>
            <span className="landing--h1--span">T</span>
            <span className="landing--h1--span">I</span>
            <span className="landing--h1--span">M</span>
            <span className="landing--h1--span">E</span>
          </h1>
          <br />
          <Box p={3} />
          <h2 className="landing--h2">
            <span className="landing--h2--span">내</span>
            <span className="landing--h2--span">가</span>
            <span className="landing--h2--span">  </span>
            <span className="landing--h2--span">만</span>
            <span className="landing--h2--span">든</span>
            <span className="landing--h2--span">  </span>
            <span className="landing--h2---span">가</span>
            <span className="landing--h2---span">면</span>
            <span className="landing--h2--span">으</span>
            <span className="landing--h2--span">로</span>
            <span className="landing--h2--span">  </span>
            <span className="landing--h2---span">미</span>
            <span className="landing--h2---span">팅</span>
            <span className="landing--h2--span">하</span>
            <span className="landing--h2--span">자</span>
          </h2>
        </Link>
      </Box>
    </div>
  );
};
