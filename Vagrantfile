# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  config.vm.box = "precise32"  
  config.vm.box_url = "http://files.vagrantup.com/precise32.box"

  #config.vm.provision :shell, :path => "Vagrantfile.sh"
  config.vm.provision :puppet do |puppet|
      puppet.manifest_file = "Vagrantfile.pp"
  end

  config.vm.network :forwarded_port, host: 8080, guest: 8080
  config.vm.network :forwarded_port, host: 6543, guest: 6543
  config.vm.network :forwarded_port, host: 9873, guest: 9873

  config.vm.network :private_network, ip: "10.0.0.2"
  #config.vm.synced_folder ".", "/vagrant", :nfs => true
  #sudo rm -rf /etc/exports

  config.vm.provider "virtualbox" do |v|
    v.name = "Vote Battle"
    v.customize ["modifyvm", :id, "--memory", "384"]
  end

end
