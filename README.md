# SkillMatch JS

## O que o sistema faz

Este projeto é um simulador simples de compatibilidade entre um candidato e vagas fictícias de Front-end. O sistema analisa as habilidades do candidato, compara com os requisitos de cada vaga, calcula um percentual de compatibilidade, classifica a vaga como Alta, Média ou Baixa, lista as habilidades faltantes, identifica a vaga com melhor aderência e sugere uma recomendação de estudo.

O objetivo é demonstrar, de forma prática, conceitos de JavaScript estudados no módulo, como classes, herança, callbacks, closures, Promises e async/await.

## Como executar

1. Acesse a pasta do projeto:

```bash
cd skillmatch
```

2. Execute o arquivo principal:

```bash
node console/skillmatch-console.js
```

3. O programa irá exibir no console o perfil do candidato, as vagas carregadas, os percentuais de compatibilidade, as habilidades faltantes e a melhor vaga encontrada.

## Regra de cálculo da compatibilidade

A compatibilidade é calculada da seguinte forma:

- O sistema compara as habilidades do candidato com os requisitos de cada vaga.
- Para cada vaga, é contado quantas habilidades exigidas o candidato já possui.
- O percentual é calculado com a fórmula:

```text
compatibilidade = (habilidades compatíveis / total de requisitos) * 100
```

Exemplo: se a vaga exige 5 habilidades e o candidato possui 4, a compatibilidade será de 80% e portanto, a vaga será classificada como Alta.

## Critério de prioridade para a recomendação de estudo

A recomendação de estudo é baseada nas habilidades que ainda faltam para a vaga. A primeira habilidade faltante da lista de requisitos é tratada como a prioridade principal pensando em cenários reais em que a listagem de vagas é descrita por ordem de prioridade, e assim, representa o próximo ponto mais importante para aumentar a chance de aprovação. O sistema também mostra todas as habilidades faltantes para que o candidato saiba o que estudar.

## Conceitos aplicados

Este projeto utiliza diversos conceitos de JavaScript, entre eles:

- Classes e objetos
- Herança
- Construtor e métodos
- Uso de this
- Callbacks
- Closures
- Arrays e métodos de array como filter, reduce e forEach
- Promises
- Async/await
- Estruturas de decisão, como if/else
- Funções e arrow functions

## Arquitetura cliente-servidor

A aplicação simula uma comunicação cliente-servidor por meio de uma Promise. A função responsável por buscar as vagas representa uma requisição assíncrona, como se os dados estivessem vindo de um servidor remoto. Enquanto isso, o fluxo principal do programa aguarda a resposta com async/await antes de continuar a análise das vagas.

Em termos simples, o cliente é o código que solicita os dados e o servidor é a fonte imaginária dessas informações. No projeto, a simulação acontece no próprio ambiente JavaScript, mas a lógica segue o mesmo fluxo de uma aplicação real: pedir dados, esperar a resposta e processar o resultado.

## Extensões do VS Code utilizadas

As extensões abaixo foram usadas ou recomendadas para facilitar o desenvolvimento e a organização do projeto:

- GitHub Copilot
- JavaScript (ES6) code snippets
- GitLens
- Prettier
- Live Server

## Var, let e const

No projeto, foi priorizado o uso de const e let em vez de var.

- var: possui escopo de função, ou seja, pode "vazar" para fora de blocos como if, for e while. Isso pode gerar comportamentos inesperados.
- let: permite reatribuição de valor, mas respeita o escopo de bloco, o que torna o código mais previsível.
- const: define uma variável que não pode receber uma nova atribuição depois de criada, sendo ideal para valores fixos como nomes de classes, listas de requisitos e objetos principais.

Exemplo prático de problema com var neste projeto:

```javascript
if (true) {
  var mensagem = "compatibilidade calculada";
}

console.log(mensagem);
```

Nesse caso, o var permanece acessível mesmo fora do bloco, o que pode confundir a leitura do código e gerar bugs quando a variável é usada em outra parte do programa.

Outro exemplo:

```javascript
for (var i = 0; i < 3; i++) {
  console.log(i);
}

console.log(i);
```

Com var, a variável i continua existindo após o loop, o que pode causar comportamento inesperado em funções maiores ou em projetos que crescem. Com let, o valor ficaria mais restrito ao bloco do loop e seria mais seguro.

Por isso, evitamos usar var neste projeto: ele pode tornar o código menos previsível, principalmente quando há múltiplas funções, estruturas de decisão e loops trabalhando com o mesmo tipo de dado.

## Quadro Kanban

O acompanhamento das tarefas foi organizado no GitHub Projects:

https://github.com/users/guigbastos/projects/2

## Vídeo de apresentação

Link do vídeo: [\[Clique para acessar o vídeo.\]](https://drive.google.com/file/d/19aZU8A-XHSmpVH-b33xAK9x192X_XX3J/view?usp=sharing)

## Observações

O projeto foi desenvolvido com foco em demonstrar lógica de programação e conceitos fundamentais de JavaScript de forma simples e didática.
