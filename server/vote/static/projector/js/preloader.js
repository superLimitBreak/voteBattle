(function(external, battlescape){

var image_path_characters = 'images/characters/';

function preload_images() {
    var images = _.filter(
                    _.flatten(
                        _.chain(battlescape.data.characters)
                         .pluck('images')
                         .map(function(images){
                            return _.values(images)
                        }).value()
                    ),
                    function(image) {return image}
                );
    _.each(images, function(image, index, list){
        console.log('Preload '+image);
        var image_element = new Image();
        image_element.src = image_path_characters+image;
    });
}


// Init ------------------------------------------------------------------------

preload_images();
// Export ----------------------------------------------------------------------


}(null, battlescape));