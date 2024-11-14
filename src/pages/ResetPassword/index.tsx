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
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../users/user_api";

const customTheme = extendTheme();

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (formData.get("password") !== formData.get("confirmPassword")) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true); // Start loading
    try {
      await resetPassword(token as string, formData.get("password") as string);
      alert("Password reset successfully.");
      navigate("/"); // Redirect to login
    } catch (error) {
      alert("Failed to reset password. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <CssVarsProvider theme={customTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          minHeight: "100vh",
        }}
      >
        {/* Left column: Form section */}
        <Box
          sx={{
            width: { xs: "100%", md: "50vw" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              width: 400,
              maxWidth: "100%",
              p: 3,
              borderRadius: "sm",
              boxShadow: "md",
              backgroundColor: "background.level1",
            }}
          >
            <Typography level="h4" component="h1" textAlign="center">
              Reset Password
            </Typography>
            <FormControl required sx={{ mt: 2 }}>
              <FormLabel>New Password</FormLabel>
              <Input type="password" name="password" />
            </FormControl>
            <FormControl required sx={{ mt: 2 }}>
              <FormLabel>Confirm Password</FormLabel>
              <Input type="password" name="confirmPassword" />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              sx={{ mt: 3 }}
              disabled={loading} // Disable button while loading
              endDecorator={loading ? <CircularProgress size="sm" /> : null} // Show loader when loading
            >
              {loading ? "Submitting..." : "Submit"}
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
