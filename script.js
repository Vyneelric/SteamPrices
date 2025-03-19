document.addEventListener("DOMContentLoaded", async () => {
    async function fetchGames(storeID) {
        try {
            const response = await fetch(`https://www.cheapshark.com/api/1.0/deals?storeID=${storeID}`);
            const data = await response.json();
            return data.slice(0, 6);
        } catch (error) {
            console.error(`Erro ao buscar jogos da loja ${storeID}:`, error);
            return [];
        }
    }

    async function loadGames(storeID, containerSelector, priceClass) {
        const games = await fetchGames(storeID);
        const container = document.querySelector(containerSelector);

        // Limpa o conteúdo anterior
        container.innerHTML = '';

        games.forEach((game) => {
            const divGame = document.createElement('div');
            divGame.classList.add('textoIndividual');

            const title = document.createElement('p');
            title.textContent = game.title;

            const priceContainer = document.createElement('div');
            priceContainer.classList.add(priceClass);

            const normalPrice = document.createElement('span');
            normalPrice.textContent = `$${game.normalPrice}`;

            const salePrice = document.createElement('button');
            salePrice.textContent = `$${game.salePrice}`;

            // Monta a estrutura
            priceContainer.appendChild(normalPrice);
            priceContainer.appendChild(salePrice);
            divGame.appendChild(title);
            divGame.appendChild(priceContainer);
            container.appendChild(divGame);
        });
    }

    loadGames(1, '.steam .textosSteam', 'priceSteam');  // Adiciona os jogos da Steam
    loadGames(25, '.epic .textosEpic', 'priceEpic');   // Adiciona os jogos da Epic Games
});
