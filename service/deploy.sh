# sudo curl -s https://raw.githubusercontent.com/developersworkspace/uptime-monitor/master/deploy.sh | bash -s

# Remove Directory
rm -rf /opt/uptime-monitor

# Clone Repository
git clone https://github.com/developersworkspace/uptime-monitor.git /opt/repositories/uptime-monitor

# Copy NGINX Configuration
cp  /opt/repositories/uptime-monitor/nginx.conf /etc/nginx/sites-enabled/uptime-monitor.conf

# Restart NGINX
systemctl restart nginx

# Install NPM Packages
npm install -g gulp
npm install -g typescript
npm install --prefix /opt/repositories/uptime-monitor/service

# Build
npm run --prefix /opt/repositories/uptime-monitor/service build

# Copy
cp -r /opt/repositories/uptime-monitor/service/dist /opt/uptime-monitor

# Remove Directory
rm -rf /opt/repositories/uptime-monitor

# Install NPM Packages
npm install --prefix /opt/uptime-monitor

# Run
pm2 start --name uptime-monitor /opt/uptime-monitor/app.js