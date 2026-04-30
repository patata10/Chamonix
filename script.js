let scene, camera, renderer;
let car, wheels=[];
let speed=0, steer=0;
let keys={};
let trafficLights=[];

init();
animate();

function init(){

scene=new THREE.Scene();
scene.fog=new THREE.Fog(0xbfdfff,50,600);

camera=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,0.1,2000);

renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth,innerHeight);
document.body.appendChild(renderer.domElement);

// LLUM
const sun=new THREE.DirectionalLight(0xffffff,1.2);
sun.position.set(100,150,50);
scene.add(sun);
scene.add(new THREE.AmbientLight(0xffffff,0.5));

// TERRA
const ground=new THREE.Mesh(
new THREE.PlaneGeometry(2000,2000),
new THREE.MeshStandardMaterial({color:0x6ea85d})
);
ground.rotation.x=-Math.PI/2;
scene.add(ground);

// CARRETERA CORBA
createCurvedRoad();

// ROTONDA
createRoundabout();

// PASSOS DE ZEBRA
createCrosswalk(0,-30);
createCrosswalk(20,-120);

// EDIFICIS
createBuildings();

// SEMÀFORS
createTrafficLight(5,-30);
createTrafficLight(-5,-120);

// COTXE
createCar();

window.addEventListener("keydown",e=>keys[e.key]=true);
window.addEventListener("keyup",e=>keys[e.key]=false);
window.addEventListener("resize",resize);
}

function createCurvedRoad(){
for(let i=0;i<50;i++){
let road=new THREE.Mesh(
new THREE.PlaneGeometry(14,20),
new THREE.MeshStandardMaterial({color:0x333333})
);
road.rotation.x=-Math.PI/2;
road.position.z=-i*20;
road.position.x=Math.sin(i*0.3)*10;
scene.add(road);
}
}

function createRoundabout(){
let geo=new THREE.RingGeometry(8,14,32);
let mat=new THREE.MeshStandardMaterial({color:0x333333});
let r=new THREE.Mesh(geo,mat);
r.rotation.x=-Math.PI/2;
r.position.set(0,0,-200);
scene.add(r);
}

function createCrosswalk(x,z){
for(let i=0;i<6;i++){
let line=new THREE.Mesh(
new THREE.BoxGeometry(3,0.1,1),
new THREE.MeshStandardMaterial({color:0xffffff})
);
line.position.set(x,0.05,z+i*2);
scene.add(line);
}
}

function createBuildings(){
for(let i=0;i<80;i++){
let h=5+Math.random()*6;
let house=new THREE.Mesh(
new THREE.BoxGeometry(6,h,6),
new THREE.MeshStandardMaterial({color:0x8b6f47})
);
house.position.set((Math.random()>0.5?1:-1)*(20+Math.random()*15),h/2,-i*20);
scene.add(house);

// sostre
let roof=new THREE.Mesh(
new THREE.ConeGeometry(5,3,4),
new THREE.MeshStandardMaterial({color:0x5c2f12})
);
roof.position.set(house.position.x,h+1.5,house.position.z);
roof.rotation.y=Math.PI/4;
scene.add(roof);
}
}

function createTrafficLight(x,z){
let pole=new THREE.Mesh(
new THREE.BoxGeometry(0.4,5,0.4),
new THREE.MeshStandardMaterial({color:0x444})
);
pole.position.set(x,2.5,z);
scene.add(pole);

let light=new THREE.Mesh(
new THREE.BoxGeometry(1,2,1),
new THREE.MeshStandardMaterial({color:0xff0000})
);
light.position.set(x,5,z);
scene.add(light);

trafficLights.push({mesh:light,state:0,timer:0});
}

function createCar(){
car=new THREE.Group();

let body=new THREE.Mesh(
new THREE.BoxGeometry(2.2,1,4),
new THREE.MeshStandardMaterial({color:0xffffff})
);
body.position.y=1;
car.add(body);

let cabin=new THREE.Mesh(
new THREE.BoxGeometry(1.6,0.8,2),
new THREE.MeshStandardMaterial({color:0x99ccff})
);
cabin.position.set(0,1.6,-0.3);
car.add(cabin);

// rodes
for(let i=0;i<4;i++){
let wheel=new THREE.Mesh(
new THREE.CylinderGeometry(0.5,0.5,0.5,16),
new THREE.MeshStandardMaterial({color:0x111})
);
wheel.rotation.z=Math.PI/2;

let x=(i<2?-1:1);
let z=(i%2?-1.5:1.5);

wheel.position.set(x,0.5,z);
car.add(wheel);
wheels.push(wheel);
}

scene.add(car);
}

function animate(){
requestAnimationFrame(animate);

// moviment
if(keys["ArrowUp"]) speed+=0.01;
if(keys["ArrowDown"]) speed-=0.01;

speed*=0.98;

if(keys["ArrowLeft"]) steer=0.02;
else if(keys["ArrowRight"]) steer=-0.02;
else steer=0;

// gir més realista
car.rotation.y+=steer*(speed*5);

// moviment
car.position.x-=Math.sin(car.rotation.y)*speed;
car.position.z-=Math.cos(car.rotation.y)*speed;

// rodes girant
wheels.forEach(w=>w.rotation.x+=speed*2);

// càmera
camera.position.x=car.position.x;
camera.position.y=4;
camera.position.z=car.position.z+8;
camera.lookAt(car.position.x,2,car.position.z-6);

// SEMÀFORS
trafficLights.forEach(t=>{
t.timer++;

if(t.timer>200){
t.state=1-t.state;
t.timer=0;

t.mesh.material.color.set(t.state?0x00ff00:0xff0000);
}
});

renderer.render(scene,camera);
}

function resize(){
camera.aspect=innerWidth/innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(innerWidth,innerHeight);
}
