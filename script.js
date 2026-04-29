let scene,camera,renderer,car;
let speed=0;
let steer=0;
let keys={};

init();
animate();

function init(){

scene=new THREE.Scene();
scene.fog=new THREE.Fog(0xbfdfff,80,700);

camera=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,0.1,2000);

renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth,innerHeight);
document.body.appendChild(renderer.domElement);

// llums
const sun=new THREE.DirectionalLight(0xffffff,1.2);
sun.position.set(100,150,50);
scene.add(sun);
scene.add(new THREE.AmbientLight(0xffffff,0.6));

// terra
const ground=new THREE.Mesh(
new THREE.PlaneGeometry(3000,3000),
new THREE.MeshStandardMaterial({color:0x6ea85d})
);
ground.rotation.x=-Math.PI/2;
scene.add(ground);

// carretera principal
for(let i=0;i<10;i++){
let road=new THREE.Mesh(
new THREE.PlaneGeometry(18,300),
new THREE.MeshStandardMaterial({color:0x333333})
);
road.rotation.x=-Math.PI/2;
road.position.z=-i*300;
scene.add(road);
}

// línies carretera
for(let i=0;i<100;i++){
let line=new THREE.Mesh(
new THREE.BoxGeometry(0.5,0.1,8),
new THREE.MeshStandardMaterial({color:0xffffff})
);
line.position.set(0,0.05,-i*20);
scene.add(line);
}

// edificis estil Chamonix
for(let i=0;i<120;i++){
let h=5+Math.random()*8;
let color=[0xc9b18a,0x8f6b4a,0xd8d8d8][Math.floor(Math.random()*3)];

let b=new THREE.Mesh(
new THREE.BoxGeometry(8,h,8),
new THREE.MeshStandardMaterial({color})
);

b.position.x=(Math.random()>0.5?1:-1)*(20+Math.random()*18);
b.position.y=h/2;
b.position.z=-i*18;
scene.add(b);

// sostre
let roof=new THREE.Mesh(
new THREE.ConeGeometry(6,3,4),
new THREE.MeshStandardMaterial({color:0x5c2f12})
);
roof.position.set(b.position.x,h+1.5,b.position.z);
roof.rotation.y=Math.PI/4;
scene.add(roof);
}

// botigues
for(let i=0;i<20;i++){
let shop=new THREE.Mesh(
new THREE.BoxGeometry(10,5,10),
new THREE.MeshStandardMaterial({color:0xffd28a})
);
shop.position.set(25,2.5,-i*60);
scene.add(shop);
}

// semàfors
for(let i=0;i<10;i++){
let pole=new THREE.Mesh(
new THREE.BoxGeometry(0.5,6,0.5),
new THREE.MeshStandardMaterial({color:0x444444})
);
pole.position.set(10,3,-i*120);
scene.add(pole);

let light=new THREE.Mesh(
new THREE.BoxGeometry(1,2,1),
new THREE.MeshStandardMaterial({color:0xff0000})
);
light.position.set(10,5,-i*120);
scene.add(light);
}

// muntanyes
for(let i=0;i<40;i++){
let m=new THREE.Mesh(
new THREE.ConeGeometry(30,60,6),
new THREE.MeshStandardMaterial({color:0xffffff})
);
m.position.set((Math.random()-0.5)*800,30,-i*70);
scene.add(m);
}

// cotxe
car=new THREE.Group();

let body=new THREE.Mesh(
new THREE.BoxGeometry(2.2,1,4.5),
new THREE.MeshStandardMaterial({color:0xffffff})
);
body.position.y=1;
car.add(body);

let top=new THREE.Mesh(
new THREE.BoxGeometry(1.8,0.8,2),
new THREE.MeshStandardMaterial({color:0x99ccff})
);
top.position.set(0,1.7,-0.2);
car.add(top);

scene.add(car);

window.addEventListener("keydown",e=>keys[e.key]=true);
window.addEventListener("keyup",e=>keys[e.key]=false);
window.addEventListener("resize",resize);

}

function animate(){
requestAnimationFrame(animate);

// conducció
if(keys["ArrowUp"]) speed+=0.015;
if(keys["ArrowDown"]) speed-=0.015;

speed*=0.985;

if(keys["ArrowLeft"]) steer=0.03;
else if(keys["ArrowRight"]) steer=-0.03;
else steer=0;

car.rotation.y+=steer*(speed*8);
car.position.x-=Math.sin(car.rotation.y)*speed;
car.position.z-=Math.cos(car.rotation.y)*speed;

// càmera vista frontal
camera.position.x=car.position.x;
camera.position.y=4;
camera.position.z=car.position.z+9;
camera.lookAt(car.position.x,2,car.position.z-8);

renderer.render(scene,camera);
}

function resize(){
camera.aspect=innerWidth/innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(innerWidth,innerHeight);
}
