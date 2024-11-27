// Global student data array
let studentData = [
    { id: 1, name: "John Doe", registerNumber: "210821104045", status: "present" },
    { id: 2, name: "Jane Smith", registerNumber: "210821104046", status: "present" },
    { id: 3, name: "Alice Johnson", registerNumber: "210821104047", status: "present" },
    { id: 4, name: "Bob Lee", registerNumber: "210821104048", status: "present" },
    { id: 5, name: "Chris Green", registerNumber: "210821104049", status: "present" },
    { id: 6, name: "Daisy Adams", registerNumber: "210821104050", status: "present" },
];

document.getElementById('attendanceForm').addEventListener('submit', function(e) {
    e.preventDefault();
    renderTable();
});

function renderTable() {
    let tableHTML = `<table class="table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Register Number</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>`;

    studentData.forEach(student => {
        tableHTML += `
            <tr class="${student.status === 'present' ? 'table-success' : 'table-danger'}">
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.registerNumber}</td>
                <td>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input attendance-radio" type="radio" id="present${student.id}" name="status${student.id}" value="present" ${student.status === 'present' ? 'checked' : ''}
                        onchange="updateAttendance(this, ${student.id}, 'present')">
                        <label class="form-check-label" for="present${student.id}">Present</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input attendance-radio" type="radio" id="absent${student.id}" name="status${student.id}" value="absent" ${student.status === 'absent' ? 'checked' : ''}
                        onchange="updateAttendance(this, ${student.id}, 'absent')">
                        <label class="form-check-label" for="absent${student.id}">Absent</label>
                    </div>
                </td>
            </tr>`;
    });

    tableHTML += `</tbody></table>`;
    document.getElementById('studentDetails').innerHTML = tableHTML;
    updateCounts();
}

function updateAttendance(radio, studentId, status) {
    const row = radio.closest('tr');
    const student = studentData.find(student => student.id === studentId);
    student.status = status;

    if (status === 'present') {
        row.classList.add('table-success');
        row.classList.remove('table-danger');
    } else {
        row.classList.add('table-danger');
        row.classList.remove('table-success');
    }

    updateCounts();
}

function updateCounts() {
    const totalPresent = studentData.filter(student => student.status === 'present').length;
    const totalAbsent = studentData.filter(student => student.status === 'absent').length;
    const totalStudents = studentData.length;

    document.getElementById('totalPresent').innerText = `Number of Present Students: ${totalPresent}`;
    document.getElementById('totalAbsent').innerText = `Number of Absent Students: ${totalAbsent}`;
    document.getElementById('totalStudents').innerText = `Total Students: ${totalStudents}`;
}

document.getElementById('previewBtn').addEventListener('click', function() {
    const content = document.getElementById('studentDetails'); // Element containing your table

    html2canvas(content).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
        });

        const logoUrl = 'assets/kec.jpeg'; // Ensure this URL is correct and accessible

        // Adding the college logo at the top center of the PDF
        pdf.addImage(logoUrl, 'PNG', 10, 10, 190, 30); // Adjust size as necessary

        // Text positions
        const leftColumnX = 10;
        const rightColumnX = 150;
        const headerY = 45;

        pdf.setFontSize(10);
        pdf.text(`Date: ${document.getElementById('date').value || 'N/A'}`, rightColumnX, headerY);
        pdf.text(`Department: ${document.getElementById('department').value || 'N/A'}`, rightColumnX, headerY + 5);
        pdf.text(`Year: ${document.getElementById('year').value || 'N/A'}`, rightColumnX, headerY + 10);
        pdf.text(`Section: ${document.getElementById('section').value || 'N/A'}`, rightColumnX, headerY + 15);

        const totalStudentsText = document.getElementById('totalStudents').innerText.split(": ")[1] || '0';
        const totalPresentText = document.getElementById('totalPresent').innerText.split(": ")[1] || '0';
        const totalAbsentText = document.getElementById('totalAbsent').innerText.split(": ")[1] || '0';
        pdf.text(`Total Students: ${totalStudentsText}`, leftColumnX, headerY);
        pdf.text(`Present: ${totalPresentText}`, leftColumnX, headerY + 5);
        pdf.text(`Absent: ${totalAbsentText}`, leftColumnX, headerY + 10);

        const tableOffsetY = 60;
        pdf.addImage(imgData, 'PNG', 10, tableOffsetY, 190, canvas.height * 190 / canvas.width); // Positioning the table below the header details

        // Trigger the download directly
        pdf.save('attendance_report.pdf');
    }).catch(error => {
        console.error('Error generating PDF:', error);
        alert('An error occurred while generating the PDF.');
    });
});
