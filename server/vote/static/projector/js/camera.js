battlescape.cameras = {};

(function(external, graphics){
// -----------------------------------------------------------------------------

var camera = graphics.camera;

var cameras = {
    pan_horizontal: {
        init: function() {
            camera.position.x = -1000;
            camera.position.y =   500;
            camera.position.z =  1600;
            this.target = new THREE.Vector3();
            this.target.y = 300;
        },
        update: function() {
            camera.position.x += 1;
            camera.lookAt(this.target);
            if (camera.position.x > 1000) {
                new_camera();
            }
        }
    },
    hover_boss: {
        init: function() {
            camera.position.x = -1600;
            camera.position.y =   50;
            camera.position.z =  1200;
            this.target = new THREE.Vector3();
            this.target.y =  300;
            this.target.x = -400;
            this.target.z =    0;
        },
        update: function() {
            camera.position.x += 0.5;
            camera.position.y += 0.1;
            camera.position.z += 0.3;
            camera.lookAt(this.target);
            if (camera.position.x > -1300) {
                new_camera();
            }
        }
    },
    foot_pass: {
        init: function() {
            camera.position.x = 704;
            camera.position.y = 36;
            camera.position.z = 771;
            this.target = new THREE.Vector3();
            this.target.y = 300;
            this.target.x = 0;
        },
        update: function() {
            camera.position.x += 0.1;
            camera.position.z += 0.01;
            camera.lookAt(this.target);
            if (camera.position.x > 750) {
                new_camera();
            }
        }
    },
    
    _into_pan_players: {
        init: function() {
            camera.position.x =  -400;
            camera.position.y =   100;
            camera.position.z =  -200;
            camera.rotation.x = Math.PI * 4;
            camera.rotation.y = 0;
            camera.rotation.z = 0;
        },
        update: function() {
            camera.position.x += 3;
            camera.position.z += 4;
            if (camera.position.x > 700) {
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
var camera_control_previous;

function new_camera(camera_name) {
    camera_control_previous = camera_control;
    if (_.has(cameras, camera_name)) {
        camera_control = cameras[camera_name];
    }
    else {
        camera_control = _.sample(_.reject(get_public_cameras_list(), function(cc){return cc==camera_control_previous}));
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