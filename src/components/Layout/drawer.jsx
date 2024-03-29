import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import List from "@material-ui/core/List";
import { motion } from "framer-motion";
import { Drawer, IconButton, Button } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import GitHubIcon from "@material-ui/icons/GitHub";
import ListItem from "@material-ui/core/ListItem";
import {
  drawerToggle,
  themeToggle,
  setUserInfo,
} from "../../Redux/Action/action";
import { auth } from "../../firebase";
import styles from "./drawer.module.scss";
import BMClogo from "./bmc-button.webp";

// eslint-disable-next-line react/prop-types

const drawerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 2,
      ease: "easeInOut",
    },
  },
};

const svgVariants = {
  hidden: {
    rotate: -180,
  },
  visible: {
    rotate: 0,
    transition: {
      duration: 1,
    },
  },
};

const pathVariants = {
  hidden: {
    opacity: 0,
    pathLength: 0,
    color: "#fff",
  },
  visible: {
    opacity: 1,
    pathLength: 1,
    color: "rgb(173, 85, 255)",
    transition: {
      duration: 2,
      ease: "easeInOut",
    },
  },
};

function DrawerBox() {
  const history = useHistory();
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.CONFIG.drawerOpen);
  const isDarkTheme = useSelector((state) => state.CONFIG.darkTheme);
  const isServiceWorkerUpdated = useSelector(
    (state) => state.CONFIG.serviceWorkerUpdated
  );
  const serviceWorkerRegistration = useSelector(
    (state) => state.CONFIG.serviceWorkerRegistration
  );

  const updateServiceWorker = () => {
    const registrationWaiting = serviceWorkerRegistration.waiting;

    if (registrationWaiting) {
      registrationWaiting.postMessage({ type: "SKIP_WAITING" });

      registrationWaiting.addEventListener("statechange", (e) => {
        if (e.target.state === "activated") {
          // eslint-disable-next-line no-undef
          window.location.reload();
        }
      });
    }
  };
  const toggleDrawer = () => async (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    await dispatch(drawerToggle());
  };

  const handleChecked = async () => {
    await dispatch(themeToggle());
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      dispatch(drawerToggle());
      dispatch(setUserInfo(null));
      history.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Drawer
      component={motion.div}
      variants={drawerVariants}
      initial="hidden"
      animate="visible"
      onClose={toggleDrawer(false)}
      anchor="left"
      open={isOpen}
      transitionDuration={500}
    >
      <List className={styles.list}>
        <div className={styles.firstDiv}>
          <ListItem
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <IconButton onClick={() => dispatch(drawerToggle())}>
              <motion.svg
                width="24"
                height="24"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                color="#000"
                variants={svgVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.path
                  d="M0 0h24v24H0z"
                  fill="none"
                  variants={pathVariants}
                ></motion.path>
                <motion.path
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                  variants={pathVariants}
                ></motion.path>
              </motion.svg>
            </IconButton>
          </ListItem>
          <div style={{ display: "grid", gap: "10px" }}>
            <ListItem
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "1rem", fontWeight: "400" }}>
                Theme Mode
              </span>
              <div className={styles.toggle} title="toggle dark mode">
                <label htmlFor="checkBox">
                  <input
                    id="checkBox"
                    type="checkbox"
                    onChange={handleChecked}
                    checked={isDarkTheme}
                  />
                  <span></span>
                </label>
              </div>
            </ListItem>
            <ListItem
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                gap: "7px",
              }}
            >
              <span style={{ fontSize: "14px" }}>Support the Dev</span>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "5px",
                }}
              >
                <a href="https://www.buymeacoffee.com/bhargab" target="_">
                  <img src={BMClogo} alt="buy me a coffee" />
                </a>
              </div>
              <div
                style={{
                  background: `${isDarkTheme ? "#fff" : "#252525"}`,
                  height: "1px",
                  width: "100px",
                  borderRadius: "100px",
                }}
              ></div>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://github.com/the-wrong-guy/"
                style={{
                  textDecoration: "none",
                  outline: "none",
                  color: "inherit",
                }}
              >
                <GitHubIcon />
              </a>
            </ListItem>
            <ListItem
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              {isServiceWorkerUpdated ? (
                <Button
                  variant="contained"
                  style={{
                    borderRadius: "1000px",
                    padding: "2px 5px",
                    background: "#FEB401",
                    fontWeight: "500",
                  }}
                  onClick={updateServiceWorker}
                  type="small"
                >
                  Update
                </Button>
              ) : (
                <div style={{ display: "block", textAlign: "center" }}>
                  <span
                    style={{
                      color: `${isDarkTheme ? "peachpuff" : "#252525"}`,
                    }}
                    className={styles.ver}
                  >
                    {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                    Version: 1.1.1
                  </span>
                </div>
              )}
            </ListItem>
          </div>
        </div>
        <div className={styles.secondDiv}>
          <ListItem
            style={{
              height: "100%",
              width: "100%",
              display: "grid",
              justifyContent: "center",
              alignContent: "space-between",
            }}
          >
            <div className={styles.contactDevItem}>
              <span style={{ fontWeight: "300" }}>
                Have some ideas to improve this platform?
              </span>
              <a
                style={{ textDecoration: "none" }}
                href="mailto:bhargab.contact@gmail.com?subject=Ideas%20or%20Features%20to%20improve%20OpenChat%20%2F%20Bugs"
              >
                <Button
                  variant="contained"
                  size="small"
                  style={{ textTransform: "unset" }}
                  component={motion.div}
                >
                  <span>Contact</span>
                  <motion.svg
                    width="30"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    color="red"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </motion.svg>
                </Button>
              </a>
            </div>
            <Button
              className={styles.logoutBtn}
              variant="contained"
              color="default"
              onClick={handleLogout}
              size="small"
            >
              <span>Logout</span>
              <svg
                width="24"
                height="24"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                color="#000"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                ></path>
              </svg>
            </Button>
            <span className={styles.credits}>Made with 🖤 and ⌚</span>
          </ListItem>
        </div>
      </List>
    </Drawer>
  );
}

export default React.memo(DrawerBox);
