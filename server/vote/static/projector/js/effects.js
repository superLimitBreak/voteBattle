battlescape = window.battlescape || {};

battlescape.effects = {};

(function(external, graphics, battlescape){

var scene = graphics.scene;

function rainbow_beam() {
    console.log("RAINBOW BEAM!!!");
    var beam_objects = []
    for (var i = 0 ; i<50 ; i++) {
        var dom = document.createElement('div');
        //dom.style['z-index'] = 1;
        dom.style['background-color'] = '#'+_.sample(['FF0000','FFFF00','00FF00','0000FF','FF00FF','00FFFF']);
        dom.style.width = '200px';
        dom.style.height = '40px';
        
        var dom_3d = new THREE.CSS3DObject( dom );
        dom_3d.position.x = _.random(-2000, -400);
        dom_3d.position.y = _.random(0, 600);
        dom_3d.position.z = _.random(-600, 600);
        beam_objects.push(dom_3d);
        scene.add(dom_3d);
        
        function tween_beam(dom, dom_3d) {
            var target = _.clone(dom_3d.position);
            target.x += 3000;
            var tween = new TWEEN.Tween(dom_3d.position)
                .to(target, _.random(5,10) * 300)
                .onComplete(function() {
                    scene.remove(dom_3d);
                })
            ;
            tween.easing(
                TWEEN.Easing.Linear.None
            ).start();    
        }
        tween_beam(dom, dom_3d);
        
    }
}


// Init ------------------------------------------------------------------------


// External --------------------------------------------------------------------

external.raninbow_beam = rainbow_beam;

}(battlescape.effects, graphics, battlescape));