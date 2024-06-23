import React from "react";
import { Image, Paper, Text } from "@mantine/core";

interface CertificateProps {
  name: string;
  eventType: string;
  webinarr: string;
  date?: string; // Optional for Bootcamp
  startDate?: string; // Optional for Webinar
  endDate?: string; // Optional for Webinar
}

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
};

export const CertificateGenerator: React.FC<CertificateProps> = ({
  name,
  eventType,
  webinarr,
  date,
  startDate,
  endDate,
}) => {
  const formattedDate = date ? formatDate(date) : null;
  const formattedStartDate = startDate ? formatDate(startDate) : null;
  const formattedEndDate = endDate ? formatDate(endDate) : null;

  console.log('eventType:', eventType);
  console.log('startDate:', startDate);
  console.log('endDate:', endDate);
  console.log('formattedStartDate:', formattedStartDate);
  console.log('formattedEndDate:', formattedEndDate);

  const imageSrc = eventType === "BOOTCAMP" 
    ? "https://ik.imagekit.io/2fljt9khj/Ihunanya%20Nwokocha%20(3).png?updatedAt=1718438031843" 
    : "https://ik.imagekit.io/webinarITauditing/_Original%20size_%20%20Ayokunmi.png?updatedAt=1715707946948";

  return (
    <Paper style={{ width: "210mm", height: "147mm", position: "relative" }}>
      {/* Background Image */}
      <Image
        src={imageSrc}
        alt="Certificate Background"
        style={{ width: "100%", height: "100%" }}
      />

      {/* Content */}
      <div
        style={{
          color: "#221E45",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <Text
          style={{
            fontSize: "25px",
            fontWeight: "bold",
            whiteSpace: "nowrap",
            marginBottom: "25px", // Adjust this value to move it further up or down
          }}
        >
          OF PARTICIPATION
        </Text>
        <Text style={{ fontSize: "20px", whiteSpace: "nowrap", marginBottom: "15px" }}>
          THIS CERTIFICATE IS PROUDLY PRESENTED TO
        </Text>
        <Text style={{ fontSize: "25px", fontWeight: "bold", whiteSpace: "nowrap", marginBottom: "15px" }}>
          {name}
        </Text>
        <Text style={{ fontSize: "20px", whiteSpace: "nowrap", marginBottom: "15px" }}>
          TO BE A PART OF THE {eventType} ON
        </Text>
        <Text
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            whiteSpace: "nowrap",
          }}
        >
          {webinarr}
        </Text>
      </div>

      {/* Date and Signature */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          position: "absolute",
          bottom: "100px",
          height: "70px",
          width: "100%",
          paddingLeft: "150px",
          paddingRight: "140px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {eventType === "BOOTCAMP" ? (
            <>
              <Text style={{ fontSize: "15px", whiteSpace: "nowrap", marginTop: "50px", marginLeft: "-70px"}}>
                DURATION: {formattedStartDate} To {formattedEndDate}
              </Text>
            </>
          ) : (
            <>
              <Text style={{ fontSize: "20px", whiteSpace: "nowrap", marginTop: "42px" }}>
                {formattedDate}
              </Text>
              <Text style={{ fontSize: "15px", whiteSpace: "nowrap", marginBottom: "32px" }}>DATE</Text>
            </>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Image
            src="https://ik.imagekit.io/webinarITauditing/naman%20signature.png?updatedAt=1715688911693"
            alt="Signature"
            style={{ width: "120px", height: "35px", objectFit: "fill", marginTop: "35px" }}
          />
          <Text style={{ fontSize: "15px", fontWeight: "bold", whiteSpace: "nowrap", marginBottom: "25px" }}>
            NAMAN JAIN
          </Text>
          <Text style={{ fontSize: "12.5px", whiteSpace: "nowrap",marginTop:"-15px" }}>
            SENIOR MANAGER
          </Text>
        </div>
      </div>
    </Paper>
  );
};
