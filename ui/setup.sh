# sudo curl -s https://raw.githubusercontent.com/developersworkspace/uptime-monitor/master/ui/setup.sh | bash -s

# Install NGINX
apt update
apt install -y nginx

# Configure NGINX
ufw allow 'Nginx Full'
systemctl enable nginx
systemctl start nginx

# Install Let's Encrypt
apt-get update
apt-get install -y letsencrypt

# Obtain SSL Certificates
# systemctl stop nginx
# letsencrypt certonly --standalone --agree-tos --email developersworkspace@gmail.com -d uptime-monitor.openservices.co.za
# letsencrypt certonly --standalone --agree-tos --email developersworkspace@gmail.com -d api.uptime-monitor.openservices.co.za
# systemctl start nginx

# Preconfigure MongoDB for Installation
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list

# Install MongoDB
apt-get update
apt-get install -y mongodb-org

# Configure MongoDB
systemctl enable mongod
systemctl start mongod

# Install node.js
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2
npm install -g pm2
pm2 startup