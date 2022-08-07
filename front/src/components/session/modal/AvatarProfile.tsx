import { Button, ButtonBase, styled, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import React, { FC } from "react";

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: "relative",
  height: 200,
  [theme.breakpoints.down("sm")]: {
    width: "100% !important", // Overrides inline-style
    height: 100,
  },
  "&:hover, &.Mui-focusVisible": {
    zIndex: 1,
    "& .MuiImageBackdrop-root": {
      opacity: 0.15,
    },
    "& .MuiImageMarked-root": {
      opacity: 0,
    },
  },
}));

const ImageSrc = styled("span")({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: "cover",
  backgroundPosition: "center 40%",
  borderRadius: "10px",
});

const ImageBackdrop = styled("span")(({ theme }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0.4,
  transition: theme.transitions.create("opacity"),
  borderRadius: "10px",
}));

interface IProps {
  selected: boolean;
  onClick: () => void;
  avatarName: string;
  avatarImagePath: string;
}

export const AvatarProfile: FC<IProps> = ({ selected, onClick, avatarName, avatarImagePath }) => {
  const theme = useTheme();
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      height="100%"
      borderRadius="10px"
    >
      <ImageButton
        focusRipple
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "10px",
          border: selected ? `4px solid ${theme.palette.primary.main}` : "",
        }}
        onClick={onClick}
      >
        <ImageSrc style={{ backgroundImage: `url(${avatarImagePath})` }} />
        {!selected && <ImageBackdrop className="MuiImageBackdrop-root" />}
      </ImageButton>
      <Box p={1} />
      <Typography component="span" variant="h6">
        {avatarName}
      </Typography>
    </Box>
  );
};
