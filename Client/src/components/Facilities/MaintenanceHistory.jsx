import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, Group, NumberInput, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates"; // Import DateInput
import { useForm } from "@mantine/form";
import { useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import UserDetailContext from "../../context/UserDetailContext";
import useProperties from "../../hooks/useProperties.jsx";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { createMaintenance } from "../../utils/api.jsx";

const MaintenanceHistory = ({
  prevStep,
  propertyDetails,
  setPropertyDetails,
  setOpened,
  setActiveStep,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const form = useForm({
    initialValues: {
      description: propertyDetails.maintenanceHistory?.[0]?.description || "",
      date: propertyDetails.maintenanceHistory?.[0]?.date || new Date(),
      cost: propertyDetails.maintenanceHistory?.[0]?.cost || 0,
    },
    validate: {
      description: (value) => (value.trim() === "" ? "Description is required" : null),
      date: (value) => (value === null ? "Date is required" : null),
      cost: (value) => (value < 0 ? "Cost cannot be negative" : null),
    },
  });

  const { description, date, cost } = form.values;

  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const { userDetails, setUserDetails } = useContext(UserDetailContext);

  useEffect(() => {
    const getTokenAndSetContext = async () => {
      try {
        if (!userDetails.token && isAuthenticated) {
          const res = await getAccessTokenSilently({
            authorizationParams: {
              audience: "http://localhost:3000", // Adjust if needed
              scope: "openid profile email",
            },
          });
          console.log("Access Token:", res);
          localStorage.setItem("access_token", res);
          setUserDetails((prev) => ({
            ...prev,
            token: res,
            email: user.email,
          }));
        }
      } catch (error) {
        console.error("Error during token retrieval:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getTokenAndSetContext();
  }, [getAccessTokenSilently, isAuthenticated, userDetails.token, setUserDetails, user]);

  const handleSubmit = () => {
    const { hasErrors } = form.validate();
    if (!hasErrors) {
      setPropertyDetails((prev) => ({
        ...prev,        
        maintenanceHistory: [{ description, date, cost }],
        userEmail: userDetails.email || user?.email,
      }));
      mutate();
    }
  };

  const { refetch: refetchProperties } = useProperties();

  const { mutate } = useMutation({
    mutationFn: () => createMaintenance({
      ...propertyDetails,
      maintenanceHistory: [{ description, date, cost }],
    }, userDetails.token),
    onError: ({ response }) => toast.error(response.data.message, { position: "bottom-right" }),
    onSettled: () => {
      toast.success("Added Successfully", { position: "bottom-right" });
      setPropertyDetails({
        name: "",
        description: "",
        type: "",
        property: "",
        state: "",
        size: "",
        maintenanceCharge: "",
        estimatedValue: "",
        yearBuilt: "",
        lastRenovationDate: "",
        materialsUsed: "",
        condition: "",
        maintenanceSchedule: "",
        country: "",
        city: "",
        address: "",
        image: null,
        maintenanceHistory: [{ description: "", date: new Date(), cost: 0 }],
        userEmail: userDetails.email || user?.email,
      });
      setOpened(false);
      setActiveStep(0);
      refetchProperties();
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Box maw="30%" mx="auto" my="sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <TextInput
          withAsterisk
          label="Description"
          placeholder="Maintenance description"
          {...form.getInputProps("description")}
        />
        <DateInput
          withAsterisk
          label="Date"
          placeholder="Select maintenance date"
          {...form.getInputProps("date")}
        />
        <NumberInput
          withAsterisk
          label="Cost ($)"
          min={0}
          {...form.getInputProps("cost")}
        />
        <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
          <Button type="submit" color="green" disabled={isLoading}>
            {isLoading ? "Submitting" : "Add Property"}
          </Button>
        </Group>
      </form>
    </Box>
  );
};

MaintenanceHistory.propTypes = {
  prevStep: PropTypes.func.isRequired,
  propertyDetails: PropTypes.shape({
    maintenanceHistory: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string,
        date: PropTypes.instanceOf(Date), // Update to Date instance
        cost: PropTypes.number,
      })
    ),
  }).isRequired,
  setPropertyDetails: PropTypes.func.isRequired,
  setOpened: PropTypes.func.isRequired,
  setActiveStep: PropTypes.func.isRequired,
};

export default MaintenanceHistory;
