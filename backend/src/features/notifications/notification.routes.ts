import { Router, Request, Response } from 'express';
import { addClient, removeClient, initSseHeaders } from './sse';

const router = Router();

// Simple SSE endpoint for realtime notifications
router.get('/events', (req: Request, res: Response) => {
  initSseHeaders(res);

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  addClient(id, res);

  // Heartbeat to keep connections alive on some proxies
  const heartbeat = setInterval(() => {
    try {
      res.write(`event: ping\ndata: {}\n\n`);
    } catch {
      // ignore
    }
  }, 25000);

  req.on('close', () => {
    clearInterval(heartbeat);
    removeClient(id);
    try {
      res.end();
    } catch {
      // ignore
    }
  });
});

export default router;


