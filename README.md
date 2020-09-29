# Teacrypt

# ! important !

## Backend & Git

Currently the backend has to be started from the build folder because its using process.cwd()

if you are changing stuff in the submodule you can use 'git submodule update --init --recursive'
https://www.vogella.com/tutorials/GitSubmodules/article.html#:~:text=2.3.-,Pulling%20with%20submodules,in%20the%20git%20pull%20command%20.

Clone the repo in packages/backend/ and rename it "config" to use the teacrypt-config

## Weird behaviour

Somehow the cross-communication is not happening if you focus the dev-console instead of the teams page. Make sure to click on the teams page if you are debugging.

## How to use in dev:

Yarn install

Yarn start or Yarn build

Go to chrome extensions -> load unzipped files -> choose the 'dist' folder.

Go to teams. Write a message. Hit enter (currently only enter is supported).

## Concept:

There should be an overlay where you can enter a key and a name for a chat (person or group).

Based on this key and the chat name teacrypt will know which messages to de- and encrypt.

Also encrypted messaged should have a prefix to prevent plain messages to be wrongfully decrpyted.

## Ideas for the future:

Right click on textbox to activate teacrypt anywhere

## Supported node versions

12.x and 14.x
