# 시험 서버가 꺼져 있으면 켬
curl -s -o /dev/null localhost:8765/nori/ 2>/dev/null || { cd /home/claude/w/loveflow && setsid nohup python3 -m http.server 8765 >/dev/null 2>&1 < /dev/null & sleep 1.5; }
