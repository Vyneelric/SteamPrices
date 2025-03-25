"use strict";

let currentPage = 1;

// Função para buscar jogos pelo título (sem paginação)
async function findGamesByTitle(nameGame) {
    const url = `https://www.cheapshark.com/api/1.0/deals?storeID=1&title=${nameGame}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Função para buscar jogos com paginação
async function findGamesWithPagination(nameGame = '', page = 1) {
    const url = `https://www.cheapshark.com/api/1.0/deals?storeID=1&title=${nameGame}&pageSize=10&pageNumber=${page}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Função para formatar porcentagem
function formatPercentage(percentage) {
    return `${(Math.round(percentage * 100) / 100).toFixed(2)}%`;
}

// Função para criar uma nova linha na tabela
function createTableRow(game) {
    const tr = document.createElement('tr');

    const saving = document.createElement('td');
    saving.textContent = formatPercentage(game.savings);
    tr.appendChild(saving);

    const price = document.createElement('td');
    const priceOld = document.createElement('span');
    priceOld.classList.add('price-old');
    priceOld.textContent = `$${game.normalPrice}`;
    price.appendChild(priceOld);
    const priceNew = document.createElement('span');
    priceNew.textContent = ` $${game.salePrice}`;
    price.appendChild(priceNew);
    tr.appendChild(price);

    const title = document.createElement('td');
    title.classList.add('jogoIMG');

    const gameImage = document.createElement('img');
    gameImage.src = game.thumb;
    gameImage.alt = game.title;
    title.appendChild(gameImage);

    const gameTitle = document.createElement('p');
    gameTitle.textContent = game.title;
    title.appendChild(gameTitle);
    tr.appendChild(title);

    const rating = document.createElement('td');
    rating.textContent = game.dealRating;
    tr.appendChild(rating);

    const metacritic = document.createElement('td');
    metacritic.textContent = game.metacriticScore || '0';
    tr.appendChild(metacritic);

    return tr;
}

// Função para preencher a tabela com jogos da pesquisa
async function populateTableWithSearch(searchQuery) {
    document.getElementById('gameList').innerHTML = ''; // Limpa a tabela
    const games = await findGamesByTitle(searchQuery); // Busca jogos pelo título

    games.forEach(game => {
        const tableRow = createTableRow(game);
        document.getElementById('gameList').appendChild(tableRow);
    });
}

// Função para carregar jogos com paginação
async function populateTable(nameGame = '', page = 1) {
    const games = await findGamesWithPagination(nameGame, page);
    games.forEach(game => {
        const tableRow = createTableRow(game);
        document.getElementById('gameList').appendChild(tableRow);
    });
}

// Função para carregar mais jogos ao rolar para baixo
async function loadMoreGames() {
    currentPage += 1;
    await populateTable('', currentPage);
}

// Evento de clique no botão de pesquisa
document.getElementById('searchButton').addEventListener('click', () => {
    const searchInput = document.getElementById('searchInput').value;
    currentPage = 1;
    populateTableWithSearch(searchInput);
});

// Evento de pressionar "Enter" no campo de pesquisa
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const searchInput = document.getElementById('searchInput').value;
        currentPage = 1;
        populateTableWithSearch(searchInput);
    }
});

// Evento de rolagem para carregar mais jogos
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;

    if (scrollY + windowHeight >= documentHeight - 200) {
        loadMoreGames();
    }
});

// Carregar jogos iniciais ao carregar a página
window.onload = () => {
    populateTable('', currentPage);
};
