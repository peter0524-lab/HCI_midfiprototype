import { Request, Response } from 'express';
import { getLogs, clearLogs } from '../middleware/logger';

export const getLogsController = (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
  const filter = req.query.filter as string | undefined;
  
  const logs = getLogs(limit, filter);
  
  res.json({
    success: true,
    count: logs.length,
    logs: logs
  });
};

export const clearLogsController = (req: Request, res: Response) => {
  clearLogs();
  res.json({
    success: true,
    message: 'Logs cleared successfully'
  });
};

export const getLogsHTML = (req: Request, res: Response) => {
  const logs = getLogs(100);
  
  const html = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HCI Prototype - API Logs</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
    }
    .header {
      background: white;
      border-radius: 16px;
      padding: 30px;
      margin-bottom: 20px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    h1 {
      color: #667eea;
      font-size: 32px;
      margin-bottom: 10px;
    }
    .stats {
      display: flex;
      gap: 20px;
      margin-top: 20px;
    }
    .stat-card {
      flex: 1;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 12px;
      text-align: center;
    }
    .stat-number {
      font-size: 36px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .stat-label {
      font-size: 14px;
      opacity: 0.9;
    }
    .controls {
      background: white;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
      display: flex;
      gap: 10px;
      align-items: center;
    }
    input[type="text"] {
      flex: 1;
      padding: 12px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
    }
    input[type="text"]:focus {
      outline: none;
      border-color: #667eea;
    }
    button {
      padding: 12px 24px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s;
    }
    button:hover {
      background: #5568d3;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
    button.clear {
      background: #ef4444;
    }
    button.clear:hover {
      background: #dc2626;
    }
    .logs-container {
      background: white;
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    .log-entry {
      padding: 16px;
      border-left: 4px solid #667eea;
      margin-bottom: 12px;
      background: #f9fafb;
      border-radius: 8px;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 13px;
      transition: all 0.2s;
    }
    .log-entry:hover {
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    .log-entry.error {
      border-left-color: #ef4444;
      background: #fef2f2;
    }
    .log-entry.success {
      border-left-color: #10b981;
    }
    .log-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .log-method {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 11px;
      margin-right: 8px;
    }
    .method-GET { background: #dbeafe; color: #1e40af; }
    .method-POST { background: #dcfce7; color: #166534; }
    .method-PUT { background: #fef3c7; color: #92400e; }
    .method-DELETE { background: #fee2e2; color: #991b1b; }
    .log-path {
      color: #374151;
      font-weight: 600;
    }
    .log-status {
      font-weight: bold;
    }
    .status-success { color: #10b981; }
    .status-error { color: #ef4444; }
    .log-details {
      color: #6b7280;
      font-size: 12px;
      margin-top: 4px;
    }
    .error-message {
      color: #dc2626;
      background: #fee2e2;
      padding: 8px 12px;
      border-radius: 6px;
      margin-top: 8px;
      font-size: 12px;
    }
    .no-logs {
      text-align: center;
      padding: 60px 20px;
      color: #9ca3af;
    }
    .refresh-info {
      text-align: center;
      color: #6b7280;
      font-size: 14px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 HCI Prototype API Logs</h1>
      <p style="color: #6b7280; margin-top: 10px;">실시간 API 요청 및 에러 로그 모니터링</p>
      <div class="stats">
        <div class="stat-card">
          <div class="stat-number" id="totalLogs">${logs.length}</div>
          <div class="stat-label">총 요청 수</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" id="successLogs">${logs.filter(l => l.statusCode && l.statusCode < 400).length}</div>
          <div class="stat-label">성공 요청</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" id="errorLogs">${logs.filter(l => l.statusCode && l.statusCode >= 400).length}</div>
          <div class="stat-label">에러 요청</div>
        </div>
      </div>
    </div>

    <div class="controls">
      <input type="text" id="searchInput" placeholder="🔍 검색: 경로, 메서드, 상태 코드..." />
      <button onclick="refreshLogs()">🔄 새로고침</button>
      <button class="clear" onclick="clearLogs()">🗑️ 로그 초기화</button>
    </div>

    <div class="logs-container">
      <div id="logsContent">
        ${logs.length === 0 ? '<div class="no-logs">📭 아직 로그가 없습니다.</div>' : logs.map(log => {
          const isError = log.statusCode && log.statusCode >= 400;
          const statusClass = isError ? 'status-error' : 'status-success';
          const entryClass = isError ? 'error' : 'success';
          const icon = isError ? '❌' : '✅';
          
          return `
            <div class="log-entry ${entryClass}">
              <div class="log-header">
                <div>
                  ${icon}
                  <span class="log-method method-${log.method}">${log.method}</span>
                  <span class="log-path">${log.path}</span>
                </div>
                <span class="log-status ${statusClass}">${log.statusCode || 'N/A'}</span>
              </div>
              <div class="log-details">
                ⏱️ ${log.duration ? log.duration + 'ms' : 'N/A'} | 
                🕐 ${new Date(log.timestamp).toLocaleString('ko-KR')} | 
                🌐 ${log.ip || 'N/A'} | 
                💻 ${log.userAgent?.substring(0, 50) || 'N/A'}...
              </div>
              ${log.error ? `<div class="error-message">🔥 Error: ${log.error}</div>` : ''}
            </div>
          `;
        }).join('')}
      </div>
      <div class="refresh-info">
        페이지를 새로고침하거나 🔄 새로고침 버튼을 클릭하여 최신 로그를 확인하세요.
      </div>
    </div>
  </div>

  <script>
    function refreshLogs() {
      window.location.reload();
    }

    async function clearLogs() {
      if (confirm('모든 로그를 삭제하시겠습니까?')) {
        try {
          const response = await fetch('/logs/clear', { method: 'POST' });
          const data = await response.json();
          if (data.success) {
            alert('✅ 로그가 초기화되었습니다.');
            refreshLogs();
          }
        } catch (error) {
          alert('❌ 로그 초기화 실패: ' + error.message);
        }
      }
    }

    // 실시간 검색
    document.getElementById('searchInput').addEventListener('input', function(e) {
      const searchTerm = e.target.value.toLowerCase();
      const logEntries = document.querySelectorAll('.log-entry');
      
      logEntries.forEach(entry => {
        const text = entry.textContent.toLowerCase();
        entry.style.display = text.includes(searchTerm) ? 'block' : 'none';
      });
    });

    // 5초마다 자동 새로고침 (선택사항)
    // setInterval(refreshLogs, 5000);
  </script>
</body>
</html>
  `;
  
  res.send(html);
};

