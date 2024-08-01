// New code
function openDb() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('Users_DB', 3); // Increment the version to 26

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // Create 'users' object store if it doesn't exist
            if (!db.objectStoreNames.contains('users')) {
                const userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
                // userStore.createIndex('name', 'name', { unique: false });
                // userStore.createIndex('specialization', 'specialization', { unique: false });
                // userStore.createIndex('phone', 'phone', { unique: false });
                // userStore.createIndex('email', 'email', { unique: true });
                // userStore.createIndex('password', 'password', { unique: false });
            }

            // Create 'admin' object store if it doesn't exist
            // if (!db.objectStoreNames.contains('admin')) {
            //     const adminStore = db.createObjectStore('admin', { keyPath: 'id', autoIncrement: true });
            //     adminStore.createIndex('email', 'email', { unique: true });
            //     adminStore.createIndex('password', 'password', { unique: false });
            // }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('userForm');
    form.addEventListener('submit', handleFormSubmit);

    // Optionally update the user list on page load
    updateUserList();

    // Add admin data (make sure this is only done once or handle it appropriately)
    // addAdminData();
});


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
        const db = await openDb();
        const transaction = db.transaction('users', 'readwrite');
        const objectStore = transaction.objectStore('users');

        const request = objectStore.put({
            name,
            specialization,
            phone,
            email,
            password
        });

        request.onsuccess = () => {
            document.getElementById('successMessage').classList.remove('hidden');
            form.reset();
            updateUserList();
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
        const db = await openDb();
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


document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('userForm');
    form.addEventListener('submit', handleFormSubmit);

    // Optionally update the user list on page load
    updateUserList();
});

function inputForm() {
    return `
        <h2 class="text-2xl font-bold mb-6 flex justify-center items-center text-blue-500">General SignUp Form</h2>
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
                <input
                    type="text"
                    id="specialization"
                    class="w-full p-2 border border-gray-300 rounded mt-1"
                />
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
        <div id="successMessage" class="mt-4 text-green-500 hidden">
            User added/updated successfully!
        </div>
        <ul id="userList" class="mt-4"></ul>
    `;
}

const mainDiv = document.getElementById("mainDiv");

mainDiv.className = "max-w-lg mx-auto bg-white p-8 rounded shadow";

mainDiv.innerHTML = inputForm();
