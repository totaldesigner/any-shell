# any-shell

XMPP를 통해 각기 다른 로컬네트워크 상에 존재하는 장치의 Shell 접근 및 제어를 위한 솔루션 

## Inatall 
``` shell
git clone https://github.com/totaldesigner/any-shell
```

## Usage
### Create and Run eJabberd (XMPP Server)
``` shell
cd deploy/ansible
ansible-playbook -i host server.yml
```
### RUn Shell
``` shell
cd deploy/ansible
ansible-playbook -i host shell.yml
any-shell --jid "user@localhost/shell" --password "1234"
```
