$home_dir = "/home/vagrant"
$venv_dir = "/home/vagrant/venv"
Exec {
    path => ["/bin", "/usr/bin", "/usr/local/bin"],
    logoutput => "on_failure",
    environment => ["HOME=/home/vagrant/"]
}

class system_packages {
    $apt_packages = [
        "build-essential",
        "python3-setuptools",
        "python-virtualenv",
        "git",
        "curl",
    ]
    exec { "update_apt":
        command => "apt-get update",
        user => "root",
    }
    package { $apt_packages:
        ensure  => present,
        require => Exec["update_apt"],
    }
}
class {'system_packages':}
