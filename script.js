'use strict';

const searchInput = document.querySelector('#search');
const suggestionsContainer = document.querySelector('#suggestions');
const errorMessage = document.querySelector('.error-message');
const spinner = document.querySelector('.spinner');
let selectedSuggestionIndex = -1;

const selectSuggestion = function (i) {
  if (i >= 0 && i < suggestionsContainer.children.length) {
    const selectedSuggestion = suggestionsContainer.querySelector('.selected');
    if (selectedSuggestion) selectedSuggestion.classList.remove('selected');

    const newSelectedSuggestion = suggestionsContainer.children[i];
    newSelectedSuggestion.classList.add('selected');

    searchInput.value = newSelectedSuggestion.textContent;
    suggestionsContainer.style.display = 'none';
    selectedSuggestionIndex = i;
  }
};

const clearHighlight = function () {
  const highlightedSuggestion =
    suggestionsContainer.querySelector('.highlighted');
  if (highlightedSuggestion)
    highlightedSuggestion.classList.remove('highlighted');
};

const highlightSuggestion = function (i) {
  clearHighlight();

  if (i >= 0 && i < suggestionsContainer.children.length) {
    const newSelectedSuggestion = suggestionsContainer.children[i];
    newSelectedSuggestion.classList.add('highlighted');

    // searchInput.value = newSelectedSuggestion.textContent;
    selectedSuggestionIndex = i;
  }
};

const showSuggestions = function (suggestions) {
  suggestionsContainer.innerHTML = ''; // Clear prev suggestions

  if (suggestions.length > 0) {
    suggestions.forEach((suggestion, index) => {
      // console.log(suggestion);
      const div = document.createElement('div');
      div.classList.add('suggestion');
      div.textContent = suggestion.name.common;

      div.addEventListener('click', () => {
        selectSuggestion(index);
      });

      div.addEventListener('mouseover', () => {
        highlightSuggestion(index);
      });

      div.addEventListener('mouseout', () => {
        clearHighlight();
      });

      suggestionsContainer.appendChild(div);
    });

    suggestionsContainer.style.display = 'block';
  } else {
    suggestionsContainer.style.display = 'none';
  }
};

const fetchSuggestions = function (query) {
  if (query.length === 0) {
    suggestionsContainer.innerHTML = '';
    suggestionsContainer.style.display = 'none';
    return;
  }

  spinner.style.display = 'block'; // Show spinner while fetching
  errorMessage.style.display = 'none'; // Hide message while fetching

  fetch(`https://restcountries.com/v3.1/name/${query}`)
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch suggestions');
      return res.json();
    })
    .then(suggestions => {
      if (searchInput.value.trim() === query) {
        // Show suggestions and hide spinner after 1 second delay
        setTimeout(() => {
          showSuggestions(suggestions);
          spinner.style.display = 'none';
        }, 500);

        errorMessage.style.display = 'none';
      }
    })
    .catch(error => {
      console.error('Error fetching suggestions:', error);
      showSuggestions([]);
      spinner.style.display = 'none';
      errorMessage.style.display = 'block';
    });
};

searchInput.addEventListener('input', function () {
  const query = searchInput.value.trim();
  fetchSuggestions(query);
});
