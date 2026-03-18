const quoteElement = document.getElementById('quote-element');
const quoteEmpty = document.getElementById('quote-empty');
const generateButton = document.getElementById('generate-quote-button');
const favoriteButton = document.getElementById('favorite-quote-button');
const quoteForm = document.getElementById('quote-form');
const quoteInput = document.getElementById('quote-input');
const favoriteQuotesList = document.getElementById('favorite-quotes-list');
const personalQuotesList = document.getElementById('personal-quotes-list');

const quotes = [
    "It isn’t normal to know what we want. It is a rare and difficult psychological achievement.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "The only way to do great work is to love what you do.",
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "The two most important days in your life are the day you are born... and the day you find out why.",
    "Believe you can and you’re halfway there.",
    "Your time is limited, so don’t waste it living someone else’s life.",
    "The best way to predict the future is to create it.",
    "Life’s most persistent and urgent question is, ‘What are you doing for others?’",
    "Be yourself; everyone else is already taken."
]

let currentQuote = "";
const favoriteQuotes = [];
const userQuotes = [];

if(localStorage.getItem('favoriteQuotes')) {
    const storedFavorites = JSON.parse(localStorage.getItem('favoriteQuotes'));
    storedFavorites.forEach((quote) => {
        if(!favoriteQuotes.includes(quote)) {
            favoriteQuotes.push(quote);
        }
    });
}

if(localStorage.getItem('userQuotes')) {
    const storedUserQuotes = JSON.parse(localStorage.getItem('userQuotes'));
    storedUserQuotes.forEach((quote) => {
        if(!userQuotes.includes(quote)) {
            userQuotes.push(quote);
        }
        if(!quotes.includes(quote)) {
            quotes.push(quote);
        }
    });
}

if (localStorage.getItem('currentQuote')) {
    const storedQuote = localStorage.getItem('currentQuote');
    if (quotes.includes(storedQuote)) {
        currentQuote = storedQuote;
    }
}

function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}

function updateFavorites() {
    favoriteQuotesList.innerHTML = '';
    favoriteQuotes.forEach((quote) => {
        const listItem = document.createElement('li');
        listItem.className = 'qotd__favorite-item';
        listItem.innerHTML = `
            <p class="qotd__favorite-quote">❤️ ${quote}</p>
            <button class="qotd__button qotd__button--remove-favorite">Remove</button>
        `;
        favoriteQuotesList.appendChild(listItem);
        const removeButton = listItem.querySelector('.qotd__button--remove-favorite');
        removeButton.addEventListener('click', () => {
            const index = favoriteQuotes.indexOf(quote);
            if (index > -1) {
                favoriteQuotes.splice(index, 1);
            }
            updateDisplay();
        });
    });
}



function updatePersonalQuotes() {
    personalQuotesList.innerHTML = '';
    userQuotes.forEach((quote) => {
        const listItem = document.createElement('li');
        listItem.className = 'qotd__personal-item';
        listItem.innerHTML = `
            <p class="qotd__personal-quote">❤️ ${quote}</p>
            <button class="qotd__button qotd__button--remove-personal">Remove</button>
        `;
        personalQuotesList.appendChild(listItem);
        const removeButton = listItem.querySelector('.qotd__button--remove-personal');
        removeButton.addEventListener('click', () => {
            personalQuotesList.removeChild(listItem);
            const index = userQuotes.indexOf(quote);
            if (index > -1) {
                userQuotes.splice(index, 1);
            }
            const favoriteIndex = favoriteQuotes.indexOf(quote);
            if (favoriteIndex > -1) {
                favoriteQuotes.splice(favoriteIndex, 1);
            }
            const allQuotesIndex = quotes.indexOf(quote);
            if (allQuotesIndex > -1) {
                quotes.splice(allQuotesIndex, 1);
            }
            updateDisplay();
        });
    });
}

function updateDisplay() {
    updateFavorites();
    updatePersonalQuotes();
    if (!currentQuote) {
        quoteElement.style.display = 'none';
        quoteEmpty.style.display = 'block';
        favoriteButton.style.display = 'none';
    } else {
        quoteElement.style.display = 'block';
        quoteEmpty.style.display = 'none';
        quoteElement.textContent = `${currentQuote}`;
        favoriteButton.style.display = 'inline-block';
        if (favoriteQuotes.includes(currentQuote)) {
        favoriteButton.textContent = '❤️ Unfavorite';
        } else {
        favoriteButton.textContent = '❤️ Favorite';
        }
    }
    if (favoriteQuotes.length === 0) {
        favoriteQuotesList.innerHTML = 
        "<li class='qotd__favorite-empty'>No favorite quotes yet. Click the ❤️ button to add some!</li>";
    }
    if (userQuotes.length === 0) {
        personalQuotesList.innerHTML = 
        "<li class='qotd__personal-empty'>No personal quotes yet. Use the form above to add your own quotes!</li>";
    }
    localStorage.setItem('userQuotes', JSON.stringify(userQuotes));
    localStorage.setItem('favoriteQuotes', JSON.stringify(favoriteQuotes));
    localStorage.setItem('currentQuote', currentQuote);
}
    
generateButton.addEventListener('click', () => {
    currentQuote = getRandomQuote();
    updateDisplay();
});

favoriteButton.addEventListener('click', () => {
    if (!favoriteQuotes.includes(currentQuote)) {
        favoriteQuotes.push(currentQuote);
    } else {
        const index = favoriteQuotes.indexOf(currentQuote);
        if (index > -1) {
            favoriteQuotes.splice(index, 1);
        }
    }
    updateDisplay();
});

quoteForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const newQuote = quoteInput.value.trim();
    if (newQuote) {
        quotes.push(newQuote);
        userQuotes.push(newQuote);
        quoteInput.value = '';
        currentQuote = newQuote;
        updateDisplay();
    }
});

updateDisplay();