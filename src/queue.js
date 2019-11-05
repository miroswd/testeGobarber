/*
A aplicação não será executada no mesmo node
A fila não vai interferir na performace da aplicação
*/
import 'dotenv/config';

import Queue from './lib/Queue';

Queue.processQueue();
