# 📋 Registro de Ponto Diário

Um aplicativo web completo para controle de registro de ponto diário, desenvolvido com Flask (backend) e HTML/CSS/JavaScript (frontend).

## ✨ Funcionalidades

- **Registro de Horários**: Entrada, saída para almoço, retorno do almoço e saída
- **Cálculo Automático**: Horas trabalhadas, horas extras e tempo de almoço
- **Validações**: Tempo mínimo de almoço de 1h12m obrigatório
- **Exportação Excel**: Download da planilha .xlsx para salvar no OneDrive
- **Interface Responsiva**: Funciona perfeitamente em desktop e mobile
- **Design Moderno**: Interface limpa e intuitiva com gradientes e animações

## 🚀 Como Usar Localmente

### Pré-requisitos
- Python 3.7+
- pip (gerenciador de pacotes Python)

### Instalação

1. **Clone ou baixe o projeto**
```bash
git clone <url-do-projeto>
cd ponto_diario
```

2. **Instale as dependências do backend**
```bash
cd backend
pip install -r requirements.txt
```

3. **Execute o servidor Flask**
```bash
python app.py
```

4. **Abra o frontend**
   - Abra o arquivo `frontend/index.html` em seu navegador
   - Ou use um servidor HTTP local:
```bash
cd frontend
python -m http.server 8000
```
   - Acesse: http://localhost:8000

## 📱 Como Usar o Aplicativo

### Registrar Ponto
1. Selecione a data (padrão: hoje)
2. Preencha os horários:
   - **Entrada**: Padrão 07:00
   - **Saída Almoço**: Quando sair para almoçar
   - **Retorno Almoço**: Use o botão "Calcular Retorno" para automatizar (1h12m)
   - **Saída**: Padrão 17:30
3. Clique em "Registrar Ponto"

### Visualizar Resumo
- **Horas Trabalhadas**: Total de horas do dia
- **Horas Extras**: Tempo além de 8h18m
- **Tempo de Almoço**: Duração do intervalo

### Exportar Planilha
- Clique em "Baixar Planilha Excel"
- Salve o arquivo no seu computador
- Faça upload para o OneDrive manualmente

## 📊 Estrutura da Planilha

A planilha Excel contém as seguintes colunas:
- **Data**: Data do registro
- **Entrada**: Horário de entrada
- **Saída Almoço**: Horário de saída para almoço
- **Retorno Almoço**: Horário de retorno do almoço
- **Saída**: Horário de saída
- **Horas Trabalhadas**: Total de horas trabalhadas
- **Horas Extras**: Horas além da jornada normal (8h18m)

## 🌐 Deploy na Nuvem

### Replit
1. Crie uma conta no [Replit](https://replit.com)
2. Importe o projeto ou faça upload dos arquivos
3. Configure o arquivo `main.py` apontando para `backend/app.py`
4. Execute o projeto
5. Use a URL fornecida pelo Replit

### Vercel (Frontend + API)
1. Instale a CLI do Vercel: `npm i -g vercel`
2. Configure o `vercel.json`:
```json
{
  "functions": {
    "backend/app.py": {
      "runtime": "python3.9"
    }
  },
  "routes": [
    { "src": "/api/(.*)", "dest": "/backend/app.py" },
    { "src": "/(.*)", "dest": "/frontend/$1" }
  ]
}
```
3. Execute: `vercel --prod`

### Heroku
1. Crie um `Procfile`:
```
web: cd backend && python app.py
```
2. Configure as variáveis de ambiente
3. Faça deploy via Git ou CLI do Heroku

## 🛠️ Estrutura do Projeto

```
ponto_diario/
├── backend/
│   ├── app.py              # Servidor Flask principal
│   ├── requirements.txt    # Dependências Python
│   └── ponto_diario.xlsx   # Planilha gerada automaticamente
├── frontend/
│   ├── index.html          # Interface principal
│   ├── style.css           # Estilos e responsividade
│   └── script.js           # Lógica JavaScript
└── README.md               # Este arquivo
```

## 🔧 Configurações Técnicas

### Backend (Flask)
- **Porta**: 5000 (padrão)
- **CORS**: Habilitado para todas as origens
- **Banco de Dados**: Planilha Excel (.xlsx)
- **Bibliotecas**: Flask, pandas, openpyxl, flask-cors

### Frontend
- **HTML5**: Semântico e acessível
- **CSS3**: Flexbox, Grid, gradientes, animações
- **JavaScript**: ES6+, Fetch API, manipulação DOM
- **Responsivo**: Mobile-first design

## 📋 APIs Disponíveis

### POST /register_point
Registra um novo ponto
```json
{
  "date": "2025-01-07",
  "entrada": "07:00",
  "saida_almoco": "12:00",
  "retorno_almoco": "13:12",
  "saida": "17:30"
}
```

### GET /get_daily_summary?date=YYYY-MM-DD
Retorna resumo do dia especificado

### GET /download_excel
Baixa a planilha Excel completa

## 🎨 Personalização

### Cores e Tema
Edite as variáveis CSS em `frontend/style.css`:
- Gradientes principais
- Cores dos cards
- Animações e transições

### Horários Padrão
Modifique em `frontend/script.js`:
- Horário de entrada padrão
- Horário de saída padrão
- Duração do almoço

### Validações
Ajuste as regras de negócio em `backend/app.py`:
- Jornada de trabalho normal
- Tempo mínimo de almoço
- Cálculo de horas extras

## 🐛 Solução de Problemas

### Erro de CORS
- Verifique se o flask-cors está instalado
- Confirme que CORS está habilitado no backend

### Planilha não baixa
- Verifique se o backend está rodando
- Confirme as permissões de escrita na pasta

### Interface não carrega dados
- Verifique a URL da API no JavaScript
- Confirme que o backend está acessível

## 📝 Licença

Este projeto é de uso livre para fins pessoais e comerciais.

## 👨‍💻 Desenvolvido por

Sistema de Registro de Ponto Diário - 2025
Desenvolvido com ❤️ usando Flask + HTML/CSS/JavaScript

