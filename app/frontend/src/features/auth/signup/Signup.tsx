import { Divider, Hidden, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import { Link, Redirect, Route, Switch } from "react-router-dom";

import Alert from "../../../components/Alert";
import AuthHeader from "../../../components/AuthHeader";
import { loginRoute, signupRoute } from "../../../routes";
import { useAuthContext } from "../AuthProvider";
import { COLLABORATIVE, INTRODUCTION } from "../constants";
import useAuthStyles from "../useAuthStyles";
import CompleteSignupForm from "./CompleteSignupForm";
import EmailForm from "./EmailForm";

const useStyles = makeStyles((theme) => ({
  agreement: {
    textAlign: "center",
    [theme.breakpoints.up("md")]: {
      marginTop: theme.spacing(3),
      textAlign: "left",
    },
  },
  logIn: {
    marginTop: "auto",
    [theme.breakpoints.up("md")]: {
      color: "#ffffff",
      lineHeight: "40px",
      marginTop: 0,
    },
  },
  logInLink: {
    color: theme.palette.secondary.main,
    fontWeight: 700,
    textDecoration: "none",
    [theme.breakpoints.up("md")]: {
      color: theme.palette.primary.main,
    },
  },
}));

export default function Signup() {
  const { authState, authActions } = useAuthContext();
  const authenticated = authState.authenticated;
  const error = authState.error;
  const authClasses = useAuthStyles();
  const classes = useStyles();

  useEffect(() => {
    authActions.clearError();
  }, [authActions]);

  return (
    <>
      {authenticated && <Redirect to="/" />}
      <Hidden mdUp>
        <div className={authClasses.backgroundBlurImage}></div>
        <div className={authClasses.page}>
          <Switch>
            <Route exact path={signupRoute}>
              <AuthHeader>Let's get started!</AuthHeader>
              {error && (
                <Alert className={authClasses.errorMessage} severity="error">
                  {error}
                </Alert>
              )}
              <EmailForm />
              {/* <Divider>Or</Divider>  not yet available: https://next.material-ui.com/components/dividers/ */}
              {/* Hidden for beta: 
            <Divider classes={{ root: authClasses.divider }} flexItem />
            <MuiButton className={authClasses.facebookButton}>
              Sign up with Facebook
            </MuiButton>
            <MuiButton className={authClasses.googleButton}>
              Sign up with Google
            </MuiButton>
            */}
              <Typography variant="body1" className={classes.agreement}>
                By signing up, you agree with the T&Cs of using the platform and
                confirm to adhere to our Code of Conduct.
              </Typography>
              <Typography className={classes.logIn}>
                Already have an account?{" "}
                <Link className={classes.logInLink} to={loginRoute}>
                  Log in
                </Link>
              </Typography>
            </Route>
            <Route path={`${signupRoute}/:urlToken?`}>
              <AuthHeader>Your basic details</AuthHeader>
              {error && (
                <Alert className={authClasses.errorMessage} severity="error">
                  {error}
                </Alert>
              )}
              <CompleteSignupForm />
            </Route>
          </Switch>
        </div>
      </Hidden>
      <Hidden smDown>
        <div className={authClasses.page}>
          <header className={authClasses.header}>
            <div className={authClasses.logo}>Couchers.org</div>
            <Switch>
              <Route exact path={signupRoute}>
                <Typography className={classes.logIn}>
                  Already have an account?{" "}
                  <Link className={classes.logInLink} to={loginRoute}>
                    Log In
                  </Link>
                </Typography>
              </Route>
            </Switch>
          </header>
          <div className={authClasses.content}>
            <div className={authClasses.introduction}>
              <Typography classes={{ root: authClasses.title }} variant="h1">
                {INTRODUCTION}
              </Typography>
              <Typography classes={{ root: authClasses.subtitle }} variant="h2">
                {COLLABORATIVE}
                <Divider className={authClasses.underline}></Divider>
              </Typography>
            </div>
            <Switch>
              <Route exact path={signupRoute}>
                <div className={authClasses.formWrapper}>
                  {error && (
                    <Alert
                      className={authClasses.errorMessage}
                      severity="error"
                    >
                      {error}
                    </Alert>
                  )}
                  <AuthHeader>Let's get started!</AuthHeader>
                  {/* <Divider>Or</Divider>  not yet available: https://next.material-ui.com/components/dividers/ */}
                  {/* Hidden for beta: 
            <Divider classes={{ root: authClasses.divider }} flexItem />
            <MuiButton className={authClasses.facebookButton}>
              Sign up with Facebook
            </MuiButton>
            <MuiButton className={authClasses.googleButton}>
              Sign up with Google
            </MuiButton>
            */}
                  <EmailForm />
                  <Typography variant="body1" className={classes.agreement}>
                    By signing up, you agree with the T&Cs of using the platform
                    and confirm to adhere to our Code of Conduct.
                  </Typography>
                </div>
              </Route>
              <Route path={`${signupRoute}/:urlToken?`}>
                <div className={authClasses.formWrapper}>
                  <AuthHeader>Your basic details</AuthHeader>
                  {error && (
                    <Alert
                      className={authClasses.errorMessage}
                      severity="error"
                    >
                      {error}
                    </Alert>
                  )}
                  <CompleteSignupForm />
                </div>
              </Route>
            </Switch>
          </div>
        </div>
      </Hidden>
    </>
  );
}
