

document.addEventListener('DOMContentLoaded', function () {
    // IndexedDB setup
    let db;
    const request = indexedDB.open('Users_DB', 6);

    request.onerror = function (event) {
        console.error('Database error:', event.target.errorCode);
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        console.log('Database opened successfully');
    };

    request.onupgradeneeded = function (event) {
        db = event.target.result;

        // Create PatientData table
        if (!db.objectStoreNames.contains('PatientData')) {
            const objectStore = db.createObjectStore('PatientData', { keyPath: 'id', autoIncrement: true });
            objectStore.createIndex('patientName', 'patientName', { unique: false });
            objectStore.createIndex('patientEmail', 'patientEmail', { unique: false });
            objectStore.createIndex('patientPhone', 'patientPhone', { unique: false });
            objectStore.createIndex('appointmentTime', 'appointmentTime', { unique: false });
            objectStore.createIndex('appointmentDate', 'appointmentDate', { unique: false });
            objectStore.createIndex('doctorFee', 'doctorFee', { unique: false });
            objectStore.createIndex('doctorName', 'doctorName', { unique: false });

            console.log('PatientData table created');
        }
    };

    // Mocked data
    const doctorsData = {
        "Monday": [
            { id: 1, name: "Dr. Smith", fees: 100, timeSlots: ["9:00 AM", "10:00 AM", "11:00 AM"] },
            { id: 2, name: "Dr. Johnson", fees: 150, timeSlots: ["2:00 PM", "3:00 PM"] }
        ],
        "Tuesday": [
            { id: 3, name: "Dr. Williams", fees: 200, timeSlots: ["10:00 AM", "11:00 AM"] }
        ]
    };

    const appointmentss = [];

    // ... [Existing UI setup code here] ...

    function bookAppointment() {
        const day = document.getElementById('day-select').value;
        const doctorId = document.getElementById('doctor-select').value;
        const timeSlot = document.getElementById('timeslot-select').value;
        const patientName = prompt("Enter patient's name:");
        const patientEmail = prompt("Enter patient's email:");
        const patientPhone = prompt("Enter patient's phone number:");

        if (!day || !doctorId || !timeSlot || !patientName || !patientEmail || !patientPhone) {
            alert("Please complete all steps.");
            return;
        }

        const doctor = getDoctorById(doctorId);
        const appointment = {
            day,
            doctorId: parseInt(doctorId),
            timeSlot,
            patientName,
            patientEmail,
            patientPhone,
            doctorFee: doctor.fees,
            doctorName: doctor.name
        };

        // Store appointment in IndexedDB
        const transaction = db.transaction(['PatientData'], 'readwrite');
        const objectStore = transaction.objectStore('PatientData');
        const request = objectStore.add(appointment);

        request.onsuccess = function () {
            console.log('Appointment stored in database:', appointment);
        };

        request.onerror = function (event) {
            console.error('Error storing appointment:', event.target.errorCode);
        };

        appointmentss.push(appointment);
        document.getElementById('confirmation-message').classList.remove('hidden');
        displayAppointments();
    }

    // ... [Existing displayAppointments, editAppointment, deleteAppointment functions here] ...

    function getDoctorById(id) {
        for (let day in doctorsData) {
            for (let doctor of doctorsData[day]) {
                if (doctor.id === parseInt(id)) {
                    return doctor;
                }
            }
        }
        return null;
    }

    // Event listeners for file import/export
    // document.addEventListener('DOMContentLoaded', function() {
        // Mocked data
        const doctorsDatas = {
            "Monday": [
                { id: 1, name: "Dr. Smith", fees: 100, timeSlots: ["9:00 AM", "10:00 AM", "11:00 AM"] },
                { id: 2, name: "Dr. Johnson", fees: 150, timeSlots: ["2:00 PM", "3:00 PM"] }
            ],
            "Tuesday": [
                { id: 3, name: "Dr. Williams", fees: 200, timeSlots: ["10:00 AM", "11:00 AM"] }
            ]
        };
    
        const appointments = [];
    
        // Create UI Elements
        const container = document.createElement('div');
        container.className = 'container mx-auto p-4';
        document.body.appendChild(container);
    
        const title = document.createElement('h1');
        title.className = 'text-2xl font-bold mb-4';
        title.textContent = 'Patient Scheduling System';
        container.appendChild(title);
    
        // Step 1: Select Day
        const step1 = document.createElement('div');
        step1.id = 'step-1';
        step1.className = 'mb-4';
    
        const selectDayLabel = document.createElement('h2');
        selectDayLabel.className = 'text-xl mb-2';
        selectDayLabel.textContent = 'Select a Day';
        step1.appendChild(selectDayLabel);
    
        const daySelect = document.createElement('select');
        daySelect.id = 'day-select';
        daySelect.className = 'p-2 border rounded';
        daySelect.innerHTML = `
            <option value="">Select Day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
        `;
        step1.appendChild(daySelect);
    
        const showDoctorsBtn = document.createElement('button');
        showDoctorsBtn.textContent = 'Show Doctors';
        showDoctorsBtn.className = 'ml-2 p-2 bg-blue-500 text-white rounded';
        showDoctorsBtn.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent any default action that might cause navigation
            fetchDoctors();
        });
        step1.appendChild(showDoctorsBtn);
    
        container.appendChild(step1);
    
        // Step 2: Select Doctor
        const step2 = document.createElement('div');
        step2.id = 'step-2';
        step2.className = 'mb-4 hidden';
    
        const selectDoctorLabel = document.createElement('h2');
        selectDoctorLabel.className = 'text-xl mb-2';
        selectDoctorLabel.textContent = 'Select a Doctor';
        step2.appendChild(selectDoctorLabel);
    
        const doctorSelect = document.createElement('select');
        doctorSelect.id = 'doctor-select';
        doctorSelect.className = 'p-2 border rounded';
        step2.appendChild(doctorSelect);
    
        const showTimeSlotsBtn = document.createElement('button');
        showTimeSlotsBtn.textContent = 'Show Time Slots';
        showTimeSlotsBtn.className = 'ml-2 p-2 bg-blue-500 text-white rounded';
        showTimeSlotsBtn.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent any default action that might cause navigation
            fetchTimeSlots();
        });
        step2.appendChild(showTimeSlotsBtn);
    
        container.appendChild(step2);
    
        // Step 3: Select Time Slot and View Fees
        const step3 = document.createElement('div');
        step3.id = 'step-3';
        step3.className = 'mb-4 hidden';
    
        const selectTimeSlotLabel = document.createElement('h2');
        selectTimeSlotLabel.className = 'text-xl mb-2';
        selectTimeSlotLabel.textContent = 'Select a Time Slot';
        step3.appendChild(selectTimeSlotLabel);
    
        const timeslotSelect = document.createElement('select');
        timeslotSelect.id = 'timeslot-select';
        timeslotSelect.className = 'p-2 border rounded';
        step3.appendChild(timeslotSelect);
    
        const feesInfo = document.createElement('div');
        feesInfo.id = 'fees-info';
        feesInfo.className = 'mt-2';
        step3.appendChild(feesInfo);
    
        const bookAppointmentBtn = document.createElement('button');
        bookAppointmentBtn.textContent = 'Book Appointment';
        bookAppointmentBtn.className = 'mt-4 p-2 bg-green-500 text-white rounded';
        bookAppointmentBtn.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent any default action that might cause navigation
            bookAppointment();
        });
        step3.appendChild(bookAppointmentBtn);
    
        container.appendChild(step3);
    
        // Step 4: Manage Appointments (CRUD)
        const step4 = document.createElement('div');
        step4.id = 'step-4';
        step4.className = 'mb-4';
    
        const manageAppointmentsLabel = document.createElement('h2');
        manageAppointmentsLabel.className = 'text-xl mb-2';
        manageAppointmentsLabel.textContent = 'Manage Appointments';
        step4.appendChild(manageAppointmentsLabel);
    
        const appointmentsList = document.createElement('ul');
        appointmentsList.id = 'appointments-list';
        step4.appendChild(appointmentsList);
    
        container.appendChild(step4);
    
        // Confirmation Message
        const confirmationMessage = document.createElement('div');
        confirmationMessage.id = 'confirmation-message';
        confirmationMessage.className = 'mt-4 hidden p-4 bg-green-100 text-green-800 border border-green-200 rounded';
        confirmationMessage.textContent = 'Appointment booked successfully!';
        container.appendChild(confirmationMessage);
    
        function fetchDoctors() {
            const day = document.getElementById('day-select').value;
    
            if (!day) {
                alert("Please select a day.");
                return;
            }
    
            const doctors = doctorsDatas[day] || [];
            doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
            doctors.forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor.id;
                option.textContent = doctor.name;
                doctorSelect.appendChild(option);
            });
    
            document.getElementById('step-2').classList.remove('hidden');
        }
    
        function fetchTimeSlots() {
            const doctorId = document.getElementById('doctor-select').value;
    
            if (!doctorId) {
                alert("Please select a doctor.");
                return;
            }
    
            const doctor = getDoctorById(doctorId);
            timeslotSelect.innerHTML = '<option value="">Select Time Slot</option>';
            doctor.timeSlots.forEach(slot => {
                const option = document.createElement('option');
                option.value = slot;
                option.textContent = slot;
                timeslotSelect.appendChild(option);
            });
    
            feesInfo.textContent = `Fees: $${doctor.fees}`;
            document.getElementById('step-3').classList.remove('hidden');
        }
    
        function bookAppointment() {
            const day = document.getElementById('day-select').value;
            const doctorId = document.getElementById('doctor-select').value;
            const timeSlot = document.getElementById('timeslot-select').value;
    
            if (!day || !doctorId || !timeSlot) {
                alert("Please complete all steps.");
                return;
            }
    
            const appointment = {
                id: appointments.length + 1,
                day,
                doctorId: parseInt(doctorId),
                timeSlot
            };
    
            appointmentss.push(appointment);
            document.getElementById('confirmation-message').classList.remove('hidden');
            displayAppointments();
        }
    
        function displayAppointments() {
            appointmentsList.innerHTML = '';
    
            appointments.forEach(appointment => {
                const doctor = getDoctorById(appointment.doctorId);
                const listItem = document.createElement('li');
                listItem.className = 'mb-2 p-2 border rounded';
                listItem.textContent = `Appointment ${appointment.id}: ${doctor.name} on ${appointment.day} at ${appointment.timeSlot}`;
    
                const editBtn = document.createElement('button');
                editBtn.textContent = 'Edit';
                editBtn.className = 'ml-2 p-1 bg-yellow-500 text-white rounded';
                editBtn.addEventListener('click', () => editAppointment(appointment.id));
                listItem.appendChild(editBtn);
    
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.className = 'ml-2 p-1 bg-red-500 text-white rounded';
                deleteBtn.addEventListener('click', () => deleteAppointment(appointment.id));
                listItem.appendChild(deleteBtn);
    
                appointmentsList.appendChild(listItem);
            });
        }
    
        function editAppointment(appointmentId) {
            const appointment = appointments.find(app => app.id === appointmentId);
    
            if (!appointment) {
                alert("Appointment not found.");
                return;
            }
    
            // Populate the form with the existing appointment details
            document.getElementById('day-select').value = appointment.day;
            fetchDoctors();
            document.getElementById('doctor-select').value = appointment.doctorId;
            fetchTimeSlots();
            document.getElementById('timeslot-select').value = appointment.timeSlot;
    
            // Delete the existing appointment
            deleteAppointment(appointmentId);
        }
    
        function deleteAppointment(appointmentId) {
            const index = appointments.findIndex(app => app.id === appointmentId);
            if (index !== -1) {
                appointments.splice(index, 1);
                displayAppointments();
            }
        }
    
        function getDoctorById(id) {
            for (let day in doctorsDatas) {
                for (let doctor of doctorsDatas[day]) {
                    if (doctor.id === parseInt(id)) {
                        return doctor;
                    }
                }
            }
            return null;
        }
    
        // File Import/Export
        function exportAppointments() {
            const blob = new Blob([JSON.stringify(appointments, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'appointments.json';
            a.click();
            URL.revokeObjectURL(url);
        }
    
        function importAppointments(file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const data = JSON.parse(event.target.result);
                appointments.length = 0; // Clear existing appointments
                appointmentss.push(...data);
                displayAppointments();
            };
            reader.readAsText(file);
        }
    
        // Event listeners for file import/export
        document.getElementById('export-btn')?.addEventListener('click', exportAppointments);
    
        document.getElementById('import-input')?.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                importAppointments(file);
            }
        });
    // });
});
