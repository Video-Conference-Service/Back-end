import React, { FC } from "react";
import Avatar from "@mui/material/Avatar";
import logo from "../../assets/avartimeLogo.png";
import { Box, IconButton, Menu, MenuItem, MenuList } from "@mui/material";
import { Link } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import "../../style.css";
import { padding } from "@mui/system";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import {
  reset,
  setUserName,
  setUserDesc,
  setProfileImagePath,
  setIsLogin,
} from "../../stores/slices/userSlice";

interface IProps {
  hideSettings?: boolean;
}

/**
 * @author
 * @function @MainHeader
 **/

export const MainHeader: FC<IProps> = ({ hideSettings = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorElUser);
  const profileImagePath = useSelector((state: any) => state.user.profileImagePath);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logout = () => {
    localStorage.clear();
    dispatch(reset);
    dispatch(setUserName(""));
    dispatch(setUserDesc(""));
    dispatch(setProfileImagePath("https://jira.ssafy.com/secure/useravatar?avatarId=10334"));
    dispatch(setIsLogin("false"));
    alert("로그아웃 완료");
    navigate("/");
  };

  return (
    <>
      <Box display="flex" justifyContent="center" alignItems="center" marginBottom="2%">
        <Link to="/main" style={{ display: "flex", justifyContent: "center" }}>
          <img src={logo} alt="로고" style={{ width: "70%", paddingTop: "2%" }} />
        </Link>

        {!hideSettings && (
          <>
            <Tooltip title="설정">
              <IconButton
                onClick={handleOpenUserMenu}
                style={{ position: "absolute", right: "3%" }}
              >
                <Avatar
                  alt="프로필 사진"
                  src={profileImagePath}
                  sx={{ width: 56, height: 56 }}
                  aria-controls={open ? "composition-menu" : undefined}
                  aria-expanded={open ? "true" : undefined}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "60px" }}
              id="profilemenu"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={open}
              onClose={handleCloseUserMenu}
            >
              <MenuItem>
                <Link to="/mypage" style={{ textDecoration: "none" }}>
                  마이페이지
                </Link>
              </MenuItem>
              <MenuItem onClick={logout}>로그아웃</MenuItem>
            </Menu>
          </>
        )}
      </Box>
    </>
  );
};