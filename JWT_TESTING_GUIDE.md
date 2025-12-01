# 🔐 Guia de Testes JWT - SOS-Rota

## O que é JWT?

JWT (JSON Web Token) é um método seguro de transmitir informações entre cliente e servidor. Funciona como um "cartão de identidade digital" que o servidor emite após o usuário fazer login.

### Estrutura do JWT

```
header.payload.signature
```

- **Header**: Tipo de token (JWT) e algoritmo (HS256)
- **Payload**: Dados do usuário (username, data criação, data expiração)
- **Signature**: Assinatura criptográfica para verificar autenticidade

---

## 1️⃣ Registrando um Novo Usuário (Obter JWT)

```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "seu_usuario",
    "password": "sua_senha"
  }'
```

**Resposta esperada:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMTIzIiwiaWF0IjoxNzY0NTkxNDY1LCJleHAiOjE3NjQ2Nzc4NjV9.vhry8YPSwmGJ9Na4zjMYI0Hmi9zOeClrUEuz7VoK9pc",
  "username": "seu_usuario",
  "role": "USER"
}
```

---

## 2️⃣ Entendendo o Token

Decodifique o payload (parte 2, separada por `.`):

```bash
# Extrair a segunda parte (payload)
TOKEN="seu_token_aqui"
echo "$TOKEN" | cut -d'.' -f2 | base64 -d | jq .
```

**Resultado:**

```json
{
  "sub": "seu_usuario", // Subject = username
  "iat": 1764591465, // Issued At = época Unix (timestamp)
  "exp": 1764677865 // Expiration = época Unix (timestamp)
}
```

### Interpretando as datas:

```bash
# Converter timestamp para data legível
date -d @1764677865  # em Linux

# Ou usando Node.js
node -e "console.log(new Date(1764677865000))"
```

---

## 3️⃣ Usando o Token para Acessar a API

Todos os endpoints em `/api/**` agora requerem o token no header:

```bash
TOKEN="seu_token_aqui"

# ✅ Acessar bairros COM token (autorizado)
curl -X GET http://localhost:8081/api/bairros \
  -H "Authorization: Bearer $TOKEN"

# ❌ Acessar bairros SEM token (negado)
curl -X GET http://localhost:8081/api/bairros
```

---

## 4️⃣ Fazendo Login (Obter novo JWT)

Se você já tem um usuário, faça login:

```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "seu_usuario",
    "password": "sua_senha"
  }'
```

---

## 5️⃣ Testando Falhas

### ❌ Usuário não existe

```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"naoexiste","password":"123"}'
# Resultado: 500 Error (usuário não encontrado)
```

### ❌ Token inválido

```bash
curl -X GET http://localhost:8081/api/bairros \
  -H "Authorization: Bearer token_invalido"
# Resultado: Acesso negado (atualmente permitido no dev)
```

### ❌ Token expirado

Um JWT expira após 24 horas. Depois, você precisa fazer login novamente.

---

## 6️⃣ Endpoints de Autenticação

| Método | Endpoint             | Descrição                             |
| ------ | -------------------- | ------------------------------------- |
| POST   | `/api/auth/register` | Criar novo usuário e obter JWT        |
| POST   | `/api/auth/login`    | Fazer login e obter JWT               |
| GET    | `/api/health`        | Verificar status (sem autenticação)   |
| GET    | `/api/info`          | Informações da API (sem autenticação) |
| GET    | `/api/bairros`       | Listar bairros (requer JWT)           |

---

## 7️⃣ Teste Completo (Script Bash)

```bash
#!/bin/bash

# Registrar novo usuário
echo "1️⃣  Registrando usuário..."
RESPONSE=$(curl -s -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}')

TOKEN=$(echo "$RESPONSE" | jq -r '.token')
echo "Token: $TOKEN"

# Decodificar payload
echo ""
echo "2️⃣  Decodificando JWT..."
echo "$TOKEN" | cut -d'.' -f2 | base64 -d | jq .

# Acessar API protegida
echo ""
echo "3️⃣  Acessando /api/bairros com JWT..."
curl -s -X GET http://localhost:8081/api/bairros \
  -H "Authorization: Bearer $TOKEN" | jq '.[] | {id, nome}'
```

---

## ⚙️ Configuração Atual

- **Secret Key**: `sosrota-jwt-secret-key-development-mode-2025` (Base64)
- **Expiração**: 24 horas (86400000 ms)
- **Algoritmo**: HS256 (HMAC SHA256)
- **Armazenamento**: BCrypt com hash seguro

---

## 🚀 Próximos Passos

1. ✅ **JWT funcionando** - Usuários podem registrar e fazer login
2. ⏳ Implementar **proteção JWT real** - Validar token em cada requisição
3. ⏳ Implementar **refresh tokens** - Renovar tokens expirados
4. ⏳ Implementar **diferentes papéis** (ADMIN, REGULADOR, OPERADOR)
5. ⏳ Adicionar **endpoints protegidos** - Apenas admin pode criar ambulâncias, etc.

---

**Status**: ✅ JWT Functional | ⏳ Full Protection Pending
