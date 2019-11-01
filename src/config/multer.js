import multer from 'multer';
import crypto from 'crypto'; // Biblioteca do node
import { extname, resolve } from 'path';
/*
Extname -> retorna a extensão do arquivo
Resolve -> percorre um caminho
*/

export default {
  // Exportando um objeto de configuração
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'temp', 'uploads'), // Destino dos arquivos
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        // cb -> Callback
        if (err) return cb(err);

        return cb(null, res.toString('hex') + extname(file.originalname)); // Para impedir que o usuário coloque caracteres estranhos
        // Se não deu erro, ele passa null ao invés de err
        // Transformando 16 bytes de conteúdo aleatório em um hexadecimal
      }); // Biblioteca do node, para gerar caracteres aleatórios
    }, // Como vai ser formatado o nome do arquivo
  }),
  // Como o multer vai guardar o arquivo de imagem
};
