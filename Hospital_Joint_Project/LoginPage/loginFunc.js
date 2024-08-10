const usersDbName = 'Users_DB';
const adminDbName = 'admin';
let usersDb;
let adminDb;

// Open Users_DB
const usersRequest = indexedDB.open(usersDbName, 6);
usersRequest.onerror = function(event) {
    console.error("Users_DB error: ", event.target.errorCode || event.target.error);
};
usersRequest.onsuccess = function(event) {
    console.log(event);
    
    console.log("Users_DB opened successfully");
    usersDb = event.target.result;
};
usersRequest.onupgradeneeded = function(event) {
    console.log(event);
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
    console.log(event);
    console.log("admin Database opened successfully");
    adminDb = event.target.result;
};
adminRequest.onupgradeneeded = function(event) {
    console.log(event);
    console.log("Upgrading adminDatabase...");
    adminDb = event.target.result;
    if (!adminDb.objectStoreNames.contains('admin')) {
        const adminStore = adminDb.createObjectStore('admin', { keyPath: 'email' });
        adminStore.createIndex('email', 'email', { unique: true });
    }
    console.log("adminDatabase Object stores and indexes created.");
};

document.getElementById('loginForm').addEventListener('submit', function(event) {
    console.log(event);
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value; 
    console.log(email);
    console.log(password);
    

    function handleLogin(db, objectStoreName, callback) {
        console.log(db, objectStoreName, callback);
        
        const transaction = db.transaction([objectStoreName], 'readonly');
        const objectStore = transaction.objectStore(objectStoreName);
        const request = objectStore.get(email);

        request.onsuccess = function(event) {
            console.log(event);
            
            const user = request.result;
            if (user && user.password === password) {
                
                console.log(user);
                console.log(user.password);
                
                // Change user status to true
                updateUserStatus(db, objectStoreName, email, true, function() {
                    console.log(`Login successful: Status changed to true for ${email}`);
                    callback(user);
                });
            } else {
                callback(null);
            }
        };

        request.onerror = function(event) {
            console.error("Request error:", event.target.errorCode);
            document.getElementById('message').textContent = "Error: Unable to login.";
            document.getElementById('message').classList.add('text-red-500');
        };
    }

    function updateUserStatus(db, objectStoreName, email, status, callback) {
        const transaction = db.transaction([objectStoreName], 'readwrite');
        const objectStore = transaction.objectStore(objectStoreName);
        const request = objectStore.get(email);

        request.onsuccess = function(event) {
            const user = request.result;
            console.log(user);
            
            user.status = true;
            const updateRequest = objectStore.put(user);

            updateRequest.onsuccess = function(event) {
                console.log(`Status updated to ${status} for ${email}`);
                callback();
            };

            updateRequest.onerror = function(event) {
                console.error("Update status error:", event.target.errorCode);
            };
        };

        request.onerror = function(event) {
            console.error("Request error:", event.target.errorCode);
        };
    }

    // Check adminDatabase first
    handleLogin(adminDb, 'admin', function(adminUser) {
        console.log("adminUser");
        
        if (adminUser) {
            console.log(adminUser);
            alert('Login successful!');
            window.location.href = '../Admin_Dashboard/dashboard.html'; // Redirect to admin dashboard
        } else {
            // If not an admin, check Users_DB
            handleLogin(usersDb, 'users', function(normalUser) {
                console.log(usersDb);
                console.log(normalUser);
                
                if (normalUser) {
                    alert('Login successful!');
                    if (normalUser.specialization === 'doctor') {
                        window.location.href = '../Doctor_Profile_Edit/Doctor_Profile_Edit/index.html'; // Redirect to doctor dashboard
                    } else if (normalUser.specialization === 'receptionist') {
                        window.location.href = '../Recipetionist/index.html'; // Redirect to patient dashboard
                    } else if (normalUser.specialization === 'patient' || normalUser.specialization === 'Patient') {
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
