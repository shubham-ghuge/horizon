import { Response } from 'express';

type Client = {
  id: string;
  res: Response;
};

const clients: Client[] = [];

export const addClient = (id: string, res: Response) => {
  clients.push({ id, res });
};

export const removeClient = (id: string) => {
  const index = clients.findIndex((c) => c.id === id);
  if (index !== -1) {
    clients.splice(index, 1);
  }
};

export const broadcastEvent = (event: string, data: unknown) => {
  const payload = `event: ${event}\n` + `data: ${JSON.stringify(data)}\n\n`;
  for (const client of clients) {
    try {
      client.res.write(payload);
    } catch {
      // Ignore broken pipe
    }
  }
};

export const initSseHeaders = (res: Response) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });
  res.flushHeaders?.();
  res.write('\n');
};


