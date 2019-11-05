// Configura tudo relacionado à fila
// handle : lidar com
import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';

import redisConfig from '../config/redis';

const jobs = [CancellationMail];

/*
  Pra cada um dos jobs cria uma fila e dentro da fila
  armazena o bee(instância que conecta com o redis, que
  consegue armazenar e recuperar os valores do banco de dados),
  e o handle, processa as filas, recebe as variáveis do contexto,
  do email, appointment e passa por dentro do job e armazena o job
  dentro da fila.
  E o processQueue, pega os jobs e processa em tempo real
*/

class Queue {
  constructor() {
    this.queues = {
      // Posso ter várias filas, cada tipo de background job, ele terá sua própria fila
    };
    this.init();
  }

  init() {
    // Percorre os valores de jobs, como não vai retornar nenhum valor, não precisa usar o map
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }), // Fila que possui a conexão com o redis (Banco não relacional)
        handle, // Método que processa o job, dispara a tarefa em background
      }; // Pegando todos os jobs da aplicação e armazenando dentro de this.queue
    });
  }

  add(queue, job) {
    // Adiciona novas tarefas dentro de cada fila
    return this.queues[queue].bee.createJob(job).save();
    // createJob -> propriedade da Bee
    // Esse bee é a propriedade do init
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}:FAILED`, err);
  }
}

export default new Queue();
