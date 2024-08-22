import PropTypes from 'prop-types';
import { TextInput, Box, Textarea, Group, Button, NumberInput, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { validateString } from "../../utils/common";

const BasicDetails = ({ prevStep, nextStep, propertyDetails, setPropertyDetails }) => {
  const form = useForm({
    initialValues: {
      name: propertyDetails.name || "",
      description: propertyDetails.description || "",
      regularPrice: propertyDetails.regularPrice || 0,
      discountPrice: propertyDetails.discountPrice || 0,
      type: propertyDetails.type || "",
      property: propertyDetails.property || "",
      status: propertyDetails.status || "",
    },
    validate: {
      name: (value) => validateString(value),
      description: (value) => validateString(value),
      regularPrice: (value) =>
        value < 1 ? "Must be greater than 1 dollars" : null,
      discountPrice: (value) =>
        value >= form.values.regularPrice
          ? "Discounted price must be less than the regular price"
          : null,
      type: (value) => validateString(value),
      property: (value) => validateString(value),
      status: (value) => validateString(value),
    },
  });

  const { name, description, regularPrice, discountPrice, type, property, status } = form.values;

  const handleSubmit = () => {
    const { hasErrors } = form.validate();
    if (!hasErrors) {
      setPropertyDetails((prev) => ({
        ...prev,
        name,
        description,
        regularPrice,
        discountPrice,
        type,
        property,
        status,
      }));
      nextStep();
    }
  };

  return (
    <Box maw="50%" mx="auto" my="md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <TextInput
          withAsterisk
          label="Name"
          placeholder="Property Name"
          {...form.getInputProps("name")}
        />
        <Textarea
          placeholder="Description"
          label="Description"
          withAsterisk
          {...form.getInputProps("description")}
        />
        <NumberInput
          withAsterisk
          label="Regular Price"
          placeholder="50"
          min={0}
          {...form.getInputProps("regularPrice")}
        />
        <NumberInput
          label="Discount Price"
          placeholder="50"
          min={0}
          {...form.getInputProps("discountPrice")}
        />
        <Select
          withAsterisk
          label="Type"
          placeholder="Select listing type"
          data={['sale', 'buy', 'rent']}
          {...form.getInputProps("type")}
        />
        <Select
          withAsterisk
          label="Property"
          placeholder="Select property type"
          data={['land', 'apartment', 'condo', 'house']}
          {...form.getInputProps("property")}
        />
        <Select
          withAsterisk
          label="Status"
          placeholder="Select property status"
          data={[
            'available', 'occupied', 'under_contract', 'for_sale', 'under_renovation',
            'pending_approval', 'sold', 'terminated', 'pending_availability', 'inactive'
          ]}
          {...form.getInputProps("status")}
        />
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

BasicDetails.propTypes = {
  prevStep: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
  propertyDetails: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    regularPrice: PropTypes.number,
    discountPrice: PropTypes.number,
    type: PropTypes.string,
    property: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  setPropertyDetails: PropTypes.func.isRequired,
};

export default BasicDetails;
