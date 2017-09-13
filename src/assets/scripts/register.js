var a = 10;

var form = new Vue({
    el: '#form',
    data: {
        show: true
    },
    methods: {
        closeForm: function() {
            this.show = false;
        }
    }
})


var app = new PIXI.Application(window.innerWidth, window.innerHeight, {backgroundColor : 0x000000, view: document.getElementById('pixiCanvas')});
var map = PIXI.Sprite.fromImage('assets/images/test.png');
app.stage.addChild(map);