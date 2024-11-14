import * as React from "react";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import CircularProgress from "@mui/joy/CircularProgress";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../users/user_api";

const customTheme = extendTheme();

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true); // Start loading
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");

    try {
      await forgotPassword(email as string);
      alert("A reset code has been sent to your email.");
      navigate("/");
    } catch (error) {
      alert("Failed to send reset code. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <CssVarsProvider theme={customTheme} disableTransitionOnChange>
      <CssBaseline />
      <Box
        sx={(theme) => ({
          width: { xs: "100%", md: "50vw" },
          display: "flex",
          justifyContent: "flex-end",
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255 255 255 / 0.2)",
          minHeight: "100dvh",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundColor: "rgba(19 19 24 / 0.4)",
          },
        })}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100dvh",
            width: "100%",
            px: 2,
            justifyContent: "center",
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              width: 400,
              maxWidth: "100%",
              mx: "auto",
              p: 3,
              borderRadius: "sm",
              boxShadow: "md",
              backgroundColor: "background.level1",
            }}
          >
            <Typography level="h4" component="h1" textAlign="center">
              Forgot Password
            </Typography>
            <FormControl required sx={{ mt: 2 }}>
              <FormLabel>Email</FormLabel>
              <Input type="email" name="email" placeholder="Enter your email" />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              sx={{ mt: 3 }}
              disabled={loading} // Disable button while loading
              endDecorator={loading ? <CircularProgress size="sm" /> : null} // Show loader when loading
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </Button>
          </Box>
        </Box>
      </Box>
      <Box
        sx={(theme) => ({
          height: "100%",
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          left: { xs: 0, md: "50vw" },
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnJlZSUyMHJlc2VhcmNoJTIwaW1hZ2VzfGVufDB8fDB8fHww)",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundImage:
              "url(https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZyZWUlMjBtZWRpY2luZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D)",
          },
        })}
      />
    </CssVarsProvider>
  );
}
