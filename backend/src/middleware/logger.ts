import { Request, Response, NextFunction } from 'express';

interface LogEntry {
  timestamp: string;
  method: string;
  path: string;
  statusCode?: number;
  duration?: number;
  error?: string;
  ip?: string;
  userAgent?: string;
}

// 메모리에 최근 1000개의 로그 저장
const logs: LogEntry[] = [];
const MAX_LOGS = 1000;

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const logEntry: LogEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
  };

  // Response가 끝날 때 로그 완성
  res.on('finish', () => {
    logEntry.statusCode = res.statusCode;
    logEntry.duration = Date.now() - startTime;
    
    // 로그 저장
    logs.push(logEntry);
    if (logs.length > MAX_LOGS) {
      logs.shift(); // 오래된 로그 제거
    }
    
    // 콘솔에도 출력
    const status = res.statusCode >= 400 ? '❌' : '✅';
    console.log(
      `${status} [${logEntry.timestamp}] ${logEntry.method} ${logEntry.path} - ${logEntry.statusCode} (${logEntry.duration}ms)`
    );
  });

  next();
};

export const errorLogger = (err: any, req: Request, res: Response, next: NextFunction) => {
  const logEntry: LogEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    statusCode: err.statusCode || 500,
    error: err.message || 'Unknown error',
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
  };

  logs.push(logEntry);
  if (logs.length > MAX_LOGS) {
    logs.shift();
  }

  console.error(`🔥 [${logEntry.timestamp}] ERROR ${logEntry.method} ${logEntry.path}:`, err.message);
  
  next(err);
};

export const getLogs = (limit?: number, filter?: string) => {
  let filteredLogs = [...logs].reverse(); // 최신 로그가 먼저
  
  if (filter) {
    filteredLogs = filteredLogs.filter(log => {
      const searchStr = `${log.method} ${log.path} ${log.statusCode} ${log.error || ''}`.toLowerCase();
      return searchStr.includes(filter.toLowerCase());
    });
  }
  
  if (limit) {
    filteredLogs = filteredLogs.slice(0, limit);
  }
  
  return filteredLogs;
};

export const clearLogs = () => {
  logs.length = 0;
};

