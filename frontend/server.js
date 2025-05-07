const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const app = express();

// 프록시 설정
app.use('/auth', createProxyMiddleware({ 
  target: 'http://localhost:8080', 
  changeOrigin: true 
}));

app.use('/oauth2/authorization', createProxyMiddleware({ 
  target: 'http://localhost:8080', 
  changeOrigin: true 
}));

app.use('/login', createProxyMiddleware({ 
  target: 'http://localhost:8080', 
  changeOrigin: true 
}));

app.use('/api', createProxyMiddleware({ 
  target: 'http://localhost:8080', 
  changeOrigin: true 
}));

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'build')));

// 모든 요청을 React 앱으로 라우팅
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// 포트 설정
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
