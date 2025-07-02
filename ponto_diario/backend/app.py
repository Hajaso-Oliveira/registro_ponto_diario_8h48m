from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
from datetime import datetime, timedelta
import os

app = Flask(__name__)
CORS(app)  # Permitir CORS para todas as rotas

EXCEL_FILE = 'ponto_diario.xlsx'

def get_excel_path():
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), EXCEL_FILE)

def initialize_excel():
    file_path = get_excel_path()
    if not os.path.exists(file_path):
        df = pd.DataFrame(columns=['Data', 'Entrada', 'Saída Almoço', 'Retorno Almoço', 'Saída', 'Horas Trabalhadas', 'Horas Extras'])
        df.to_excel(file_path, index=False)

@app.route('/')
def index():
    return 'Backend do Registro de Ponto Diário está funcionando!'

@app.route('/register_point', methods=['POST'])
def register_point():
    data = request.json
    date_str = data.get('date')
    entrada_str = data.get('entrada')
    saida_almoco_str = data.get('saida_almoco')
    retorno_almoco_str = data.get('retorno_almoco')
    saida_str = data.get('saida')

    initialize_excel()
    file_path = get_excel_path()
    df = pd.read_excel(file_path)

    # Convertendo strings para objetos datetime para cálculos
    entrada = datetime.strptime(entrada_str, '%H:%M') if entrada_str else None
    saida_almoco = datetime.strptime(saida_almoco_str, '%H:%M') if saida_almoco_str else None
    retorno_almoco = datetime.strptime(retorno_almoco_str, '%H:%M') if retorno_almoco_str else None
    saida = datetime.strptime(saida_str, '%H:%M') if saida_str else None

    horas_trabalhadas = timedelta(0)
    horas_extras = timedelta(0)
    tempo_almoco = timedelta(0)

    if entrada and saida_almoco:
        horas_trabalhadas += (saida_almoco - entrada)
    if retorno_almoco and saida:
        horas_trabalhadas += (saida - retorno_almoco)
    if saida_almoco and retorno_almoco:
        tempo_almoco = (retorno_almoco - saida_almoco)

    # Cálculo de horas extras (considerando 8h18m de jornada normal)
    jornada_normal = timedelta(hours=8, minutes=48)    
    # Ajustar horas trabalhadas para considerar a jornada normal
    if horas_trabalhadas > jornada_normal:
        horas_extras = horas_trabalhadas - jornada_normal
    else:
        horas_extras = timedelta(0) # Não há horas extras se for menor ou igual à jornada normal

    # Formatar para string para salvar no Excel
    horas_trabalhadas_str = str(horas_trabalhadas)
    horas_extras_str = str(horas_extras)
    new_row = {
        'Data': date_str,
        'Entrada': entrada_str,
        'Saída Almoço': saida_almoco_str,
        'Retorno Almoço': retorno_almoco_str,
        'Saída': saida_str,
        'Horas Trabalhadas': horas_trabalhadas_str,
        'Horas Extras': horas_extras_str
    }

    # Verificar se já existe um registro para a data e atualizar ou adicionar
    if date_str in df['Data'].values:
        for col in new_row:
            df.loc[df['Data'] == date_str, col] = new_row[col]
    else:
        df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)

    df.to_excel(file_path, index=False)

    return jsonify({
        'message': 'Ponto registrado com sucesso!',
        'horas_trabalhadas': horas_trabalhadas_str,
        'horas_extras': horas_extras_str,
        'tempo_almoco': str(tempo_almoco)
    })

@app.route('/get_daily_summary', methods=['GET'])
def get_daily_summary():
    date_str = request.args.get('date')
    initialize_excel()
    file_path = get_excel_path()
    df = pd.read_excel(file_path)

    daily_data = df[df['Data'] == date_str]

    if not daily_data.empty:
        row = daily_data.iloc[0]
        return jsonify({
            'entrada': row['Entrada'],
            'saida_almoco': row['Saída Almoço'],
            'retorno_almoco': row['Retorno Almoço'],
            'saida': row['Saída'],
            'horas_trabalhadas': row['Horas Trabalhadas'],
            'horas_extras': row['Horas Extras'],
            'tempo_almoco': str(timedelta(hours=1, minutes=12)) # Tempo de almoço fixo
        })
    else:
        return jsonify({
            'entrada': '',
            'saida_almoco': '',
            'retorno_almoco': '',
            'saida': '',
            'horas_trabalhadas': '0:00:00',
            'horas_extras': '0:00:00',
            'tempo_almoco': '0:00:00'
        })

@app.route('/download_excel', methods=['GET'])
def download_excel():
    file_path = get_excel_path()
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True, download_name=EXCEL_FILE)
    else:
        return jsonify({'message': 'Arquivo Excel não encontrado.'}), 404

if __name__ == '__main__':
    initialize_excel()
    app.run(debug=True, host='0.0.0.0', port=5000)


