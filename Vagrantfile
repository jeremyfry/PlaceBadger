Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/trusty32"
  config.vm.provision :shell, path: "vagrantConfig.sh"
  config.vm.network "forwarded_port", guest: 3000, host: 3000
  config.vm.network "forwarded_port", guest: 1337, host: 1337
end