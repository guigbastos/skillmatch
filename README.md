# SkillMatch

Aplicação acadêmica que compara as habilidades de uma pessoa com os requisitos de vagas fictícias de Front-End, Back-End e Full Stack. O percentual representa a correspondência entre habilidades e requisitos; não é uma probabilidade de contratação.

## Funcionalidades

- Preenchimento de perfil com nome, área de interesse, habilidades e anos de experiência profissional por tecnologia.
- Análise somente das vagas da área escolhida, com habilidades encontradas e faltantes, percentual e classificação.
- Destaque da vaga de maior compatibilidade e recomendação das habilidades faltantes mais frequentes.
- Catálogo local de 15 vagas em JSON, com cinco vagas por área e cinco por senioridade.
- Estados visíveis de carregamento, catálogo vazio, área sem vagas e falha ao carregar os dados.
- Perfil salvo no navegador depois de uma análise válida e restaurado quando a aplicação é aberta novamente. O contador de análises é reiniciado a cada sessão.

Não há backend nem candidatura real. Os anos de experiência aparecem no resumo do perfil, mas não alteram o cálculo de compatibilidade.

## Como executar a aplicação web

Você precisa do Git, do Visual Studio Code e de um navegador moderno. Para carregar os módulos JavaScript e o catálogo com `fetch`, abra a página por um servidor HTTP, e não diretamente por `file://`.

1. Clone o repositório e entre na pasta:

   ```bash
   git clone https://github.com/guigbastos/skillmatch.git
   cd skillmatch
   ```

   O acesso ao repositório no GitHub é necessário para cloná-lo.

2. Abra a pasta `skillmatch` no Visual Studio Code.
3. Instale ou habilite a extensão Live Server, se ainda não estiver disponível.
4. Clique com o botão direito em `index.html` e escolha **Open with Live Server**.
5. Use no navegador o endereço HTTP aberto pelo Live Server.

A aplicação web não exige pacotes npm nem etapa de build.

## Organização dos arquivos

- `index.html`: estrutura semântica da página e formulário.
- `assets/styles/index.style.css`: identidade visual e layout responsivo com Flexbox.
- `assets/scripts/main.js`: coordena carregamento, validação, análise, persistência e atualização da interface.
- `assets/scripts/engine.js`: classes, validação do perfil e regras de compatibilidade e recomendação.
- `assets/scripts/data.js`: carregamento do JSON e leitura/gravação do perfil no `localStorage`.
- `assets/scripts/ui.js`: eventos do formulário, mensagens e renderização do DOM.
- `assets/data/jobs.json`: catálogo fictício usado pela aplicação web.
- `assets/img/logo.svg`: logotipo.
- `skillmatch.js`: mini original de console, mantido como histórico do projeto.

### Executar o mini original

O mini de console é uma versão anterior e independente da aplicação web. Com Node.js instalado, execute na raiz do repositório:

```bash
node skillmatch.js
```

Esse comando executa somente o mini; ele não inicia a aplicação web.

## Regras de negócio

Habilidades são normalizadas removendo espaços externos e convertendo o texto para minúsculas. Requisitos repetidos são considerados uma única vez. O cálculo é:

```text
compatibilidade = habilidades encontradas / requisitos únicos da vaga × 100
```

- A área selecionada determina quais vagas entram na análise, mas não altera a porcentagem.
- A senioridade é exibida nos cards e não filtra as vagas.
- Alta: 80% ou mais; Média: de 50% a menos de 80%; Baixa: menos de 50%.
- Em empate na melhor compatibilidade, vence a vaga de menor ID. As vagas analisadas continuam na ordem do catálogo.
- A recomendação considera as habilidades faltantes mais frequentes entre as vagas da área; habilidades empatadas são apresentadas juntas.
- Para cada habilidade selecionada, o perfil recebe um número inteiro de 0 a 50 anos. Zero significa que ainda não há experiência profissional naquela tecnologia. Períodos podem se sobrepor e não são somados.
- Os salários do catálogo são valores numéricos mensais em reais.

## Conceitos aplicados

A aplicação usa HTML semântico, CSS externo com Flexbox e JavaScript nativo em módulos ES. O código também demonstra classes, herança, `this`, métodos de array, callback, closure, `fetch`, `async/await` e `localStorage`.

- `FrontEndJob` herda de `Job` e personaliza o título da vaga.
- `Job.analyse()` usa `this` para analisar os requisitos da própria vaga.
- `map`, `filter` e `reduce` participam do fluxo real: `normalizeSkills()` normaliza e remove repetições; `analyseJobs()` filtra pela área e transforma vagas em resultados; `buildStudyRecommendation()` encontra a maior frequência e seleciona as habilidades recomendadas.
- `analyseJobs()` recebe um callback que entrega o resumo ao fluxo coordenado por `main.js`.
- `createAnalysisCounter()` usa uma closure para manter a contagem privada durante a sessão.
- `data.js` usa `fetch` e `async/await` para carregar o catálogo e `localStorage` para persistir o perfil.

## Organização e evolução

O acompanhamento das tarefas está no [GitHub Projects](https://github.com/users/guigbastos/projects/2). O desenvolvimento web segue em `develop`, com uma branch `feat/...` por cartão e integração por pull request. A integração final da versão web em `main` está prevista para o cartão C20.

A versão web evolui do mini de console criado em 10/08/2026, commit `c9150c6`. No mini, `fetchJobsFromServer()` simulava uma requisição com `Promise`, atraso e falha aleatória; na versão web, `data.js` usa `fetch` para ler `assets/data/jobs.json`. O mini priorizava a primeira habilidade faltante de uma vaga; a aplicação web recomenda as habilidades faltantes mais frequentes entre as vagas da área selecionada.

## Demonstração

O vídeo disponível mostra o mini original de console, não a aplicação web:
Vídeo demonstrativo da versão console:

[Assistir à demonstração do mini SkillMatch](https://drive.google.com/file/d/19aZU8A-XHSmpVH-b33xAK9x192X_XX3J/view?usp=sharing)

Vídeo demonstrativo da versão web:

[Assistir à demonstração do SkillMatch Web](https://drive.google.com/file/d/1n5nCLJT4wLxGNd3-7bTu_aXzPeeiNwx-/view?usp=sharing)

## Melhorias futuras

Estas ideias não estão implementadas na versão atual:

- Filtrar vagas por modalidade e ordená-las por salário.
- Oferecer tema claro e escuro.
- Publicar a aplicação em uma hospedagem estática, como GitHub Pages.
- Integrar a aplicação a APIs externas.
