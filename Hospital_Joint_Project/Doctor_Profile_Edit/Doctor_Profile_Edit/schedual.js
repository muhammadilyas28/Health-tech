
const schedule = {};

function openModal() {
    document.getElementById('add-day-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('add-day-modal').classList.add('hidden');
}

function addNewDay(day, startTime, endTime, status) {
    if (!schedule[day]) {
        schedule[day] = { startTime, endTime, status };
        renderSchedule();
        closeModal();
    } else {
        alert('Day already exists.');
    }
}

function updateStartTime(day, newTime) {
    if (schedule[day].status === 'Available') {
        schedule[day].startTime = newTime;
    } else {
        alert('Cannot update time. Set the status to "Available" first.');
    }
}

function updateEndTime(day, newTime) {
    if (schedule[day].status === 'Available') {
        schedule[day].endTime = newTime;
    } else {
        alert('Cannot update time. Set the status to "Available" first.');
    }
}

function toggleAvailability(day) {
    schedule[day].status = schedule[day].status === 'Available' ? 'Not Available' : 'Available';
    renderSchedule();
}

function deleteDay(day) {
    delete schedule[day];
    renderSchedule();
}

function renderSchedule() {
    const scheduleBody = document.getElementById('schedule-body');
    scheduleBody.innerHTML = '';

    for (const [day, info] of Object.entries(schedule)) {
        const row = document.createElement('tr');

        const dayCell = document.createElement('td');
        dayCell.className = 'px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900';
        dayCell.textContent = day;
        row.appendChild(dayCell);

        const startTimeCell = document.createElement('td');
        startTimeCell.className = 'px-6 py-4 whitespace-nowrap text-sm font-medium';
        startTimeCell.innerHTML = `<input type="time" value="${info.startTime.slice(0, -3)}" step="3600" onchange="updateStartTime('${day}', this.value)" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" ${info.status === 'Not Available' ? 'disabled' : ''}>`;
        row.appendChild(startTimeCell);

        const endTimeCell = document.createElement('td');
        endTimeCell.className = 'px-6 py-4 whitespace-nowrap text-sm font-medium';
        endTimeCell.innerHTML = `<input type="time" value="${info.endTime.slice(0, -3)}" step="3600" onchange="updateEndTime('${day}', this.value)" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" ${info.status === 'Not Available' ? 'disabled' : ''}>`;
        row.appendChild(endTimeCell);

        const statusCell = document.createElement('td');
        statusCell.className = 'px-6 py-4 whitespace-nowrap text-sm font-medium';
        statusCell.innerHTML = `<button onclick="toggleAvailability('${day}')" class="${info.status === 'Available' ? 'bg-green-500' : 'bg-red-500'} text-white px-3 py-1 rounded">${info.status}</button>`;
        row.appendChild(statusCell);

        const actionsCell = document.createElement('td');
        actionsCell.className = 'px-6 py-4 whitespace-nowrap text-sm font-medium';
        actionsCell.innerHTML = `<button onclick="deleteDay('${day}')" class="bg-red-500 text-white px-3 py-1 rounded">Delete</button>`;
        row.appendChild(actionsCell);

        scheduleBody.appendChild(row);
    }
}

document.getElementById('add-day-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const day = document.getElementById('new-day').value;
    const startTime = document.getElementById('new-start-time').value;
    const endTime = document.getElementById('new-end-time').value;
    const status = document.getElementById('new-status').value;
    addNewDay(day, startTime, endTime, status);
});

document.addEventListener('DOMContentLoaded', renderSchedule);

// Function to open IndexedDB and get a list of doctor names
function getDoctorNamesFromIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('doctorDB', 1);

        request.onerror = function(event) {
            console.error('Database error:', event.target.error);
            reject(event.target.error);
        };

        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(['doctorDetails'], 'readonly');
            const store = transaction.objectStore('doctorDetails');
            const getAllRequest = store.getAll();

            getAllRequest.onsuccess = function(event) {
                const doctors = event.target.result;
                const doctorNames = doctors.map(doctor => doctor.name); // Adjust the property name according to your schema
                resolve(doctorNames);
            };

            getAllRequest.onerror = function(event) {
                console.error('Error fetching doctors:', event.target.error);
                reject(event.target.error);
            };
        };

        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('doctorDetails')) {
                db.createObjectStore('doctorDetails', { keyPath: 'id', autoIncrement: true });
            }
        };
    });
}

// Example usage of the function
getDoctorNamesFromIndexedDB()
    .then(doctorNames => {
        console.log('Doctor names:', doctorNames);
        // You can use the doctorNames array to populate your form
    })
    .catch(error => {
        console.error('Failed to get doctor names:', error);
    });
