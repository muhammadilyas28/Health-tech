// --------------------PATIENT APPOINTMENT FORM---------------------
let patient_form = document.getElementById("patient_form");
export function patient_form_starter() {
    let db;
    let request = window.indexedDB.open('appointmentsDB', 2);


    patient_form.className = 'patientform_displayBlock';

    // Open (or create) the IndexedDB database

    // Handle database creation or upgrade
    request.onupgradeneeded = function (event) {
        db = event.target.result;

        // Create an object store (like a table) to store patient appointments
        let objectStore = db.createObjectStore('appointments', { keyPath: 'id', autoIncrement: true });

        // Define the schema(Name) of the IndexedDB
        objectStore.createIndex('patientData', 'patientData');

        console.log('Database setup complete');
    };

    // Handle successful database opening
    request.onsuccess = function (event) {
        db = event.target.result;
        console.log('Database opened successfully');
    };

    // Handle database errors
    request.onerror = function (event) {
        console.error('Database error:', event.target.errorCode);
    };
}
function initializeDatabase() {
    let request = window.indexedDB.open('appointmentsDB', 2);

    request.onupgradeneeded = function (event) {
        let db = event.target.result;

        // Create the object store with the ID keyPath
        if (!db.objectStoreNames.contains('appointments')) {
            let objectStore = db.createObjectStore('appointments', { keyPath: 'id', autoIncrement: true });

            // Create a unique index on the phone number
            objectStore.createIndex('phone', 'patientPhone', { unique: true });
        }
    };

    request.onerror = function (event) {
        console.error('Database error:', event.target.errorCode);
    };
}

// Call this function when initializing the app
initializeDatabase();

function checkPhoneNumberExists(phoneNumber, callback) {
    let request = window.indexedDB.open('appointmentsDB', 2);

    request.onsuccess = function (event) {
        let db = event.target.result;
        let transaction = db.transaction(['appointments'], 'readonly');
        let objectStore = transaction.objectStore('appointments');
        let index = objectStore.index('phone'); // Access the unique index on phone

        let query = index.get(phoneNumber);

        query.onsuccess = function (event) {
            if (event.target.result) {
                // Phone number already exists
                callback(true);
            } else {
                // Phone number does not exist
                callback(false);
            }
        };

        query.onerror = function (event) {
            console.error('Error checking phone number:', event.target.errorCode);
            callback(false);
        };
    };

    request.onerror = function (event) {
        console.error('Database error:', event.target.errorCode);
        callback(false);
    };
}


// function saveAppointmentToDB(appointmentData) {
//     checkPhoneNumberExists(appointmentData.patientPhone, function (exists) {
//         if (exists) {
//             alert('Phone number already exists. Please use a different phone number.');
//             return;
//         }

//         let request = window.indexedDB.open('appointmentsDB', 2);

//         request.onsuccess = function (event) {
//             let db = event.target.result;

//             let transaction = db.transaction(['appointments'], 'readwrite');
//             let objectStore = transaction.objectStore('appointments');

//             let addRequest = objectStore.add(appointmentData);

//             addRequest.onsuccess = function (event) {
//                 console.log('Appointment saved to database');
//             };

//             addRequest.onerror = function (event) {
//                 console.error('Error saving appointment:', event.target.error);
//             };

//             transaction.oncomplete = function (event) {
//                 console.log('Transaction completed successfully');
//             };

//             transaction.onerror = function (event) {
//                 console.error('Transaction error:', event.target.error);
//             };
//         };

//         request.onerror = function (event) {
//             console.error('Database error:', event.target.errorCode);
//         };
//     });
// }



// Function to save form data to IndexedDB
// Function to save form data to IndexedDB
function saveAppointmentToDB(appointmentData) {
    let requesti = window.indexedDB.open('appointmentsDB', 2);

    requesti.onupgradeneeded = function (event) {
        let db = event.target.result;
        if (!db.objectStoreNames.contains('appointments')) {
            db.createObjectStore('appointments', { keyPath: 'id', autoIncrement: true });
        }
    };

    requesti.onsuccess = function (event) {
        let db = event.target.result;
        console.log("db --> ", db)

        let transaction = db.transaction(['appointments'], 'readwrite');
        console.log("transaction --> ", transaction)

        let objectStore = transaction.objectStore('appointments');
        console.log("objectStore --> ", objectStore)

        // Add the appointment data to the object store
        let requestiz = objectStore.add(appointmentData);

        // Handle successful addition
        requestiz.onsuccess = function (event) {
            console.log('Appointment saved to database');
        };

        // Handle errors
        requestiz.onerror = function (event) {
            console.error('Error saving appointment:', event.target.error);
        };
    };

    requesti.onerror = function (event) {
        console.error('Database error:', event.target.errorCode);
    };
}

import createReceipt from './recipetfile.js'
let appointmentData = ""
// Function to submit the form

function submitForm(event) {
    console.log(event);

    event.preventDefault(); // Prevent form submission

    // Fetch values from form   

    let patient_Name = document.getElementById('patientName')
    let doctor_name = document.getElementById('doctorsList')
    console.log(doctor_name);
    let appointment_Date = document.getElementById('appointmentDate')
    let appointment_Time = document.getElementById('appointmentTime')
    let email_patient = document.getElementById('email')
    let phone_patient = document.getElementById('phone')
    let payment_Type = document.getElementById('paymentType')
    let amount = document.getElementById('amount')
    let comments_ = document.getElementById('comments')

    // Create an object with the form data
    appointmentData = {

        patientName: patient_Name.value,
        patientPhone: phone_patient.value,
        appointmentDate: appointment_Date.value,
        appointmentTime: appointment_Time.value,
        patient_email: email_patient.value,
        doctor: doctor_name.value,
        paymentType: payment_Type.value,
        comments: comments_.value,
        amounts: amount.value

    };
    console.log(appointmentData);

    // Save the data to IndexedDB
    saveAppointmentToDB(appointmentData);


    // createReceipt.saveDetails(appointmentData);
    idbToReciptFile(appointmentData)


    // Optional: Reset the form after submission
    document.getElementById('appointmentForm').reset();
}

function idbToReciptFile(appointmentData) {
    document.getElementById('patient_n').innerText += appointmentData.patientName
    document.getElementById('doctor_n').innerText += appointmentData.doctor
    document.getElementById('appointment_D').innerText += appointmentData.appointmentDate
    document.getElementById('appointment_T').innerText += appointmentData.appointmentTime
    document.getElementById('patient_e').innerText += appointmentData.patient_email
    document.getElementById('patient_p').innerText += appointmentData.patientPhone
    document.getElementById('patient_pay').innerText += appointmentData.paymentType
    document.getElementById('patient_c').innerText += appointmentData.comments
    document.getElementById('patient_amut').innerText += appointmentData.amounts
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    document.getElementById('invoice_date').innerText += `${day}-${month}-${year}`

}

let submitButton = null;


export function createAppointmentForm() {
    const dummyDoctors = ['Dr. Smith', 'Dr. Johnson', 'Dr. Brown'];

    const calendarContainer = document.createElement('div');
    calendarContainer.id = 'calendar-container';
    document.body.appendChild(calendarContainer);

    const popupContainer = document.createElement('div');
    popupContainer.id = 'popupContainer';
    document.body.appendChild(popupContainer);

    const formContainer = document.createElement('div');
    formContainer.id = 'formContainer';
    formContainer.style.display = 'block';
    document.body.appendChild(formContainer);

    const patientForm = document.createElement('div');
    patientForm.id = 'patient_form';
    document.body.appendChild(patientForm);
    const container = document.getElementById('formContainer');
    container.style.display = 'none';
    container.style.width = '80%';

    const formContainers = document.createElement('div');
    formContainers.id = 'patient_form';
    formContainers.className = 'bg-white p-8 rounded-lg shadow-lg w-screen';
    formContainers.style.padding = '30px';
    formContainers.style.borderRadius = '11px';

    const formTitle = document.createElement('h2');
    formTitle.className = 'text-2xl font-bold mb-6 text-gray-800';
    formTitle.textContent = 'Patient Appointment Form';
    formContainers.appendChild(formTitle);

    const form = document.createElement('form');
    form.id = 'appointmentForm';
    form.onsubmit = (event) => submitForm(event);
    formContainers.appendChild(form);

    // Create the patient name field
    const patientNameDiv = document.createElement('div');
    patientNameDiv.className = 'mb-4 flex flex-row gap-5 justify-center items-center';
    const patientNameLabel = document.createElement('label');
    patientNameLabel.className = 'block text-gray-700 font-bold';
    patientNameLabel.htmlFor = 'patientName';
    patientNameLabel.textContent = 'Patient Name:';
    const patientNameInput = document.createElement('input');
    patientNameInput.type = 'text';
    patientNameInput.id = 'patientName';
    patientNameInput.name = 'patientName';
    patientNameInput.className = 'mt-1 w-[40%] border border-gray-300 rounded-md shadow-sm p-2 text-black focus:ring-indigo-500 focus:border-indigo-500';
    patientNameInput.required = true;
    patientNameDiv.appendChild(patientNameLabel);
    patientNameDiv.appendChild(patientNameInput);
    form.appendChild(patientNameDiv);

    // Create the doctor dropdown field
    const doctorDiv = document.createElement('div');
    doctorDiv.className = 'mb-4 flex flex-row gap-5 justify-center items-center';
    const doctorLabel = document.createElement('label');
    doctorLabel.className = 'block text-gray-700 font-bold';
    doctorLabel.htmlFor = 'doctor';
    doctorLabel.textContent = 'Doctor:';
    const doctorSelect = document.createElement('select');
    doctorSelect.id = 'doctorsList';
    doctorSelect.name = 'doctor';
    doctorSelect.className = 'mt-1 w-[40%] border border-gray-300 rounded-md shadow-sm p-2 text-black focus:ring-indigo-500 focus:border-indigo-500';
    doctorSelect.required = true;

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Doctor';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    doctorSelect.appendChild(defaultOption);

    dummyDoctors.forEach(doctor => {
        console.log(doctor);
        const optionElement = document.createElement('option');
        optionElement.value = doctor;
        optionElement.textContent = doctor;
        doctorSelect.appendChild(optionElement);
    });

    doctorDiv.appendChild(doctorLabel);
    doctorDiv.appendChild(doctorSelect);
    form.appendChild(doctorDiv);

    // Create the appointment date field
    const appointmentDateDiv = document.createElement('div');
    appointmentDateDiv.className = 'mb-4 flex flex-row gap-5 justify-center items-center';
    const appointmentDateLabel = document.createElement('label');
    appointmentDateLabel.className = 'block text-gray-700 font-bold';
    appointmentDateLabel.htmlFor = 'appointmentDate';
    appointmentDateLabel.textContent = 'Appointment Date:';
    const appointmentDateInput = document.createElement('input');
    appointmentDateInput.type = 'date';
    appointmentDateInput.id = 'appointmentDate';
    appointmentDateInput.name = 'appointmentDate';
    appointmentDateInput.className = 'mt-1 w-[40%] border border-gray-300 rounded-md shadow-sm p-2 text-black focus:ring-indigo-500 focus:border-indigo-500';
    appointmentDateInput.required = true;
    appointmentDateDiv.appendChild(appointmentDateLabel);
    appointmentDateDiv.appendChild(appointmentDateInput);
    form.appendChild(appointmentDateDiv);

    // Create the appointment time field
    const appointmentTimeDiv = document.createElement('div');
    appointmentTimeDiv.className = 'mb-4 flex flex-row gap-5 justify-center items-center';
    const appointmentTimeLabel = document.createElement('label');
    appointmentTimeLabel.className = 'block text-gray-700 font-bold';
    appointmentTimeLabel.htmlFor = 'appointmentTime';
    appointmentTimeLabel.textContent = 'Appointment Time:';
    const appointmentTimeInput = document.createElement('input');
    appointmentTimeInput.type = 'time';
    appointmentTimeInput.id = 'appointmentTime';
    appointmentTimeInput.name = 'appointmentTime';
    appointmentTimeInput.className = 'mt-1 w-[40%] border border-gray-300 rounded-md shadow-sm p-2 text-black focus:ring-indigo-500 focus:border-indigo-500';
    appointmentTimeInput.required = true;
    appointmentTimeDiv.appendChild(appointmentTimeLabel);
    appointmentTimeDiv.appendChild(appointmentTimeInput);
    form.appendChild(appointmentTimeDiv);

    // Create the email field
    const emailDiv = document.createElement('div');
    emailDiv.className = 'mb-4 flex flex-row gap-5 justify-center items-center';
    const emailLabel = document.createElement('label');
    emailLabel.className = 'block text-gray-700 font-bold';
    emailLabel.htmlFor = 'email';
    emailLabel.textContent = 'User e-mail:';
    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.id = 'email';
    emailInput.name = 'email';
    emailInput.className = 'mt-1 w-[40%] border border-gray-300 rounded-md shadow-sm p-2 text-black focus:ring-indigo-500 focus:border-indigo-500';
    emailInput.required = true;
    emailDiv.appendChild(emailLabel);
    emailDiv.appendChild(emailInput);
    form.appendChild(emailDiv);

    // Create the phone field
    const phoneDiv = document.createElement('div');
    phoneDiv.className = 'mb-4 flex flex-row gap-5 justify-center items-center';
    const phoneLabel = document.createElement('label');
    phoneLabel.className = 'block text-gray-700 font-bold';
    phoneLabel.htmlFor = 'phone';
    phoneLabel.textContent = 'Phone:';
    const phoneInput = document.createElement('input');
    phoneInput.type = 'tel';
    phoneInput.id = 'phone';
    phoneInput.name = 'phone';
    phoneInput.className = 'mt-1 w-[40%] border border-gray-300 rounded-md shadow-sm p-2 text-black focus:ring-indigo-500 focus:border-indigo-500';
    phoneInput.required = true;
    phoneDiv.appendChild(phoneLabel);
    phoneDiv.appendChild(phoneInput);
    form.appendChild(phoneDiv);

    // Create the amount field
    const amountDiv = document.createElement('div');
    amountDiv.className = 'mb-4 flex flex-row gap-5 justify-center items-center';
    const amountLabel = document.createElement('label');
    amountLabel.className = 'block text-gray-700 font-bold';
    amountLabel.htmlFor = 'amount';
    amountLabel.textContent = 'Amount:';
    const amountInput = document.createElement('input');
    amountInput.type = 'tel';
    amountInput.id = 'amount';
    amountInput.name = 'amount';
    amountInput.className = 'mt-1 w-[40%] border border-gray-300 rounded-md shadow-sm p-2 text-black focus:ring-indigo-500 focus:border-indigo-500';
    amountInput.required = true;
    amountDiv.appendChild(amountLabel);
    amountDiv.appendChild(amountInput);
    form.appendChild(amountDiv);

    // Create the payment type field
    const paymentTypeDiv = document.createElement('div');
    paymentTypeDiv.className = 'mb-4 flex flex-row gap-5 justify-center items-center';
    const paymentTypeLabel = document.createElement('label');
    paymentTypeLabel.className = 'block text-gray-700 font-bold';
    paymentTypeLabel.htmlFor = 'paymentType';
    paymentTypeLabel.textContent = 'Payment Type:';
    const radioDiv = document.createElement('div');
    radioDiv.className = 'mt-1';
    const paymentOptions = [
        { value: 'paid', text: 'Paid' },
        { value: 'unpaid', text: 'Unpaid' }
    ];
    paymentOptions.forEach(option => {
        const radioLabel = document.createElement('label');
        radioLabel.className = 'inline-flex items-center';
        const radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.id = 'paymentType';
        radioInput.name = 'paymentType';
        radioInput.value = option.value;
        radioInput.required = true;
        radioLabel.appendChild(radioInput);
        const span = document.createElement('span');
        span.className = 'ml-2';
        span.textContent = option.text;
        radioLabel.appendChild(span);
        radioDiv.appendChild(radioLabel);
    });
    paymentTypeDiv.appendChild(paymentTypeLabel);
    paymentTypeDiv.appendChild(radioDiv);
    form.appendChild(paymentTypeDiv);

    // Create the comments field
    const commentsDiv = document.createElement('div');
    commentsDiv.className = 'mb-4 flex flex-row gap-5 justify-center items-center';
    const commentsLabel = document.createElement('label');
    commentsLabel.htmlFor = 'comments';
    commentsLabel.className = 'block text-gray-700 font-medium';
    commentsLabel.textContent = 'Comments (optional):';
    const commentsTextarea = document.createElement('textarea');
    commentsTextarea.id = 'comments';
    commentsTextarea.name = 'comments';
    commentsTextarea.rows = 4;
    commentsTextarea.className = 'mt-1 w-[40%] border border-gray-300 rounded-md shadow-sm p-2 text-black focus:ring-indigo-500 focus:border-indigo-500';
    commentsDiv.appendChild(commentsLabel);
    commentsDiv.appendChild(commentsTextarea);
    form.appendChild(commentsDiv);

    // Create the submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.id = 'submit_btn';
    submitButton.className = 'w-full bg-indigo-500 text-white font-medium py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';
    submitButton.textContent = 'Submit Appointment';

    submitButton.addEventListener('click', (event) => {
        createReceipt();
        formContainers.style.display = 'none';
        calendarContainer.style.display = 'none';
        recipt_file.style.display = 'block';
        recipt_file.style.width = '150%';
    });

    form.appendChild(submitButton);

    container.appendChild(formContainers);
}


createAppointmentForm();

export default {
    patient_form_starter,
    createAppointmentForm,
}
