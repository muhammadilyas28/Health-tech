// Profile Component
class Profile {
    constructor(name, email, imageUrl) {
        this.name = name;
        this.email = email;
        this.imageUrl = imageUrl;
    }

    createElement() {
        const profileDiv = document.createElement('div');
        profileDiv.style.background = 'white';
        profileDiv.style.padding = '20px';
        profileDiv.style.borderRadius = '8px';
        profileDiv.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        profileDiv.style.marginTop = '20px';

        const img = document.createElement('img');
        img.src = this.imageUrl;
        img.alt = this.name;
        img.style.borderRadius = '50%';
        img.style.width = '100px';
        img.style.height = '100px';
        img.style.objectFit = 'cover';
        
        const name = document.createElement('h2');
        name.textContent = this.name;
        
        const email = document.createElement('p');
        email.textContent = `Email: ${this.email}`;
        
        profileDiv.appendChild(img);
        profileDiv.appendChild(name);
        profileDiv.appendChild(email);

        return profileDiv;
    }
}

// PatientList Component
class PatientList {
    constructor(patients) {
        this.patients = patients;
    }

    createElement() {
        const listDiv = document.createElement('div');
        listDiv.style.background = 'white';
        listDiv.style.padding = '20px';
        listDiv.style.borderRadius = '8px';
        listDiv.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        listDiv.style.marginTop = '20px';

        const title = document.createElement('h2');
        title.textContent = 'Patient List';

        const list = document.createElement('ul');
        list.style.listStyleType = 'none';
        list.style.padding = '0';
        list.style.margin = '0';

        this.patients.forEach(patient => {
            const listItem = document.createElement('li');
            listItem.textContent = `${patient.name} - ${patient.lastVisit}`;
            listItem.style.padding = '10px';
            listItem.style.borderBottom = '1px solid #ddd';
            list.appendChild(listItem);
        });

        listDiv.appendChild(title);
        listDiv.appendChild(list);

        return listDiv;
    }
}

// App Component
class App {
    constructor() {
        this.profile = new Profile(
            'Dr. John Doe',
            'john.doe@example.com',
            'https://via.placeholder.com/100'
        );
        this.patientList = new PatientList([
            { name: 'Alice Smith', lastVisit: '2024-07-20' },
            { name: 'Bob Johnson', lastVisit: '2024-07-21' },
            { name: 'Charlie Brown', lastVisit: '2024-07-22' }
        ]);
    }

    createElement() {
        const appDiv = document.createElement('div');
        appDiv.style.maxWidth = '1200px';
        appDiv.style.margin = 'auto';
        appDiv.style.padding = '20px';
        appDiv.style.fontFamily = 'Arial, sans-serif';
        appDiv.style.backgroundColor = '#f4f4f9';

        const headerDiv = document.createElement('div');
        headerDiv.style.display = 'flex';
        headerDiv.style.justifyContent = 'space-between';
        headerDiv.style.alignItems = 'center';
        headerDiv.style.background = '#007bff';
        headerDiv.style.color = 'white';
        headerDiv.style.padding = '10px 20px';
        headerDiv.style.borderRadius = '8px';

        const headerTitle = document.createElement('h1');
        headerTitle.textContent = 'Doctor Dashboard';
        headerDiv.appendChild(headerTitle);

        appDiv.appendChild(headerDiv);
        appDiv.appendChild(this.profile.createElement());
        appDiv.appendChild(this.patientList.createElement());

        return appDiv;
    }
}

// Render the app
const app = new App();
document.body.appendChild(app.createElement());