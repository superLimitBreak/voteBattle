battlescape.cameras = {};

(function(external, graphics){
// -----------------------------------------------------------------------------

var camera = graphics.camera;

var cameras = {
    pan_horizontal: {
        init: function() {
            camera.position.x = -1000;
            camera.position.y =   300;
            camera.position.z =  1500;
            this.target = new THREE.Vector3();
        },
        update: function() {
            camera.position.x += 1;
            camera.lookAt(this.target);
            if (camera.position.x > 1000) {
                new_camera();
            }
        }
    },
    
    _into_pan_players: {
        init: function() {
            camera.position.x =  -600;
            camera.position.y =   100;
            camera.position.z =  -200;
            camera.rotation.x = Math.PI * 4;
            camera.rotation.y = 0;
            camera.rotation.z = 0;
        },
        update: function() {
            camera.position.x += 3;
            camera.position.z += 4;
            if (camera.position.x > 500) {
                new_camera();
            }
        }
    }
}

function get_public_cameras_list() {
    var public_cameras = []
    _.each(cameras, function(value, key, list){
        if (key.charAt(0) != '_') {
            public_cameras.push(value);
        }
    });
    return public_cameras;
}

var camera_control;

function new_camera(camera_name) {
    if (_.has(cameras, camera_name)) {
        camera_control = cameras[camera_name];
    }
    else {
        camera_control = _.sample(get_public_cameras_list());
    }
    camera_control.init();
}

function update() {
    if (camera_control) {
        camera_control.update();
    }
}

function stop() {
    camera_control = undefined;
}

external.update = update;
external.stop = stop;
external.new_camera = new_camera;

}(battlescape.cameras, graphics));

animation_update_functions.push(battlescape.cameras.update);