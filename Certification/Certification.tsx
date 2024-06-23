import React, { useState, useRef } from "react";
import { Outlet } from "react-router-dom";
import { Button, TextInput, Select, Modal, Group, Loader } from "@mantine/core";
import * as XLSX from "xlsx";
// import {CertificateGenerator}  from "../components/CertificateGenerator";
import { CertificateGenerator } from "../components/CertificateGenerator";
import jsPDF from "jspdf";
import "../App.css";
import logo from "../images/think_cloudly_logo_transparent.png";
import CourseCompletion from "../components/CourseCompletion";

const Certification: React.FC = () => {
  const [eventName, setEventName] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(""); // New state for start date

  const [completionDate, setCompletionDate] = useState<string>("");
  const [lastRefreshTimestamp, setLastRefreshTimestamp] = useState<
    string | null
  >(null);
  const [data, setData] = useState<any>(null);
  const [displayedData, setDisplayedData] = useState<any[]>([]);
  const [rowsToShow, setRowsToShow] = useState<number>(5);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewedCertificate, setViewedCertificate] =
    useState<JSX.Element | null>(null);
  const [webinarr, webinarname] = useState<string>(""); // State for event type
  // const [eventType, seteventType] = useState<string>("");
  const [generatedCertificates, setGeneratedCertificates] = useState<
    JSX.Element[]
  >([]); // State for generated certificates
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false); // State for confirmation dialog
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state for async actions
  const [mailSendingComplete, setMailSendingComplete] =
    useState<boolean>(false); // State to track mail sending completion
  const [emailLogs, setEmailLogs] = useState<any[]>([]); // State for email logs
  const [showLogModal, setShowLogModal] = useState<boolean>(false); // State to control the log modal visibility

  const formatDateToMMDDYYYY = (dateString: string): string => {
    const [year, month, day] = dateString.split("-");
    return `${month}-${day}-${year}`;
  };

  const handleRefreshData = () => {
    console.log("Refreshing data...");
    setLastRefreshTimestamp(null); // Reset last refresh timestamp
    setData(null); // Clear data
    setDisplayedData([]); // Clear displayed data
    setGeneratedCertificates([]); // Clear generated certificates
    setViewedCertificate(null); // Clear viewed certificate
    setEventName(""); // Reset event name
    setCompletionDate(""); // Reset completion date
    setStartDate(""); // Reset start date
    setCompletionDate(""); // Reset completion date
    webinarname(""); // Reset event type

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input value
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const workbook = XLSX.read(event!.target!.result as string, {
        type: "binary",
      });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(sheet);

      setData(sheetData);
      setDisplayedData(sheetData.slice(0, rowsToShow));
    };

    reader.readAsBinaryString(file);
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleLoadMore = () => {
    setRowsToShow(rowsToShow + 5);
    setDisplayedData(data.slice(0, rowsToShow + 5));
  };
  // console.log(eventName)

  

  const generatePDF = (data: any) => {
    const doc = new jsPDF({
      orientation: "landscape",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const formattedStartDate = formatDateToMMDDYYYY(startDate);
    const formattedCompletionDate = formatDateToMMDDYYYY(completionDate);

    // const pdfDataUri = doc.output("datauristring");
    // const base64Pdf = pdfDataUri.split(",")[1];

    // return base64Pdf;
    if (eventName === "COURSE COMPLETION") {
      // Custom template for Course Completion
      doc.addImage(
        "https://ik.imagekit.io/webinarITauditing/BG%20Template%20Certificate.png?updatedAt=1718192777434",
        "PNG",
        10,
        10,
        pageWidth - 20,
        pageHeight - 20
      );

      doc.setFontSize(25);
      doc.setFont("helvetica", "bold");

      doc.text(`${data.Name}`, pageWidth / 2, pageHeight / 2 + 5, {
        align: "center",
      });

      doc.setFontSize(15);
      doc.setFont("Helvetica", "normal");

      // Split the text into two parts: before and after webinarr
      const textBefore = `for successfully completing the course of `;
      const textAfter = ` `; // space needed to separate bold part
      const boldText = `${webinarr}`;

      // Measure widths to calculate exact positioning
      const textBeforeWidth = doc.getTextWidth(textBefore);
      const boldTextWidth = doc.getTextWidth(boldText);

      // Calculate positions to center-align the combined text
      const startX = pageWidth / 2 - (textBeforeWidth + boldTextWidth) / 2;

      doc.text(textBefore, startX, pageHeight / 2 + 15, { align: "left" });
      doc.setFont("Helvetica", "bold");
      doc.text(boldText, startX + textBeforeWidth, pageHeight / 2 + 15, {
        align: "left",
      });
      doc.setFont("Helvetica", "normal");
      doc.text(
        textAfter,
        startX + textBeforeWidth + boldTextWidth,
        pageHeight / 2 + 15,
        { align: "left" }
      );

      // Organization Name
      doc.setFontSize(15);
      const courseByText = "Course by ";
      const orgNameText = "Thinkcloudly Pvt. Ltd.";
      const courseByWidth = doc.getTextWidth(courseByText);
      const orgNameWidth = doc.getTextWidth(orgNameText);

      doc.text(
        courseByText,
        (pageWidth - (courseByWidth + orgNameWidth)) / 2,
        pageHeight / 2 + 25
      );
      doc.setFont("Helvetica", "bold");
      doc.text(
        orgNameText,
        (pageWidth + (courseByWidth - orgNameWidth)) / 2,
        pageHeight / 2 + 25
      );

      doc.setFontSize(12.5);
      doc.setFont("Helvetica", "normal");
      doc.text(
        `DURATION: ${formattedStartDate} To ${formattedCompletionDate}`,
        pageWidth / 2 - 25,
        pageHeight / 2 + 40,
        { align: "center" }
      );
    } else if (eventName === "BOOTCAMP") {
      // Custom template for Bootcamp
      doc.addImage(
        "https://ik.imagekit.io/2fljt9khj/Ihunanya%20Nwokocha%20(3).png?updatedAt=1718438031843",
        "PNG",
        (pageWidth - (pageWidth - 20)) / 2,
        (pageHeight - (pageHeight - 20)) / 2,
        pageWidth - 20,
        pageHeight - 20
      );

      doc.setFontSize(28);
      doc.setFont("Helvetica", "normal");
      doc.text("OF PARTICIPATION", pageWidth / 2 - 3, 72, { align: "center" });

      doc.setFontSize(23);
      doc.setFont("normal");
      doc.text("THIS CERTIFICATE IS PROUDLY PRESENTED TO", pageWidth / 2, 95, {
        align: "center",
      });

      doc.setFontSize(32);
      doc.text(`${data.Name}`, pageWidth / 2, 113, { align: "center" });

      doc.setFontSize(23);
      doc.text(`TO BE A PART OF THE ${eventName} ON`, pageWidth / 2, 132, {
        align: "center",
      });

      doc.setFontSize(23);
      doc.setFont("Helvetica", "normal");
      doc.text(`${webinarr}`, pageWidth / 2, 147, { align: "center" });

      const formattedDuration = `${formattedStartDate} To ${formattedCompletionDate}`;
      doc.setFontSize(20);
      doc.setFont("normal");
      doc.text(`Duration: ${formattedDuration}`, pageWidth / 4, 165, {
        align: "center",
      });

      doc.addImage(
        "https://ik.imagekit.io/webinarITauditing/naman%20signature.png?updatedAt=1715688911693",
        "PNG",
        200,
        153,
        40,
        12
      );

      doc.setFontSize(15);
      doc.setFont("Helvetica", "normal");
      doc.text("NAMAN JAIN", 220, 175, { align: "center" });

      doc.setFontSize(12.5);
      doc.text("SENIOR MANAGER", 220, 183.5, { align: "center" });
    } else if (eventName === "WEBINAR") {
      // Default template for Webinar
      doc.addImage(
        "https://ik.imagekit.io/webinarITauditing/_Original%20size_%20%20Ayokunmi.png?updatedAt=1715707946948",
        "PNG",
        (pageWidth - (pageWidth - 20)) / 2,
        (pageHeight - (pageHeight - 20)) / 2,
        pageWidth - 20,
        pageHeight - 20
      );

      doc.setFontSize(28);
      doc.setFont("Helvetica", "normal");
      doc.text("OF PARTICIPATION", pageWidth / 2 - 3, 72, { align: "center" });

      doc.setFontSize(23);
      doc.setFont("normal");
      doc.text("THIS CERTIFICATE IS PROUDLY PRESENTED TO", pageWidth / 2, 95, {
        align: "center",
      });

      doc.setFontSize(32);
      doc.text(`${data.Name}`, pageWidth / 2, 113, { align: "center" });

      doc.setFontSize(23);
      doc.text(`TO BE A PART OF THE ${eventName} ON`, pageWidth / 2, 132, {
        align: "center",
      });

      doc.setFontSize(23);
      doc.setFont("Helvetica", "normal");
      doc.text(`${webinarr}`, pageWidth / 2, 147, { align: "center" });

      const formattedDate = formatDateToMMDDYYYY(completionDate);
      doc.setFontSize(20);
      doc.setFont("normal");
      doc.text(`${formattedDate}`, pageWidth / 4, 165, { align: "center" });

      doc.setFontSize(15);
      doc.text("DATE", pageWidth / 4, 175, { align: "center" });
      doc.addImage(
        "https://ik.imagekit.io/webinarITauditing/naman%20signature.png?updatedAt=1715688911693",
        "PNG",
        200,
        153,
        40,
        12
      );

      doc.setFontSize(15);
      doc.setFont("Helvetica", "normal");
      doc.text("NAMAN JAIN", 220, 175, { align: "center" });

      doc.setFontSize(12.5);
      doc.text("SENIOR MANAGER", 220, 183.5, { align: "center" });
    }

    const pdfDataUri = doc.output("datauristring");
    const base64Pdf = pdfDataUri.split(",")[1];

    return base64Pdf;
  };

  // View Certificates
  const handleViewCertificate = (row: any) => {
    if (!eventName.trim() && !completionDate.trim()) {
      alert("Event Name and Completion Date are required");
      return;
    }
    if (!eventName.trim()) {
      alert("Event Name is required");
      return;
    }
    if (!completionDate.trim()) {
      alert("Completion Date is required");
      return;
    }
      // Add validation for start date when BOOTCAMP or COURSE COMPLETION is selected
  if ((eventName === "BOOTCAMP" || eventName === "COURSE COMPLETION") && !startDate.trim()) {
    alert("Start Date is required for Bootcamp or Course Completion");
    return;
  }



    let certificate;
    if (eventName === "COURSE COMPLETION") {
      certificate = (
        <div id={`certificate-${row["Email"]}`} key={row["Email"]}>
          <CourseCompletion
            name={row.Name}
            courseName={webinarr}
            startDate={startDate} // Pass the raw date string
            endDate={completionDate} // Pass the raw date string as endDate
          />
        </div>
      );
    } else if (eventName === "BOOTCAMP") {
      certificate = (
        <div id={`certificate-${row["Email"]}`} key={row["Email"]}>
          <CertificateGenerator
            name={row.Name}
            eventType={eventName}
            startDate={startDate} // Pass the raw start date string
            endDate={completionDate} // Pass the raw end date string
            webinarr={webinarr}
          />
        </div>
      );
    } else {
      certificate = (
        <div id={`certificate-${row["Email"]}`} key={row["Email"]}>
          <CertificateGenerator
            name={row.Name}
            eventType={eventName}
            date={completionDate} // Pass the raw date string
            webinarr={webinarr}
          />
        </div>
      );
    }

    setViewedCertificate(certificate);
  };


  const handleGenerateAndSendEmail = async () => {
    if (!eventName.trim() || !completionDate.trim()) {
      alert("Event Name and Completion Date are required");
      return;
    }
    if ((eventName === "BOOTCAMP" || eventName === "COURSE COMPLETION") && !startDate.trim()) {
      alert("Start Date is required for Bootcamp or Course Completion");
      return;
    }

    setShowConfirmation(true);
  };

  const handleGenerateAndSendEmailConfirmed = async () => {
    setShowConfirmation(false);
    setIsLoading(true);

    // Generate and send certificates for each email
    try {
      const totalEmails = data.length; // Total number of emails to be sent
      let sentEmailsCount = 0; // Counter for sent emails
      const logs = []; // Array to store logs

      for (const row of data) {
        console.log(
          `Preparing to send email ${sentEmailsCount + 1} of ${totalEmails}`
        );
        const pdfData = generatePDF({
          ...row,
          eventName,
          date: completionDate,
        });

        try {
          await sendEmail(row["Email"], pdfData, row["Name"], 0);
          sentEmailsCount++;
          console.log(
            `Successfully sent ${sentEmailsCount} of ${totalEmails} emails`
          );

          // Add successful log
          // logs.push({ name: row["Name"], email: row["Email"], status: "Sent" });

          // Optional: Show status to the user
          alert(
            `Successfully sent ${sentEmailsCount} of ${totalEmails} emails`
          );
        } catch (error) {
          console.error(`Failed to send email to ${row["Email"]}.`, error);

          // Add failed log
          logs.push({
            name: row["Name"],
            email: row["Email"],
            status: "Failed",
          });
        }
      }

      setMailSendingComplete(true); // Set mail sending complete status
      // showLogsPopup(logs); // Show logs popup
    } catch (error) {
      console.error("Failed to send emails.", error);
    } finally {
      setIsLoading(false);
    }
  };
  // Function to show logs in a popup
  // const showLogsPopup = (logs: any[]) => {
  //   const logDetails = logs
  //     .map(
  //       (log) =>
  //         `<p>Name: ${log.name}, Email: ${log.email}, Status: ${log.status}</p>`
  //     )
  //     .join("");

  //   const popupContent = `
  //   <div id="logsPopup" style="position: fixed; top: 0; width: 100%; background: white; border: 1px solid #ccc; z-index: 1000; padding: 10px;">
  //     <h2>Email Logs</h2>
  //     ${logDetails}
  //     <button id="closeLogsButton">Close</button>
  //   </div>
  // `;

  //   document.body.insertAdjacentHTML("afterbegin", popupContent);

  //   // Wait until the DOM updates with the new content
  //   setTimeout(() => {
  //     const closeLogsButton = document.getElementById("closeLogsButton");
  //     if (closeLogsButton) {
  //       closeLogsButton.addEventListener("click", closeLogsPopup);
  //     } else {
  //       console.error("closeLogsButton is null");
  //     }
  //   }, 0);
  // };

  // // Function to close the logs popup
  // const closeLogsPopup = () => {
  //   const popup = document.getElementById("logsPopup");
  //   if (popup) {
  //     popup.remove();
  //   }
  // };

  const sendEmail = (
    email: string,
    pdfData: string,
    name: string,
    sentCertificates: number
  ) => {
    console.log(`Preparing to send email to ${email} with name ${name}`);
    return fetch("https://admin-dashboard-backend-sbu4.onrender.com/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, pdfData, name, eventName, webinarr }),
    })
      .then((response) => {
        console.log(`Received response for email to ${email}:`, response);

        return response.json();
      })
      .then((data) => {
        console.log(`Email sent successfully to ${email}`, data);
        alert(`Email sent successfully to ${email}`);
      })
      .catch((error) => {
        console.error(`Error sending email to ${email}:`, error);
      });
  };

  const handleSendEmail = async (row: any) => {
    console.log("Handling send email for row:", row);

    if (!eventName.trim() && !completionDate.trim()) {
      alert("Event Name and Completion Date are required");
      console.error("Event Name and Completion Date are missing");
      return;
    }
    if (!eventName.trim()) {
      alert("Event Name is required");
      console.error("Event Name is missing");
      return;
    }
    if (!completionDate.trim()) {
      alert("Completion Date is required");
      console.error("Completion Date is missing");
      return;
    }

    setIsLoading(true);
    console.log("Loading state set to true");

    try {
      console.log("Generating PDF for row:", row);
      const pdfData = generatePDF({
        ...row,
        eventName,
        date: completionDate,
      });
      console.log("PDF generated successfully");

      await sendEmail(row["Email"], pdfData, row["Name"], 0);
      setMailSendingComplete(true); // Set mail sending complete status
    } catch (error) {
      console.error(`Failed to send email to ${row["Email"]}`, error);
    } finally {
      setIsLoading(false);
      console.log("Loading state set to false");
    }
  };

  return (
    <div className="container">
      <img src={logo} alt="Logo" className="logo" />
      <div className="horizontal-line"></div>
      <h1>Think Cloudly</h1>
      <div className="horizontal-line"></div>
      <div className="row">
        <div className="form-group">
          <label className="label">Event Name:</label>
          <Select
            id="eventSelect"
            data={[
              { value: "BOOTCAMP", label: "Bootcamp" },
              { value: "WEBINAR", label: "Webinar" },
              { value: "COURSE COMPLETION", label: "Course Completion" },
            ]}
            value={eventName}
            onChange={(value) => setEventName(value ?? "")} // Ensure value is a string
            placeholder="Select event name"
          />
        </div>

        <div className="form-group">
          <label className="label">Specify Event Type:</label>
          <TextInput
            value={webinarr}
            onChange={(event) => webinarname(event.currentTarget.value)}
            placeholder="Enter event type"
          />
        </div>
      </div>
      {eventName === "COURSE COMPLETION" && (
        <>
          <div className="row">
            <div className="form-group">
              <label>Start Date:</label>
              <TextInput
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Completion Date:</label>
              <TextInput
                type="date"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
              />
            </div>
          </div>
        </>
      )}
      {eventName === "BOOTCAMP" && (
        <>
          <div className="row">
            <div className="form-group">
              <label>Start Date:</label>
              <TextInput
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Completion Date:</label>
              <TextInput
                type="date"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
              />
            </div>
          </div>
        </>
      )}
      {eventName !== "COURSE COMPLETION" && eventName !== "BOOTCAMP" && (
        <div className="row">
          <div className="form-group">
            <label>Completion Date:</label>
            <TextInput
              type="date"
              value={completionDate}
              onChange={(e) => setCompletionDate(e.target.value)}
            />
          </div>
        </div>
      )}
      <div className="row">
        <Group>
          <Button onClick={handleButtonClick}>Upload Data</Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
          <Button onClick={handleRefreshData}>Refresh Data</Button>
        </Group>
      </div>
      {lastRefreshTimestamp && (
        <p>Last Refreshed: {new Date(lastRefreshTimestamp).toLocaleString()}</p>
      )}
      {data && (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedData.map((row, index) => (
                  <tr key={index}>
                    <td>{row["Name"]}</td>
                    <td>{row["Email"]}</td>

                    <td>
                      <Button onClick={() => handleViewCertificate(row)}>
                        View
                      </Button>
                      <Button onClick={() => handleSendEmail(row)}>
                        Send Email
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.length > displayedData.length && (
            <Button onClick={handleLoadMore}>Load More</Button>
          )}
          <div className="generate-send-container">
            <Button onClick={handleGenerateAndSendEmail}>
              Generate and Send All Emails
            </Button>
          </div>
          {/* <Button onClick={handleViewLogs}>View Email Logs</Button> */}
        </>
      )}
      {viewedCertificate && (
        <div className="certificate-viewer">
          <h2>Certificate Preview</h2>
          {viewedCertificate}
        </div>
      )}
      <Modal
        opened={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title="Confirmation"
      >
        <p>Are you sure you want to send certificates to all participants?</p>
        <Group>
          <Button onClick={handleGenerateAndSendEmailConfirmed}>Yes</Button>
          <Button onClick={() => setShowConfirmation(false)}>No</Button>
        </Group>
      </Modal>
      {isLoading && !mailSendingComplete && (
        <div className="loading-overlay">
          <Loader size="lg" /> {/* Set size to large */}
        </div>
      )}
      <Outlet />
    </div>
  );
};

export default Certification;

// function showLogsPopup(logs: { name: any; email: any; status: string }[]) {
//   throw new Error("Function not implemented.");
// }
