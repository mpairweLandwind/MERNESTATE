import PropTypes from 'prop-types';
import { TextInput, Box, Textarea, Group, Button, NumberInput, Select, Grid, Col } from "@mantine/core";
import { DateInput } from "@mantine/dates"; // Import DateInput from Mantine
import { useForm } from "@mantine/form";
import { validateString } from "../../utils/common";

const MBasicDetails = ({ prevStep, nextStep, propertyDetails, setPropertyDetails }) => {
  const form = useForm({
    initialValues: {
      name: propertyDetails.name || "",
      description: propertyDetails.description || "",
      type: propertyDetails.type || "",
      property: propertyDetails.property || "",
      state: propertyDetails.state || "",
      size: propertyDetails.size || 0,
      maintenanceCharge: propertyDetails.maintenanceCharge || 0,
      estimatedValue: propertyDetails.estimatedValue || 0,
      yearBuilt: propertyDetails.yearBuilt || "",
      lastRenovationDate: propertyDetails.lastRenovationDate ? new Date(propertyDetails.lastRenovationDate) : null,
      materialsUsed: propertyDetails.materialsUsed || "",
      condition: propertyDetails.condition || "",
      maintenanceSchedule: propertyDetails.maintenanceSchedule || "",
    },
    validate: {
      name: (value) => validateString(value),
      description: (value) => validateString(value),
      type: (value) => validateString(value),
      property: (value) => validateString(value),
      state: (value) => validateString(value),
    },
  });

  const {
    name,
    description,
    type,
    property,
    state,
    size,
    maintenanceCharge,
    estimatedValue,
    yearBuilt,
    lastRenovationDate,
    materialsUsed,
    condition,
    maintenanceSchedule,
  } = form.values;

  const handleSubmit = () => {
    const { hasErrors } = form.validate();
    if (!hasErrors) {
      setPropertyDetails((prev) => ({
        ...prev,
        name,
        description,
        type,
        property,
        state,
        size,
        maintenanceCharge,
        estimatedValue,
        yearBuilt,
        lastRenovationDate,
        materialsUsed,
        condition,
        maintenanceSchedule,
      }));
      nextStep();
    }
  };

  return (
    <Box maw="70%" mx="auto" my="md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Grid>
          <Col span={6}>
            <TextInput
              withAsterisk
              label="Name"
              placeholder="Property Name"
              {...form.getInputProps("name")}
            />
          </Col>
          <Col span={6}>
            <Select
              withAsterisk
              label="Type"
              placeholder="Select listing type"
              data={['Routine', 'Preventive', 'Corrective', 'Predictive', 'Emergency', 'Cosmetic', 'Seasonal', 'Deferred']}
              {...form.getInputProps("type")}
            />
          </Col>
          <Col span={6}>
            <Select
              withAsterisk
              label="Property Type"
              placeholder="Select property type"
              data={['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'LAND']}
              {...form.getInputProps("property")}
            />
          </Col>
          <Col span={6}>
            <Select
              withAsterisk
              label="State"
              placeholder="Select property state"
              data={['UNOCCUPIED', 'RENTED', 'UNDER_MAINTENANCE', 'UNDER_SALE']}
              {...form.getInputProps("state")}
            />
          </Col>
          <Col span={12}>
            <Textarea
              placeholder="Description"
              label="Description"
              withAsterisk
              {...form.getInputProps("description")}
            />
          </Col>
          <Col span={6}>
            <NumberInput
              label="Size (sqft)"
              placeholder="Enter property size"
              {...form.getInputProps("size")}
            />
          </Col>
          <Col span={6}>
            <NumberInput
              label="Maintenance Charge ($)"
              placeholder="Enter maintenance charge"
              {...form.getInputProps("maintenanceCharge")}
            />
          </Col>
          <Col span={6}>
            <NumberInput
              label="Estimated Value ($)"
              placeholder="Enter estimated value"
              {...form.getInputProps("estimatedValue")}
            />
          </Col>
          <Col span={6}>
            <NumberInput
              label="Year Built"
              placeholder="Enter year built"
              {...form.getInputProps("yearBuilt")}
            />
          </Col>
          <Col span={6}>
            <DateInput
              label="Last Renovation Date"
              placeholder="Select last renovation date"
              {...form.getInputProps("lastRenovationDate")}
            />
          </Col>
          <Col span={6}>
            <Textarea
              label="Materials Used"
              placeholder="Enter materials used"
              {...form.getInputProps("materialsUsed")}
            />
          </Col>
          <Col span={6}>
            <Select
              label="Condition"
              placeholder="Select property condition"
              data={[
                { value: 'NEW', label: 'NEW' },
                { value: 'GOOD', label: 'GOOD' },
                { value: 'FAIR', label: 'FAIR' },
                { value: 'POOR', label: 'POOR' }
              ]}
              {...form.getInputProps("condition")}
            />
          </Col>
          <Col span={6}>
            <Select
              label="Maintenance Schedule"
              placeholder="Select maintenance schedule"
              data={[
                { value: 'DAILY', label: 'Daily' },
                { value: 'WEEKLY', label: 'Weekly' },
                { value: 'MONTHLY', label: 'Monthly' },
                { value: 'QUARTERLY', label: 'Quarterly' },
                { value: 'HALF-YEARLY', label: 'Half-Yearly' },
                { value: 'YEARLY', label: 'Yearly/Annually' },
              ]}
              {...form.getInputProps("maintenanceSchedule")}
            />
          </Col>
        </Grid>
        <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
          <Button type="submit">Next step</Button>
        </Group>
      </form>
    </Box>
  );
};

MBasicDetails.propTypes = {
  prevStep: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
  propertyDetails: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    property: PropTypes.string,
    state: PropTypes.string,
    size: PropTypes.number,
    maintenanceCharge: PropTypes.number,
    estimatedValue: PropTypes.number,
    yearBuilt: PropTypes.string,
    lastRenovationDate: PropTypes.instanceOf(Date), // Updated to handle Date instance
    materialsUsed: PropTypes.string,
    condition: PropTypes.string,
    maintenanceSchedule: PropTypes.string,
  }).isRequired,
  setPropertyDetails: PropTypes.func.isRequired,
};

export default MBasicDetails;
