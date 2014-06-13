(function(external, battlescape){

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
        new Image(image);
    });
}


// Init ------------------------------------------------------------------------

preload_images();
// Export ----------------------------------------------------------------------


}(null, battlescape));