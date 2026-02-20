# TaskTamer — Offline & Shareable 🏆

**Gerenciador de tarefas simples, 100% offline e compartilhável por arquivo**

TaskTamer é uma aplicação web leve que permite criar, editar e **compartilhar listas de tarefas** sem precisar de conta, servidor ou conexão constante com a internet.

As tarefas ficam salvas automaticamente no seu navegador e você pode exportar tudo em um arquivo `.tasktamer` para enviar por WhatsApp, e-mail, drive, etc. Qualquer pessoa com acesso ao site consegue importar o arquivo e continuar o trabalho.

## ✨ Principais funcionalidades

- 100% **offline** — funciona sem internet depois do primeiro acesso
- Salvamento **automático** no navegador (IndexedDB)
- **Exportação** para arquivo `.tasktamer` (formato próprio, leve e legível)
- **Importação** por arrastar e soltar ou botão
- Exportação alternativa em **JSON** (para debug ou integração)
- Edição rápida de tarefas com **duplo clique**
- Tabela com: Status • Tarefa • Responsável • Descrição • Ações
- Botão de **reset local** (limpa todos os dados salvos no navegador)
- Interface limpa e responsiva

## 🚀 Como usar

1. Acesse → https://felipe-felpipi.github.io/TaskTamer/
2. Adicione suas tarefas usando o formulário
3. As tarefas são salvas automaticamente
4. Para compartilhar:
   - Clique em **Exportar arquivo (.tasktamer)**
   - Envie o arquivo por qualquer meio
5. A outra pessoa:
   - Abre o site
   - Arrasta o arquivo `.tasktamer` na área indicada **ou** clica em Importar
   - Pronto! As tarefas aparecem na lista

## 💾 Formato do arquivo `.tasktamer`

É um arquivo JSON compactado e com extensão customizada.  
Contém array de tarefas com campos:  
`id`, `title`, `responsible`, `description`, `status`, `createdAt`, etc.

## 🛠 Tecnologias utilizadas

- HTML5 + CSS3
- Vanilla JavaScript (sem frameworks pesados)
- IndexedDB (armazenamento local persistente)
- File API (exportação e importação de arquivos)
- Service Worker (para funcionamento offline — PWA-like)

https://felipe-felpipi.github.io/TaskTamer/
