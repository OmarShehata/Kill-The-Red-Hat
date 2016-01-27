# Kill-The-Red-Hat
A game/experiment written in nodejs and using socket.io and Three.js

Current status: *Very basic working prototype*

How to run
==========
Make sure you have Nodejs installed. Run:

```sh
$ npm install
```

To install all the dependencies. Then run:

```sh
$ node killhat.js
```
Player 1 should visit the url from a desktop browser, and player two should visit it on their phone using Google Cardboard

How to play
===========

The player on the **desktop has an aerial view**. They are trying to kill the man in the red shirt. However, they are all wearing hats, so they look identical from the top!

Top view:

![Alt text](/topview.png?raw=true "Top View")

Luckily, you have a friend **on the ground (on the phone/google cardboard)** to help you out. He/she can see which one is actually red (with the rest being yellow). Work together to find out which one is the true red one! 

Ground View:

![Alt text](/groundview.png?raw=true "Ground View")

When you're confident you know which one it is, click it!