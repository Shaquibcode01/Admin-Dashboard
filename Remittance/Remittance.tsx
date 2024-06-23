import React, { useState } from 'react';
import { TextInput, Checkbox, Button } from '@mantine/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import './RemittancePage.css'; // Import custom CSS for styling

const RemittancePage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    date: new Date(),
    groupNumber: '',
    numStudents: '',
    numClasses: '',
    numLeaves: '',
    total: '',
    netAmountPaid: '',
    tdsChecked: false,
    leaveAvoidChecked: false,
    leavePaidChecked: false,
    leaveDeductionAmount: '',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData({ ...formData, date });
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.currentTarget;
    if (name === 'leaveAvoidChecked' && checked) {
      setFormData({ ...formData, leaveAvoidChecked: true, leavePaidChecked: false, leaveDeductionAmount: '' });
    } else if (name === 'leavePaidChecked' && checked) {
      setFormData({ ...formData, leavePaidChecked: true, leaveAvoidChecked: false });
    } else {
      setFormData({ ...formData, [name]: checked });
    }
  };

  const handleCalculate = () => {
    const totalAmount = parseFloat(formData.total) || 0;
    const leaveDeduction = parseFloat(formData.leaveDeductionAmount) || 0;

    let netAmountPaid = totalAmount - leaveDeduction;
    const tdsAmount = formData.tdsChecked ? netAmountPaid * 0.1 : 0;

    netAmountPaid -= tdsAmount;

    const roundedNetAmount = Math.round(netAmountPaid * 100) / 100;

    setFormData({ ...formData, netAmountPaid: roundedNetAmount.toFixed(2) });
  };

  const generateRemittancePDF = () => {
    const { name, contact, date, groupNumber, numStudents, numClasses, numLeaves, total, netAmountPaid, tdsChecked, leaveAvoidChecked, leavePaidChecked, leaveDeductionAmount } = formData;

    const formattedDate = `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;

    const totalAmount = parseFloat(total) || 0;
    const leaveAmount = parseInt(numLeaves) || 0;
    const tdsAmount = tdsChecked ? parseFloat(netAmountPaid) * 0.1 : 0;
    const extraLeaves = leaveAmount > 3 ? leaveAmount - 3 : 0;
    const leaveDeducted = leaveAvoidChecked ? 'NA' : leavePaidChecked ? `${leaveDeductionAmount}/-` : 'NA';

    const data = {
      issueDate: formattedDate,
      trainerName: name,
      trainerContact: contact,
      workDetails: [
        {
          date: formattedDate,
          groupNumber: groupNumber,
          numStudents: parseInt(numStudents) || 0,
          numClasses: parseInt(numClasses) || 0,
          totalLeaves: leaveAmount,
          amount: `${totalAmount.toFixed(2)}/-`,
        },
      ],
      extraLeaves: extraLeaves > 0 ? extraLeaves.toString() : 'NA',
      leaveAmountDeducted: leaveDeducted,
      tdsDeducted: tdsChecked ? `${tdsAmount.toFixed(2)}/-` : 'NA',
      netAmountPaid: `${netAmountPaid}/-`,
    };

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    doc.setFont('courier', 'normal');
    doc.setFontSize(10);

    doc.text('Remittance Advice', pageWidth / 2, 8, { align: 'center' });
    doc.text(`Issue Date: ${data.issueDate}`, 8, 18);
    doc.text(`Trainer Name: ${data.trainerName}`, 8, 28);
    doc.text(`Trainer Contact: ${data.trainerContact}`, 8, 38);

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

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.text('Final payment after Deductions:', 8, finalY);

    (doc as any).autoTable({
      startY: finalY + 10,
      head: [['No. of Extra Leaves', 'Leave Amount Deducted', 'TDS 10% Deducted', 'Net Amount Paid']],
      body: [
        [data.extraLeaves, data.leaveAmountDeducted, data.tdsDeducted, data.netAmountPaid]
      ],
      theme: 'grid',
    });

    const contactY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(10);
    doc.text('For any payment-related queries, please contact: mukesh.kumar@thinkcloudly.com', 8, contactY);
    doc.text('Thank you for your services. We appreciate your partnership.', 8, contactY + 10);

    doc.text('By:', 8, contactY + 20);
    doc.text('Namrata Arora', 8, contactY + 30);

    doc.text('This is a computerized document and does not require a physical signature.', 8, contactY + 40);

    const footerY = doc.internal.pageSize.height - 20;

    doc.setFontSize(8);
    doc.text('1111-21 Iceboat Terr, Toronto, Ontario M5V 4A9', pageWidth / 2, footerY, { align: 'center' });
    doc.text('+1 (725) 710-9949   info@thinkcloudly.com   www.thinkcloudly.com', pageWidth / 2, footerY + 10, { align: 'center' });

    return doc;
  };

  const handleSendEmail = () => {
    const doc = generateRemittancePDF();
    const pdfBase64 = doc.output('datauristring').split(',')[1]; // Extract base64 part of the data URI

    axios.post('http://localhost:8000/send-remittance-email', {
      email: formData.email,
      pdfData: pdfBase64,
    })
    .then(response => {
      console.log('Email sent successfully:', response.data);
    })
    .catch(error => {
      console.error('Error sending email:', error);
    });
  };

  return (
    <div className="remittance-page">
      <div className="section">
        <h2>VENDOR DETAILS:</h2>
        <div className="input-group">
          <TextInput
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter name"
          />
          <TextInput
            label="Contact"
            name="contact"
            value={formData.contact}
            onChange={handleInputChange}
            placeholder="Enter contact number"
          />
          <TextInput
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter email"
          />
        </div>
      </div>

      <div className="section">
        <h2>BATCH DETAILS:</h2>
        <div className="input-group">
          <div>
            <label>Issue Date:</label>
            <br />
            <DatePicker
              selected={formData.date}
              onChange={handleDateChange}
              dateFormat="dd MMMM yyyy"
              placeholderText="Select issue date"
              className="date-picker"
            />
          </div>
          <TextInput
            label="Group Number"
            name="groupNumber"
            value={formData.groupNumber}
            onChange={handleInputChange}
            placeholder="Enter group number"
          />
          <TextInput
            label="Number of Students"
            name="numStudents"
            value={formData.numStudents}
            onChange={handleInputChange}
            placeholder="Enter number of students"
          />
          <TextInput
            label="Number of Classes"
            name="numClasses"
            value={formData.numClasses}
            onChange={handleInputChange}
            placeholder="Enter number of classes"
          />
          <TextInput
            label="Number of Leaves"
            name="numLeaves"
            value={formData.numLeaves}
            onChange={handleInputChange}
            placeholder="Enter number of Leaves"
          />
          <TextInput
            label="Total Amount"
            name="total"
            value={formData.total}
            onChange={handleInputChange}
            placeholder="Enter total amount"
          />
          <div className="total">
            <label>Net Amount Paid:</label>
            <span>{formData.netAmountPaid}</span>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Checkboxes:</h2>
        <div className="checkbox-group">
          <Checkbox
            label="TDS"
            name="tdsChecked"
            checked={formData.tdsChecked}
            onChange={handleCheckboxChange}
          />
          <Checkbox
            label="Leave Avoid"
            name="leaveAvoidChecked"
            checked={formData.leaveAvoidChecked}
            onChange={handleCheckboxChange}
          />
          {formData.leavePaidChecked && (
            <div className="manual-leave-deduction">
              <TextInput
                label="Leave Amount Deducted"
                name="leaveDeductionAmount"
                value={formData.leaveDeductionAmount}
                onChange={handleInputChange}
                placeholder="Enter leave deduction amount"
              />
            </div>
          )}
          <Checkbox
            label="Leave Paid"
            name="leavePaidChecked"
            checked={formData.leavePaidChecked}
            onChange={handleCheckboxChange}
          />
        </div>
      </div>

      <div className="section">
        <Button onClick={handleCalculate}>Calculate</Button>
        <Button onClick={handleSendEmail}>Send Mail</Button>
      </div>
    </div>
  );
};

export default RemittancePage;
