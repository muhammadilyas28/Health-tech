// const dbName = 'Users_DB';
// let db;

// if (!window.indexedDB) {
//     console.error("Your browser doesn't support IndexedDB.");
// } else {
//     const request = indexedDB.open(dbName, 3);

//     request.onerror = function(event) {
//         console.error("Database error: ", event.target.errorCode || event.target.error);
//     };

//     request.onsuccess = function(event) {
//         console.log("Database opened successfully");
//         db = event.target.result;
//     };

//     request.onupgradeneeded = function(event) {
//         console.log("Upgrading database...");
//         db = event.target.result;

//         if (!db.objectStoreNames.contains('users')) {
//             const userStore = db.createObjectStore('users', { keyPath: 'email' });
//             userStore.createIndex('email', 'email', { unique: true });
//         }

//         if (!db.objectStoreNames.contains('admin')) {
//             const adminStore = db.createObjectStore('admin', { keyPath: 'email' });
//             adminStore.createIndex('email', 'email', { unique: true });
//         }

//         console.log("Object stores and indexes created.");
//     };
// }

// // Login user
// document.getElementById('loginForm').addEventListener('submit', function(event) {
//     event.preventDefault();
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;

//     // Function to handle login for a specific object store
//     function handleLogin(objectStoreName, callback) {
//         const transaction = db.transaction([objectStoreName], 'readonly');
//         const objectStore = transaction.objectStore(objectStoreName);

//         const request = objectStore.get(email);

//         request.onsuccess = function() {
//             const user = request.result;
            
//             if (user && user.password === password) {
//                 callback(user);
//             } else {
//                 callback(null);
//             }
//         };

//         request.onerror = function() {
//             document.getElementById('message').textContent = "Error: Unable to login.";
//             document.getElementById('message').classList.add('text-red-500');
//         };
//     }

//     // Check admin table first
//     handleLogin('admin', function(adminUser) {
//         if (adminUser) {
//             alert('Login successful!');
//             window.location.href = '../Dashboard/admin_dashboard.html'; // Redirect to admin dashboard
//         } else {
//             // If not an admin, check users table
//             handleLogin('users', function(normalUser) {
//                 if (normalUser) {
//                     alert('Login successful!');
//                     if (normalUser.specialization === 'doctor') {
//                         window.location.href = '../Doctorsdashboard/index.html'; // Redirect to doctor dashboard
//                     } else if (normalUser.specialization === 'patient') {
//                         window.location.href = '../patientDashboard/index.html'; // Redirect to patient dashboard
//                     } else {
//                         window.location.href = '../UserDashboard/user_dashboard.html'; // Redirect to a default user dashboard
//                     }
//                 } else {
//                     document.getElementById('message').textContent = "Invalid email or password.";
//                     document.getElementById('message').classList.add('text-red-500');
//                 }
//             });
//         }
//     });
// });
// ---------------------New Code -----------------------
const usersDbName = 'Users_DB';
const adminDbName = 'adminDatabase';
let usersDb;
let adminDb;

// Open Users_DB
const usersRequest = indexedDB.open(usersDbName, 3);
usersRequest.onerror = function(event) {
    console.error("Users_DB error: ", event.target.errorCode || event.target.error);
};
usersRequest.onsuccess = function(event) {
    console.log("Users_DB opened successfully");
    usersDb = event.target.result;
};
usersRequest.onupgradeneeded = function(event) {
    console.log("Upgrading Users_DB...");
    usersDb = event.target.result;
    if (!usersDb.objectStoreNames.contains('users')) {
        const userStore = usersDb.createObjectStore('users', { keyPath: 'email' });
        userStore.createIndex('email', 'email', { unique: true });
    }
    console.log("Users_DB Object stores and indexes created.");
};

// Open adminDatabase
const adminRequest = indexedDB.open(adminDbName, 5);
adminRequest.onerror = function(event) {
    console.error("adminDatabase error: ", event.target.errorCode || event.target.error);
};
adminRequest.onsuccess = function(event) {
    console.log("adminDatabase opened successfully");
    adminDb = event.target.result;
};
adminRequest.onupgradeneeded = function(event) {
    console.log("Upgrading adminDatabase...");
    adminDb = event.target.result;
    if (!adminDb.objectStoreNames.contains('admin')) {
        const adminStore = adminDb.createObjectStore('admin', { keyPath: 'email' });
        adminStore.createIndex('email', 'email', { unique: true });
    }
    console.log("adminDatabase Object stores and indexes created.");
};
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Function to handle login for a specific object store in a specific database
    function handleLogin(db, objectStoreName, callback) {
        const transaction = db.transaction([objectStoreName], 'readonly');
        const objectStore = transaction.objectStore(objectStoreName);
        const request = objectStore.get(email);

        request.onsuccess = function() {
            const user = request.result;
            if (user && user.password === password) {
                callback(user);
            } else {
                callback(null);
            }
        };

        request.onerror = function() {
            document.getElementById('message').textContent = "Error: Unable to login.";
            document.getElementById('message').classList.add('text-red-500');
        };
    }

    // Check adminDatabase first
    handleLogin(adminDb, 'admin', function(adminUser) {
        if (adminUser) {
            alert('Login successful!');
            window.location.href = '../Dashboard/dashboard.html'; // Redirect to admin dashboard
        } else {
            // If not an admin, check Users_DB
            handleLogin(usersDb, 'users', function(normalUser) {
                if (normalUser) {
                    alert('Login successful!');
                    if (normalUser.specialization === 'doctor') {
                        window.location.href = '../Doctorsdashboard/index.html'; // Redirect to doctor dashboard
                    } else if (normalUser.specialization === 'patient') {
                        window.location.href = '../patientDashboard/index.html'; // Redirect to patient dashboard
                    } else {
                        window.location.href = '../UserDashboard/user_dashboard.html'; // Redirect to a default user dashboard
                    }
                } else {
                    document.getElementById('message').textContent = "Invalid email or password.";
                    document.getElementById('message').classList.add('text-red-500');
                }
            });
        }
    });
});
