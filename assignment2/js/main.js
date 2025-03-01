/*********************************************************************************
* WEB422 – Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name:Lynne Ngo Student ID:129432233 Date:2025-02-08
*
********************************************************************************/

// Removed the unnecessary comment block at the top

// Define constants and variables
const API_URL = 'http://localhost:3000/api/movies';
const PER_PAGE = 10;
let currentPage = 1;

/**
 * Loads movie data from the API and updates the table.
 * @param {string} title - Optional title to search for.
 */
function loadMovieData(title = null) {
  console.log('loadMovieData called with title');
  const url = `${API_URL}?page=${currentPage}&perPage=${PER_PAGE}${title ? `&title=${title}` : ''}`;
  const paginationControl = document.querySelector('.pagination');
  

  if (paginationControl) {
    if (title !== null) {
      currentPage = 1; // Reset page to 1 when searching by title
      paginationControl.classList.add('d-none'); // Hide pagination control
    } else {
      paginationControl.classList.remove('d-none'); // Show pagination control
    }
  }

  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Format data and add to DOM
      const rows = data.map(movie => {
        const runtimeHours = Math.floor(movie.runtime / 60);
        const runtimeMinutes = (movie.runtime % 60).toString().padStart(2, '0');
        return `
          <tr data-id="${movie._id}">
            <td>${movie.year}</td>
            <td>${movie.title}</td>
            <td>${movie.plot || 'N/A'}</td>
            <td>${movie.rated || 'N/A'}</td>
            <td>${runtimeHours}:${runtimeMinutes}</td>
          </tr>
        `;
      }).join('');

      document.querySelector('#moviesTable tbody').innerHTML = rows;

      // Add click event listeners to table rows
      const tableRows = document.querySelectorAll('#moviesTable tbody tr');
      tableRows.forEach(row => {
        row.addEventListener('click', () => {
          const id = row.getAttribute('data-id');
         
      
          // Load movie data
          fetch(`${API_URL}/${id}`)
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              } else {
                return response.json();
              }
            })
            .then(movieData => {
              // Set modal title
              const modalTitle = document.querySelector('#detailsModalLabel');
              modalTitle.textContent = movieData.title;

              // Set modal body
              const modalBody = document.querySelector('#detailsModal .modal-body');
              const html = `
                <img class="img-fluid w-100" src="${movieData.poster}"><br><br>
                <strong>Directed By:</strong> ${movieData.directors.join(', ')}<br><br>
                <p>${movieData.fullplot}</p>
                <strong>Cast:</strong> ${movieData.cast.join(', ') || 'N/A'}<br><br>
                <strong>Awards:</strong> ${movieData.awards.text || 'N/A'}<br>
                <strong>IMDB Rating:</strong> ${movieData.imdb.rating} (${movieData.imdb.votes} votes)
              `;
              modalBody.innerHTML = html;

              // Show modal
              const detailsModal = new bootstrap.Modal(document.querySelector('#detailsModal'));
              detailsModal.show();
            })
            .catch(error => {
              console.error(error);
            });
        });
      });
    });
}
loadMovieData();
// Add click events to the "previous page" and "next page" buttons
document.addEventListener('DOMContentLoaded', () => {
  // Click event for the "previous page" pagination button
  document.querySelector('#previousPage').addEventListener('click', () => {
    console.log(currentPage);
    if (currentPage > 1) {
      currentPage--;
      loadMovieData();
      updatePaginationControl();
    }
  });

  // Click event for the "next page" pagination button
  document.querySelector('#nextPage').addEventListener('click', () => {
    if (currentPage < 3) {
      currentPage++;
      loadMovieData();
      updatePaginationControl();
    }
  });

  // Click event for the page number buttons
  document.querySelectorAll('.page-item:not(#previousPage):not(#nextPage)').forEach((item) => {
    item.addEventListener('click', (e) => {
      const pageNumber = parseInt(e.target.textContent);
      currentPage = pageNumber;
      loadMovieData();
      updatePaginationControl();
    });
  });

  // Update the pagination control to reflect the current page number
  function updatePaginationControl() {
    document.querySelectorAll('.page-item:not(#previousPage):not(#nextPage)').forEach((item) => {
      item.classList.remove('active');
      const pageNumber = parseInt(item.querySelector('.page-link').textContent);
      if (pageNumber === currentPage) {
        item.classList.add('active');
      }
    });
  }

  // Submit event for the "searchForm" form
  document.querySelector('#searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.querySelector('#title').value;
    loadMovieData(title);
  });

  // Click event for the "clearForm" button
  document.querySelector('#clearForm').addEventListener('click', () => {
    document.querySelector('#title').value = '';
    loadMovieData();
  });
});
