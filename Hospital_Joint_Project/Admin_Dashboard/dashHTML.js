// Create the mainDiv element
let mainDiv = document.createElement('div');
mainDiv.id = 'mainDiv';
mainDiv.className = 'w-screen h-screen flex overflow-x-hidden';

// Append mainDiv to the body or a specific container element
document.body.appendChild(mainDiv);

const menuButton = document.getElementById('menu-button');
const sidebar = document.getElementById('sidebar');

function menuClick() {
    sidebar.classList.toggle('sidebar-closed');
}

let inputFields = (name, id, inputType) => {
    return `
        <label for="${id}" class="block text-gray-700 font-semibold">${name}</label>
        <input type="${inputType}" id="${id}" class="w-full p-3 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
    `;
};

let ProfileManagement = () => {
    return `
        <div class="h-72 w-full flex items-center justify-center">
            <div class="bg-blue-300 w-full max-w-4xl rounded-lg shadow-xl p-6 md:p-8">
                <div class="flex flex-col md:flex-row items-center justify-between border-b pb-6 mb-6">
                    <div>
                        <h1 class="text-3xl md:text-4xl font-bold text-gray-800">Profile</h1>
                        <p id="admin-name" class="text-gray-600 mt-1">Admin Name</p>
                        <p id="admin-email" class="text-gray-600 mt-1">admin@example.com</p>
                    </div>
                    <div class="flex items-center mt-6 md:mt-0">
                        <div class="relative">
                            <img id="admin-picture" src="https://via.placeholder.com/100" alt="Profile Picture" class="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-blue-500">
                        </div>
                    </div>
                </div>
                <div class="flex justify-end">
                    <button id="editProfileButton" class="bg-blue-500 text-white py-2 px-6 rounded-lg shadow hover:bg-blue-600 transition duration-300">Edit Profile</button>
                </div>
            </div>
        </div>
        
        <!-- Edit Profile Modal -->
        <div id="editProfileModal" class="fixed z-50 inset-0 overflow-y-auto hidden">
            <div class="flex items-center justify-center min-h-screen">
                <div class="bg-white w-full max-w-2xl rounded-lg shadow-xl p-6 md:p-8">
                    <div class="flex justify-between items-center border-b pb-3 mb-4">
                        <h2 class="text-2xl font-bold">Edit Profile</h2>
                        <button id="closeModalButton" class="text-gray-500 hover:text-gray-700">&times;</button>
                    </div>
                    <form id="editProfileForm">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="mb-4">
                                ${inputFields("Name", "edit-name", "text")}
                            </div>
                            <div class="mb-4">
                                ${inputFields("Email", "edit-email", "email")}
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="mb-4">
                                ${inputFields("Password", "edit-password", "password")}
                            </div>
                            <div class="mb-4">
                                ${inputFields("Confirm Password", "edit-confirm-password", "password")}
                            </div>
                        </div>
                        <div class="mb-4">
                            <label for="edit-picture" class="block text-gray-700 font-semibold">Profile Picture</label>
                            <input type="file" id="edit-picture" class="w-full p-3 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div class="mb-4">
                            <label for="edit-bio" class="block text-gray-700 font-semibold">Bio</label>
                            <textarea id="edit-bio" class="w-full p-3 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                        </div>
                        <div class="flex justify-end">
                            <button type="submit" class="bg-blue-500 text-white py-2 px-6 rounded-lg shadow hover:bg-blue-600 transition duration-300">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
};

let RoleManagement = () => {
    return `
        <div class="h-72 w-full flex items-center justify-center">
            <div class="bg-white w-full max-w-4xl rounded-lg shadow-xl p-6 md:p-8">
                <h1 class="text-3xl md:text-4xl font-bold text-gray-800">Role Management</h1>
                <div id="role-management-content">
                    <div class="mb-4">
                        ${inputFields("Role Name", "role-name", "text")}
                        ${inputFields("Commission (%)", "role-commission", "number")}
                        <button id="add-role-button" class="mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition duration-300">Add Role</button>
                    </div>
                    <table class="w-full table-auto">
                        <thead>
                            <tr>
                                <th class="px-4 py-2">Role Name</th>
                                <th class="px-4 py-2">Commission (%)</th>
                                <th class="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="role-table-body">
                            <!-- Roles will be dynamically added here -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
};

let dashboard = () => {
    return `
        <!-- Main content -->
        <div class="flex-1 md:-ml-52">
            <header class="bg-gray-200 text-gray-800 p-4 flex gap-6 items-center md:z-50">
                <button id="menu-button" class="md:hidden ">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
                <h1 class="text-2xl">Admin Dashboard</h1>
            </header>
            <main id="main-content" class="p-6">
                <h2 class="text-3xl">Main Content</h2>
                <p>Here is the main content of the page...</p>
            </main>
        </div>`;
};

let sideNavDiv = () => {
    return `<div id="sidebar" class="md:z-50 mt-16 md:mt-0 sidebar w-64 bg-gray-800 text-white h-screen absolute md:relative z-10 md:-translate-x-52 md:hover:translate-x-0">
        <div class="p-6">
            <div class="block py-2.5 px-4 rounded transition duration-200 text-blue-500 font-bold text-xl">Admin Dashboard</div>
            <nav class="mt-6">
                <a href="#" id="role-management-link" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Role Management</a>
                <a href="#" id="profile-link" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Profile</a>
                <a href="../LoginPage/loginPage.html" class="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Logout</a>
            </nav>
        </div>
    </div>`;
};

let loadProfileManagement = () => {
    let mainContent = document.getElementById("main-content");
    mainContent.innerHTML = ProfileManagement();
    document.getElementById("editProfileButton").addEventListener("click", () => {
        document.getElementById("editProfileModal").classList.remove("hidden");
    });
    document.getElementById("closeModalButton").addEventListener("click", () => {
        document.getElementById("editProfileModal").classList.add("hidden");
    });

    document.getElementById("editProfileForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("edit-name").value;
        const email = document.getElementById("edit-email").value;
        const pictureInput = document.getElementById("edit-picture");
        const file = pictureInput.files[0];

        // Update profile display with new values
        document.getElementById("admin-name").innerText = `Name: ${name}`;
        document.getElementById("admin-email").innerText = `Email: ${email}`;

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById("admin-picture").src = e.target.result;
            };
            reader.readAsDataURL(file);
        }

        // Close modal
        document.getElementById("editProfileModal").classList.add("hidden");
    });
};

// IndexedDB setup
let db;
const request = indexedDB.open('Roles', 5);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    const roleStore = db.createObjectStore('roles', { keyPath: 'id', autoIncrement: true });
    roleStore.createIndex('name', 'name', { unique: true });
};

request.onsuccess = function(event) {
    db = event.target.result;
    loadRoleManagement();
};

request.onerror = function(event) {
    console.error('IndexedDB error:', event.target.errorCode);
};

let loadRoleManagement = () => {
    let mainContent = document.getElementById("main-content");
    mainContent.innerHTML = RoleManagement();

    // Load roles from IndexedDB
    loadRolesFromIndexedDB();

    // Add role functionality
    document.getElementById('add-role-button').addEventListener('click', () => {
        const roleName = document.getElementById('role-name').value.trim();
        const roleCommission = parseFloat(document.getElementById('role-commission').value.trim());
        if (roleName && !isNaN(roleCommission)) {
            addRoleToIndexedDB(roleName, roleCommission);
            document.getElementById('role-name').value = '';
            document.getElementById('role-commission').value = '';
        }
    });
};

let loadRolesFromIndexedDB = () => {
    const transaction = db.transaction(['roles'], 'readonly');
    const roleStore = transaction.objectStore('roles');

    roleStore.openCursor().onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
            addRoleToTable(cursor.value);
            cursor.continue();
        }
    };
};

// Function to add a role to IndexedDB
let addRoleToIndexedDB = (roleName, roleCommission) => {
    const transaction = db.transaction(['roles'], 'readwrite');
    const roleStore = transaction.objectStore('roles');

    const checkRequest = roleStore.index('name').get(roleName);
    checkRequest.onsuccess = function(event) {
        if (!event.target.result) {
            const addRequest = roleStore.add({ name: roleName, commission: roleCommission });

            addRequest.onsuccess = function(e) {
                addRoleToTable({ name: roleName, commission: roleCommission });
            };

            addRequest.onerror = function(event) {
                console.error('Error adding role:', event.target.errorCode);
            };
        } else {
            alert('Role with this name already exists.');
        }
    };
};

// Function to add a role to the table
let addRoleToTable = (role) => {
    const tableBody = document.getElementById('role-table-body');
    const row = document.createElement('tr');
    const roleName = role.name;
    const roleCommission = role.commission;

    row.innerHTML = `
        <td class="px-4 py-2">${roleName}</td>
        <td class="px-4 py-2">${roleCommission}%</td>
        <td class="px-4 py-2">
            <button class="edit-role-button bg-yellow-500 text-white py-1 px-3 rounded-lg shadow hover:bg-yellow-600 transition duration-300">Edit</button>
            <button class="delete-role-button bg-red-500 text-white py-1 px-3 rounded-lg shadow hover:bg-red-600 transition duration-300">Delete</button>
        </td>
    `;

    tableBody.appendChild(row);

    // Attach event listeners to the edit and delete buttons
    row.querySelector('.edit-role-button').addEventListener('click', () => editRole(row, roleName, roleCommission, role.id));
    row.querySelector('.delete-role-button').addEventListener('click', () => deleteRole(row, role.id));
};

// Function to edit a role in IndexedDB
let editRole = (row, oldRoleName, oldRoleCommission, roleId) => {
    const newRoleName = prompt('Enter new role name:', oldRoleName);
    const newRoleCommission = parseFloat(prompt('Enter new commission percentage:', oldRoleCommission));
    if (newRoleName && !isNaN(newRoleCommission)) {
        const transaction = db.transaction(['roles'], 'readwrite');
        const roleStore = transaction.objectStore('roles');
        const request = roleStore.get(roleId);

        request.onsuccess = function(event) {
            const role = event.target.result;
            role.name = newRoleName;
            role.commission = newRoleCommission;
            const updateRequest = roleStore.put(role);

            updateRequest.onsuccess = function() {
                row.cells[0].innerText = newRoleName;
                row.cells[1].innerText = `${newRoleCommission}%`;
            };

            updateRequest.onerror = function(event) {
                console.error('Error updating role:', event.target.errorCode);
            };
        };
    }
};

// Function to delete a role from IndexedDB
let deleteRole = (row, roleId) => {
    if (confirm('Are you sure you want to delete this role?')) {
        const transaction = db.transaction(['roles'], 'readwrite');
        const roleStore = transaction.objectStore('roles');
        const request = roleStore.delete(roleId);

        request.onsuccess = function() {
            row.remove();
        };

        request.onerror = function(event) {
            console.error('Error deleting role:', event.target.errorCode);
        };
    }
};

let attachMenuButtonListener = () => {
    const menuButton = document.getElementById('menu-button');
    const sidebar = document.getElementById('sidebar');
    const mainDiv = document.getElementById('mainDiv');

    menuButton.addEventListener('click', () => {
        sidebar.classList.toggle('sidebar-closed');
        mainDiv.classList.toggle('content-shift');
    });
};

mainDiv.innerHTML = `
    ${sideNavDiv()}
    ${dashboard()}
`;

attachMenuButtonListener();

document.getElementById('role-management-link').addEventListener('click', loadRoleManagement);
document.getElementById('profile-link').addEventListener('click', loadProfileManagement);

// Load default content (ProfileManagement)
loadProfileManagement();
