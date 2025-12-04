import { pool } from './connection';

const nomes = [
  'MARIA', 'JOSE', 'ANA', 'JOAO', 'ANTONIO', 'FRANCISCO',
  'CARLOS', 'PAULO', 'PEDRO', 'LUCAS', 'LUIZ', 'MARCOS',
  'LUIS', 'GABRIEL', 'RAFAEL', 'DANIEL', 'MARCELO', 'BRUNO',
  'FERNANDO', 'FABIO', 'RODRIGO', 'PATRICIA', 'SANDRA', 'JULIANA',
];

const sobrenomes = [
  'SILVA', 'SANTOS', 'OLIVEIRA', 'SOUZA', 'RODRIGUES', 'FERREIRA',
  'ALVES', 'PEREIRA', 'LIMA', 'GOMES', 'COSTA', 'RIBEIRO',
  'MARTINS', 'CARVALHO', 'ROCHA', 'ALMEIDA', 'NASCIMENTO', 'ARAUJO',
];

const cidades = {
  'SP': ['SAO PAULO', 'CAMPINAS', 'SANTOS', 'RIBEIRAO PRETO'],
  'RJ': ['RIO DE JANEIRO', 'NITEROI', 'CAMPOS'],
  'MG': ['BELO HORIZONTE', 'UBERLANDIA', 'CONTAGEM'],
  'RS': ['PORTO ALEGRE', 'CAXIAS DO SUL', 'PELOTAS'],
  'BA': ['SALVADOR', 'FEIRA DE SANTANA'],
  'PR': ['CURITIBA', 'LONDRINA', 'MARINGA'],
};

function gerarCPF(): string {
  const n1 = Math.floor(Math.random() * 9);
  const n2 = Math.floor(Math.random() * 9);
  const n3 = Math.floor(Math.random() * 9);
  const n4 = Math.floor(Math.random() * 9);
  const n5 = Math.floor(Math.random() * 9);
  const n6 = Math.floor(Math.random() * 9);
  const n7 = Math.floor(Math.random() * 9);
  const n8 = Math.floor(Math.random() * 9);
  const n9 = Math.floor(Math.random() * 9);
  
  return `${n1}${n2}${n3}${n4}${n5}${n6}${n7}${n8}${n9}`;
}

function gerarTelefone(): string {
  const ddd = Math.floor(Math.random() * 90) + 10;
  const numero = Math.floor(Math.random() * 90000000) + 10000000;
  return `${ddd}${numero}`;
}

function gerarDataNascimento(): string {
  const ano = Math.floor(Math.random() * 50) + 1970;
  const mes = Math.floor(Math.random() * 12) + 1;
  const dia = Math.floor(Math.random() * 28) + 1;
  return `${ano}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
}

/**
 * Função para popular o banco de dados
 * Pode ser chamada automaticamente ou manualmente
 */
export async function popularBanco(): Promise<void> {
  const client = await pool.connect();
  
  try {
    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║   POPULANDO BANCO DE DADOS                ║');
    console.log('╚════════════════════════════════════════════╝\n');

    // Verificar se já tem registros
    const countCheck = await client.query('SELECT COUNT(*) as total FROM registros');
    const totalAtual = parseInt(countCheck.rows[0].total, 10);
    
    if (totalAtual > 0) {
      console.log(`ℹ️  Banco já possui ${totalAtual} registros. Pulando população.`);
      return;
    }

    const totalRegistros = 6000; // 6.000 registros (acima do mínimo de 5.000)
    const estados = Object.keys(cidades);
    const cpfsUsados = new Set<string>();

    console.log(`📝 Criando ${totalRegistros} registros...\n`);

    await client.query('BEGIN');

    let inserted = 0;

    for (let i = 1; i <= totalRegistros; i++) {
      const nome = nomes[Math.floor(Math.random() * nomes.length)];
      const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
      const nomeCompleto = `${nome} ${sobrenome}`;

      let cpf = gerarCPF();
      while (cpfsUsados.has(cpf)) {
        cpf = gerarCPF();
      }
      cpfsUsados.add(cpf);

      const estado = estados[Math.floor(Math.random() * estados.length)];
      const cidadeList = cidades[estado as keyof typeof cidades];
      const cidade = cidadeList[Math.floor(Math.random() * cidadeList.length)];

      const email = `${nome.toLowerCase()}.${sobrenome.toLowerCase()}${i}@email.com`;
      const telefone = Math.random() > 0.3 ? gerarTelefone() : null;
      const dataNascimento = gerarDataNascimento();
      const status = Math.random() > 0.25 ? 'ativo' : 'inativo';

      await client.query(
        `INSERT INTO registros (nome, email, cpf, telefone, cidade, estado, data_nascimento, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [nomeCompleto, email, cpf, telefone, cidade, estado, dataNascimento, status]
      );

      inserted++;

      if (inserted % 500 === 0) {
        console.log(`✅ ${inserted} registros criados...`);
      }
    }

    await client.query('COMMIT');

    console.log(`\n✅ ${totalRegistros} registros criados com sucesso!\n`);
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('❌ Erro ao popular banco:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

