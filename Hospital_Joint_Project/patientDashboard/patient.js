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
    const appointmentList = document.getElementById('appointment-list');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const profileLink = document.getElementById('profile-link');
    const appointmentsLink = document.getElementById('appointments-link');
    const profileContent = document.getElementById('profile-content');
    const appointmentsContent = document.getElementById('appointments-content');
    // appointmentsContent.append('ilyas')

    // Simulated profile data
    let profileData = {
        name: '',
        email: '',
        picture: ''
    };

    // Simulated appointment data
    const appointments = [
        'Check-up on 2024-08-15',
        'Dental cleaning on 2024-08-22'
    ];

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

    // Render appointment list
    function renderAppointments() {

        appointmentList.innerHTML='<u><b>Reminder List</b></u>'
        
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
        appointmentsContent.classList.remove('visible-content');
        appointmentsContent.classList.add('hidden-content');
    });

    // Show appointments content
    appointmentsLink.addEventListener('click', (e) => {
        e.preventDefault();
        appointmentsContent.classList.add('visible-content');
        profileContent.classList.remove('visible-content');
        profileContent.classList.add('hidden-content');
    });

    // Event listeners
    editProfileBtn.addEventListener('click', showModal);
    closeModalBtn.addEventListener('click', hideModal);

    // Initial render
    renderProfile();
    renderAppointments();
});
