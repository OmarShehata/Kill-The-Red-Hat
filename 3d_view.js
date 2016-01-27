$(function(){
	//Initialize Three.js
	var camera, scene, renderer;
    var effect, controls;
    var element, container;

    var clock = new THREE.Clock();

    init();
    animate();

    var circleArray = []
    var sphereArray = []
    function GetPosition(circle){
    	//Transforms from the 2d plane to the 3d plane
    	var x = circle.x - 400;//Minus half the assumed screen height and width in the 2d plane
    	var y = circle.y - 300;//Becuase we want the 3d viewer to see thigns in the center
    	x /= 10;
    	y /= 10;
    	return {x:x,y:y}
    }

    function CreateSpheres(){

    	for(var i=0;i<circleArray.length;i++){
    		var circle = circleArray[i]
    		var geometry = new THREE.SphereGeometry( 5, 32, 32 );
    		var color = 0xff0000;
    		if(circle.type == "red") color = 0xffff00;
			var material = new THREE.MeshBasicMaterial( {color: color} );
			var sphere = new THREE.Mesh( geometry, material );
			scene.add( sphere );
			sphere.position.x = GetPosition(circle).x;
			sphere.position.z = GetPosition(circle).y;
			sphere.position.y = 5;
			sphereArray.push(sphere)
    	}
    }
    function UpdateSpheres(){
    	for(var i=0;i<sphereArray.length;i++){
    		var circle = circleArray[i];
    		var sphere = sphereArray[i];
    		sphere.position.x = GetPosition(circle).x;
			sphere.position.z = GetPosition(circle).y;
    	}
    }

    function init() {
      renderer = new THREE.WebGLRenderer();
      element = renderer.domElement;
      container = document.getElementById('threejs_container');
      container.appendChild(element);

      effect = new THREE.StereoEffect(renderer);

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
      camera.position.set(0, 10, 0);
      scene.add(camera);

      controls = new THREE.OrbitControls(camera, element);
      controls.rotateUp(Math.PI / 4);
      controls.target.set(
        camera.position.x + 0.1,
        camera.position.y,
        camera.position.z
      );
      controls.noZoom = true;
      controls.noPan = true;

      function setOrientationControls(e) {
        if (!e.alpha) {
          return;
        }

        controls = new THREE.DeviceOrientationControls(camera, true);
        controls.connect();
        controls.update();

        element.addEventListener('click', fullscreen, false);

        window.removeEventListener('deviceorientation', setOrientationControls, true);
      }
      window.addEventListener('deviceorientation', setOrientationControls, true);


      var light = new THREE.HemisphereLight(0x777777, 0x000000, 0.6);
      scene.add(light);

      var texture = THREE.ImageUtils.loadTexture(
        'textures/patterns/checker.png'
      );
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat = new THREE.Vector2(50, 50);
      texture.anisotropy = renderer.getMaxAnisotropy();

      var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0xffffff,
        shininess: 20,
        shading: THREE.FlatShading,
        map: texture
      });

      var geometry = new THREE.PlaneGeometry(1000, 1000);

      var mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 2;
      scene.add(mesh);

      window.addEventListener('resize', resize, false);
      setTimeout(resize, 1);

      //Create boundaries
      function CreateRect(color,x,y,a,b,c){
      	var geometry = new THREE.BoxGeometry( a,b,c );
		var material = new THREE.MeshBasicMaterial( { color: color } );

		mesh = new THREE.Mesh( geometry, material );
		scene.add( mesh );
		mesh.position.x = x;
		mesh.position.z = y;
      }
      CreateRect(0xff0000,100,0,10,100,100)//Red is right
      CreateRect(0x00ff00,-100,0,10,100,100)//green is left
      CreateRect(0x0000ff,0,100,100,100,10)//blue is bottom
      CreateRect(0xff00ff,0,-100,100,100,10)//pink is top of screen
    }

    function resize() {
      var width = container.offsetWidth;
      var height = container.offsetHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      effect.setSize(width, height);
    }

    function update(dt) {
      resize();

      camera.updateProjectionMatrix();

      controls.update(dt);
    }

    function render(dt) {
      effect.render(scene, camera);
    }

    function animate(t) {
      requestAnimationFrame(animate);

      update(clock.getDelta());
      render(clock.getDelta());
    }

    function fullscreen() {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      }
    }


	//Get the circle positions from the server
	var socket = io();
	var circleArray = []
	socket.on('circle-array', function(msg){
		circleArray = JSON.parse(msg);
		//Update circle positions
		if(sphereArray.length == 0){
			CreateSpheres()
		} else {
			UpdateSpheres()
		}
	});
	
})