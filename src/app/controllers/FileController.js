import File from '../models/File';

class FileController {
  async store(req, res) {
    // Um upload por vez - por se tratar da foto avatar
    // return res.json(req.file); // Gera todas as informações do arquivo
    const { originalname: name, filename: path } = req.file; // Buscando apenas as informações neacessárias
    // Salvando no banco de dados como name e path

    const file = await File.create({
      name,
      path,
    });
    return res.json(file);
  }
}

export default new FileController();
