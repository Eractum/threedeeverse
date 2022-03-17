import { RectAreaLightHelper } from '/js/three.js-master/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from '/js/three.js-master/examples/jsm/lights/RectAreaLightUniformsLib.js';

var mouseX = window.innerWidth/2;
var mouseY = window.innerHeight/2;
var anchorCamRotX = window.innerWidth/2;
var anchorCamRotY = window.innerHeight/2;
var curWinX=window.innerWidth;
var curWinY=window.innerHeight;
    
document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);
    
function onMouseUpdate(e) {
  mouseX = e.pageX;
  mouseY = e.pageY;
}

function randomInteger(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}


var timer = 0;

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
const scene = new THREE.Scene();

//------CAMERA------

var camera = new THREE.PerspectiveCamera (75, window.innerWidth/window.innerHeight, 0.1,1000);
var camZ=0;
var camY=0;
var camX=0;
var camRotZ=0;
var camRotY=0;
var camRotX=0;

function addPosCamZ(val){
	camZ+=val;
	camera.position.setZ(camZ);
}
function addPosCamY(val){
	camY+=val;
	camera.position.setY(camY);
}
function addPosCamX(val){
	camX+=val;
	camera.position.setX(camX);
}
function addRotCamZ(val){
	camRotZ+=val;
	camera.rotation.z = camRotZ;
}
function addRotCamY(val){
	camRotY+=val;
	camera.rotation.y = camRotY;
}
function addRotCamX(val){
	camRotX+=val;
	camera.rotation.x = camRotX;
}

function setRotCamZ(val){
	camRotZ=val;
	camera.rotation.z = camRotZ;
}
function setRotCamY(val){
	camRotY=val;
	camera.rotation.y = camRotY;
}
function setRotCamX(val){
	camRotX=val;
	camera.rotation.x = camRotX;
}

var renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#bg'),
	alpha: true,
	antialias: true,
});
renderer.setPixelRatio (window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);


addPosCamZ(60);
addPosCamY(5);
addRotCamX(-0.1);

renderer.render (scene,camera);

//------SCENES------
var scenes = document.getElementsByClassName("container")[0].children;

var campoints = Array(scenes.length);

for (let i=0; i< campoints.length; i++)  {
	campoints[i]=null;
}

function setCamPoint(x,y,z,col=[0,0,0],supcol=null,r = [-0.1,0,0], lightMode = [0,0]) {
	let emptyIndex = campoints.indexOf(null);
	campoints[emptyIndex]=[x,y,z,r[0],r[1],r[2]];
	campoints[emptyIndex].color = col;
	if (supcol != null && supcol.length>=3) {
		campoints[emptyIndex].supColor = supcol;
	}
	else {
		campoints[emptyIndex].supColor = col;
	}
	
	campoints[emptyIndex].dirLight=lightMode[0];
	campoints[emptyIndex].hemLight=lightMode[1];
}

//------SET SCENE POSITIONS HERE------

setCamPoint(0,5,60);
setCamPoint(0,-3000,60,[255,150,255],[242,29,190],[-0.1,0,0],[1,0.1]);
setCamPoint(0,-6000,60,[214,220,200],[80,129,150],[-0.1,0,0],[1,0.1]);
setCamPoint(0,-9000,60,[0,0,0],[0,0,0],[-0.1,0,0],[0,0]);
setCamPoint(0,-12000,60,[0,0,0],[0,0,0],[-0.1,0,0],[0.1,0]);

while (campoints.indexOf(null)!=-1) {
	setCamPoint(0,5,60);
}

const mainContainer = document.getElementsByClassName("container")[0];

//------SCENE 1------

var geometry = new THREE.IcosahedronGeometry(5,2);
var material = new THREE.MeshBasicMaterial({wireframe: true});
const torus = new THREE.Mesh(geometry, material);
torus.rotation.z = Math.PI/3;
geometry = new THREE.IcosahedronGeometry(13,3);
const mainshape1 = new THREE.Mesh(geometry, material);
mainshape1.rotation.z = Math.PI/3;
const gridhelp = new THREE.GridHelper(2000,100);

const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

var light2 = new THREE.HemisphereLight( 0xfcf9e8,0xB1E1FF, 0.1 );
light2.position.x=-3;
light2.position.z=23;
light2.position.y=campoints[1][1]+300;
scene.add(light2);

scene.add(torus, gridhelp, mainshape1);

function addStar() {
	geometry = new THREE.IcosahedronGeometry(0.5);
	material = new THREE.MeshBasicMaterial({wireframe: true});
	let star = new THREE.Mesh(geometry,material);
	let [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200));
	star.position.set(x,y,z);
	[x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(Math.PI));
	star.rotation.x = x;
	star.rotation.y = y;
	star.rotation.z = z;
	star.rotationspeed = THREE.MathUtils.randFloatSpread(0.005);
	return (star);
}

var stars = Array(100);
for(let i=0;i<stars.length;i++) {
	stars[i] = addStar();
	scene.add(stars[i]);
}

//------SCENE 2------

var meshes = [];

var loader = new THREE.OBJLoader();
var manager = new THREE.LoadingManager();

manager.onProgress = function ( item, loaded, total ) {

};

var percentComplete;

var onProgress = function ( xhr ) {
					if ( xhr.lengthComputable ) {
						percentComplete = xhr.loaded / xhr.total;
					}
};

var imgLoader  = new THREE.ImageLoader( manager );

var head;
const cloudModelsAmount = 5;
const cloudNormalRadius = 1300;
var clouds = [];
var clouds12 = [];
var clouds21 = [];

loader.load( '../../models/vaporwavebust/heliosbust.obj', function ( obj ) {

	obj.traverse( function ( child )
    {
      if ( child instanceof THREE.Mesh )
      {
        meshes.push(child);
      }
    });

    head = meshes[0];
	head.material = new THREE.MeshBasicMaterial({wireframe: true});
	head.position.x=-1;
	head.position.z=40;
	head.position.y=campoints[1][1]-10;
	
	var textureHead = new THREE.Texture();
	imgLoader.load( 'models/vaporwavebust/color.png', function ( image ) {
		textureHead.image = image;
		textureHead.needsUpdate = true;
	  });
	
	head.material = new THREE.MeshPhongMaterial({map: textureHead});
	var normalMapHead = THREE.ImageUtils.loadTexture('models/vaporwavebust/normal.png', undefined, function () {
    head.material.normalMap = normalMapHead;
});
	
	scene.add(head);
	
	addClouds(0,cloudModelsAmount);
	
}, onProgress, function ( error ) {

	console.error( error );

} );

function addClouds (j,jLength) {
	if (j<jLength) {
		let path = '../../models/clouds/cloud' + (j+1).toString() + '.obj';
		loader.load ( path, function ( obj ) {
			obj.traverse( function ( child )
			{
			  if ( child instanceof THREE.Mesh )
			  {
				meshes.push(child);
			  }
			});
			
			let clouds1 = [];
			
			for (let i=0; i<30; i++) {
				clouds1.push(meshes[meshes.length-1].clone());
				clouds1[i].material = new THREE.MeshToonMaterial({color: 0xe7d0e9,emissive: 0x2a0000});
				clouds1[i].scale.set(20*(THREE.MathUtils.randFloatSpread(1)<0?-1:1),20,20);
				clouds1[i].customRadius = cloudNormalRadius + THREE.MathUtils.randFloatSpread(500);
				clouds1[i].position.x = THREE.MathUtils.randFloatSpread(clouds1[i].customRadius) * (window.innerWidth/window.innerHeight);
				clouds1[i].startX = clouds1[i].position.x;
				clouds1[i].xMovingAmount = THREE.MathUtils.randFloatSpread(100);
				clouds1[i].xMovingOffset = THREE.MathUtils.randFloatSpread(Math.PI);
				clouds1[i].position.y = THREE.MathUtils.randFloatSpread(clouds1[i].customRadius) + campoints[1][1];
				clouds1[i].position.z = -0.5*Math.sqrt(Math.pow(clouds1[i].customRadius,2)-Math.pow(clouds1[i].position.x,2)-Math.pow((clouds1[i].position.y - campoints[1][1]),2))+150;
			}
			clouds.push(clouds1);
			
			for (let i=0; i< clouds1.length; i++) {
				scene.add(clouds[clouds.length-1][i]);
			}
			
			addClouds(j+1,jLength);
		});
	}
	else {
		for (let i=0; i<10; i++) {
		clouds12.push(meshes[randomInteger(1,cloudModelsAmount)].clone());
		clouds12[i].material = new THREE.MeshToonMaterial({color: 0xe7d0e9,emissive: 0x2a0000});
		clouds12[i].scale.set(20*(THREE.MathUtils.randFloatSpread(1)<0?-1:1),20,20);
		clouds12[i].position.x = THREE.MathUtils.randFloatSpread(cloudNormalRadius) * (window.innerWidth/window.innerHeight);
		clouds12[i].position.z = 0.5*THREE.MathUtils.randFloatSpread(1000)-(500);
		clouds12[i].position.y = campoints[1][1]+(cloudNormalRadius/2)+50+Math.pow(THREE.MathUtils.randFloatSpread(15)+15,2);
		scene.add(clouds12[i]);
		clouds21.push(meshes[randomInteger(1,cloudModelsAmount)].clone());
		clouds21[i].material = new THREE.MeshToonMaterial({color: 0xe7d0e9,emissive: 0x2a0000});
		clouds21[i].scale.set(20*(THREE.MathUtils.randFloatSpread(1)<0?-1:1),20,20);
		clouds21[i].position.x = THREE.MathUtils.randFloatSpread(cloudNormalRadius) * (window.innerWidth/window.innerHeight);
		clouds21[i].position.z = 0.5*THREE.MathUtils.randFloatSpread(1000)-(500);
		clouds21[i].position.y = campoints[1][1]-(cloudNormalRadius/2)-50-Math.pow(THREE.MathUtils.randFloatSpread(15)+15,2);
		scene.add(clouds21[i]);
		}
		
		ShipLoader();
	}
}

//------SCENE 3------

var textureLoader = new THREE.TextureLoader();
geometry = new THREE.PlaneGeometry(800, 20);
var planes = [];
for (let i=0; i<15; i++) {
	let str = 'img/img'+((i%3)+2).toString()+'.png';
	material = new THREE.MeshPhongMaterial({map: textureLoader.load(str), transparent: true});
	planes.push (new THREE.Mesh(geometry,material));
	planes[i].rotation.x=-1*Math.PI/3;
	planes[i].position.y+=-12;
	planes[i].position.z=60-(i*20);
}

//SHIP

var ship;

function ShipLoader () {
	let path = '../../models/boat/boat.obj';
	loader.load ( path, function ( obj ) {
		obj.traverse( function ( child ) {
			if ( child instanceof THREE.Mesh ) {
				meshes.push(child);
			}
		});
		
		ship = meshes[meshes.length-1].clone();
		ship.position.y = campoints[2][1]-8;
		ship.rotation.y = -Math.PI/2+Math.PI/6;
		ship.position.x = -17;
		ship.position.z = 20;
		
		var textureShip = new THREE.Texture();
		imgLoader.load( 'models/boat/color.png', function ( image ) {
			textureShip.image = image;
			textureShip.needsUpdate = true;
		  });
		
		ship.material = new THREE.MeshPhongMaterial({map: textureShip, emissive: 0x121212, shininess: 44});
		scene.add(ship);
		
		LoadFlamingo();
	});
}

//MOUNTAIN RIGHT

geometry = new THREE.PlaneGeometry(200, 100);
material = new THREE.MeshPhongMaterial({map: textureLoader.load('img/mr.png'), transparent: true});
planes.push (new THREE.Mesh(geometry,material));
planes[planes.length-1].position.x = 150;
planes[planes.length-1].position.z = -100;
planes[planes.length-1].position.y = 20;
planes[planes.length-1].rotation.y = -Math.PI/6;

//MOUNTAIN LEFT

geometry = new THREE.PlaneGeometry(550, 125);
material = new THREE.MeshPhongMaterial({map: textureLoader.load('img/ml.png'), transparent: true});
planes.push (new THREE.Mesh(geometry,material));
planes[planes.length-1].position.x = -200;
planes[planes.length-1].position.z = -150;
planes[planes.length-1].position.y = 30;
planes[planes.length-1].rotation.y = Math.PI/12;

//MOUNTAIN BACK

geometry = new THREE.PlaneGeometry(1600, 300);
material = new THREE.MeshPhongMaterial({map: textureLoader.load('img/mb.png'), transparent: true});
planes.push (new THREE.Mesh(geometry,material));
planes[planes.length-1].position.z = -250;
planes[planes.length-1].position.y = 100;

for (let i=0; i<planes.length; i++) {
	planes[i].position.y+=campoints[2][1];
	scene.add(planes[i]);
}

//------SCENE 4------

var rectlight = [];
rectlight.push(new THREE.RectAreaLight( 0xff0000, 5, 8, 15 ));
rectlight.push(new THREE.RectAreaLight( 0x00ff00, 5, 8, 15 ));
rectlight.push(new THREE.RectAreaLight( 0x0000ff, 5, 8, 15 ));
rectlight[0].position.set(-10, campoints[3][1], 40);
rectlight[1].position.set(0, campoints[3][1], 40);
rectlight[2].position.set(10, campoints[3][1], 40);
rectlight[0].rotation.y = Math.PI;
rectlight[1].rotation.y = Math.PI;
rectlight[2].rotation.y = Math.PI;
scene.add(rectlight[0]);
scene.add(rectlight[1]);
scene.add(rectlight[2]);
scene.add( new RectAreaLightHelper(rectlight[0]));
scene.add( new RectAreaLightHelper(rectlight[1]));
scene.add( new RectAreaLightHelper(rectlight[2]));

var scene4floorGeo = new THREE.BoxGeometry( 2000, 0.1, 2000 );
var scene4floorMat = new THREE.MeshStandardMaterial( { color: 0x808080, roughness: 0.1, metalness: 0 } );
var scene4floor = new THREE.Mesh( scene4floorGeo, scene4floorMat );
scene4floor.position.y = campoints[3][1]-5;
scene.add(scene4floor);

var flamingo;

function LoadFlamingo() {
	let path = '../../models/flamingoaesthetics/Flamingo.obj';
	loader.load ( path, function ( obj ) {
		obj.traverse( function ( child ) {
			if ( child instanceof THREE.Mesh ) {
				meshes.push(child);
			}
		});
		flamingo = meshes[meshes.length-1].clone();
		flamingo.material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 0, metalness: 0 } );
		flamingo.position.set(0,campoints[3][1]-5,45);
		flamingo.scale.set(0.5,0.5,0.5);
		scene.add(flamingo);
		
		LoadGlBust();
		
	});
}

//------SCENE 5------

var scene5lights = [];

var sphere5 = new THREE.SphereGeometry( 0.3, 16, 8 );

scene5lights.push(new THREE.PointLight( 0xff0040, 2, 10 ));
scene5lights[scene5lights.length-1].add( new THREE.Mesh( sphere5, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
scene.add(scene5lights[scene5lights.length-1]);
scene5lights.push(new THREE.PointLight( 0x0040ff, 2, 10 ));
scene5lights[scene5lights.length-1].add( new THREE.Mesh( sphere5, new THREE.MeshBasicMaterial( { color: 0x0040ff } ) ) );
scene.add(scene5lights[scene5lights.length-1]);
scene5lights.push(new THREE.PointLight( 0x80ff80, 2, 10 ));
scene5lights[scene5lights.length-1].add( new THREE.Mesh( sphere5, new THREE.MeshBasicMaterial( { color: 0x80ff80 } ) ) );
scene.add(scene5lights[scene5lights.length-1]);
scene5lights.push(new THREE.PointLight( 0xffaa00, 2, 10 ));
scene5lights[scene5lights.length-1].add( new THREE.Mesh( sphere5, new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) ) );
scene.add(scene5lights[scene5lights.length-1]);

scene5lights.push(new THREE.PointLight( 0xff0040, 2, 10 ));
scene5lights[scene5lights.length-1].add( new THREE.Mesh( sphere5, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
scene.add(scene5lights[scene5lights.length-1]);
scene5lights.push(new THREE.PointLight( 0x0040ff, 2, 10 ));
scene5lights[scene5lights.length-1].add( new THREE.Mesh( sphere5, new THREE.MeshBasicMaterial( { color: 0x0040ff } ) ) );
scene.add(scene5lights[scene5lights.length-1]);
scene5lights.push(new THREE.PointLight( 0x80ff80, 2, 10 ));
scene5lights[scene5lights.length-1].add( new THREE.Mesh( sphere5, new THREE.MeshBasicMaterial( { color: 0x80ff80 } ) ) );
scene.add(scene5lights[scene5lights.length-1]);
scene5lights.push(new THREE.PointLight( 0xffaa00, 2, 10 ));
scene5lights[scene5lights.length-1].add( new THREE.Mesh( sphere5, new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) ) );
scene.add(scene5lights[scene5lights.length-1]);

var glbust;

function LoadGlBust() {
	let path = '../../models/glbust/glBust.obj';
	loader.load ( path, function ( obj ) {
		obj.traverse( function ( child ) {
			if ( child instanceof THREE.Mesh ) {
				meshes.push(child);
			}
		});
		glbust = meshes[meshes.length-1].clone();
		glbust.material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 0, metalness: 0 } );
		glbust.position.set(0,campoints[4][1]-30,0);
		glbust.scale.set(0.2,0.2,0.2);
		scene.add(glbust);
		
		//NEXT LOADER FUNCTION
		
	});
}

//------ANIMATION------

function animate() {
	
	
	requestAnimationFrame(animate);
	
	//!!!MOUSE FOLLOWER
	
	anchorCamRotX += (mouseX-anchorCamRotX)/50;
	anchorCamRotY += (mouseY-anchorCamRotY)/50;
	addRotCamY(-1*(((mouseX-anchorCamRotX)*0.003)/window.innerWidth));
	addRotCamX(-1*(((mouseY-anchorCamRotY)*0.003)/window.innerHeight));
	
	if(percentComplete==1){
		let HRY = head.rotation.y;
		let HRX = head.rotation.x;
		
		head.rotation.y=HRY+(((mouseX-anchorCamRotX)*0.009)/window.innerWidth);
		head.rotation.x=HRX+(((mouseY-anchorCamRotY)*0.009)/window.innerHeight);
		
		for (let i=0; i< clouds.length; i++) {
			for (let j=0; j< clouds[i].length; j++) {
				clouds[i][j].position.x=clouds[i][j].startX+clouds[i][j].xMovingAmount*(Math.sin((clouds[i][j].xMovingOffset+(Math.PI*((window.innerWidth/2)-anchorCamRotX)/(window.innerWidth/2)))/2));
			}
		}
		
		ship.rotation.x=Math.sin(timer*7)*0.1;
		ship.rotation.z=Math.cos(timer*7)*0.07;
		flamingo.rotation.y += 0.003;
		flamingo.position.x=-1*Math.sin(timer*3+(Math.PI/2*3))*3;
		flamingo.position.z=47+(-1*Math.sin(timer*3)*3);
		
		glbust.rotation.y += 0.003;
	}
	
	//!!!NORMAL ANIMATION
	
	timer+=0.001;
	torus.position.y=Math.sin(timer*2)*30;
	torus.position.x=Math.cos(timer*2)*20;
	torus.position.z=Math.cos(timer*2)*22.361;
	torus.rotation.y += 0.005;
	
	scene5lights[0].position.x = Math.sin( timer * 0.7 * 5) * 15;
	scene5lights[0].position.y = campoints[4][1] + Math.sin( timer * 0.5 * 5) * 20;
	scene5lights[0].position.z = Math.sin( timer * 0.3 * 5) * 15;
	
	scene5lights[1].position.x = Math.sin( timer * 0.3 * 5) * 15;
	scene5lights[1].position.y = campoints[4][1] + Math.sin( timer * 0.5 * 5) * 20;
	scene5lights[1].position.z = Math.sin( timer * 0.7 * 5) * 15;
	
	scene5lights[2].position.x = Math.sin( timer * 0.7 * 5) * 15;
	scene5lights[2].position.y = campoints[4][1] + Math.sin( timer * 0.3 * 5) * 20;
	scene5lights[2].position.z = Math.sin( timer * 0.5 * 5) * 15;
	
	scene5lights[3].position.x = Math.sin( timer * 0.3 * 5) * 15;
	scene5lights[3].position.y = campoints[4][1] + Math.sin( timer * 0.7 * 5) * 20;
	scene5lights[3].position.z = Math.sin( timer * 0.5 * 5) * 15;
	
	scene5lights[4].position.x = Math.sin( timer * 0.7 * 5 + Math.PI) * 15;
	scene5lights[4].position.y = campoints[4][1] + Math.sin( timer * 0.5 * 5 + Math.PI) * 20;
	scene5lights[4].position.z = Math.sin( timer * 0.3 * 5 + Math.PI) * 15;
	
	scene5lights[5].position.x = Math.sin( timer * 0.3 * 5 + Math.PI) * 15;
	scene5lights[5].position.y = campoints[4][1] + Math.sin( timer * 0.5 * 5 + Math.PI) * 20;
	scene5lights[5].position.z = Math.sin( timer * 0.7 * 5 + Math.PI) * 15;
	
	scene5lights[6].position.x = Math.sin( timer * 0.7 * 5 + Math.PI) * 15;
	scene5lights[6].position.y = campoints[4][1] + Math.sin( timer * 0.3 * 5 + Math.PI) * 20;
	scene5lights[6].position.z = Math.sin( timer * 0.5 * 5 + Math.PI) * 15;
	
	scene5lights[7].position.x = Math.sin( timer * 0.3 * 5 + Math.PI) * 15;
	scene5lights[7].position.y = campoints[4][1] + Math.sin( timer * 0.7 * 5 + Math.PI) * 20;
	scene5lights[7].position.z = Math.sin( timer * 0.5 * 5 + Math.PI) * 15;
	
	mainshape1.rotation.y += 0.0005;
	
	for(let i=0;i<stars.length/2;i++) {
		stars[i].position.y+=Math.sin(timer*3 + (Math.PI/4))*0.01;
		stars[i].rotation.y+=stars[i].rotationspeed;
	}
	for(let i=stars.length/2;i<stars.length;i++) {
		stars[i].position.x+=Math.cos(timer*3 + (Math.PI/2))*0.01;
		stars[i].rotation.y+=stars[i].rotationspeed;
	}
	
	for (let i=0; i<15; i++) {
		planes[i].position.x = Math.sin(timer*3)*3*(Math.pow(-1,i));
	}
	
	renderer.render (scene,camera);
}
animate();

//------RESIZE------

window.addEventListener("resize", function(){
	anchorCamRotX = (anchorCamRotX*window.innerWidth)/curWinX;
	anchorCamRotY = (anchorCamRotY*window.innerHeight)/curWinY;
	mouseX = (mouseX*window.innerWidth)/curWinX;
	mouseY = (mouseY*window.innerHeight)/curWinY;
	curWinX=window.innerWidth;
	curWinY=window.innerHeight;
	
	camera = new THREE.PerspectiveCamera (75, window.innerWidth/window.innerHeight, 0.1,1000);
	renderer = new THREE.WebGLRenderer({
		canvas: document.querySelector('#bg'),
	});
	renderer.setPixelRatio (window.devicePixelRatio);
	renderer.setSize(window.innerWidth,window.innerHeight);
	camera.position.z = camZ;
	camera.position.y = camY;
	camera.position.x = camX ;
	camera.rotation.z = camRotZ;
	camera.rotation.y = camRotY;
	camera.rotation.x = camRotX;
	renderer.render (scene,camera);
	
	head.rotation.y=0;
	head.rotation.x=0;

}, false);


//------ON CONTAINER SCROLL------

mainContainer.addEventListener("scroll", function(){
	let activePoint=0;
	for (let i=Math.floor(mainContainer.scrollTop); i>0; i--) {
		if (i%window.innerHeight==0) {activePoint = i/window.innerHeight; break;}
	}
	
	if (Math.floor(mainContainer.scrollTop)%window.innerHeight==0) {
		camera.position.x = campoints[activePoint][0];
		camera.position.y = campoints[activePoint][1];
		camera.position.z = campoints[activePoint][2];
		mouseX = window.innerWidth/2;
		mouseY = window.innerHeight/2;
		anchorCamRotX = window.innerWidth/2;
		anchorCamRotY = window.innerHeight/2;
		setRotCamX(campoints[activePoint][3]);
		setRotCamY(campoints[activePoint][4]);
		setRotCamZ(campoints[activePoint][5]);
		
		camX = camera.position.x;
		camY = camera.position.y;
		camZ = camera.position.z;
		
		let bg = "rgb("+campoints[activePoint].color[0]+","+campoints[activePoint].color[1]+","+campoints[activePoint].color[2]+")";
		let bg2 = "rgb("+campoints[activePoint].supColor[0]+","+campoints[activePoint].supColor[1]+","+campoints[activePoint].supColor[2]+")";
		let grad = "linear-gradient(0deg,"+bg+","+bg2+")";
		document.getElementById("bg").style.background=grad;
		
		head.rotation.y=0;
		head.rotation.x=0;
		
		light.intensity = campoints[activePoint].dirLight;
		light2.intensity = campoints[activePoint].hemLight;
	}
	else {
		camera.position.x = campoints[activePoint][0]-((campoints[activePoint][0]-campoints[activePoint+1][0])*((Math.floor(mainContainer.scrollTop)-(window.innerHeight*activePoint))/window.innerHeight));
		camera.position.y = campoints[activePoint][1]-((campoints[activePoint][1]-campoints[activePoint+1][1])*((Math.floor(mainContainer.scrollTop)-(window.innerHeight*activePoint))/window.innerHeight));
		camera.position.z = campoints[activePoint][2]-((campoints[activePoint][2]-campoints[activePoint+1][2])*((Math.floor(mainContainer.scrollTop)-(window.innerHeight*activePoint))/window.innerHeight));
		
		setRotCamX(campoints[activePoint][3]-((campoints[activePoint][3]-campoints[activePoint+1][3])*((Math.floor(mainContainer.scrollTop)-(window.innerHeight*activePoint))/window.innerHeight)));
		setRotCamY(campoints[activePoint][4]-((campoints[activePoint][4]-campoints[activePoint+1][4])*((Math.floor(mainContainer.scrollTop)-(window.innerHeight*activePoint))/window.innerHeight)));
		setRotCamZ(campoints[activePoint][5]-((campoints[activePoint][5]-campoints[activePoint+1][5])*((Math.floor(mainContainer.scrollTop)-(window.innerHeight*activePoint))/window.innerHeight)));
	
		camX = camera.position.x;
		camY = camera.position.y;
		camZ = camera.position.z;
	
		let bg = "rgb("+(campoints[activePoint].color[0]+((campoints[activePoint+1].color[0]-campoints[activePoint].color[0])*((Math.floor(mainContainer.scrollTop)-(window.innerHeight*activePoint))/window.innerHeight)))+","+(campoints[activePoint].color[1]+((campoints[activePoint+1].color[1]-campoints[activePoint].color[1])*((Math.floor(mainContainer.scrollTop)-(window.innerHeight*activePoint))/window.innerHeight)))+","+(campoints[activePoint].color[2]+((campoints[activePoint+1].color[2]-campoints[activePoint].color[2])*((Math.floor(mainContainer.scrollTop)-(window.innerHeight*activePoint))/window.innerHeight)))+")";
		let bg2 = "rgb("+(campoints[activePoint].supColor[0]+((campoints[activePoint+1].supColor[0]-campoints[activePoint].supColor[0])*((Math.floor(mainContainer.scrollTop)-(window.innerHeight*activePoint))/window.innerHeight)))+","+(campoints[activePoint].supColor[1]+((campoints[activePoint+1].supColor[1]-campoints[activePoint].supColor[1])*((Math.floor(mainContainer.scrollTop)-(window.innerHeight*activePoint))/window.innerHeight)))+","+(campoints[activePoint].supColor[2]+((campoints[activePoint+1].supColor[2]-campoints[activePoint].supColor[2])*((Math.floor(mainContainer.scrollTop)-(window.innerHeight*activePoint))/window.innerHeight)))+")";
		let grad = "linear-gradient(0deg,"+bg+","+bg2+")";
		document.getElementById("bg").style.background=grad;
		
		light.intensity = campoints[activePoint].dirLight-((campoints[activePoint].dirLight-campoints[activePoint+1].dirLight)*((Math.floor(mainContainer.scrollTop)-(window.innerHeight*activePoint))/window.innerHeight));
		light2.intensity = campoints[activePoint].hemLight-((campoints[activePoint].hemLight-campoints[activePoint+1].hemLight)*((Math.floor(mainContainer.scrollTop)-(window.innerHeight*activePoint))/window.innerHeight));
	}
}, false);


//ALL THE REST OF THIS SITE'S JS


var spancontainer = document.getElementsByClassName("type-in")[0];

var spanmessages = [];

for (let i=0; i<spancontainer.children.length; i++) {
	spanmessages.push (spancontainer.children[i].innerHTML);
}

var currentSpan = document.createElement("span");
currentSpan.activeSpan = 0;
currentSpan.SpanProgress = 0;

spancontainer.appendChild(currentSpan);

function SpanWriter() {
	if (spanmessages[currentSpan.activeSpan].length > currentSpan.SpanProgress) {
		currentSpan.innerHTML = currentSpan.innerHTML + spanmessages[currentSpan.activeSpan][currentSpan.SpanProgress];
		currentSpan.SpanProgress++;
		setTimeout (SpanWriter,100);
	}
	else {
		currentSpan.activeSpan = (currentSpan.activeSpan + 1) % spanmessages.length;
		currentSpan.SpanProgress = 0;
		setTimeout (SpanDeleter, 2000);
	}
}

function SpanDeleter() {
	if (currentSpan.innerHTML == "") {
		SpanWriter();
	}
	else {
		var tmp = currentSpan.innerHTML.split('');
		tmp.splice(currentSpan.innerHTML.length-1,1);
		currentSpan.innerHTML = tmp.join('');
		setTimeout (SpanDeleter, 50);
	}
}

var spanwriter = SpanWriter();


var blocker = document.createElement("div");
blocker.classList.add("blocker");
var blockerIMG = document.createElement("img");
blocker.appendChild(blockerIMG);
blocker.addEventListener("click", function() {
	blocker.style.display="none";
});
document.body.appendChild(blocker);
window.addEventListener("scroll", function() {
	let sbHeight = window.pageYOffset - (window.innerHeight/10);
	blocker.style.top=sbHeight+"px";
});
var galleryIMGs= document.getElementsByClassName("galleryable");
for (let i=0; i<galleryIMGs.length; i++) {
	galleryIMGs[i].addEventListener("click", function() {
		blocker.style.display="flex";
		blockerIMG.src=this.src;
		let sbHeight = window.pageYOffset - (window.innerHeight/10);
		blocker.style.top=sbHeight+"px";
	});
}

var toContacts = document.getElementsByClassName("toContacts");
for (let i=0; i<toContacts.length; i++) {
	toContacts.addEventListener("click", function(){
		document.getElementsByClassName("container")[0].scrollTo(scenes[4]);
	}, false);
}

var toOffers = document.getElementsByClassName("toOffers");
for (let i=0; i<toContacts.length; i++) {
	toContacts.addEventListener("click", function(){
		document.getElementsByClassName("container")[0].scrollTo(scenes[3]);
	}, false);
}