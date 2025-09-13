# Biblioteca Virtual - Aplicativo Mobile

## Integrantes

* João Victor Michaeli - Rm: 555678
* Henrique Garcia      - Rm: 558062
* Larissa Mezencio     - Rm: 557197

## Link do video de funcionamento

* https://youtu.be/2kXPFVHqRqk

---

## Descrição do Projeto

A **Biblioteca Virtual** é um aplicativo mobile desenvolvido em **React Native**, com integração ao **Firebase Firestore**, que permite aos usuários organizar e gerenciar sua coleção pessoal de livros de forma simples, rápida e intuitiva.

O principal objetivo do aplicativo é oferecer uma experiência completa para quem deseja acompanhar sua leitura, registrar novos livros, editar informações existentes e aplicar filtros e buscas de forma eficiente.

O Firestore fornece armazenamento em nuvem com **atualização em tempo real**, consultas otimizadas (`where` e `orderBy`) e suporte a **paginação**, garantindo performance mesmo para bibliotecas grandes.

O app conta com **interface moderna e consistente**, ícones intuitivos, feedback visual para carregamento e erros, e navegação fluida entre telas.

---

## Funcionalidades Principais

### 1. Cadastro de Livros

* Adicionar livros com campos detalhados:

  * Título
  * Autor
  * Ano de publicação
  * Gênero literário
  * Status de leitura (`quero ler`, `lendo`, `lido`)
* Cada livro recebe automaticamente uma data de criação (`createdAt`) e atualização (`updatedAt`).
* **Validações em tempo real** garantem que os campos obrigatórios estejam preenchidos corretamente.

### 2. Busca e Filtros

* **Busca em tempo real (debounced)** por título ou autor.
* **Filtros por gênero literário** (Ficção, Romance, Fantasia, Não-ficção) e **status de leitura**.
* **Ordenação de resultados** por ordem alfabética ou por data de cadastro.
* A combinação de filtros, busca e ordenação permite que o usuário encontre rapidamente o livro desejado.

### 3. Listagem e Detalhes

* Todos os livros cadastrados pelo usuário são exibidos em **cards** informativos, mostrando título, autor, ano, gênero e status.
* Ao tocar em um card, o usuário é levado à **tela de detalhes**, podendo visualizar mais informações e editar o livro se necessário.
* Existe um **botão flutuante (FAB)** que leva diretamente à tela de criação de livros.

### 4. Edição e Exclusão

* O usuário pode **editar qualquer livro** já cadastrado.

  * As alterações são salvas em tempo real no Firestore e refletidas imediatamente na lista.
  * Campos pré-preenchidos e validação garantem facilidade e segurança na edição.
* Para **excluir um livro**, o aplicativo solicita confirmação do usuário, removendo o registro do Firestore e atualizando a lista automaticamente.

### 5. Paginação e Carregamento Incremental

* A lista de livros carrega inicialmente **10 livros por página**.
* Ao chegar no final da lista, mais livros são carregados automaticamente (**load more**).
* Consultas são otimizadas utilizando filtros (`where`) e ordenação (`orderBy`).
* **Snapshot listener** garante atualização em tempo real sem perda de performance.

### 6. Perfis e Estatísticas

* O usuário possui **perfil com informações básicas** (nome e email).
* Estatísticas de leitura exibem quantos livros estão cadastrados, quantos foram lidos e quantos ainda estão em andamento.
* Possibilidade de **favoritar livros** para organizar leituras prioritárias.

---

## Fluxo de Uso do Aplicativo

### Cenário 1: Cadastro de um novo livro

1. Usuário acessa a tela principal da biblioteca.
2. Toca no **botão flutuante (+)** para adicionar um novo livro.
3. Preenche título, autor, ano, gênero e status de leitura.
4. Ao salvar, o livro aparece automaticamente na lista, com **feedback visual de sucesso**.

### Cenário 2: Busca e filtro de livros

1. Usuário digita parte do título ou autor na barra de busca.
2. A lista de livros é filtrada **em tempo real**, mostrando apenas os livros que correspondem ao texto digitado.
3. Usuário aplica filtros adicionais por gênero ou status de leitura.
4. Os resultados podem ser ordenados por título ou data de cadastro.
5. Livros que correspondem a todos os critérios aparecem em destaque nos cards.

### Cenário 3: Edição de livro existente

1. Usuário toca em um card de livro na lista.
2. Tela de detalhes é aberta, mostrando informações completas.
3. Usuário toca em **Editar**, alterando campos como título, autor ou status de leitura.
4. Após salvar, alterações são refletidas imediatamente no Firestore e na lista principal, com feedback de sucesso.

### Cenário 4: Exclusão de livro

1. Usuário acessa o card do livro que deseja excluir.
2. Toca em **Excluir** e confirma a ação em um modal de alerta.
3. O livro é removido do Firestore e desaparece da lista, mantendo a interface atualizada.

### Cenário 5: Paginação e carregamento incremental

1. Ao acessar a lista de livros, apenas os primeiros 10 livros são carregados.
2. Ao rolar até o final da lista, mais livros são carregados automaticamente.
3. A combinação de **queries otimizadas** e **snapshot listener** garante atualização em tempo real sem perda de performance.

---

## Diferenciais do Projeto

* **Atualização em tempo real** graças ao Firestore.
* **Busca e filtros combinados** que agilizam a localização de livros.
* **Interface intuitiva e responsiva**, com ícones e cores consistentes.
* **Validação de dados** em tempo real e feedback visual de operações.
* **Paginação e load more** que garantem performance para bibliotecas extensas.
* **Segurança** e boas práticas, incluindo persistência de sessão, proteção de rotas e armazenamento seguro de dados.
