:root{ --primary:#6C63FF; --secondary:#00DDFF; --accent:#FF4ED8; --dark:#0B0F19; --surface:#1A1F2E; }
*{margin:0;padding:0;box-sizing:border-box;font-family:'Sora',sans-serif}
body{background:var(--dark);color:#fff}
.btn-primary{background:linear-gradient(135deg,var(--primary),var(--secondary));border:none;border-radius:99px;padding:14px 24px;color:white;font-weight:700;width:100%;cursor:pointer}
.card{background:var(--surface);border:1px solid #ffffff0d;border-radius:16px;padding:16px}
.page{max-width:430px;margin:0 auto;min-height:100vh;background:var(--dark);padding-bottom:80px}
.bottom-nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;background:#0B0F19F0;backdrop-filter:blur(20px);display:flex;justify-content:space-around;padding:10px 0 24px;z-index:99}
