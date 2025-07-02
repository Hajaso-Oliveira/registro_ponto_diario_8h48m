# 🚀 Guia de Deploy - Registro de Ponto Diário

## 📋 Opções de Deploy

### 1. 🔥 Replit (Mais Fácil)

**Vantagens**: Gratuito, fácil setup, URL pública instantânea
**Desvantagens**: Pode hibernar após inatividade

**Passos**:
1. Acesse [replit.com](https://replit.com) e crie uma conta
2. Clique em "Create Repl" → "Import from GitHub" ou "Upload folder"
3. Faça upload de todos os arquivos do projeto
4. Crie um arquivo `main.py` na raiz com:
```python
import os
os.chdir('backend')
exec(open('app.py').read())
```
5. Clique em "Run" - o Replit detectará automaticamente as dependências
6. Use a URL fornecida para acessar o aplicativo

### 2. ⚡ Vercel (Recomendado para Produção)

**Vantagens**: Rápido, CDN global, SSL automático
**Desvantagens**: Requer configuração adicional

**Passos**:
1. Instale a CLI: `npm install -g vercel`
2. Na pasta do projeto, execute: `vercel`
3. Siga as instruções no terminal
4. Para atualizações: `vercel --prod`

**Configuração adicional**:
- O arquivo `vercel.json` já está configurado
- Modifique as URLs da API no `script.js` para usar `/api/` em vez de `http://localhost:5000`

### 3. 🟣 Heroku

**Vantagens**: Robusto, escalável, banco de dados integrado
**Desvantagens**: Plano gratuito limitado

**Passos**:
1. Crie conta no [heroku.com](https://heroku.com)
2. Instale a CLI do Heroku
3. Na pasta do projeto:
```bash
git init
heroku create nome-do-seu-app
git add .
git commit -m "Deploy inicial"
git push heroku main
```

### 4. 🌐 Hugging Face Spaces

**Vantagens**: Gratuito, foco em ML/AI, comunidade ativa
**Desvantagens**: Mais voltado para demos

**Passos**:
1. Crie conta em [huggingface.co](https://huggingface.co)
2. Crie um novo Space com Gradio/Streamlit
3. Faça upload dos arquivos
4. Configure o `app.py` como ponto de entrada

### 5. 🔵 Railway

**Vantagens**: Deploy simples, banco de dados integrado
**Desvantagens**: Plano gratuito com limitações

**Passos**:
1. Conecte seu GitHub ao [railway.app](https://railway.app)
2. Importe o repositório
3. Railway detectará automaticamente o Flask
4. Configure as variáveis de ambiente se necessário

## 🔧 Configurações por Plataforma

### URLs da API
Dependendo da plataforma, você precisará ajustar a URL base da API no arquivo `frontend/script.js`:

```javascript
// Para desenvolvimento local
const API_BASE_URL = 'http://localhost:5000';

// Para Vercel
const API_BASE_URL = '/api';

// Para Heroku/Railway/Replit
const API_BASE_URL = 'https://seu-app.herokuapp.com';
```

### Variáveis de Ambiente
Algumas plataformas podem exigir configuração de variáveis:
- `FLASK_ENV=production`
- `PORT=5000` (ou a porta fornecida pela plataforma)

### Arquivos Estáticos
Para servir os arquivos do frontend junto com o backend, você pode:

1. **Copiar arquivos do frontend para pasta static do Flask**:
```bash
mkdir backend/static
cp frontend/* backend/static/
```

2. **Modificar o app.py para servir arquivos estáticos**:
```python
from flask import send_from_directory

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)
```

## 📱 Testando o Deploy

Após o deploy, teste:
1. ✅ Página principal carrega
2. ✅ Formulário de registro funciona
3. ✅ Cálculos são exibidos corretamente
4. ✅ Download da planilha funciona
5. ✅ Interface responsiva no mobile

## 🔄 Atualizações

Para atualizar o aplicativo após mudanças:
- **Replit**: Edite os arquivos diretamente na interface
- **Vercel**: Execute `vercel --prod` novamente
- **Heroku**: Faça `git push heroku main`
- **Railway**: Push para o repositório GitHub conectado

## 🆘 Solução de Problemas

### Erro 500 - Internal Server Error
- Verifique os logs da plataforma
- Confirme que todas as dependências estão no `requirements.txt`
- Verifique se o arquivo Excel pode ser criado (permissões)

### CORS Error
- Verifique se flask-cors está instalado
- Confirme que CORS está habilitado no backend

### Arquivos não carregam
- Verifique se os caminhos dos arquivos estão corretos
- Para produção, use caminhos relativos

### Planilha não baixa
- Verifique se a pasta tem permissão de escrita
- Considere usar armazenamento temporário da plataforma

## 💡 Dicas de Otimização

1. **Performance**: Use CDN para bibliotecas CSS/JS externas
2. **SEO**: Adicione meta tags apropriadas
3. **PWA**: Considere adicionar Service Worker para uso offline
4. **Banco de Dados**: Para uso intensivo, migre para PostgreSQL/MySQL
5. **Autenticação**: Adicione login para múltiplos usuários

## 📞 Suporte

Para problemas específicos de deploy:
- Replit: Documentação oficial e comunidade Discord
- Vercel: Documentação e GitHub Issues
- Heroku: Centro de ajuda e Stack Overflow
- Railway: Discord da comunidade

