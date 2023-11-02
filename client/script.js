// Define a function to handle the search form submission
function handleSearchFormSubmit(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the form data
    const searchField = document.getElementById('search-field').value;
    const searchPattern = document.getElementById('search-pattern').value;
    const numResults = document.getElementById('num-results').value || undefined;  // If no value is provided, set it to undefined

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
        .then(data => {
            // Display the search results on the page
            displaySearchResults(data);
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
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '';
    if (data.length === 0) {
        resultsContainer.textContent = 'No results found.';
        return;
    }
    // Use Promise.all to fetch and display information for all superheroes concurrently
    Promise.all(data.map(superheroId => getSuperheroInfo(superheroId)))
        .then(superheroes => {
            superheroes.forEach(superheroInfo => {
                const resultItem = document.createElement('div');
                resultItem.textContent = JSON.stringify(superheroInfo, null, 2);
                resultsContainer.appendChild(resultItem);
            });
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

// Add an event listener to the search form
const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', handleSearchFormSubmit);
