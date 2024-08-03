// ---------------------New Code -----------------------
const usersDbName = 'Users_DB';
const adminDbName = 'admin';
let usersDb;
let adminDb;

// Open Users_DB
const usersRequest = indexedDB.open(usersDbName, 5);
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
    console.log("admin Database opened successfully");
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
    console.log(email);
    console.log(password);   

    // Function to handle login for a specific object store in a specific database
    // function handleLogin(db, objectStoreName, callback) {
    //     console.log(db, objectStoreName, callback);
        
    //     const transaction = db.transaction([objectStoreName], 'readonly');
    //     const objectStore = transaction.objectStore(objectStoreName);
    //     console.log(email);
    //     console.log(password);
        
    //     // const request = objectStore.get(email);
    //     const request = objectStore.get("a@gmail.com");
    //     console.log(request);
    //     console.log(objectStore);
    //     request.onsuccess = function() {
    //         const user = request.result;
    //         console.log(user);
            
    //         if (user && user.password === password) {
    //             console.log(user);
                
    //             callback(user);
    //         } else {
    //             callback(null);
    //         }
    //     };

    //     request.onerror = function() {
    //         document.getElementById('message').textContent = "Error: Unable to login.";
    //         document.getElementById('message').classList.add('text-red-500');
    //     };
    // }


    function handleLogin(db, objectStoreName, callback) {
        console.log("DB:", db);
        console.log("Object Store Name:", objectStoreName);
        console.log("Callback Function:", callback);
        
        const transaction = db.transaction([objectStoreName], 'readonly');
        const objectStore = transaction.objectStore(objectStoreName);
        
        console.log("Email:", email);
        console.log("Password:", password);
        
        const request = objectStore.get(email);
        console.log("Request:", request);
        console.log("Object Store:", objectStore);
        
        request.onsuccess = function(event) {
            const user = request.result;
            console.log("User:", user);
            
            if (user && user.password === password) {
                console.log("Login successful:", user);
                callback(user);
            } else {
                console.log("Login failed: Invalid email or password");
                callback(null);
            }
        };
    
        request.onerror = function(event) {
            console.error("Request error:", event.target.errorCode);
            document.getElementById('message').textContent = "Error: Unable to login.";
            document.getElementById('message').classList.add('text-red-500');
        };
    }
    
    // // Example usage:
    // // Assume you have already opened the database and obtained a reference to `db`
    // const db; // Replace this with the actual database reference
    // const objectStoreName = "users";
    // const email = "a@gmail.com";
    // const password = "password123";
    
    // handleLogin(db, objectStoreName, email, password, function(user) {
    //     if (user) {
    //         console.log("User logged in:", user);
    //     } else {
    //         console.log("Login failed");
    //     }
    // });
    

    // Check adminDatabase first
    handleLogin(adminDb, 'admin', function(adminUser) {
        console.log(adminDb);
        console.log(adminUser);
        
        if (adminUser) {
            alert('Login successful!');
            window.location.href = '../Dashboard/dashboard.html'; // Redirect to admin dashboard
        } else {
            // If not an admin, check Users_DB
            handleLogin(usersDb, 'users', function(normalUser) {
                if (normalUser) {
                    alert('Login successful!');
                    if (normalUser.specialization === 'doctor') {
                        window.location.href = '../Doctor_Profile_Edit/Doctor_Profile_Edit/index.html'; // Redirect to doctor dashboard
                    } else if (normalUser.specialization === 'receptionist') {
                        window.location.href = '../Recipetionist/index.html'; // Redirect to patient dashboard
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
