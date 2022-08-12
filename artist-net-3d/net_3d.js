//=================== config variables ========================
var isRotationActive = true;
var angle = 0, removeNodes = false, counter = 0;
var imgWidth = window.innerWidth
var imgHeight= window.innerHeight
//=============================================================

const scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 50, imgWidth/ imgHeight, 0.5, 12500);
camera.position.set(-4500, -680, 2765)
//{x: -5936.879752460709, y: -604.7473074495978, z: 2145.0173291864994}
//x: -1574.2348525577263
//y: -860.8348281858166
//z: -4967.012410665374

scene.add(camera)
scene.add(new THREE.AmbientLight(0x404040,3))

const renderer = new THREE.WebGLRenderer({preserveDrawingBuffer:true, antialias:true});
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

controls = new THREE.OrbitControls( camera, renderer.domElement, renderer.domElement);
controls.autoRotate = true

//speed/10 = degrees per frame (if speed=2, degrees = 0.2)
//controls.autoRotateSpeed = 10*(360/endFrame);
controls.autoRotateSpeed = 1.5

const objLoader = new THREE.ObjectLoader();
const node_group = new THREE.Group();
const link_group = new THREE.Group();

var component_colors = {3:0x7074b5,
  29:0xf9c016,
  57:0xf38168,
  15:0x44bda2,
  53:0x81d2ee,
  296:0x98ca3e,
  25:0x338456,
  43:0xe4be7b,
  22:0x224192,
  238:0x60919f,
  // beyond top 10
  71: 0xb5942f,
  77:0xc15a3e,
  9:0xadd9e2,
  51:0xf16b94,
  // new additions
  73:0xf0e68c,
  42:0xbd42aa,
  70:0xdb7093,
  211:0xdaa520,
  72:0x8a2be2,
  24:0x008080,
  // +5 = 25
  45:0x3cb371,
  46:0x00ff00,
  76:0xffff00,
  6:0xff7f7f,
  4:0xff0080,
  // +5 = 30
  143: 0x00fa9a,
  48:0xdda0dd,
  177:0x1e90ff,
  222:0xffa500,
  74:0x2f4f4f,
  //+20 = 50
  10:0x7074b5,
  60:0xa9b31d,
  100:0x470101,
  84:0xffa6a6,
  237:0x1d6603,
  84:0x028cd1,
  2:0xa9b31d,
  12:0xd4c67b,
  8:0x99882f,
  93:0x850047,
  94:0xb82f06,
  99:0x94b00b,
  144:0x8fffe1,
  36:0xe7ed2d,
  204:0xebc9ff,
  196:0x6f02b0,
  7:0x30f2d8,
  166:0xf20a0e,
  5:0x74a6e8,
  107:0xbd42aa,
  119:0x6f8059
}

// label rendeer

const labelRenderer = new THREE.CSS2DRenderer();
labelRenderer.setSize(innerWidth, innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement);

  // add labels
const labelDiv = document.createElement('div');
labelDiv.className = 'label';
labelDiv.style.marginTop = '-1em';
const label = new THREE.CSS2DObject(labelDiv);
label.visible = false;
scene.add(label);

var objMapperNodes = {};
for(var i = 0; i<net_obj['nodes'].length; i++){
  var s = net_obj['nodes'][i]
  var key = Object.keys(s)[6]
  var s_parsed = objLoader.parse(s['__threeObj'])

  //s_parsed.material.emmisive = new THREE.Color(0xeaa9a9)
  s_parsed.material.transparent = false
  s_parsed.material.opacity = 1

  //s_parsed.matrial.emissive = new THTREE.Color(0x404040)
  //s_parsed.material.emmisive = new THREE.Color(0xeaa9a9)

  if(net_obj['nodes'][i]['component'] in component_colors){
    s_parsed.material.color = new THREE.Color(component_colors[net_obj['nodes'][i]['component']])
    //s_parsed.material.emmisive = new THREE.Color(0xeaa9a9)
  }

  // change sphere size if no art sold
  if(net_obj['nodes'][i]['n_art_sold'] == 0){
    s_parsed.scale.set(1.1,1.1,1.1)
  }

  // update vars
  s_parsed.visible=true
  s_parsed.name = net_obj['nodes'][i]['label']
  s_parsed.object_type = 'node'
  //s_parsed.material.transparent = false
  //  s_parsed.material.emmisive = new THREE.Color(0xeaa9a9)

  //  if(s_parsed.material.opacity<1){
  //    s_parsed.material.opacity=0.5
  //  }
  //  s_parsed.material.opacity=1
  //  all_nodes[net_obj['nodes'][i]['id']] = net_obj['nodes'][i]
  objMapperNodes[net_obj['nodes'][i]['id']] = s_parsed
  node_group.add(s_parsed)
}

var objMapperLinks = {};
for(var i = 0; i<net_obj['links'].length; i++){
  //net_obj['links'][i]['time'] = Math.max(node_id_time[net_obj['links'][i]['source']['id']],
  //node_id_time[net_obj['links'][i]['target']['id']])

  net_obj['links'][i].width=6

  var s = net_obj['links'][i]
  var s_parsed = objLoader.parse(s['__lineObj'])

  //update vars
  s_parsed.visible = true
  //s_parsed.material.transparent = false

  // update component color
  if(net_obj['links'][i]['source']['component'] in component_colors){
    s_parsed.material.color = new THREE.Color(component_colors[net_obj['links'][i]['source']['component']])
    //s_parsed.material.emmisive = new THREE.Color(0xeaa9a9)
  }else{
    s_parsed.material.opacity = 0.5
    net_obj['links'][i].opacity=0.5
  }

  s_parsed.object_type = 'link'

  //if(s_parsed.material.opacity<1){
  //  s_parsed.material.opacity=0.5
  //}
  //s_parsed.material.opacity=1
  //s_parsed.material.transparent = false
  //  console.log(s['__lineObj']["object"])
  objMapperLinks[i] = s_parsed
  //scene.add(s_parsed)
  link_group.add(s_parsed)
}

setTimeout(console.log('adding links..'),
          scene.add(link_group), 100);

// ambient lighting
node_group.add(new THREE.AmbientLight(0x404040,2))

setTimeout(console.log('adding nodes...'),
           scene.add(node_group), 1);

let INTERSECTED;
var secondloc = false;

// Track mouse movement to pick objects
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', ({ clientX, clientY }) => {
    const { innerWidth, innerHeight } = window;

    mouse.x = (clientX / innerWidth) * 2 - 1;
    mouse.y = -(clientY / innerHeight) * 2 + 1;

    if(!secondloc) secondloc=true;
});

window.addEventListener('pointerdown',({event}) =>{
  raycaster.setFromCamera(mouse, camera);

  const [clicked] = raycaster.intersectObjects( scene.children);

  if (clicked && clicked.object.object_type == 'node'){
    console.log("clicked")
    user_clicked = clicked.object.name
    window.open('https://foundation.app/'+user_clicked, target='_blank')
  }
})

function animate(){
  // Pick objects from view using normalized mouse coordinates
  raycaster.setFromCamera(mouse, camera);

  const [hovered] = raycaster.intersectObjects(scene.children);

  if (secondloc && hovered && hovered.object.object_type == 'node') {
    console.log('hovered...')

    // Setup label
    renderer.domElement.className = 'hovered';
    label.visible = true;
    labelDiv.textContent = '@'+hovered.object.name;
    label.position.set(hovered.object.position.x,
                      hovered.object.position.y,
                      hovered.object.position.z)

    if ( INTERSECTED != hovered.object ) {

        if ( INTERSECTED ){
          INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
          INTERSECTED.scale.set(INTERSECTED.currentscale, INTERSECTED.currentscale, INTERSECTED.currentscale );;
        }

        INTERSECTED = hovered.object;
        INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
        INTERSECTED.material.emissive.setHex( 0xff0000 );

        INTERSECTED.currentscale = INTERSECTED.scale.x;
        INTERSECTED.scale.set( INTERSECTED.currentscale*1.2,
                              INTERSECTED.currentscale*1.2,
                              INTERSECTED.currentscale*1.2);
    }

  } else {
    // Reset label
    renderer.domElement.className = '';
    label.visible = false;
    labelDiv.textContent = '';

    if ( INTERSECTED ){
      INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
      INTERSECTED.scale.set(INTERSECTED.currentscale, INTERSECTED.currentscale, INTERSECTED.currentscale );
    }
    INTERSECTED = null;
  }

  renderer.render( scene, camera );
  controls.update()
  requestAnimationFrame( animate )

  // Render labels
  labelRenderer.render(scene, camera);
}
animate();


// resize window
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

window.addEventListener( 'resize', onWindowResize );


// pause rotation
document.getElementById('rotationToggle').addEventListener('click', event => {
  controls.autoRotate = !controls.autoRotate;
  event.target.innerHTML = `${(controls.autoRotate ? 'Pause' : 'Resume')} Rotation`;
});

// hide links
var showlinks = true
document.getElementById('linksToggle').addEventListener('click', event => {
  showlinks = !showlinks;
  for(var i in objMapperLinks){
    if(showlinks){
      objMapperLinks[i].visible = true
    }else{
      objMapperLinks[i].visible = false
    }
  }
  event.target.innerHTML = `${(showlinks ? 'Hide' : 'Show')} Links`;
});

