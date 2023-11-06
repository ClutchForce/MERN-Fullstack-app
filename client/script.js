let ascendingOrder = true;  // A variable to keep track of the current sort order

function sanitizeInput(input) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return input.replace(reg, (match)=>(map[match]));
}

// Function to validate superhero IDs
function validateSuperheroIds(ids) {
    return ids.map(id => parseInt(id.trim())).filter(id => !isNaN(id));
}

// Function to sort the superhero data based on a specified field and order
function sortSuperheroes(superheroes, field, sortType) {
    //console.log('sortSuperheroes', superheroes, field);
    return superheroes.slice().sort((a, b) => {
        let comparison = 0;
        if (field === 'powers') {
            comparison = a.powers.length - b.powers.length;
        } else {
            //fix undefined error by accessing properties directly on a and b
            if (sortType === 'list') {
                comparison = a.info[field].localeCompare(b.info[field]);
            } else {
                comparison = a[field].localeCompare(b[field]);
            }
        }
        return ascendingOrder ? comparison : -comparison;
    });
}

// Define a function to handle the search form submission
function handleSearchFormSubmit(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the form data
    //fix sanitize input
    const searchField = sanitizeInput(document.getElementById('search-field').value);
    const searchPattern = sanitizeInput(document.getElementById('search-pattern').value);

    const numResults = document.getElementById('num-results').value || undefined;  // If no value is provided, set it to undefined

    
    //check to see if search pattern and field is empty and return appropriate error message if so
    if (!searchPattern || !searchField) {
        const resultsContainer = document.getElementById('results-container');
        resultsContainer.textContent = '';
        resultsContainer.textContent = 'Both search pattern and field are required.';
        return;
    }

    // Build the URL for the search request
    const url = new URL('/api/superheroes/search', window.location.origin);
    url.searchParams.append('field', searchField);
    url.searchParams.append('pattern', searchPattern);
    if (numResults) {
        url.searchParams.append('n', numResults);
    }
    //Debugging
    console.log(url);

    // Send the search request using the fetch API
    fetch(url)
        .then(response => {
            if (!response.ok) {
                // If the response status is not OK, throw an error
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        // Update the .then block to sort the data before displaying it
        .then(data => {
            Promise.all(data.map(superheroId => getSuperheroInfo(superheroId)))
                .then(superheroes => {
                    const sortField = document.getElementById('sort-field').value;
                    const sortType = 'search';
                    const sortedSuperheroes = sortSuperheroes(superheroes, sortField, sortType);
                    // Display the search results on the page
                    displaySearchResults(sortedSuperheroes);
                });
        })
        .catch(error => {
            // Log any errors to the console
            console.error('There has been a problem with your fetch operation:', error);
        });
}

// Define a function to fetch and process superhero powers
async function getSuperheroPowers(superheroId) {
    // Send a request to get the superhero powers
    const response = await fetch(`/api/superheroes/${superheroId}/powers`);
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    const powerData = await response.json();
    // Filter out the false values and collect the power names into an array
    const powersArray = Object.keys(powerData)
        .filter(power => powerData[power] === "True")
        .map(power => power.replace(/_/g, ' '));  // Replace underscores with spaces
    return powersArray;
}

// Define a function to get superhero information
async function getSuperheroInfo(superheroId) {
    // Send a request to get the superhero information
    console.log('getSuperheroInfo', superheroId);
    const response = await fetch(`/api/superheroes/${superheroId}`);

    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    const superheroInfo = await response.json();
    // Get the superhero powers
    const powersArray = await getSuperheroPowers(superheroId);  // pass superheroId instead of superheroInfo.name
    // Append the powers array to the superhero information object
    superheroInfo.powers = powersArray;
    return superheroInfo;
}

// Update the displaySearchResults function
function displaySearchResults(data) {
    //console.log('displaySearchResults', data);
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.textContent = '';  // Clear any previous search results
    if (data.length === 0) {
        resultsContainer.textContent = 'No results found.';
        return;
    }
    // Create a table element
    const table = document.createElement('table');
    // Create a table header row
    const headerRow = document.createElement('tr');
    const headers = ['ID','Name', 'Gender', 'Eye Color', 'Race', 'Hair Color', 'Height', 'Publisher', 'Skin Color', 'Alignment', 'Weight', 'Powers'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.appendChild(document.createTextNode(headerText));
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Add each superhero's data as a row in the table
    data.forEach(superheroInfo => {
        const row = document.createElement('tr');
        const rowData = [
            superheroInfo.id,
            superheroInfo.name,
            superheroInfo.Gender,
            superheroInfo['Eye color'],
            superheroInfo.Race,
            superheroInfo['Hair color'],
            superheroInfo.Height,
            superheroInfo.Publisher,
            superheroInfo['Skin color'],
            superheroInfo.Alignment,
            superheroInfo.Weight,
            superheroInfo.powers.join(', ')
        ];
        rowData.forEach(dataText => {
            const td = document.createElement('td');
            td.appendChild(document.createTextNode(dataText));
            row.appendChild(td);
        });
        table.appendChild(row);
    });

    // Append the table to the results container
    resultsContainer.appendChild(table);
}


// Function sends a request to the server to create or update a list when the form is submitted
function handleListFormSubmit(event) {
    event.preventDefault();
    const listName = document.getElementById('list-name').value;
    //added sanitize input
    const superheroIds = validateSuperheroIds(document.getElementById('superhero-ids').value.split(','));

    // Function to compare two arrays of IDs to see if they are different
    function arraysDiffer(a, b) {
        return a.length !== b.length || a.some((item, index) => item !== b[index]);
    }

    // Check if the list already exists
    fetch(`/api/lists/${listName}`)
        .then(response => {
            if (response.ok) {
                // If the list exists, get its superhero IDs and compare them to the new IDs
                return response.json().then(existingIds => {
                    if (arraysDiffer(existingIds, superheroIds)) {
                        // If the IDs are different, update the list
                        return fetch(`/api/lists/${listName}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ superheroIds }),
                        })
                        .then(response => {
                            if (!response.ok) {
                                // Handle non-successful responses
                                return response.text().then(text => { throw new Error(text); });
                            }
                            // Refresh the list of lists after the list is updated
                            fetchLists();
                        });
                    } else {
                        // If the IDs are the same, log an appropriate error message
                        console.error(`The superhero IDs for the list "${listName}" are already up to date.`);
                    }
                });
            } else {
                // If the list doesn't exist, create it
                return fetch('/api/lists', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ listName }),
                })
                .then(response => {
                    if (!response.ok) {
                        // Handle non-successful responses
                        return response.text().then(text => { throw new Error(text); });
                    }
                    // If the list is created successfully, update it with the superhero IDs
                    return fetch(`/api/lists/${listName}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ superheroIds }),
                    });
                })
                .then(response => {
                    if (!response.ok) {
                        // Handle non-successful responses
                        return response.text().then(text => { throw new Error(text); });
                    }
                    // Refresh the list of lists after the new list is created and updated
                    fetchLists();
                });
            }
        })
        .catch(error => console.error('Error handleListFormSubmit:', error));
}


// Function to fetch the existing lists from the server and display them on the page
// Update to the fetchLists function to sort the data before displaying it
function fetchLists() {
    fetch('/api/lists')
    .then(response => response.json())
    .then(data => {
        const listsContainer = document.getElementById('lists-container');
        listsContainer.textContent = '';  // Clear the existing content
        data.forEach(listName => {
            fetchListDetails(listName).then(superheroes => {
                const sortField = document.getElementById('sort-field').value;
                //fix need to access info field of object
                const sortType = 'list';
                const sortedSuperheroes = sortSuperheroes(superheroes, sortField, sortType);
                displayList(listName, sortedSuperheroes);
            });
        });
    })
    .catch(error => console.error('Error fetchLists:', error));
}

// Update the displayList function
// Added sanitizion by removing innerHTML and using textContent
function displayList(listName, superheroes) {
    const listsContainer = document.getElementById('lists-container');
    const listDiv = document.createElement('div');
    listDiv.className = 'list';

    const listHeader = document.createElement('div');
    listHeader.className = 'list-header';

    const listNameTextNode = document.createTextNode(listName);
    listHeader.appendChild(listNameTextNode);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', () => deleteList(listName));

    listHeader.appendChild(deleteButton);
    listDiv.appendChild(listHeader);
    listsContainer.appendChild(listDiv);

    superheroes.forEach(superhero => {
        const superheroDiv = document.createElement('div');
        superheroDiv.className = 'superhero';

        const h3 = document.createElement('h3');
        h3.textContent = superhero.name;
        superheroDiv.appendChild(h3);

        const properties = [
            { label: 'ID', value: superhero.info.id },
            { label: 'Gender', value: superhero.info.Gender },
            { label: 'Eye Color', value: superhero.info['Eye color'] },
            { label: 'Race', value: superhero.info.Race },
            { label: 'Hair Color', value: superhero.info['Hair color'] },
            { label: 'Height', value: superhero.info.Height },
            { label: 'Publisher', value: superhero.info.Publisher },
            { label: 'Skin color', value: superhero.info['Skin color'] },
            { label: 'Alignment', value: superhero.info.Alignment },
            { label: 'Weight', value: superhero.info.Weight },
            { label: 'Powers', value: superhero.powers.join(', ') },
        ];

        properties.forEach(prop => {
            const p = document.createElement('p');
            p.textContent = `${prop.label}: ${prop.value}`;
            superheroDiv.appendChild(p);
        });

        listDiv.appendChild(superheroDiv);
    });
}


// Function to toggle the sort order and refresh the displayed results
function toggleSortOrder() {
    ascendingOrder = !ascendingOrder;
    fetchLists();
    //refresh the search results as well if needed
    document.getElementById('search-form').dispatchEvent(new Event('submit'));
}

// Function to fetch the details for a specific list and display them on the page
function fetchListDetails(listName) {
    return new Promise((resolve, reject) => {
        fetch(`/api/lists/${listName}/details`)
        .then(response => {
            if (!response.ok) {
                return reject('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const superheroes = data.map(item => {
                return {
                    name: item.name,
                    info: item.info,
                    powers: item.powers || []  // will return empty array if no powers
                };
            });
            resolve(superheroes);
        })
        .catch(error => {
            console.error('Error fetchListDetails:', error);
            reject(error);
        });
    });
}

//Add a function to delete a list
function deleteList(listName) {
    //console.log('deleteList', listName);
    fetch(`/api/lists/${listName}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        // Refresh the list of lists after a list is deleted
        fetchLists();
    })
    .catch(error => console.error('Error deleteList:', error));
    //refresh the search results as well if needed
    fetchLists();
}

// Function to fetch the superhero IDs in a list by list name
function fetchListNames() {
    return fetch('/api/lists')
        .then(response => response.json())
        .catch(error => console.error('Error fetchListNames:', error));
}

// Function to fetch the superhero IDs in a list by list name
function populateListNameDropdown(listNames) {
    const listNameDropdown = document.getElementById('list-name-dropdown');
    listNameDropdown.textContent = '';  // Clear existing items
    listNames.forEach(listName => {
        const dropdownItem = document.createElement('div');
        dropdownItem.className = 'dropdown-item';
        dropdownItem.setAttribute('data-value', listName);
        dropdownItem.textContent = listName;
        listNameDropdown.appendChild(dropdownItem);
    });
    // Update input value, hide dropdown, and fetch superhero IDs when a dropdown item is clicked
    listNameDropdown.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            const listNameField = document.getElementById('list-name');
            listNameField.value = item.getAttribute('data-value');
            listNameDropdown.style.display = 'none';
            fetchListSuperheroIds(listNameField.value);
        });
    });
}

// Function to fetch the superhero IDs in a list by list name
function fetchListSuperheroIds(listName) {
    fetch(`/api/lists/${listName}`)
        .then(response => response.json())
        .then(data => {
            const superheroIdsField = document.getElementById('superhero-ids');
            superheroIdsField.value = data.join(', ');  // simply join the data as it's already an array of IDs
        })
        .catch(error => console.error('Error:', error));
}

// Add an event listener to the name search field
document.addEventListener('DOMContentLoaded', (event) => {
    const searchField = document.getElementById('search-field');
    const searchDropdown = document.getElementById('search-dropdown');
    const dropdownItems = document.querySelectorAll('.dropdown-item');


    // Show dropdown when input is clicked
    searchField.addEventListener('click', () => {
        searchDropdown.style.display = 'block';
    });

    // Hide dropdown when anything other than the dropdown is clicked
    window.addEventListener('click', (event) => {
        if (event.target !== searchField && event.target.parentNode !== searchDropdown) {
            searchDropdown.style.display = 'none';
        }
    });

    // Update input value and hide dropdown when a dropdown item is clicked
    dropdownItems.forEach(item => {
        item.addEventListener('click', () => {
            searchField.value = item.getAttribute('data-value');
            searchDropdown.style.display = 'none';
        });
    });
    // code to handle search pattern dropdown
    const searchPattern = document.getElementById('search-pattern');
    const patternDropdown = document.getElementById('pattern-dropdown');

    // Function to populate the pattern dropdown
    function populatePatternDropdown(publishers) {
        patternDropdown.textContent = '';  // Clear existing items
        publishers.forEach(publisher => {
            if (publisher) {  // Ignore empty strings
                const dropdownItem = document.createElement('div');
                dropdownItem.className = 'dropdown-item';
                dropdownItem.setAttribute('data-value', publisher);
                dropdownItem.textContent = publisher;
                patternDropdown.appendChild(dropdownItem);
            }
        });
        // Update input value and hide dropdown when a dropdown item is clicked
        patternDropdown.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                searchPattern.value = item.getAttribute('data-value');
                patternDropdown.style.display = 'none';
            });
        });
    }

    // Function to fetch publishers and populate the pattern dropdown
    function fetchPublishers() {
        fetch('http://localhost:3000/api/publishers')
            .then(response => response.json())
            .then(data => populatePatternDropdown(data))
            .catch(error => console.error('Error fetchPublishers:', error));
    }

    // Show or hide pattern dropdown based on search field value
    searchPattern.addEventListener('click', () => {
        if (searchField.value.toLowerCase() === 'publisher') {
            fetchPublishers();  // Fetch publishers if not already fetched
            patternDropdown.style.display = 'block';
        } else {
            patternDropdown.style.display = 'none';
        }
    });

    // Hide pattern dropdown when anything other than the dropdown is clicked
    window.addEventListener('click', (event) => {
        if (event.target !== searchPattern && event.target.parentNode !== patternDropdown) {
            patternDropdown.style.display = 'none';
        }
    });

    // Show pattern dropdown when input is clicked, if search field value is 'publisher'
    searchPattern.addEventListener('click', () => {
        if (searchField.value.toLowerCase() === 'publisher') {
            patternDropdown.style.display = 'block';
        }
    });

    // Function to fetch powers and populate the pattern dropdown
    function fetchPowers() {
        fetch('http://localhost:3000/api/superheroes/0/powers')
            .then(response => response.json())
            .then(data => {
                const powers = Object.keys(data).slice(1);  // Exclude the first key "hero_names"
                populatePatternDropdown(powers);
            })
            .catch(error => console.error('Error fetchPowers:', error));
    }

    // Show or hide pattern dropdown based on search field value
    searchPattern.addEventListener('click', () => {
        const searchFieldValue = searchField.value.toLowerCase();
        if (searchFieldValue === 'publisher') {
            fetchPublishers();  // Fetch publishers if not already fetched
            patternDropdown.style.display = 'block';
        } else if (searchFieldValue === 'power') {
            fetchPowers();  // Fetch powers if not already fetched
            patternDropdown.style.display = 'block';
        } else {
            patternDropdown.style.display = 'none';
        }
    });

    const listNameField = document.getElementById('list-name');
    const listNameDropdown = document.createElement('div');
    listNameDropdown.id = 'list-name-dropdown';
    listNameDropdown.className = 'dropdown-content';
    listNameField.parentNode.appendChild(listNameDropdown);

    // Show list name dropdown when input is clicked
    listNameField.addEventListener('click', () => {
        fetchListNames()
            .then(data => {
                populateListNameDropdown(data);
                listNameDropdown.style.display = 'block';
            });
    });

    // Hide list name dropdown when anything other than the dropdown is clicked
    window.addEventListener('click', (event) => {
        if (event.target !== listNameField && event.target.parentNode !== listNameDropdown) {
            listNameDropdown.style.display = 'none';
        }
    });

});

// Add an event listener to the toggle-sort-order button
document.getElementById('toggle-sort-order').addEventListener('click', toggleSortOrder);

// Add an event listener to the list form
document.getElementById('list-form').addEventListener('submit', handleListFormSubmit);

// Call fetchLists to load and display the lists when the page loads
fetchLists();

// Add an event listener to the search form
const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', handleSearchFormSubmit);

