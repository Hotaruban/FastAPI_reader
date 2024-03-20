document.addEventListener("DOMContentLoaded", function() {
    var button = document.getElementById("connectButton");
    button.addEventListener("click", collectUserInfo);
	createColumnCheckboxes();
	var today = new Date();
    var dateStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
    document.getElementById('startDate').value = dateStr;
    document.getElementById('endDate').value = dateStr;
});

function collectUserInfo() {
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;

	var userInfo = {
		'username': username,
		'password': password
	};

	var apiUrl = "https://main-bvxea6i-pr4445soispvo.eu-5.platformsh.site/api/v1/login";
	var acceptHeader = "application/json";
	var contentType = "application/x-www-form-urlencoded";

	fetch(apiUrl, {
		method: 'POST',
		headers: {
			'accept': acceptHeader,
			'Content-Type': contentType,
		},
		body: new URLSearchParams({
			'grant_type': '',
			'username': userInfo.username,
			'password': userInfo.password,
			'scope': '',
			'client_id': '',
			'client_secret': ''
		}).toString()
	})
	.then(response => {
		if (!response.ok) {
			throw new Error('Request failed');
		}
		return response.json();
	})
	.then(response => {
		console.log("Access token accepted: " + response.access_token);
		localStorage.setItem('token', response.access_token);
		localStorage.setItem('tokenType', response.token_type);
		document.getElementById('connectUser').style.display = 'none';
		document.getElementById('selectDateAndDevice').style.display = 'block';
	})
	.catch(error => {
		console.error(error);
	});
}

// Ajoutez cette fonction pour créer une liste de contrôle pour les colonnes
function createColumnCheckboxes() {
    const columns = ['time', 'temperature', 'humidity', 'co2', 'power', 'CH4', 'CO', 'O2', 'NH3', 'NO2'];
    const container = document.getElementById('columnCheckboxes');

    for (let column of columns) {
        const label = document.createElement('label');
        //label.textContent = column;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = column;
        checkbox.checked = true;

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(column));
        container.appendChild(label);
    }
}

// Appelez cette fonction lorsque la page est chargée
//createColumnCheckboxes();

document.getElementById('submitDateAndDevice').addEventListener('click', function() {
    // Récupérez les colonnes sélectionnées
    const selectedColumns = Array.from(document.querySelectorAll('#columnCheckboxes input:checked')).map(input => input.value);

    let startDate = document.getElementById('startDate').value;
    let endDate = document.getElementById('endDate').value;
    const device = document.getElementById('device').value;

    startDate += 'T00:00:00';
    endDate += 'T23:59:59';

    const deviceIds = {
        'manna1': '65844092e9a18c85e20bb1f5',
        'manna2': '65844101e9a18c85e20bb1f6'
    };

    const deviceId = deviceIds[device];

    const url = new URL(`https://main-bvxea6i-pr4445soispvo.eu-5.platformsh.site/api/v1/devices/data/${deviceId}`);
    url.searchParams.append('start_datetime', startDate);
    url.searchParams.append('end_datetime', endDate);
    url.searchParams.append('csv_file', 'false');

    fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': localStorage.getItem('tokenType') + ' ' + localStorage.getItem('token')
        }
    })
    .then(response => response.json())
    .then(data => {
        // Create the table
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // Add the column headers
        const headerRow = document.createElement('tr');
        for (let key in data[0]) {
            if (selectedColumns.includes(key)) { // Check if the column is selected
                const th = document.createElement('th');
                th.textContent = key;
                headerRow.appendChild(th);
            }
        }
        thead.appendChild(headerRow);

        // Add the data
        for (let item of data) {
            const row = document.createElement('tr');
            for (let key in item) {
                if (selectedColumns.includes(key)) { // Check if the column is selected
                    const td = document.createElement('td');
                    td.textContent = item[key];
                    row.appendChild(td);
                }
            }
            tbody.appendChild(row);
        }

        table.appendChild(thead);
        table.appendChild(tbody);

        // Show the table
        document.getElementById('getDataDevice').innerHTML = '';
        document.getElementById('getDataDevice').appendChild(table);
    })
    .catch(error => console.error('Error:', error));
});
