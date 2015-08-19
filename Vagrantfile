# New to Vagrant? Read: https://github.com/nelsonic/learn-vagrant
# This script creates a VM with Ubuntu, Node.js, Java & ElasticSearch
$script = <<SCRIPT

sudo -i

# update ubuntu (security etc.)
apt-get update

apt-get -y install g++ git git-core nodejs

# nodejs
apt-get -y install g++ git git-core nodejs npm
# use https://github.com/visionmedia/n to get latest node+npm
npm install n -g
n stable
node -v
npm install nodemon -g

# OpenJDK Java runtime http://packages.ubuntu.com/precise/openjdk-7-jre-headless
sudo apt-get install openjdk-7-jre-headless -y

### Check http://www.elasticsearch.org/download/ for latest version of ElasticSearch and replace wget link below

wget https://download.elasticsearch.org/elasticsearch/elasticsearch/elasticsearch-1.7.1.deb
sudo dpkg -i elasticsearch-1.7.1.deb

curl -L http://github.com/elasticsearch/elasticsearch-servicewrapper/tarball/master | tar -xz
sudo mkdir -p /usr/local/share/elasticsearch/bin/
sudo mv *servicewrapper*/service /usr/local/share/elasticsearch/bin/
rm -Rf *servicewrapper*

sudo /usr/local/share/elasticsearch/bin/service/elasticsearch install
sudo ln -s `readlink -f /usr/local/share/elasticsearch/bin/service/elasticsearch` /usr/local/bin/rcelasticsearch

sudo service elasticsearch start
# curl http://localhost:9200

# install Redis following http://redis.io/topics/quickstart
# wget http://download.redis.io/redis-stable.tar.gz
# tar xvzf redis-stable.tar.gz
# cd redis-stable
# # sudo make me a sandiwch --> https://xkcd.com/149/
# sudo make
# sudo make install
# redis-server

# install redis from apt
sudo apt-get install redis-server

# disable init.d from running redis
sudo update-rc.d redis-server disable

# Using Upstart to Automatically Start Redis
sudo -i
git clone https://gist.github.com/c0b11f688b365d941a8a
mv ./c0b11f688b365d941a8a/redis-server.conf /etc/init/redis-server.conf
rm -rf ./c0b11f688b365d941a8a

# Start Redis for the first time:
sudo start redis-server

# check that node.js can access redis db
git clone https://github.com/dwyl/learn-redis.git && cd learn-redis
npm install && npm test

SCRIPT


Vagrant.configure("2") do |config|

  # config.vm.box = "base"
  config.vm.box = "ubuntu-nodejs-server"
  config.vm.box_url = "https://cloud-images.ubuntu.com/vagrant/trusty/current/trusty-server-cloudimg-amd64-vagrant-disk1.box"

  config.vm.network :forwarded_port, guest: 3000, host: 3000
  config.vm.network :forwarded_port, guest: 9200, host: 9200
  config.vm.network :forwarded_port, guest: 9300, host: 9300
  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  config.vm.network :private_network, ip: "192.168.33.10"
  config.vm.provision :shell, :inline => $script

end
