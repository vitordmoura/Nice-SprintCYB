# TaskFlow — CP Mobile

Aplicativo de gerenciamento de tarefas desenvolvido com **React Native** e **Expo**.

## Grupo

| Nome | RM |
|:--|:--:|
| Thiago Araujo Vieira | 553477 |
| Lucas Reis Diniz | 552838 |
| Diana Letícia | 553562 |
| João Viktor | 552613 |
| Victor Augusto | 553518 |
| Vitor de Moura | 553806 |

---

## Tecnologias

| Camada | Tecnologia |
|:--|:--|
| Framework | React Native 0.81 + Expo 54 |
| Linguagem | TypeScript |
| Navegação | React Navigation (Stack + Bottom Tabs) |
| Persistência | AsyncStorage |
| HTTP | Axios |
| Ícones | HugeIcons React Native |

---

## Arquitetura

```
src/
├── components/
│   ├── CategoryIcon.tsx
│   ├── CustomButton.tsx
│   ├── CustomInput.tsx
│   ├── EmptyState.tsx
│   ├── FilterBar.tsx
│   ├── Header.tsx
│   ├── StatusBadge.tsx
│   └── TaskCard.tsx
├── context/
│   ├── AuthContext.tsx
│   ├── TaskContext.tsx
│   └── ThemeContext.tsx
├── hooks/
│   └── useTasks.ts
├── routes/
│   ├── AppRoutes.tsx
│   ├── TabRoutes.tsx
│   └── TaskStackRoutes.tsx
├── screens/
│   ├── home/HomeScreen.tsx
│   ├── tasks/TaskListScreen.tsx
│   ├── tasks/TaskDetailScreen.tsx
│   ├── tasks/TaskFormScreen.tsx
│   ├── settings/SettingsScreen.tsx
│   └── LoginScreen.tsx
├── services/
│   ├── api.ts
│   └── taskStorage.ts
├── types/
│   ├── task.ts
│   ├── user.ts
│   └── navigation.ts
└── utils/
    ├── formatDate.ts
    └── generateId.ts
```

---

## Funcionalidades

### Autenticação
- Tela de login com contexto de autenticação
- Rotas protegidas por autenticação

### Tarefas
- Listagem de tarefas com filtro por status e categoria
- Criação e edição de tarefas
- Detalhes da tarefa com status e prioridade
- Status: **Pendente · Em Andamento · Concluída**
- Prioridade: **Baixa · Média · Alta**
- Categorias: Trabalho, Estudos, Saúde, Pessoal, Finanças, Lazer, Compras, Outros

### Home
- Frase motivacional aleatória via API (`dummyjson.com/quotes`)
- Resumo das tarefas do dia

### Configurações
- Alternância de tema claro/escuro

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

```bash
npm install -g expo-cli
```

## Demonstração 


https://github.com/user-attachments/assets/cfc255d8-57d1-4c3c-8643-c5b4805e3fd5



---

## Como rodar

### 1. Instalar dependências

```bash
npm install
```

### 2. Iniciar o projeto

```bash
npx expo start
```

Escaneie o QR Code com o aplicativo **Expo Go** (Android/iOS) ou pressione:
- `a` — abrir no emulador Android
- `i` — abrir no simulador iOS
- `w` — abrir no navegador (web)
