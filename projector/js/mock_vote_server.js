battlescape.votes = {};

(function(external, battlescape){
// -----------------------------------------------------------------------------

var votes = {};


var keys = {49:'1', 50:'2', 51:'3', 52:'4', 32:'SPACE'};
window.addEventListener('keydown', eventKeyDown, true);
function eventKeyDown(event) {
    if (event.keyCode in keys) {
        console.log(keys[event.keyCode]);
        event.preventDefault();
    }
}



// Init ------------------------------------------------------------------------


// External --------------------------------------------------------------------
external.votes = votes;

}(battlescape.votes, battlescape));