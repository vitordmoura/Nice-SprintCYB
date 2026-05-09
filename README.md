# NICE — Aplicativo de Saúde Mental e Bem‑Estar

O **NICE** é um aplicativo mobile desenvolvido com **React Native** e **Expo**, criado para apoiar o bem‑estar emocional, 
organização pessoal e hábitos saudáveis. O projeto integra práticas modernas de **DevSecOps**, incluindo CI/CD, análise estática, verificação de dependências e detecção de segredos.

---

## Grupo

| Nome | RM |
|------|------|
| Diana Letícia | 553562 |
| João Viktor | 552613 |
| Lucas Reis Diniz | 552838 |
| Thiago Araujo Vieira | 553477 |
| Victor Augusto | 553518 |
| Vitor de Moura | 553806 |

---

## Tecnologias

| Camada | Tecnologia |
|--------|------------|
| Framework | React Native 0.81 + Expo 54 |
| Linguagem | TypeScript |
| Navegação | React Navigation (Stack + Bottom Tabs) |
| Persistência | AsyncStorage |
| HTTP | Axios |
| Ícones | HugeIcons React Native |


##  Arquitetura
```
NICE-SPRINTCYB/
├── .github/
│   └── workflows/
│       └── applicationscan-pipeline.yml
│
assets/
├── favicon.png
├── icon.png
└── splash-icon.png
│
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
│
├── context/
│   ├── AuthContext.tsx
│   ├── TaskContext.tsx
│   └── ThemeContext.tsx
│
├── hooks/
│   └── useTasks.ts
│
├── routes/
│   ├── AppRoutes.tsx
│   ├── TabRoutes.tsx
│   └── TaskStackRoutes.tsx
│
├── screens/
│   ├── home/HomeScreen.tsx
│   ├── tasks/TaskListScreen.tsx
│   ├── tasks/TaskDetailScreen.tsx
│   ├── tasks/TaskFormScreen.tsx
│   ├── settings/SettingsScreen.tsx
│   └── LoginScreen.tsx
│
├── services/
│   ├── api.ts
│   └── taskStorage.ts
│
├── types/
│   ├── task.ts
│   ├── user.ts
│   └── navigation.ts
│
└── utils/
    ├── formatDate.ts
    └── generateId.ts
```

##  Funcionalidades

### Autenticação
- Login com contexto global  
- Persistência de sessão  
- Rotas protegidas  

### Tarefas e Organização
- Listagem de tarefas  
- Filtros por status e categoria  
- Criação, edição e exclusão  
- Status: **Pendente**, **Em Andamento**, **Concluída**  
- Prioridade: **Baixa**, **Média**, **Alta**
- Categorias: Trabalho, Estudos, Saúde, Pessoal, Finanças, Lazer, Compras, Outros  

### Home
- Frase motivacional via API  
- Resumo das tarefas do dia  

### Configurações
- Tema claro/escuro  
- Preferências do usuário  


## Segurança e DevSecOps

O repositório conta com um pipeline configurado no **GitHub Actions**, responsável por executar automaticamente 
verificações de segurança e qualidade sempre que há um push ou pull request.  

O pipeline CI/CD inclui:

- SAST com Semgrep  
- SCA com npm audit  
- Secret Scan com GitLeaks  
- Relatórios SARIF e HTML  
- Gestão de segredos via GitHub Secrets  
- Princípio do acesso mínimo  
- Rotação periódica de credenciais

Ao final da execução, o Actions disponibiliza **relatórios completos** com o resultado de cada etapa, permitindo 
acompanhar facilmente o status da segurança e da integridade do projeto.


## Instalação

### 1. Pré‑requisitos
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
