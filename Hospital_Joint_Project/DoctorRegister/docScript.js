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
        <h2 class="text-3xl font-bold mb-6 flex justify-center items-center text-green-900">Sign Up in HEALTH-CARE </h2>
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
            <div class="mb-4">
                <label for="password" class="block text-gray-700">Password</label>
                <input
                    type="password"
                    id="password"
                    class="w-full p-2 border border-gray-300 rounded mt-1"
                />
            </div>
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
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
            status:false,
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
    return new Promise((resolve, reject) => {
        // Open the database
        const request = indexedDB.open('Roles', 5); // Adjust the version if needed

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            // Create the 'roles' object store if it doesn't exist
            if (!db.objectStoreNames.contains('roles')) {
                db.createObjectStore('roles', { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction('roles', 'readonly');
            const objectStore = transaction.objectStore('roles');
            const allRolesRequest = objectStore.getAll();

            allRolesRequest.onsuccess = () => {
                resolve(allRolesRequest.result);
            };

            allRolesRequest.onerror = (event) => {
                console.error('Error fetching roles:', event.target.error);
                reject(event.target.error);
            };
        };

        request.onerror = (event) => {
            console.error('Database error:', event.target.error);
            reject(event.target.error);
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
    mainDiv.style.width='450px'
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
