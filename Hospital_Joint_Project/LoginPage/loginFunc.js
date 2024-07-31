const dbName = 'Users_DB';
let db;

const request = indexedDB.open(dbName, 2);
if (!window.indexedDB) {
    console.error("Your browser doesn't support IndexedDB.");
} else {

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
        const userStore = db.createObjectStore('users', { keyPath: 'email' });
        userStore.createIndex('email', 'email', { unique: true });

        // const adminStore = db.createObjectStore('admin', { keyPath: 'email' });
        // adminStore.createIndex('email', 'email', { unique: true });
        
        console.log("Object stores and indexes created.");
    };
}

// Login user
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Function to handle login for a specific object store
    function handleLogin(objectStoreName, callback) {
        console.log(objectStoreName);
        console.log(objectStoreName);
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

    // Check admin table first
    handleLogin('admin', function(adminUser) {
        console.log(adminUser);
        if (adminUser) {
            console.log(adminUser);
            alert('Login successful!');
            window.location.href = '../Dashboard/dashboard.html'; // Redirect to admin dashboard
        } else {
            // If not an admin, check users table
            handleLogin('users', function(normalUser) {
                console.log(normalUser);
                if (normalUser) {
                    console.log(normalUser);
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
