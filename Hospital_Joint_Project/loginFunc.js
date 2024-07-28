// IndexedDB setup
// const dbName = 'UserDatabase';
// const dbName = 'Users_DB';
// let db;

// const request = indexedDB.open(dbName, 1);

// request.onerror = function(event) {
//     console.error("Database error: ", event.target.errorCode);
// };

// request.onsuccess = function(event) {
//     db = event.target.result;
// };

// request.onupgradeneeded = function(event) {
//     db = event.target.result;
//     const objectStore = db.createObjectStore('users', { keyPath: 'email' });
//     objectStore.createIndex('email', 'email', { unique: true });
// };


// // Login user

if (!window.indexedDB) {
    console.error("Your browser doesn't support IndexedDB.");
} else {
    openDatabase(2); // Update to the existing version or a new higher version
}

function openDatabase(version) {
    const request = indexedDB.open(dbName, version);
    console.log("request --> ", request);

    request.onerror = function(event) {
        console.error("Database error: ", event.target.errorCode || event.target.error);
    };

    request.onsuccess = function(event) {
        console.log("Database opened successfully");
        db = event.target.result;
    };

    request.onupgradeneeded = function(event) {
        console.log("Upgrading database...");
        db = event.target.result;
        if (!db.objectStoreNames.contains('users')) {
            const objectStore = db.createObjectStore('users', { keyPath: 'email' });
            objectStore.createIndex('email', 'email', { unique: true });
            console.log("Object store and index created.");
        }
    };
}

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const transaction = db.transaction(['users']);
    const objectStore = transaction.objectStore('users');
    const request = objectStore.get(email);

    request.onsuccess = function() {
        if (request.result && request.result.password === password) {
            document.getElementById('popupMessage').textContent = "Login successful!";
            document.getElementById('popup').classList.remove('hidden');
            if (request.result.type === "admin") {
                window.location.href = '../Dashboard/dashboard.html'; // Change 'dashboard.html' to the path of your desired HTML file
            }
        } else {
            document.getElementById('message').textContent = "Invalid email or password.";
        }
    };

    request.onerror = function() {
        document.getElementById('message').textContent = "Error: Unable to login.";
    };
});

document.getElementById('registerFormContainer').innerHTML = inputForm();

document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const specialization = document.getElementById('specialization').value;
    const phone = document.getElementById('phone').value;

    const transaction = db.transaction(['users'], 'readwrite');
    const objectStore = transaction.objectStore('users');
    const request = objectStore.add({ email, password, name, specialization, phone });

    request.onsuccess = function() {
        document.getElementById('successMessage').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('successMessage').classList.add('hidden');
        }, 2000);
    };

    request.onerror = function() {
        document.getElementById('successMessage').textContent = "Error: Email already registered.";
        document.getElementById('successMessage').classList.remove('hidden');
        document.getElementById('successMessage').classList.add('text-red-500');
    };
});

document.getElementById('showRegister').addEventListener('click', function() {
    document.getElementById('loginFormContainer').classList.add('hidden');
    document.getElementById('registerFormContainer').classList.remove('hidden');
});

document.getElementById('showLogin').addEventListener('click', function() {
    document.getElementById('registerFormContainer').classList.add('hidden');
    document.getElementById('loginFormContainer').classList.remove('hidden');
});

document.getElementById('closePopup').addEventListener('click', function() {
    document.getElementById('popup').classList.add('hidden');
});