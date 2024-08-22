import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import "./UploadImage.css";
import { Button, Group } from "@mantine/core";

const UploadImage = ({
  propertyDetails,
  setPropertyDetails,
  nextStep,
  prevStep,
}) => {
  const [imageURLs, setImageURLs] = useState(propertyDetails.images || []);
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  const handleNext = () => {
    setPropertyDetails((prev) => ({ ...prev, images: imageURLs }));
    nextStep();
  };

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "duyrx4d7g",
        uploadPreset: "rz4wltd3",
        maxFiles: 6, // Maximum number of files user can upload
        multiple: true, // Enable multiple file upload
      },
      (err, result) => {
        if (result.event === "success") {
          setImageURLs((prev) => [...prev, result.info.secure_url]);
        }
      }
    );
  }, []);

  return (
    <div className="flexColCenter uploadWrapper">
      {imageURLs.length === 0 ? (
        <div
          className="flexColCenter uploadZone"
          onClick={() => widgetRef.current?.open()}
        >
          <AiOutlineCloudUpload size={50} color="grey" />
          <span>Upload Image</span>
        </div>
      ) : (
        <div className="uploadedImages">
          {imageURLs.map((url, index) => (
            <img key={index} src={url} alt={`Uploaded ${index + 1}`} />
          ))}
          <Button variant="default" onClick={() => widgetRef.current?.open()}>
            Upload More Images
          </Button>
        </div>
      )}

      <Group position="center" mt={"xl"}>
        <Button variant="default" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={imageURLs.length === 0}>
          Next
        </Button>
      </Group>
    </div>
  );
};

UploadImage.propTypes = {
  propertyDetails: PropTypes.shape({
    images: PropTypes.arrayOf(PropTypes.string), // Update the prop type to expect an array of strings
  }).isRequired,
  setPropertyDetails: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
  prevStep: PropTypes.func.isRequired,
};

export default UploadImage;
