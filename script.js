"use strict"

        // Função para consumir a API CheapShark
        fetch('https://www.cheapshark.com/api/1.0/deals?storeID=1')
            .then(response => response.json())
            .then(data => {
                const jogos = data.slice(0, 6); // Pega os 6 primeiros jogos

                // Preencher os dados dos jogos no HTML
                const jogoElements = document.querySelectorAll('.textoIndividual');

                jogos.forEach((jogo, index) => {
                    const p = jogoElements[index].querySelector('p');
                    const span = jogoElements[index].querySelector('span');
                    const button = jogoElements[index].querySelector('button');

                    p.textContent = jogo.title;
                    span.textContent = '$' + jogo.normalPrice;
                    button.textContent = '$' + jogo.salePrice;
                });
            })
            .catch(error => console.error('Erro ao carregar dados da API:', error));