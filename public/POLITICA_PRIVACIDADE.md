### `POLITICA_PRIVACIDADE`

```markdown
# Política de Privacidade - petCard

**Última atualização: Junho de 2026**

Esta Política de Privacidade descreve como o aplicativo **petCard** coleta, usa e protege as informações dos usuários ao utilizar nossos serviços de gerenciamento de saúde animal.

---

## 1. Informações que Coletamos

### 1.1 Informações Fornecidas por Você

- **Dados de Cadastro:** Nome completo, endereço de e-mail, número de contato telefônico e senha criptografada.
- **Dados do Pet:** Nome do animal, espécie, raça, peso, data de nascimento e fotos de perfil (avatares pré-definidos ou imagens carregadas de sua câmera/galeria).

### 1.2 Informações de Dispositivo e Localização

- **Permissão de Localização:** Solicitamos acesso à geolocalização do dispositivo (`ACCESS_FINE_LOCATION`) exclusivamente para renderizar o mapa interativo de clínicas veterinárias próximas. Esses dados não são salvos em nossos servidores.
- **Permissão de Internet:** Necessária para sincronizar os dados dos seus pets com o nosso servidor hospedado de forma segura.

---

## 2. Uso das Informações

Utilizamos os dados coletados exclusivamente para:

- Autenticar o seu acesso ao ecossistema do aplicativo.
- Sincronizar e salvar o histórico de vacinas e dados de peso dos seus pets.
- Exibir clínicas veterinárias ao redor do tutor através da API do Google Maps.

---

## 3. Armazenamento e Segurança dos Dados

- O aplicativo armazena tokens de autenticação localmente no dispositivo via `AsyncStorage` para manter sua sessão segura.
- Os dados remotos são enviados via protocolo criptografado HTTPS para nossos servidores dedicados no **Render**.
- As senhas dos usuários passam por processos de hashing antes do armazenamento no banco de dados, impedindo o acesso à sua senha real por terceiros.

---

## 4. Compartilhamento de Dados

O **petCard** não vende, aluga ou compartilha quaisquer informações pessoais ou dados de animais com empresas parceiras, agências de publicidade ou terceiros.

---

## 5. Exclusão de Conta e Direitos do Usuário

Você possui total controle sobre seus dados. A qualquer momento, você pode solicitar a exclusão definitiva de sua conta e de todos os pets vinculados a ela enviando um suporte interno ou através das configurações do seu perfil.
```
