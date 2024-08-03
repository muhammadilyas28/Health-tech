document.addEventListener('DOMContentLoaded', function() {
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
    showDoctorsBtn.addEventListener('click', fetchDoctors);
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
    showTimeSlotsBtn.addEventListener('click', fetchTimeSlots);
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
    bookAppointmentBtn.addEventListener('click', bookAppointment);
    step3.appendChild(bookAppointmentBtn);

    container.appendChild(step3);

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

        const doctors = doctorsData[day] || [];
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
            day,
            doctorId,
            timeSlot
        };

        appointments.push(appointment);
        document.getElementById('confirmation-message').classList.remove('hidden');
    }

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
            appointments.push(...data);
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
});
