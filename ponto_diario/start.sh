#!/bin/bash

# Script de inicialização do Registro de Ponto Diário

echo "🚀 Iniciando Registro de Ponto Diário..."

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado. Por favor, instale Python 3.7+"
    exit 1
fi

# Verificar se pip está instalado
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 não encontrado. Por favor, instale pip"
    exit 1
fi

echo "✅ Python e pip encontrados"

# Navegar para o diretório do backend
cd backend

# Instalar dependências
echo "📦 Instalando dependências..."
pip3 install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ Dependências instaladas com sucesso"
else
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

# Iniciar o servidor Flask
echo "🌐 Iniciando servidor Flask..."
echo "📱 Acesse a interface em: file://$(pwd)/../frontend/index.html"
echo "🔗 API disponível em: http://localhost:5000"
echo "⏹️  Pressione Ctrl+C para parar o servidor"
echo ""

python3 app.py

