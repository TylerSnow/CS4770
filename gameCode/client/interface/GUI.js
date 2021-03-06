
GUI = function(container){

	var self={};
	self.container=container;
	var sPAnimation=0;
	var bearAnimationStage=0;
	var backgroundPositionCounter=0;
	var editorBackgroundCounter=0;
	self.create= function(type, id, left, top, width, height){
		var element= document.createElement(type);

		element.id=id;
		element.style.position='absolute';
		if(left!=0){element.style.left=left;}
		if(top!=0){element.style.top=top;}
		if(height!=0){
			if(type=='canvas'){
				element.height=height;
			}else{
				element.style.height=height;
			}
		}
		if(width!=0){
			if(type=='canvas'){
				element.width=width;
			}else{
				element.style.width=width;
			}
		}
		self.container.appendChild(element);
		return element;
	}

	self.createCanvas=function(width, height){
		self.bg=self.create('canvas','bg',0,0,width,height);
		self.fg=self.create('canvas','fg',0,0,width,height);
		self.ep=self.create('canvas','ep',0,0,width,height);
		self.gr=self.create('canvas','gr',0,0,width,height);
		self.bg.style.zIndex = 0;
		self.fg.style.zIndex = 1;
		self.ep.style.zIndex = 2;
		self.gr.style.zIndex = 3;
		self.bg_ctx = self.bg.getContext("2d");
		self.fg_ctx = self.fg.getContext("2d");
		self.ep_ctx = self.ep.getContext("2d");
		self.gr_ctx = self.gr.getContext("2d");
		self.ep_ctx.globalAlpha = 0.5;
	}
	//draw level editor background
	self.editorBackground=function(offsetX,offsetY,img){
		x=self.bg.width+offsetX;
		y=0;
		gui.bg_ctx.clearRect(0,0,self.bg.width,self.bg.height);
		n=editorBackgroundCounter;
		var image;
		//console.log(img);
		switch(img){
			case 'world1':
				image = Img.background1;
				break;
			case 'world2':
				image = Img.background2;
				break;
			case 'world3':
				image = Img.background3;
				break;
		}
		//console.log(image);
		if(image != null){
			gui.bg_ctx.drawImage(image,x+self.bg.width*(n-1),y,self.bg.width,self.bg.height);
			gui.bg_ctx.drawImage(image,x+self.bg.width*n,y,self.bg.width,self.bg.height);
			gui.bg_ctx.drawImage(image,x+self.bg.width*(n-2),y,self.bg.width,self.bg.height);
			image.onload=function(){};
			if(x<self.bg.width-self.bg.width*n){
				editorBackgroundCounter++;
			}
			else if(x>(-self.bg.width)*n ){
				editorBackgroundCounter--;
			}
		}
	}
	//draws gameplay background
	self.drawMap=function(){
		gui.bg_ctx.clearRect(0,0,self.bg.width,self.bg.height);
		img=Img.background2;
		sound=Sound.worldTwo;
		switch(level.background){
			case 'world1':
				sound=Sound.worldOne;
				img=Img.background1;
				break;
			case 'world2':
				sound=Sound.worldTwo;
				img=Img.background2;
				break;
			case 'world3':
				sound=Sound.worldThree;
				img=Img.background3;
				break;
		}
		n=backgroundPositionCounter;
		x=self.bg.width-level['player'].x;
		y=0;
		//if(
		img.onload=function(){
		}
		//console.log(Sound.worldTwo);
		sound.play();
		//continuously loops backgrounds
		gui.bg_ctx.drawImage(img,x+self.bg.width*(n-1),y,self.bg.width,self.bg.height);
		gui.bg_ctx.drawImage(img,x+self.bg.width*n,y,self.bg.width,self.bg.height);
		gui.bg_ctx.drawImage(img,x+self.bg.width*(n-2),y,self.bg.width,self.bg.height);

		if(x<self.bg.width-self.bg.width*n){
			backgroundPositionCounter++;
		}
		else if(x>(-self.bg.width)*n ){
			backgroundPositionCounter--;
		}
	};

	//draws Entities
	self.drawEntity=function(entity,ctx,isLevelEditor){
		if(isLevelEditor){
			playX=0;
			xOffset=0;
			yOffset=0;
		}else{
			playX=level['player'].x-self.fg.width/2;
			xOffset=entity.width/2;
			yOffset=entity.height/2;
		}
		var en=entity;
		ctx.save();
		switch(en.type){
			case "player":
				if(en.isBig==true){
					if(!isLevelEditor){
						playDir=ani.getPlayDirection(en);
						//Draws jumping animation
						//console.log(en.vy);
						if(en.vy!=0){
							playDir=ani.playJumpAnimation(en,playDir);
						}else{
							//updates player animation every 5th frame
							ani.updateEntityAnimation(en,5);
						}
					}else{
						playDir = 1;
					}
					var fW=Img.playerBig.width/5;
					var fH=Img.playerBig.height/3;
					//ani.updateEntityAnimation(en,5);
					if(en.isImmune && en.immuneCounter%6==0){
						//self.quickAnimatedDraw(Img.playerBig,en,ctx,playDir,fW,fH);

					}
					else{
						self.quickAnimatedDraw(Img.playerBig,en,ctx,playDir,fW,fH);
					}
				}else{
					var fW=Img.playerSmall.width/5;
					var fH=Img.playerSmall.height/3;
					//only animates for gameplay not level editor
					if(!isLevelEditor){
						playDir=ani.getPlayDirection(en);
						//Draws jumping animation
						//console.log(en.vy);
						if(en.vy!=0){
							playDir=ani.playJumpAnimation(en,playDir);
						}else{
							//updates player animation every 5th frame
							ani.updateEntityAnimation(en,5);
						}
					}else{
						playDir=0;
					}
					if(en.isImmune && en.immuneCounter%6==0){
		      			//self.quickAnimatedDraw(Img.playerSmall,en,ctx,playDir,fW,fH);
					}else{
						self.quickAnimatedDraw(Img.playerSmall,en,ctx,playDir,fW,fH);
					}
				}
				break;
			case "basic enemy":
				enemyImg=Img.basicEnemy1;
				var fW=Img.basicEnemy1.width/4;
				var fH=Img.basicEnemy1.height/2;
				dir=ani.getPlayDirection(en);
				ani.updateEntityAnimation(en,4);
				self.quickAnimatedDraw(enemyImg,en,ctx,dir,fW,fH);
				break;
			case "basic boss":
				enemyImg=Img.basicEnemy1;
				var fW=Img.basicEnemy1.width/4;
				var fH=Img.basicEnemy1.height/2;
				dir=ani.getPlayDirection(en);
				ani.updateEntityAnimation(en,4);
				self.quickAnimatedDraw(enemyImg,en,ctx,dir,fW,fH);
				break;
			case "flying enemy":
				enemyImg=Img.basicEnemy2;
				var fW=Img.basicEnemy2.width/4;
				var fH=Img.basicEnemy2.height/2;
				dir=ani.getPlayDirection(en);
				ani.updateEntityAnimation(en,4);
				self.quickAnimatedDraw(enemyImg,en,ctx,dir,fW,fH);
				break;
			case "flying boss":
				enemyImg=Img.basicEnemy2;
				var fW=Img.basicEnemy2.width/4;
				var fH=Img.basicEnemy2.height/2;
				dir=ani.getPlayDirection(en);
				ani.updateEntityAnimation(en,4);
				self.quickAnimatedDraw(enemyImg,en,ctx,dir,fW,fH);
				break;
			case "tank enemy":
				enemyImg=Img.basicEnemy3;
				var fW=Img.basicEnemy3.width/5;
				var fH=Img.basicEnemy3.height/2;
				dir=ani.getPlayDirection(en);
				ani.updateEntityAnimation(en,5);
				self.quickAnimatedDraw(enemyImg,en,ctx,dir,fW,fH);
				break;
			case "tank boss":
				enemyImg=Img.basicEnemy3;
				var fW=Img.basicEnemy3.width/5;
				var fH=Img.basicEnemy3.height/2;
				dir=ani.getPlayDirection(en);
				ani.updateEntityAnimation(en,5);
				self.quickAnimatedDraw(enemyImg,en,ctx,dir,fW,fH);
				break;
			case "ghost":
				ghostImg = Img.playerSmall;
				var fW=Img.playerSmall.width/5;
				var fH=Img.playerSmall.height/3;
				ani.updateEntityAnimation(en,5);
				self.quickAnimatedDraw(ghostImg,en,gui.ep_ctx,0,fW,fH);
				break;
			case "pistol":
				var weapImg=Img.pistol;
				var fW=weapImg.width/5;
				var fH=weapImg.height/2;


				dir=1;
				newX=ani.getWeaponPosition(en);
				if (en.isFiring==true){
					aniX=ani.fireAnimation(en,en.fireTimer,newX);
				}
				newX=0;
				aniX=0;
				if(!isLevelEditor){
					xOffset=fW/2;
					yOffset=fH/2;
					newX=ani.getWeaponPosition(en);
					dir=ani.getPlayDirection(en);
					self.quickAniWeaponDraw(weapImg,en,ctx,aniX,dir,fW,fH,newX,en.y);
				}else{
					aniX=0
					newX=0;
					self.editorWeaponDraw(weapImg,en,ctx,fW,fH);
				}

				break;
			case "shotgun":
				weapImg=Img.shotgun;
				var fW=weapImg.width/5;
				var fH=weapImg.height/2;
				dir=1;
				newX=ani.getWeaponPosition(en);
				if (en.isFiring==true){
					aniX=ani.fireAnimation(en,en.fireTimer,newX);
				}
				newX=0;
				aniX=0;
				if(!isLevelEditor){
					xOffset=fW/2;
					yOffset=fH/2;
					newX=ani.getWeaponPosition(en);
					dir=ani.getPlayDirection(en);
					self.quickAniWeaponDraw(weapImg,en,ctx,aniX,dir,fW,fH,newX,en.y);
				}else{
					aniX=0
					newX=0;
					self.editorWeaponDraw(weapImg,en,ctx,fW,fH);
				}

				break;
			case "sword":
				weapImg=Img.swordWeapon;
				var fW=weapImg.width/5;
				var fH=weapImg.height/2;
				aniX=0
				newX=ani.getWeaponPosition(en);
				newY=en.y;
				dir=ani.getPlayDirection(en);
				if (en.isFiring==true){
					ani.swordAnimation(en,en.fireTimer,newX,newY,weapImg,fW,fH,dir);
				}
				else{
					aniX=0;
					newX=0;
					dir=1;
					if(!isLevelEditor){
						xOffset=fW/2;
						yOffset=fH/2;
						newX=ani.getWeaponPosition(en);
						dir=ani.getPlayDirection(en);
						self.quickAniWeaponDraw(weapImg,en,ctx,aniX,dir,fW,fH,newX,newY);
					}else{
						self.editorWeaponDraw(weapImg,en,ctx,fW,fH);
					}
				}

				break;
			case "assaultRifle":
				weapImg=Img.assaultWeapon
				var fW=weapImg.width/9;
				var fH=weapImg.height/2;
				dir=1;
				newX=ani.getWeaponPosition(en);
				if (en.isFiring==true){
					aniX=ani.fireAnimation(en,en.fireTimer,newX);
				}
				newX=0;
				aniX=0;
				if(!isLevelEditor){
					xOffset=fW/2;
					yOffset=fH/2;
					newX=ani.getWeaponPosition(en);
					dir=ani.getPlayDirection(en);
					self.quickAniWeaponDraw(weapImg,en,ctx,aniX,dir,fW,fH,newX,en.y);
				}else{
					aniX=0
					newX=0;
					self.editorWeaponDraw(weapImg,en,ctx,fW,fH);
				}

				break;
			case "noWeapon":
				break;
			case "bullet":
				self.quickDraw(Img.bullet,en,ctx,en.x,en.y);
				break;

			case "meleeBullet":
				//melee bullets shouldnt be drawn
				//self.quickDraw(Img.bullet,en,ctx,en.x,en.y);
				break;
			case "boulder":
				//console.log(en.width,en.height,en.x,en.y);
				fW=Img.boulder.width/5;
				fH=Img.boulder.height;
				ctx.drawImage(Img.boulder,0,0,fW,Img.boulder.height,en.x-xOffset-playX,en.y-yOffset,en.width,en.height);
				break;
			case "boulderBullet":
				fW=Img.boulder.width/5;
				fH=Img.boulder.height;
				ani.updateEntityAnimation(en,5);
				gui.quickAnimatedDraw(Img.boulder,en,ctx,0,fW,fH);
				break;

			case "ammo":
				self.quickDraw(Img.bullet,en,ctx,en.x,en.y);
				break;
		}
		//console.log(entity);
		//entity.img.onload=function(){};
		ctx.restore();
	};
	//draws terrain
	self.drawTerrain=function(terrain,ctx,isLevelEditor){
		var t=terrain;
		if(isLevelEditor){
			playX=0;
			xOffset=0;
			yOffset=0;
		}
		else{
			playX=level['player'].x-self.fg.width/2;
			xOffset=0;
			yOffset=0;

		}
		ctx.save();
		switch(terrain.type){
			case "Terrain1x1":
				self.quickDraw(Img.terrain1x1,t,ctx,t.x,t.y);
				break;
			case "Terrain1x1Breakable":
				self.quickDraw(Img.terrain1x1Breakable,t,ctx,t.x,t.y);
				break;
			case "Terrain3x2":
				self.quickDraw(Img.terrain3x2,t,ctx,t.x,t.y);
				break;
			case "Terrain3x2Breakable":
				self.quickDraw(Img.terrain3x2Breakable,t,ctx,t.x,t.y);
				break;
			case "Terrain3x4":
				self.quickDraw(Img.terrain3x4,t,ctx,t.x,t.y);
				break;
			case "Terrain3x4Breakable":
				self.quickDraw(Img.terrain3x4Breakable,t,ctx,t.x,t.y);
				break;
			case "Terrain3x6":
				self.quickDraw(Img.terrain3x6,t,ctx,t.x,t.y);
				break;
			case "Terrain3x6Breakable":
				self.quickDraw(Img.terrain3x6Breakable,t,ctx,t.x,t.y);
				break;
			case "Terrain1x6Breakable":
				self.quickDraw(Img.terrain1x6Breakable,t,ctx,t.x,t.y);
				break;
			case "Checkpoint":
				if (t.isActive){
					//does not exist yet
					//img=Img.activeCheckpoint;
				}
				else{
					img=Img.standardCheckpoint;
				}
				self.quickDraw(img,t,gui.fg_ctx,t.x,t.y);
				break;
			case "spike trap":
				self.quickDraw(Img.spikeTrap,t,ctx,t.x,t.y);
				break;

			case "moving platform":
				self.quickDraw(Img.platform,t,ctx,t.x,t.y);

				break;
		}
		//Drawing terrain modifiers

		if(terrain.mod.type!='none'){
			gui.drawTerrainMod(terrain,ctx);
		}
		terrain.img.onload=function(){};
		ctx.restore();
	};
	//draw modified terrain
	self.drawTerrainMod=function(terrain,ctx){
		t=terrain;
		if(t.mod.type=='ice'){
			img=Img.iceTerrain;
		}
		else if(t.mod.type=='mud'){
			img=Img.mudTerrain;
		}
		gui.modDraw(img,t,ctx,t.x,t.y);

	};
	//draw medals at end of game
	self.drawMedal=function(medal){
		
		playTime=Timer.getEndTime();
		img=Img.medals;
		fW=img.width/3;
		fH=img.height;
		theTime=gui.formatTime(playTime);
		if(medal=="gold"){
			medalType=0;
		}else if(medal=="silver"){
			medalType=1;
		}else if(medal=="bronze"){
			medalType=2;
		}else if(medal=="none"){
			medalType=3;
		}
		else{
			medalType=4;
		}
		if (medalType!=4){
			gui.gr_ctx.clearRect(400,50,450,400);
			gui.gr_ctx.drawImage(Img.menuBackground,400,50,450,400);
			if(medalType!=3){
				gui.gr_ctx.drawImage(img,fW*medalType,0,fW,fH,450,150,100,200);
			}
			gui.gr_ctx.fillText('Your time: '+ theTime[0] +":"+theTime[1]+ ":"+theTime[2],600,200);
			medalTime=gui.formatTime(storyMedals[0]);
			gui.gr_ctx.fillText('Gold time: '+ medalTime[0] +":"+medalTime[1]+ ":"+medalTime[2],600,250);
			medalTime=gui.formatTime(storyMedals[1]);
			gui.gr_ctx.fillText('Silver time: '+ medalTime[0] +":"+medalTime[1]+ ":"+medalTime[2],600,275);
			medalTime=gui.formatTime(storyMedals[2]);
			gui.gr_ctx.fillText('Bronze time: '+ medalTime[0] +":"+medalTime[1]+ ":"+medalTime[2],600,300);
		}
	}
	//Draws goal flag
	self.drawGoal=function(){
		playX=level['player'].x-self.fg.width/2;
		img=Img.finalCheckpoint;
		gui.fg_ctx.drawImage(img,(level.width)-playX,100,50,500);
	};
	//Checkpoint update
	self.checkpointUpdate=function(checkpoint){
		//Does not exist
		//img=Img.activeCheckpoint;
		//self.quickDraw(img,checkpoint,gui,fg_ctx,checkpoint.x,checkpoint.y);
		ani.checkpointSound();
	};
	//LevelComplete
	self.levelComplete=function(){
		img=Img.levelComplete;
		gui.gr_ctx.drawImage(img,400,50,450,400);
		ani.winGameSound();
	};
	//QuickDraw Methods(For improved readability)
	self.quickDraw=function(img,entity,ctx,x,y){
		ctx.drawImage(img,(x-xOffset)-playX,y-yOffset,entity.width,entity.height);
	};
	self.modDraw=function(img,entity,ctx,x,y){
		ctx.drawImage(img,(x-xOffset)-playX,y-yOffset,entity.width,25);
	};
	self.aniDraw=function(img,x,y,width,height){
		gui.fg_ctx.drawImage(img,(x-xOffset)-playX,y-yOffset,width,height);
	};
	self.quickPlayerDraw=function(img,en,ctx,aniX,aniDir,fW,fH){
		ctx.drawImage(img,aniX*fW,aniDir*fH,fW,fH,en.x-xOffset-playX,en.y-yOffset,en.width,en.height);
	};
	self.quickAniWeaponDraw=function(img,en,ctx,aniX,dir,fW,fH,x,y){
		ctx.drawImage(img,aniX*fW,dir*fH,fW,fH,x-xOffset-playX,y-yOffset,fW,fH);
	};
	self.quickAnimatedDraw=function(img,en,ctx,aniStepY,fW,fH){
		ctx.drawImage(img,en.aniCount*fW,aniStepY*fH,fW,fH,en.x-xOffset-playX,en.y-yOffset,en.width,en.height);
	};
	self.onlyAnimation=function(img,en,ctx,aniX,fW,width,height,x,y){
		ctx.drawImage(img,aniX*fW,0,fW,img.height,x-xOffset-playX,y-yOffset,width,height);
	};
	self.editorWeaponDraw = function(img,en,ctx,fW,fH){
		ctx.drawImage(img,0,0,fW,fH,en.x,en.y,50,50);
	};
	self.formatTime=function(time){
		calcTime=time/1000;
		minutes=Math.floor(calcTime/60);
		seconds=Math.floor(calcTime-minutes*60);
		milliseconds=(time-seconds*1000-minutes*60000)%1000;
		//console.log("Min",minutes,"sec",seconds,"mil",milliseconds);
		if (minutes<10){
			minutes="0"+minutes;
		}
		if (seconds<10){
			seconds="0"+seconds;
		}
		if (milliseconds<100){
			milliseconds="0"+milliseconds;
			if(milliseconds<10){
				milliseconds="0"+milliseconds;
			}
		}
		return [minutes,seconds,milliseconds];
	};

	self.prettyPrint = function(time){
		prettyTime = time[0]+":"+time[1]+":"+time[2];
		return prettyTime;
	}

	self.HUD=function(ctx,player){

		var timeX=0;
		var timeY=90;
		var healthX=0;
		var healthY=30;
		var timeX=0;
		var timeY=90;
		var momentX=0;
		var momentY=60;
		var ammoX=1050;
		var ammoY=30;
		var weaponX=1050;
		var weaponY=80;
		var weaponImgX=1125;
		var weaponImgY=50;
		var healthBar=player.health/player.maxHealth*100
		var momentumBar=(Math.abs(player.getMomentum())/player.maxMomentum)*100
		var ammo;
		var weaponImg=player.weapon.img;

		ctx.save();

		ctx.clearRect(0,0,self.fg.width,100);
		ctx.font="18px Arial";
		//draw bar outlines
		ctx.strokeRect(healthX,healthY,100,10);
		ctx.strokeRect(momentX,momentY,100,10);
		//draw Healthbar
		ctx.fillStyle="#FF0000";
		ctx.fillRect(healthX,healthY,healthBar,10);

		//draw Momentumbar
		ctx.fillStyle="#0000FF";
		ctx.fillRect(momentX,momentY,momentumBar,10);
		//Colour Text
		ctx.fillStyle="#FFFFFF";
		ctx.fillText('Health:',healthX,healthY);
		ctx.fillText('Momentum:',momentX,momentY);
		theTime=gui.formatTime(Timer.getCurrentTime());
		//console.log(theTime);
		//draws time
		ctx.fillText('Time: '+ theTime[0] +":"+theTime[1]+ ":"+theTime[2],timeX,timeY);
		//draw ammo
		if(!player.isBig){
			if(player.weapon.type=="sword" || player.weapon.type=="pistol"){
				ammo=Img.infinity;
				ctx.fillText('Ammo: ',ammoX,ammoY);
				ctx.drawImage(ammo,ammoX+75,ammoY-25,75,40);
				ammo.onload=function(){};
			}else{
				ammo=player.weapon.ammo;
				//draw ammo
				ctx.fillText('Ammo: '+ammo,ammoX,ammoY);
				ctx.fillText('Weapon: ',weaponX,weaponY);
			}
			//ctx.fillText('Ammo: '+ammo,ammoX,ammoY);
			ctx.fillText('Weapon: ',weaponX,weaponY);
			//draw current weapon image
			fW=weaponImg.width/5;
			fH=weaponImg.height/2;
			if(player.weapon.type=="assaultRifle"){
				fW=weaponImg.width/9;
			}
	 		ctx.drawImage(weaponImg,0,0,fW,fH,weaponImgX,weaponImgY,50,50);
			weaponImg.onload=function(){};
		}
		else{
			ammo=Img.infinity;
			ctx.fillText('Ammo: ',ammoX,ammoY);
			ctx.drawImage(ammo,ammoX+75,ammoY-25,75,40);
			ammo.onload=function(){};
			ctx.fillText('Weapon: ',weaponX,weaponY);
			if(player.hasBoulder){
				fW=Img.boulder.width/5;
				fH=Img.boulder.height;
				ctx.drawImage(Img.boulder,0,0,fW,fH,weaponImgX,weaponImgY,50,50);
			}
			else{

			}
		}
	};
	return self;
}
