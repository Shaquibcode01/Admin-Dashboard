import React, { useState } from 'react';
import { TextInput, Checkbox, Button } from '@mantine/core'; // Assuming you use Mantine for UI components
import logo from "../images/think_cloudly_logo_transparent.png";

import jsPDF from 'jspdf';
import 'jspdf-autotable';

const generateRemittancePDF = () => {
  const data = {
    issueDate: '28th May 2024',
    trainerName: 'Amtul Sana',
    trainerContact: '9885026824',
    workDetails: [
      {
        date: '21st May',
        groupNumber: 'Cyber - 981',
        numStudents: 2,
        numClasses: 38,
        totalLeaves: 2,
        amount: '15000/-'
      }
    ],
    extraLeaves: 'NA',
    leaveAmountDeducted: 'NA',
    tdsDeducted: '1500/-',
    netAmountPaid: '13500/-'
  };

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Set font and sizes
  doc.setFont('courier', 'normal');
  doc.setFontSize(10);

  // Issue Date and Trainer Details
  doc.text('Remittance Advice', pageWidth / 2, 8, { align: 'center' });
  doc.text(`Issue Date: ${data.issueDate}`, 8, 18);
  doc.text(`Trainer Name: ${data.trainerName}`, 8, 28);
  doc.text(`Trainer Contact: ${data.trainerContact}`, 8, 38);

  // Table for Work Details
  (doc as any).autoTable({
    startY: 50,
    head: [['Date', 'Group Number', 'No. of Students', 'No. of Classes', 'Total Leaves', 'Amount']],
    body: data.workDetails.map(item => [
      item.date,
      item.groupNumber,
      item.numStudents.toString(),
      item.numClasses.toString(),
      item.totalLeaves.toString(),
      item.amount
    ]),
    theme: 'grid',
  });

  // Final Payment Details
  const finalY = (doc as any).lastAutoTable.finalY + 10;

  doc.setFontSize(12);
  doc.text('Final payment after Deductions:', 8, finalY);

  // Table for Deductions and Final Payment
  (doc as any).autoTable({
    startY: finalY + 10,
    head: [['No. of Extra Leaves', 'Leave Amount Deducted', 'TDS 10% Deducted', 'Net Amount Paid']],
    body: [
      [data.extraLeaves, data.leaveAmountDeducted, data.tdsDeducted, data.netAmountPaid]
    ],
    theme: 'grid',
  });

  // Contact Information
  const contactY = (doc as any).lastAutoTable.finalY + 10;

  doc.setFontSize(10);
  doc.text('For any payment-related queries, please contact: mukesh.kumar@thinkcloudly.com', 8, contactY);
  doc.text('Thank you for your services. We appreciate your partnership.', 8, contactY + 10);

  // Sign off
  doc.text('By:', 8, contactY + 20);
  doc.text('Namrata Arora', 8, contactY + 30);

  doc.text('This is a computerized document and does not require a physical signature.', 8, contactY + 40);

  // Footer
  const footerY = doc.internal.pageSize.height - 20;

  doc.setFontSize(8);
  doc.text('1111-21 Iceboat Terr, Toronto, Ontario M5V 4A9', pageWidth / 2, footerY, { align: 'center' });
  doc.text('+1 (725) 710-9949   info@thinkcloudly.com   www.thinkcloudly.com', pageWidth / 2, footerY + 10, { align: 'center' });

  // Save the PDF
  doc.save('Remittance_Advice.pdf');

};


const RemittancePage = () => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [groupNumber, setGroupNumber] = useState('');
  const [numStudents, setNumStudents] = useState('');
  const [numClasses, setNumClasses] = useState('');
  const [numLeaves, setNumLeaves] = useState('');

  const [total, setTotal] = useState(0);
  const [tdsChecked, setTdsChecked] = useState(false);
  const [leaveAvoidChecked, setLeaveAvoidChecked] = useState(false);
  const [leavePaidChecked, setLeavePaidChecked] = useState(false);

  const handleCalculate = () => {
    // Calculate total based on inputs
    const calculatedTotal = parseFloat(groupNumber) * parseFloat(numStudents) * parseFloat(numClasses);
    setTotal(calculatedTotal);
  };

  return (
    <div className="remittance-page">
      <div className="section">
        <h2>VENDOR DETAILS:</h2>
        <div className="input-group">
          <TextInput
            label="Name"
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
            placeholder="Enter name"
          />
          <TextInput
            label="Contact"
            value={contact}
            onChange={(event) => setContact(event.currentTarget.value)}
            placeholder="Enter contact number"
          />
          <TextInput
            label="Email"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            placeholder="Enter email"
          />
        </div>
      </div>

      <div className="section">
        <h2>BATCH DETAILS:</h2>
        <div className="input-group">
          <TextInput
            label="Group Number"
            value={groupNumber}
            onChange={(event) => setGroupNumber(event.currentTarget.value)}
            placeholder="Enter group number"
          />
          <TextInput
            label="Number of Students"
            value={numStudents}
            onChange={(event) => setNumStudents(event.currentTarget.value)}
            placeholder="Enter number of students"
          />
          <TextInput
            label="Number of Classes"
            value={numClasses}
            onChange={(event) => setNumClasses(event.currentTarget.value)}
            placeholder="Enter number of classes"
          />
           <TextInput
            label="Number of Leaves"
            value={numLeaves}
            onChange={(event) => setNumLeaves(event.currentTarget.value)}
            placeholder="Enter number of Leaves"
          />
          <div className="total">
            <label>Total:</label>
            <span>{total}</span>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Amount:</h2>
        <div className="amount">
          <span>{total}</span>
        </div>
      </div>

      <div className="section">
        <h2>Checkboxes:</h2>
        <div className="checkbox-group">
          <Checkbox
            label="TDS"
            checked={tdsChecked}
            onChange={(event) => setTdsChecked(event.currentTarget.checked)}
          />
          <Checkbox
            label="Leave Avoid"
            checked={leaveAvoidChecked}
            onChange={(event) => setLeaveAvoidChecked(event.currentTarget.checked)}
          />
          <Checkbox
            label="Leave Paid"
            checked={leavePaidChecked}
            onChange={(event) => setLeavePaidChecked(event.currentTarget.checked)}
          />
        </div>
      </div>

      <div className="section">
        <Button onClick={handleCalculate}>Calculate</Button>
      </div>
      <div>
      <button onClick={generateRemittancePDF}>Generate Remittance PDF</button>
    </div>
    </div>
  );
};

export default RemittancePage;
