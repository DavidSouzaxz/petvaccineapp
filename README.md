# petCard 🐾

O **petCard** é um aplicativo móvel nativo desenvolvido para ajudar tutores a gerenciar e organizar a saúde, histórico de vacinação e agendamentos de seus pets. O app consome dados de uma API remota, possui integração com Google Maps para localização de clínicas parceiras e gerencia notificações locais.

---

## 🚀 Tecnologias Utilizadas

### Frontend & Mobile

- **React Native** (com **Expo SDK 51**)
- **EAS Build & CLI** (Gerenciamento de compilação nativa de APKs)
- **KeyboardAwareScrollView** (Tratamento fluido de inputs e teclados)
- **React Native Maps** (Integração nativa com o Google Maps SDK)
- **AsyncStorage** (Persistência local de sessão e preferências)

### Backend (API Remota)

- **Node.js / Express** (Hospedado no **Render**)

---

## 🛠️ Configuração do Ambiente Local

### Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** (Versão LTS recomendada)
- **Android Studio** (com emulador configurado e ferramentas de SDK)

### 1. Clonar o Repositório

```bash
git clone https://github.com/davidsouzaxz/petvaccineapp.git

cd petvaccineapp
```

## 2. Instalar Dependências

```bash
npm install
```

## 3. Variáveis de Ambiente (.env)

Crie um arquivo .env na raiz do projeto e configure suas chaves privadas. Atenção: Este arquivo está listado no .gitignore e nunca deve ser commitado.

```bash
npx expo start --clear
Visualizar Logs do Emulador Android
Caso precise depurar requisições ou erros nativos em tempo real diretamente do console
```

# Instale a dependência de CLI caso necessário

```bash
npm install --save-dev @react-native-community/cli
```

# Inicie a captura de logs

```bash
npx react-native log-android
```

📦 Compilação e Build (EAS Build)
O projeto está configurado de forma segura no eas.json para ocultar segredos de produção no histórico do Git usando placeholders em variáveis.

Gerar APK de Produção (preview)
Para compilar o APK injetando as variáveis do ambiente e salvando o arquivo final de forma renomeada na raiz do projeto, execute:

```bash
eas build --platform android --profile preview --clear-cache --output=./PetCard.apk
```

Instalar o último build direto no Emulador
Se o emulador local estiver aberto com espaço liberado (Wipe Data feito), você pode baixar e instalar o último pacote gerado na nuvem rodando:

```bash
eas build:run --platform android
```

📂 Estrutura de Arquivos Chave

```bash
/src/services/ - Integração com APIs (ServiceUser.js, ServicePet.js, etc).

/src/core/ - Regras de negócio estáticas e mapeamentos (SpeciesImageMap.js).

app.json - Manifesto global do Expo e permissões nativas de hardware (INTERNET, LOCATION).

eas.json - Perfis de compilação da infraestrutura Expo.
```
