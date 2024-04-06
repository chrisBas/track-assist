import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import App from "./App";
import SignInWithGoogleButton from "./features/common/components/sign-in-with-google/SignInWithGoogleButton";
import { useSession } from "./features/common/hooks/useSession";
import TopAppBar from "./features/common/components/TopAppBar";
import props from "./features/common/utils/props";
import supabase, { login } from "./features/common/utils/supabase-client";

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
        <Box
          component="img"
          alt="Track-Assist"
          src={`${props.srcPrefix}/logo192.png`}
        />
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
