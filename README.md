1. Build le front -> npm run build
2. scp -r dist/* pi@192.168.1.26:/home/pi/jarvis-magicmirror/static

3. Build du server -> npm run build
4. scp -r dist/* pi@192.168.1.26:/home/pi/jarvis-magicmirror

6. node server.js


https://blog.r0b.io/post/minimal-rpi-kiosk/
-> configuration chromium raspberry: sudo nano .xinitrc
& sudo nano .bash_profile pour le lancement

+ 

.bash_profile

if [ -z $DISPLAY ] && [ $(tty) = /dev/tty1 ]
then
  cd jarvis-magicmirror
  pm2 start server.js
  startx -- -nocursor
fi

-> prérequis: installer: sudo npm install pm2@latest -g  -> permet de lancer node en mode daemon