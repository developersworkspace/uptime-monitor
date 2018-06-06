# sudo curl -s https://raw.githubusercontent.com/developersworkspace/uptime-monitor/master/ui/deploy.sh | bash -s

# Remove Directory
rm -rf /opt/uptime-monitor

# Clone Repository
git clone https://github.com/developersworkspace/uptime-monitor.git /opt/repositories/uptime-monitor

# Copy NGINX Configuration
cp /opt/repositories/uptime-monitor/ui/nginx.conf /etc/nginx/sites-enabled/uptime-monitor.conf

# Restart NGINX
systemctl restart nginx

# Install NPM Packages
npm install -g gulp
npm install -g typescript
npm install --prefix /opt/repositories/uptime-monitor/ui

# Build
npm run --prefix /opt/repositories/uptime-monitor/ui build

# Copy
cp -r /opt/repositories/uptime-monitor/ui/dist/uptime-monitor-ui /opt/uptime-monitor-ui

# Remove Directory
rm -rf /opt/repositories/uptime-monitor
