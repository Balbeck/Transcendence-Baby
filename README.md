# Comment lancer le Projet : 

	1 - Demarer Docker

	2 - Ouvrir 3 terminaux 
		-Terminal 1 [ DB ] :
			-> 'docker compose up --build'
			-> ou 'docker-compose up --build'
		-Terminal 2 [ Backend ] : (Une fois que la DB est lancee)
			-> 'cd ./backend/'
			-> (#if Juste apres un gitclone les dependances ne sont pas installees,
				-> Faut donc faire un: 'npm install' ou 'npm i' et avoid node installe ! )
			'npm run start:dev'
		-Terminal 3 [ Frontend ] :
			-> 'cd ./frontend'
			-> (#if Juste apres un gitclone les dependances ne sont pas installees,
				-> Faut donc faire un: 'npm install' ou 'npm i' et avoid node installe ! )
			-> 'npm run dev -- --open'

	3 - Se connecter
		'http://localhost:5173/'

	







# TRANSCENDENCE

This is the last mandatory project of the 42 school.
The goal is to create a complete, full featured website to organize a *Pong* competition.
We have to use the NestJS backend framework.

## How to run the Project
Command:  
`docker-compose up`

### Tipps & Tricks
If you follow the videos you something have to delete the images & containers and then start everything again.

Command to remove all images:  
`docker rmi -f $(docker images -a -q)`

Command to remove all containers:  
`docker rm -vf $(docker ps -a -q)`

### Docker commands

Command to start:  
`docker-compose up`

Command to build:
`docker-compose build`


Command to remove all images:  
`docker rmi -f $(docker images -a -q)`

Command to remove all containers:  
`docker rm -vf $(docker ps -a -q)`