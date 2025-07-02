// Configurações
const API_BASE_URL = 'https://ponto-production-012d.up.railway.app';


// Elementos DOM
const form = document.getElementById('ponto-form');
const dataInput = document.getElementById('data');
const entradaInput = document.getElementById('entrada');
const saidaAlmocoInput = document.getElementById('saida-almoco');
const retornoAlmocoInput = document.getElementById('retorno-almoco');
const saidaInput = document.getElementById('saida');
const btnCalcularAlmoco = document.getElementById('btn-calcular-almoco');
const btnExportar = document.getElementById('btn-exportar');
const loadingOverlay = document.getElementById('loading-overlay');

// Elementos de display
const horasTrabalhadasDisplay = document.getElementById('horas-trabalhadas');
const horasExtrasDisplay = document.getElementById('horas-extras');
const tempoAlmocoDisplay = document.getElementById('tempo-almoco');
const displayEntrada = document.getElementById('display-entrada');
const displaySaidaAlmoco = document.getElementById('display-saida-almoco');
const displayRetornoAlmoco = document.getElementById('display-retorno-almoco');
const displaySaida = document.getElementById('display-saida');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Definir data atual
    const hoje = new Date().toISOString().split('T')[0];
    dataInput.value = hoje;
    
    // Carregar dados do dia atual
    carregarDadosDiarios(hoje);
    
    // Event listeners
    form.addEventListener('submit', handleSubmitPonto);
    btnCalcularAlmoco.addEventListener('click', calcularRetornoAlmoco);
    btnExportar.addEventListener('click', exportarPlanilha);
    dataInput.addEventListener('change', function() {
        carregarDadosDiarios(this.value);
    });
    
    // Auto-calcular retorno do almoço quando saída do almoço for preenchida
    saidaAlmocoInput.addEventListener('change', function() {
        if (this.value && !retornoAlmocoInput.value) {
            calcularRetornoAlmoco();
        }
    });
});

// Funções de utilidade
function showLoading() {
    loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    const container = document.getElementById('toast-container');
    container.appendChild(toast);
    
    // Remover toast após 5 segundos
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

function formatTime(timeString) {
    if (!timeString || timeString === '0:00:00') return '--:--';
    return timeString;
}

// Calcular retorno do almoço (1h12m após saída)
function calcularRetornoAlmoco() {
    const saidaAlmoco = saidaAlmocoInput.value;
    if (!saidaAlmoco) {
        showToast('Preencha o horário de saída para o almoço primeiro.', 'error');
        return;
    }
    
    const [horas, minutos] = saidaAlmoco.split(':').map(Number);
    const saidaDate = new Date();
    saidaDate.setHours(horas, minutos, 0, 0);
    
    // Adicionar 1h12m
    saidaDate.setMinutes(saidaDate.getMinutes() + 72);
    
    const retornoHoras = saidaDate.getHours().toString().padStart(2, '0');
    const retornoMinutos = saidaDate.getMinutes().toString().padStart(2, '0');
    
    retornoAlmocoInput.value = `${retornoHoras}:${retornoMinutos}`;
    showToast('Horário de retorno calculado automaticamente!', 'success');
}

// Carregar dados diários
async function carregarDadosDiarios(data) {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/get_daily_summary?date=${data}`);
        
        if (!response.ok) {
            throw new Error('Erro ao carregar dados');
        }
        
        const dados = await response.json();
        
        // Preencher campos do formulário
        entradaInput.value = dados.entrada || '07:00';
        saidaAlmocoInput.value = dados.saida_almoco || '';
        retornoAlmocoInput.value = dados.retorno_almoco || '';
        saidaInput.value = dados.saida || '17:30';
        
        // Atualizar displays
        displayEntrada.textContent = formatTime(dados.entrada);
        displaySaidaAlmoco.textContent = formatTime(dados.saida_almoco);
        displayRetornoAlmoco.textContent = formatTime(dados.retorno_almoco);
        displaySaida.textContent = formatTime(dados.saida);
        
        // Atualizar resumo
        horasTrabalhadasDisplay.textContent = formatTime(dados.horas_trabalhadas);
        horasExtrasDisplay.textContent = formatTime(dados.horas_extras);
        tempoAlmocoDisplay.textContent = formatTime(dados.tempo_almoco);
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showToast('Erro ao carregar dados do dia selecionado.', 'error');
    } finally {
        hideLoading();
    }
}

// Submeter registro de ponto
async function handleSubmitPonto(event) {
    event.preventDefault();
    
    const formData = {
        date: dataInput.value,
        entrada: entradaInput.value,
        saida_almoco: saidaAlmocoInput.value,
        retorno_almoco: retornoAlmocoInput.value,
        saida: saidaInput.value
    };
    
    // Validações básicas
    if (!formData.date) {
        showToast('Por favor, selecione uma data.', 'error');
        return;
    }
    
    if (!formData.entrada) {
        showToast('Por favor, preencha o horário de entrada.', 'error');
        return;
    }
    
    // Validar se saída do almoço e retorno estão preenchidos juntos
    if ((formData.saida_almoco && !formData.retorno_almoco) || (!formData.saida_almoco && formData.retorno_almoco)) {
        showToast('Preencha tanto a saída quanto o retorno do almoço.', 'error');
        return;
    }
    
    // Validar se o retorno do almoço é pelo menos 1h12m após a saída
    if (formData.saida_almoco && formData.retorno_almoco) {
        const saidaTime = new Date(`2000-01-01T${formData.saida_almoco}:00`);
        const retornoTime = new Date(`2000-01-01T${formData.retorno_almoco}:00`);
        const diferenca = (retornoTime - saidaTime) / (1000 * 60); // diferença em minutos
        
        if (diferenca < 72) { // 1h12m = 72 minutos
            showToast('O retorno do almoço deve ser pelo menos 1h12m após a saída.', 'error');
            return;
        }
    }
    
    try {
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/register_point`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Erro ao registrar ponto');
        }
        
        const resultado = await response.json();
        
        // Atualizar displays com os novos dados
        displayEntrada.textContent = formatTime(formData.entrada);
        displaySaidaAlmoco.textContent = formatTime(formData.saida_almoco);
        displayRetornoAlmoco.textContent = formatTime(formData.retorno_almoco);
        displaySaida.textContent = formatTime(formData.saida);
        
        // Atualizar resumo
        horasTrabalhadasDisplay.textContent = formatTime(resultado.horas_trabalhadas);
        horasExtrasDisplay.textContent = formatTime(resultado.horas_extras);
        tempoAlmocoDisplay.textContent = formatTime(resultado.tempo_almoco);
        
        showToast('Ponto registrado com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao registrar ponto:', error);
        showToast('Erro ao registrar ponto. Tente novamente.', 'error');
    } finally {
        hideLoading();
    }
}

// Exportar planilha
async function exportarPlanilha() {
    try {
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/download_excel`);
        
        if (!response.ok) {
            throw new Error('Erro ao baixar planilha');
        }
        
        // Criar blob e download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ponto_diario.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showToast('Planilha baixada com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao exportar planilha:', error);
        showToast('Erro ao baixar planilha. Tente novamente.', 'error');
    } finally {
        hideLoading();
    }
}

// Função para formatar tempo em formato legível
function formatTimeDisplay(timeString) {
    if (!timeString || timeString === '0:00:00') return '0h 0m';
    
    const parts = timeString.split(':');
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    
    if (hours === 0) {
        return `${minutes}m`;
    } else if (minutes === 0) {
        return `${hours}h`;
    } else {
        return `${hours}h ${minutes}m`;
    }
}

// Atualizar relógio em tempo real (opcional)
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
    
    // Você pode adicionar um elemento para mostrar o horário atual se desejar
    // document.getElementById('current-time').textContent = timeString;
}

// Atualizar relógio a cada segundo (descomente se quiser usar)
// setInterval(updateClock, 1000);

// Função para detectar se é mobile
function isMobile() {
    return window.innerWidth <= 768;
}

// Ajustar interface para mobile
function adjustForMobile() {
    if (isMobile()) {
        // Ajustes específicos para mobile podem ser feitos aqui
        document.body.classList.add('mobile');
    } else {
        document.body.classList.remove('mobile');
    }
}

// Executar ajuste na carga e redimensionamento
window.addEventListener('load', adjustForMobile);
window.addEventListener('resize', adjustForMobile);

