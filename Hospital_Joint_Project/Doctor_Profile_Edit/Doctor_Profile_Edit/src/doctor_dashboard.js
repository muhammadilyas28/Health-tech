const dbName = 'doctorProfileDB';
const profileId = 1; // Assuming only one profile; use unique IDs for multiple profiles
let db;

// Open or create an IndexedDB database
const request = indexedDB.open(dbName, 2);

request.onupgradeneeded = (event) => {
  db = event.target.result;
  const objectStore = db.createObjectStore('profiles', { keyPath: 'id' });
  objectStore.createIndex('photo', 'photo', { unique: false });
};

request.onsuccess = (event) => {
  db = event.target.result;
  loadProfile();
};

request.onerror = (event) => {
  console.error('Database error:', event.target.errorCode);
};

function saveProfile(profile, photoBlob) {
  const transaction = db.transaction(['profiles'], 'readwrite');
  const objectStore = transaction.objectStore('profiles');
  const profileData = { ...profile, id: profileId, photo: photoBlob };

  const request = objectStore.put(profileData);
  request.onsuccess = () => {
    console.log('Profile saved');
    // Reload the profile to update the view
    loadProfile();
  };
  request.onerror = (event) => {
    console.error('Error saving profile:', event.target.errorCode);
  };
}

function loadProfile() {
  const transaction = db.transaction(['profiles']);
  const objectStore = transaction.objectStore('profiles');
  const request = objectStore.get(profileId);

  request.onsuccess = (event) => {
    const profile = event.target.result;
    if (profile) {
      const photoUrl = profile.photo ? URL.createObjectURL(profile.photo) : '';
      document.getElementById('doctorPhoto').src = photoUrl;
      document.getElementById('doctorName').textContent = profile.name;
      document.getElementById('batchNoInput').value = profile.batchNo;
      document.getElementById('doctorEmailInput').value = profile.email;
      document.getElementById('doctorPhoneInput').value = profile.phone;
      document.getElementById('doctorDegreeDocsInput').value = profile.degreeDocs;
      document.getElementById('doctorStatusInput').value = profile.status;
    }
  };
  request.onerror = (event) => {
    console.error('Error loading profile:', event.target.errorCode);
  };
}

const doctorProfileHTML = `
  <div class="mb-6">
    <h2 class="text-xl font-medium mb-2">Doctor Profile</h2>
    <div class="flex items-center mb-4">
      <img id="doctorPhoto" src="" alt="Doctor Photo" class="w-16 h-16 rounded-full mr-4">
      <div>
        <p id="doctorName" class="text-lg font-semibold text-gray-800">Dr. John Doe</p>
        <button id="editProfileBtn" class="text-blue-500 hover:underline">Edit Profile</button>
      </div>
    </div>
    <form id="editProfileForm" class="hidden">
      <div class="mb-4">
        <label for="photoInput" class="block text-sm font-medium text-gray-700">Upload Photo</label>
        <input type="file" id="photoInput" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
      </div>
      <div class="mb-4">
        <label for="batchNoInput" class="block text-sm font-medium text-gray-700">BatchNo [Name-Phone]</label>
        <input type="text" id="batchNoInput" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
      </div>
      <div class="mb-4">
        <label for="doctorNameInput" class="block text-sm font-medium text-gray-700">Name</label>
        <input type="text" id="doctorNameInput" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
      </div>
      <div class="mb-4">
        <label for="doctorEmailInput" class="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" id="doctorEmailInput" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
      </div>
      <div class="mb-4">
        <label for="doctorPhoneInput" class="block text-sm font-medium text-gray-700">Phone</label>
        <input type="tel" id="doctorPhoneInput" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
      </div>
      <div class="mb-4">
        <label for="doctorDegreeDocsInput" class="block text-sm font-medium text-gray-700">Degree and Practice Documents</label>
        <input type="text" id="doctorDegreeDocsInput" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
      </div>
      <div class="mb-4">
        <label for="doctorStatusInput" class="block text-sm font-medium text-gray-700">Status</label>
        <select id="doctorStatusInput" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Review">Review</option>
          <option value="Rejected">Rejected</option>
          <option value="Ban">Ban</option>
        </select>
      </div>
      <div class="flex justify-end">
        <button type="button" id="saveProfileBtn" class="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Save</button>
        <button type="button" id="cancelEditProfileBtn" class="ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">Cancel</button>
      </div>
    </form>
  </div>
`;

// Append the profile HTML to the body
document.body.innerHTML = doctorProfileHTML;

// Add event listeners for edit and cancel buttons
document.getElementById('editProfileBtn').addEventListener('click', () => {
  document.getElementById('editProfileForm').classList.remove('hidden');
});

document.getElementById('cancelEditProfileBtn').addEventListener('click', () => {
  document.getElementById('editProfileForm').classList.add('hidden');
});

// Handle photo upload
document.getElementById('photoInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const photoBlob = new Blob([e.target.result], { type: file.type });
      document.getElementById('doctorPhoto').src = URL.createObjectURL(photoBlob);
      document.getElementById('doctorPhoto').alt = file.name;

      // Save profile data and photo in IndexedDB
      const profile = {
        name: document.getElementById('doctorNameInput').value,
        batchNo: document.getElementById('batchNoInput').value,
        email: document.getElementById('doctorEmailInput').value,
        phone: document.getElementById('doctorPhoneInput').value,
        degreeDocs: document.getElementById('doctorDegreeDocsInput').value,
        status: document.getElementById('doctorStatusInput').value
      };
      saveProfile(profile, photoBlob);
    };
    reader.readAsArrayBuffer(file);
  }
});

// Save profile data when clicking the save button
document.getElementById('saveProfileBtn').addEventListener('click', () => {
  const profile = {
    name: document.getElementById('doctorNameInput').value,
    batchNo: document.getElementById('batchNoInput').value,
    email: document.getElementById('doctorEmailInput').value,
    phone: document.getElementById('doctorPhoneInput').value,
    degreeDocs: document.getElementById('doctorDegreeDocsInput').value,
    status: document.getElementById('doctorStatusInput').value
  };
  const photoInput = document.getElementById('photoInput').files[0];
  const photoBlob = photoInput ? new Blob([photoInput], { type: photoInput.type }) : null;
  saveProfile(profile, photoBlob);
  document.getElementById('editProfileForm').classList.add('hidden');
});
