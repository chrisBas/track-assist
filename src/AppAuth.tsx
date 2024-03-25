import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import App from "./App";
import SignInWithGoogleButton from "./component/SignInWithGoogleButton";
import { useSession } from "./hook/useSession";
import TopAppBar from "./mobile/component/TopAppBar";
import supabase, { login } from "./util/supabase-client";

export default function AppAuth() {
  // global state
  const [session, setSession] = useSession();

  // local state
  const [isLoaded, setIsLoaded] = useState(false);

  // effects
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") {
        setTimeout(() => {
          // timeout is needed to prevent flicker (maybe?)
          setIsLoaded(true);
        }, 1000);
      }
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [setSession]);

  if (!isLoaded) {
    return (
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box component="img" alt="Track-Assist" src="/logo192.png" />
      </Box>
    );
  } else {
    if (session === null) {
      return (
        <Box>
          <TopAppBar title="Login" />
          <Box
            sx={{
              height: "100vh",
              width: "100vw",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SignInWithGoogleButton
              onClick={() => {
                login();
              }}
            />
          </Box>
        </Box>
      );
    } else {
      return <App />;
    }
  }
}
