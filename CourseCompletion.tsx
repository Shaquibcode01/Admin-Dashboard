import React from "react";
import { Image, Paper, Text } from "@mantine/core";

interface CourseCompletionProps {
  name: string;
  courseName: string;
  startDate: string;
  endDate: string;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
};

const CourseCompletion: React.FC<CourseCompletionProps> = ({
  name,
  courseName,
  startDate,
  endDate,
}) => {
  return (
    <Paper style={{ width: "210mm", height: "147mm", position: "relative" }}>
      {/* Background Image */}
      <Image
        src="https://ik.imagekit.io/webinarITauditing/BG%20Template%20Certificate.png?updatedAt=1718192777434"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Content */}
      <div
        style={{
          position: "absolute",
          top: "40mm", // Adjusted top position based on template
          left: 0,
          right: 0,
          bottom: "20mm", // Adjusted bottom position based on template
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20mm", // Adjusted padding for content spacing
          boxSizing: "border-box", // Include padding in element's total width/height
          color: "#221E45",
          textAlign: "center",
        }}
      >
        {/* Certificate Header */}
        <div style={{ marginBottom: "30mm", flexGrow: 1 }}>
          <Text style={{ fontSize: "30px", fontWeight: "bold", marginTop: "40px" }}>
            {name}
          </Text>
          <Text style={{ fontSize: "15px", marginBottom: "25px" }}>
            for successfully completing the course of {courseName} <br /> course by <strong>Thinkcloudly Pvt. Ltd.</strong><br />
          </Text>

          <Text style={{ fontSize: "15px", marginBottom: "10px", marginRight: "120px" }}>
            <strong>DURATION:</strong> {formatDate(startDate)} To {formatDate(endDate)}
          </Text>
        </div>

        {/* Date and Signature */}
        <div style={{ marginTop: "auto", marginBottom: "20mm" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {/* Add any additional elements like signature or date here */}
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default CourseCompletion;
