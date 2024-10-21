import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import IconButton from "@mui/joy/IconButton";
import Stack from "@mui/joy/Stack";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Typography from "@mui/joy/Typography";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab, { tabClasses } from "@mui/joy/Tab";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import CardOverflow from "@mui/joy/CardOverflow";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { AxiosInstance } from "../../core/baseURL";
import { getCurrentUser } from "../../utils/helpers";

function Index() {
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [userDetails, setUserDetails] = React.useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const currentUser = getCurrentUser();
  console.log("currentuser", currentUser);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Save profile details
  const handleSave = async () => {
    try {
      // Sending PUT request to update the user
      const response = await AxiosInstance.put(
        `/users/update/${currentUser.id}`,
        userDetails,
      );
      console.log("User updated successfully:", response.data);
      // Optionally: Show success notification here
    } catch (error) {
      console.error("Error updating user:", error);
      // Optionally: Show error notification here
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageBase64 = reader.result as string;
        setSelectedImage(imageBase64);

        // Save the image specifically for the current user using their unique ID or email
        localStorage.setItem(`profileImage_${currentUser.id}`, imageBase64);
        console.log("Image uploaded:", imageBase64); // Debugging line
      };
      reader.readAsDataURL(file);
    } else {
      console.error("No file selected"); // Debugging line
    }
  };

  // Fetch stored image associated with the current user on component mount
  React.useEffect(() => {
    const storedImage = localStorage.getItem(`profileImage_${currentUser.id}`);
    if (storedImage) {
      setSelectedImage(storedImage);
    }

    // Set user details
    setUserDetails({
      first_name: currentUser.first_name || "",
      last_name: currentUser.last_name || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
      address: currentUser.address || "",
      password: "",
    });
  }, [currentUser]);

  return (
    <Box sx={{ flex: 1, width: "100%" }}>
      <Box
        sx={{
          position: "sticky",
          top: { sm: -100, md: -110 },
          bgcolor: "background.body",
          zIndex: 9995,
        }}
      >
        <Box sx={{ px: { xs: 2, md: 6 } }}>
          <Breadcrumbs
            size="sm"
            aria-label="breadcrumbs"
            separator={<ChevronRightRoundedIcon fontSize="medium" />}
            sx={{ pl: 0 }}
          >
            <Link
              underline="none"
              color="neutral"
              href="#some-link"
              aria-label="Home"
            >
              <HomeRoundedIcon />
            </Link>
            <Link
              underline="hover"
              color="neutral"
              href="#some-link"
              sx={{ fontSize: 12, fontWeight: 500 }}
            >
              Users
            </Link>
            <Typography color="primary" sx={{ fontWeight: 500, fontSize: 12 }}>
              My profile
            </Typography>
          </Breadcrumbs>
          <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
            My profile
          </Typography>
        </Box>
      </Box>
      <Stack
        spacing={4}
        sx={{
          display: "flex",
          maxWidth: "800px",
          mx: "auto",
          px: { xs: 2, md: 6 },
          py: { xs: 2, md: 3 },
        }}
      >
        <Card>
          <Box sx={{ mb: 1 }}>
            <Typography level="title-md">Personal info</Typography>
          </Box>
          <Divider />
          <Stack
            direction="row"
            spacing={3}
            sx={{ display: { xs: "none", md: "flex" }, my: 1 }}
          >
            <Stack direction="column" spacing={1}>
              <AspectRatio
                ratio="1"
                maxHeight={200}
                sx={{ flex: 1, minWidth: 120, borderRadius: "100%" }}
              >
                <img
                  src={
                    selectedImage ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
                  }
                  loading="lazy"
                  alt="Profile"
                />
              </AspectRatio>
              <IconButton
                aria-label="upload new picture"
                size="sm"
                variant="outlined"
                color="neutral"
                sx={{
                  bgcolor: "background.body",
                  position: "absolute",
                  zIndex: 2,
                  borderRadius: "50%",
                  left: 100,
                  top: 170,
                }}
                component="label"
              >
                <EditRoundedIcon />
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleImageChange}
                />
              </IconButton>
            </Stack>
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              <Stack spacing={1}>
                <FormLabel>First Name</FormLabel>
                <Input
                  name="first_name"
                  size="sm"
                  placeholder="First name"
                  value={userDetails.first_name}
                  onChange={handleChange}
                />
              </Stack>
              <Stack spacing={1}>
                <FormLabel>Last Name</FormLabel>
                <Input
                  name="last_name"
                  size="sm"
                  placeholder="Last name"
                  value={userDetails.last_name}
                  onChange={handleChange}
                />
              </Stack>

              <Stack spacing={1}>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  size="sm"
                  placeholder="Email"
                  value={userDetails.email}
                  onChange={handleChange}
                />
              </Stack>
              <Stack spacing={1}>
                <FormLabel>Phone</FormLabel>
                <Input
                  name="phone"
                  size="sm"
                  placeholder="Phone"
                  value={userDetails.phone}
                  onChange={handleChange}
                />
              </Stack>
              <Stack spacing={1}>
                <FormLabel>Address</FormLabel>
                <Input
                  name="address"
                  size="sm"
                  placeholder="Address"
                  value={userDetails.address}
                  onChange={handleChange}
                />
              </Stack>
              <Stack spacing={1}>
                <FormLabel>Password</FormLabel>
                <Input
                  name="password"
                  type="password"
                  size="sm"
                  placeholder="Password"
                  value={userDetails.password}
                  onChange={handleChange}
                />
              </Stack>
              {/* <div>
                <FormControl sx={{ display: { sm: "contents" } }}>
                  <FormLabel>Timezone</FormLabel>
                  <Select
                    size="sm"
                    startDecorator={<AccessTimeFilledRoundedIcon />}
                    defaultValue="1"
                  >
                    <Option value="1">
                      Indochina Time (Bangkok)
                      <Typography textColor="text.tertiary" sx={{ ml: 0.5 }}>
                        — GMT+07:00
                      </Typography>
                    </Option>
                    <Option value="2">
                      Indochina Time (Ho Chi Minh City)
                      <Typography textColor="text.tertiary" sx={{ ml: 0.5 }}>
                        — GMT+07:00
                      </Typography>
                    </Option>
                  </Select>
                </FormControl>
              </div> */}
            </Stack>
          </Stack>
          <CardOverflow sx={{ borderTop: "1px solid", borderColor: "divider" }}>
            <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
              <Button size="sm" variant="outlined" color="neutral">
                Cancel
              </Button>
              <Button size="sm" variant="solid" onClick={handleSave}>
                Save
              </Button>
            </CardActions>
          </CardOverflow>
        </Card>
        {/* <Card>
          <Box sx={{ mb: 1 }}>
            <Typography level="title-md">Change Password</Typography>
            <Typography level="body-sm">
              You can update your account password here
            </Typography>
          </Box>
          <Divider />
          <FormControl>
            <FormLabel>Current Password</FormLabel>
            <Input size="sm" type="password" placeholder="Current Password" />
          </FormControl>
          <FormControl>
            <FormLabel>New Password</FormLabel>
            <Input size="sm" type="password" placeholder="New Password" />
          </FormControl>
          <CardOverflow sx={{ borderTop: "1px solid", borderColor: "divider" }}>
            <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
              <Button size="sm" variant="outlined" color="neutral">
                Cancel
              </Button>
              <Button size="sm" variant="solid">
                Save
              </Button>
            </CardActions>
          </CardOverflow>
        </Card> */}
      </Stack>
    </Box>
  );
}

export default Index;
