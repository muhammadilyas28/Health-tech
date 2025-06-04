async function openDb(name, version, storeName) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(name, version);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

async function fetchRoles() {
    try {
        const db = await openDb('Roles_DB', 1, 'roles');
        const transaction = db.transaction('roles', 'readonly');
        const objectStore = transaction.objectStore('roles');
        const request = objectStore.getAll();

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    } catch (error) {
        console.error('Database error:', error);
        return [];
    }
}

function inputForm(roles) {
    return `
    <div class="flex justify-between items-center">
            <a href="../Landing_page.html" class="text-blue-500 hover:text-blue-600">
                <img src="./back-arrow.png" alt="doctor" class="w-5 h-5 mb-6">
            </a>
            <h2 class="text-xl font-semibold mb-6 flex justify-center items-center text-blue-500">Register in Health Tech Lab </h2>
        </div>
        <form id="userForm">
            <input type="hidden" id="userId" />
            <div class="mb-4">
                <label for="name" class="block text-gray-700">Name</label>
                <input
                    type="text"
                    id="name"
                    class="w-full p-2 border border-gray-300 rounded mt-1"
                />
            </div>
            <div class="mb-4">
                <label for="specialization" class="block text-gray-700">Specialization</label>
                <select
                    id="specialization"
                    class="w-full p-2 border border-gray-300 rounded mt-1"
                >
                    <option value="">Select a Role</option>
                    ${roles.map(role => `<option value="${role.name}">${role.name}</option>`).join('')}
                </select>
            </div>
            <div class="mb-4">
                <label for="phone" class="block text-gray-700">Phone</label>
                <input
                    type="text"
                    id="phone"
                    class="w-full p-2 border border-gray-300 rounded mt-1"
                />
            </div>
            <div class="mb-4">
                <label for="email" class="block text-gray-700">Email</label>
                <input
                    type="email"
                    id="email"
                    class="w-full p-2 border border-gray-300 rounded mt-1"
                />
            </div>
            <div class="mb-4 relative">
                <label for="password" class="block text-gray-700">Password</label>
                <div class="relative">
                    <input
                        type="password"
                        id="password"
                        class="w-full p-2 border border-gray-300 rounded mt-1 pr-10"
                    />
                    <button 
                        type="button"
                        onclick="togglePassword()"
                        class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        <i class="fas fa-eye" id="toggleIcon"></i>
                    </button>
                </div>
            </div>
            <button type="submit" class="bg-blue-500 text-white w-full px-4 py-2 rounded">
                Sign Up
            </button>
        </form>
        <div id="successMessage" class="bg-orange-400 p-2 rounded-lg mt-4 text-xl font-bold text-red-500 hidden">
           <p> Signup successfully!</p>
           </div>
           <ul id="userList" class="mt-4"></ul>
           `;
    window.location.href = '../Landing_page.html'
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const name = form.querySelector('#name').value;
    const specialization = form.querySelector('#specialization').value;
    const phone = form.querySelector('#phone').value;
    const email = form.querySelector('#email').value;
    const password = form.querySelector('#password').value;

    if (!name || !specialization || !phone || !email || !password) {
        alert('All fields are required.');
        return;
    }

    try {
        const db = await openDb('Users_DB', 6, 'users');
        const transaction = db.transaction('users', 'readwrite');
        const objectStore = transaction.objectStore('users');

        const request = objectStore.put({
            name,
            specialization,
            phone,
            email,
            password,
            status: false,
        });

        request.onsuccess = () => {
            console.log('You are Registered Syccessfully', {
                // name,
                // specialization,
                // phone,
                // email,
                // password
            });
            document.getElementById('successMessage').classList.remove('hidden');
            form.reset();
            updateUserList();
            window.location.href = '../Landing_page.html';

        };

        request.onerror = (event) => {
            console.error('Error saving data:', event.target.error);
        };
    } catch (error) {
        console.error('Database error:', error);
    }
}

async function updateUserList() {
    try {
        const db = await openDb('Roles', 5, 'roles');
        const transaction = db.transaction('users', 'readonly');
        const objectStore = transaction.objectStore('users');
        const request = objectStore.getAll();

        request.onsuccess = () => {
            const users = request.result;
            const userList = document.getElementById('userList');
            userList.innerHTML = '';

            users.forEach(user => {
                const li = document.createElement('li');
                li.textContent = `${user.name} - ${user.specialization} - ${user.phone} - ${user.email}`;
                userList.appendChild(li);
            });
        };

        request.onerror = (event) => {
            console.error('Error fetching users:', event.target.error);
        };
    } catch (error) {
        console.error('Database error:', error);
    }
}


async function getRoles() {
    // Dummy roles data as fallback
    const dummyRoles = [
        { id: 1, name: 'doctor' },
        { id: 2, name: 'receptionist' },
        { id: 3, name: 'patient' },
        { id: 4, name: 'admin' },
        { id: 5, name: 'nurse' }
    ];

    return new Promise((resolve, reject) => {
        // Open the database
        const request = indexedDB.open('Roles', 5);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            // Create the 'roles' object store if it doesn't exist
            if (!db.objectStoreNames.contains('roles')) {
                const store = db.createObjectStore('roles', { keyPath: 'id', autoIncrement: true });
                // Add dummy roles to the store
                dummyRoles.forEach(role => {
                    store.add(role);
                });
            }
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction('roles', 'readonly');
            const objectStore = transaction.objectStore('roles');
            const allRolesRequest = objectStore.getAll();

            allRolesRequest.onsuccess = () => {
                const roles = allRolesRequest.result;
                // If no roles found in DB, return dummy roles
                if (!roles || roles.length === 0) {
                    console.log('No roles found in DB, using dummy roles');
                    resolve(dummyRoles);
                } else {
                    resolve(roles);
                }
            };

            allRolesRequest.onerror = (event) => {
                console.error('Error fetching roles:', event.target.error);
                console.log('Using dummy roles due to fetch error');
                resolve(dummyRoles);
            };
        };

        request.onerror = (event) => {
            console.error('Database error:', event.target.error);
            console.log('Using dummy roles due to DB error');
            resolve(dummyRoles);
        };
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const roles = await getRoles();
        console.log('Roles:', roles);
        // const roles = await fetchRoles();
        const mainDiv = document.getElementById("mainDiv");
        mainDiv.className = "bg-white opacity-80 p-8 rounded-xl shadow";
        mainDiv.style.width = '450px'
        console.log(roles);

        mainDiv.innerHTML = inputForm(roles);

        const form = document.getElementById('userForm');
        form.addEventListener('submit', handleFormSubmit);

        updateUserList();
        // Use the roles data to populate a dropdown or any other UI element
    } catch (error) {
        console.error('Failed to fetch roles:', error);
    }

});

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}
