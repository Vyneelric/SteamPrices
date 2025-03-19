"use strict";

// Variável para controlar a página dos resultados carregados
let currentPage = 1;

// Função para buscar jogos a partir da API
async function findGamesTitle(nameGame, page = 1) {
    const url = `https://www.cheapshark.com/api/1.0/deals?storeID=1&title=${nameGame}&pageSize=10&pageNumber=${page}`;
    const response = await fetch(url);
    const data = await response.json();
    return data; // Retorna os dados dos jogos
}

// Função para formatar o valor da porcentagem para 2 casas decimais
function formatPercentage(percentage) {
    return `${(Math.round(percentage * 100) / 100).toFixed(2)}%`;
}

// Função para criar uma nova linha na tabela
function createTableRow(game) {
    const tr = document.createElement('tr');

    // SAVINGS (formato de porcentagem)
    const saving = document.createElement('td');
    saving.textContent = formatPercentage(game.savings); // Formata a porcentagem
    tr.appendChild(saving);

    // PRICE
    const price = document.createElement('td');
    const priceOld = document.createElement('span');
    priceOld.classList.add('price-old');
    priceOld.textContent = `$${game.normalPrice}`;
    price.appendChild(priceOld);
    const priceNew = document.createElement('span');
    priceNew.textContent = ` $${game.salePrice}`;
    price.appendChild(priceNew);
    tr.appendChild(price);

    // TITLE (Imagem e nome do jogo)
    const title = document.createElement('td');
    title.classList.add('jogoIMG');  // Adicionando a classe 'jogoIMG'

    const gameImage = document.createElement('img');
    gameImage.src = game.thumb;
    gameImage.alt = game.title;
    title.appendChild(gameImage);

    const gameTitle = document.createElement('p');
    gameTitle.textContent = game.title;
    title.appendChild(gameTitle);
    tr.appendChild(title);

    // DEAL RATING
    const rating = document.createElement('td');
    rating.textContent = game.dealRating;
    tr.appendChild(rating);

    // METACRITIC
    const metacritic = document.createElement('td');
    metacritic.textContent = game.metacriticScore || '0';
    tr.appendChild(metacritic);

    return tr;
}

// Função para preencher a tabela com jogos
async function populateTable(searchQuery = '', page = 1) {
    const gameList = document.getElementById('gameList');
    const games = await findGamesTitle(searchQuery, page); // Pega os jogos com base na pesquisa e na página

    games.forEach(game => {
        const tableRow = createTableRow(game); // Cria a linha da tabela
        gameList.appendChild(tableRow); // Adiciona a linha na tabela
    });
}

// Função que será chamada quando o usuário clicar no botão de pesquisa
document.getElementById('searchButton').addEventListener('click', () => {
    const searchInput = document.getElementById('searchInput').value;
    currentPage = 1; // Resetar para a primeira página de resultados
    document.getElementById('gameList').innerHTML = ''; // Limpa a tabela antes de adicionar novos jogos
    populateTable(searchInput, currentPage); // Preenche a tabela com a pesquisa
});

// Função que será chamada ao pressionar "Enter" no campo de pesquisa
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const searchInput = document.getElementById('searchInput').value;
        currentPage = 1;
        document.getElementById('gameList').innerHTML = ''; // Limpa a tabela
        populateTable(searchInput, currentPage); // Preenche a tabela com a pesquisa
    }
});

// Função para carregar mais jogos quando o usuário rolar para baixo
async function handleScroll() {
    const scrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;

    // Verifica se o usuário chegou ao final da página
    if (scrollY + windowHeight >= documentHeight - 200) {
        currentPage += 1; // Avança para a próxima página
        populateTable('', currentPage); // Carrega mais jogos
    }
}

// Adiciona o listener de rolagem
window.addEventListener('scroll', handleScroll);

// Carregar jogos iniciais assim que a página for carregada
window.onload = () => {
    populateTable('', currentPage); // Carrega jogos de forma inicial
};
