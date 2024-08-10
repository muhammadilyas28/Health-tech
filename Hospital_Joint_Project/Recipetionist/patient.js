document.addEventListener('DOMContentLoaded', () => {
    const profileSection = document.getElementById('profile-section');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const profileModal = document.getElementById('profile-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const profileForm = document.getElementById('profile-form');
    const profilePictureInput = document.getElementById('profile-picture-input');
    const profilePicture = document.getElementById('profile-picture');
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    const appointmentForm = document.getElementById('appointment-form');
    const appointmentDay = document.getElementById('appointment-day');
    const doctorsDropdown = document.createElement('select');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const profileLink = document.getElementById('profile-link');
    const appointmentsLink = document.getElementById('appointments-link');
    const profileContent = document.getElementById('profile-content');
    const appointmentsContent = document.getElementById('appointments-content');

    // Create doctors dropdown
    doctorsDropdown.id = 'appointment-doctor';
    doctorsDropdown.classList.add('mt-1', 'block', 'w-full', 'border-emerald-300', 'rounded-md', 'shadow-sm', 'p-2');
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = 'Select a doctor';
    doctorsDropdown.appendChild(defaultOption);
    appointmentForm.insertBefore(doctorsDropdown, appointmentForm.querySelector('button[type="submit"]'));

    // Simulated profile data
    let profileData = {
        name: '',
        email: '',
        picture: ''
    };

    // Render profile
    function renderProfile() {
        profileName.innerHTML = `<strong>Name:</strong> ${profileData.name || 'Not set'}`;
        profileEmail.innerHTML = `<strong>Email:</strong> ${profileData.email || 'Not set'}`;
        if (profileData.picture) {
            profilePicture.src = profileData.picture;
            profilePicture.classList.remove('hidden');
        } else {
            profilePicture.classList.add('hidden');
        }
    }

    // Show modal
    function showModal() {
        profileModal.classList.remove('hidden');
    }

    // Hide modal
    function hideModal() {
        profileModal.classList.add('hidden');
    }

    // Handle profile edit form submission
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const pictureFile = profilePictureInput.files[0];
        
        profileData.name = name;
        profileData.email = email;
        
        if (pictureFile) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profileData.picture = e.target.result;
                renderProfile();
            }
            reader.readAsDataURL(pictureFile);
        }
        
        renderProfile();
        hideModal();
    });

    // Open IndexedDB and fetch doctors
    function fetchDoctors() {
        const request = indexedDB.open('Users_DB', 6);

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('users')) {
                db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction(['users'], 'readonly');
            const objectStore = transaction.objectStore('users');
            const getAllRequest = objectStore.getAll();

            getAllRequest.onsuccess = function (event) {
                const users = event.target.result;
                populateDoctorsDropdown(users);
            };

            transaction.oncomplete = function () {
                db.close();
            };
        };

        request.onerror = function () {
            console.error('Failed to open the database.');
        };
    }

    // Populate doctors dropdown
    function populateDoctorsDropdown(users) {
        users.forEach(user => {
            if (user.specialization=== 'doctor') {  // Assuming each user has a role property
                const option = document.createElement('option');
                option.value = user.name;
                option.textContent = user.name;
                doctorsDropdown.appendChild(option);
            }
        });
    }

    // Handle appointment form submission
    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedDay = appointmentDay.value;
        const selectedDoctor = doctorsDropdown.value;
        if (selectedDoctor) {
            alert(`Appointment booked for ${selectedDay} with doctor Name ${selectedDoctor}`);
        } else {
            alert('Please select a doctor.');
        }
        appointmentDay.value = ''; // Reset the dropdown after submission
        doctorsDropdown.value = ''; // Reset the doctors dropdown after submission
    });

    // Toggle sidebar
    sidebarToggle.addEventListener('click', () => {
        if (sidebar.classList.contains('sidebar-hidden')) {
            sidebar.classList.remove('sidebar-hidden');
            sidebar.classList.add('sidebar-visible');
            sidebarToggle.classList.add('ml-64'); // Add margin when sidebar is visible
        } else {
            sidebar.classList.remove('sidebar-visible');
            sidebar.classList.add('sidebar-hidden');
            sidebarToggle.classList.remove('ml-64'); // Remove margin when sidebar is hidden
        }
    });

    // Show profile content
    profileLink.addEventListener('click', (e) => {
        e.preventDefault();
        profileContent.classList.add('visible-content');
        appointmentsContent.classList.add('hidden-content');
    });

    // Show appointments content
    appointmentsLink.addEventListener('click', (e) => {
        e.preventDefault();
        appointmentsContent.classList.add('visible-content');
        profileContent.classList.add('hidden-content');
    });

    // Event listeners
    editProfileBtn.addEventListener('click', showModal);
    closeModalBtn.addEventListener('click', hideModal);

    // Initial render
    renderProfile();

    // Fetch doctors from IndexedDB
    fetchDoctors();
});
