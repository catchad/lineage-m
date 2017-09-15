var a = 10;

var form = new Vue({
    el: '#form',
    data: {
        show: false
    },
    methods: {
        closeForm: function () {
            this.show = false;
        }
    }
})



var mapPosition = 0;
var app = new PIXI.Application(window.innerWidth, window.innerHeight, { backgroundColor: 0x000000, view: document.getElementById('pixiCanvas') });
var all = [];
var loader = new PIXI.loaders.Loader();
loader.add('map', 'assets/images/1-2.png')
      .add('map2', 'assets/images/2-2.png')
      .add('character1', 'assets/images/character1.png')
      .add('character2', 'assets/images/character2.png')
      .add('character3', 'assets/images/character3.png')
      .add('character4', 'assets/images/character4.png')
      .add('character5', 'assets/images/character5.png')
      .add('character6', 'assets/images/character6.png')
      .add('character7', 'assets/images/character7.png')
      .add('character8', 'assets/images/character8.png');
loader.load((loader, resources) => {
    // resources.bunny
    // resources.spaceship
    var container = new PIXI.Container();
    // container.addChild(sprite);
    container.pivot.set(0.5, 0.5);
    container.x = window.innerWidth/2;
    container.y = window.innerHeight/2;
    app.stage.addChild(container);





    var map = new PIXI.Sprite(resources.map.texture);
    map.anchor.set(0.5);
    map.x = 0;
    map.y = 0;
    container.addChild(map);

    var map2 = new PIXI.Sprite(resources.map2.texture);
    map2.anchor.set(0.5);
    map2.x = map.x + resources.map.texture.width / 2;
    map2.y = map.y - resources.map.texture.height / 2;
    container.addChild(map2);

    var angle = angleBetween({x:map.x, y:map.y}, {x:map2.x, y:map2.y});

    var character1 = new PIXI.Sprite(resources.character1.texture);
    character1.anchor.set(0.5, 1);
    character1.x = 0;
    character1.y = 0;
    container.addChild(character1);

    // var character2 = new PIXI.Sprite(resources.character1.texture);
    // character2.anchor.set(0.5, 1);
    // var p = getPoint(angle, 50);
    // character2.x = window.innerWidth / 2 + p.x;
    // character2.y = window.innerHeight / 2 + p.y;
    // app.stage.addChild(character2);
    // console.log( resources['character7'].texture);
    var character2 = new PIXI.Sprite(resources.character7.texture);
    character2.anchor.set(0.5, 1);
    var p = getPoint(-angle, 60);
    character2.x = 0 + p.x;
    character2.y = 0 + p.y;
    container.addChild(character2);

    var character3 = new PIXI.Sprite(resources.character5.texture);
    character3.anchor.set(0.5, 1);
    var p = getPoint(-angle + Math.PI, 60);
    character3.x = 0 + p.x;
    character3.y = 0 + p.y;
    container.addChild(character3);

    var sprites = new PIXI.particles.ParticleContainer(50000, {
        scale: true,
        position: true,
        rotation: true,
        uvs: true,
        alpha: true
    });
    container.addChild(sprites);


    for( var i=1; i<5; i++ ) {
        var p = getPoint(angle, 50*i);
        
        var newCharacter = new PIXI.Sprite(resources['character1'].texture);
        newCharacter.anchor.set(0.5, 1);
        newCharacter.x = character2.x + p.x;
        newCharacter.y = character2.y + p.y;
        // container.addChild(newCharacter);
        // newCharacter.cacheAsBitmap = true;
        // newCharacter.visible = false;
        sprites.addChild(newCharacter);
        all.push(newCharacter);
    }

    for( var i=1; i<5; i++ ) {
        var p = getPoint(angle, 50*i);

        var newCharacter = new PIXI.Sprite(resources['character2'].texture);
        newCharacter.anchor.set(0.5, 1);
        newCharacter.x = p.x;
        newCharacter.y = p.y;
        // newCharacter.cacheAsBitmap = true;

        // newCharacter.visible = false;
        // container.addChild(newCharacter);
        sprites.addChild(newCharacter);
        all.push(newCharacter);
    }

    for( var i=1; i<5; i++ ) {
        var p = getPoint(angle, 50*i);

        var newCharacter = new PIXI.Sprite(resources['character3'].texture);
        newCharacter.anchor.set(0.5, 1);
        newCharacter.x = character3.x + p.x;
        newCharacter.y = character3.y + p.y;
        // newCharacter.cacheAsBitmap = true;
        // newCharacter.visible = false;
        // container.addChild(newCharacter);
        sprites.addChild(newCharacter);
        all.push(newCharacter);
    }
    // container.scale.x = container.scale.y = 2;


    function angleBetween(point1, point2) {
        return Math.atan2( point2.x - point1.x, point2.y - point1.y );
    }


    // var dist = getDistance(resources.map.texture.width / 2, resources.map.texture.height / 2);
    // console.log(dist);
    // var aa = getPoint(0, 400);
    // map2.x = window.innerWidth / 2 + aa.x;
    // map2.y = window.innerHeight / 2 + aa.y;
    // console.log(aa);

    function getDistance(a, b) {
        return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    }
    function getPoint(theta, r) {
        var x = (r *Math.sin(theta));
        var y = (r *Math.cos(theta));
        return {x:x, y:y};
    }


    window.addEventListener('mousewheel', function(event) {
        // console.log( character2.worldTransform.tx);
        // console.log( all[0].worldTransform.tx, all[0].worldTransform.ty);
        // for( var i=0; i<all.length; i++ ) {
        //     if( all[i].worldTransform.tx > 0 && all[i].worldTransform.tx < window.innerWidth && all[i].worldTransform.ty > 0 && all[i].worldTransform.ty < window.innerHeight ) {
        //         all[i].visible = true;
        //         console.log("true");
        //     } else {
        //         all[i].visible = false;
        //     }
            
        // }

        if( event.deltaY > 0 ) {
            mapPosition-=60;

        } else {
            mapPosition+=60;
        }
        var p = getPoint(angle, mapPosition);
        TweenMax.to(container, 0.5, {x:window.innerWidth/2 + p.x, y:window.innerHeight/2 + p.y} );
        // container.x = window.innerWidth/2 + p.x;
        // container.y = window.innerHeight/2 + p.y;

    })

});

// var texture = PIXI.Texture.fromImage('assets/images/test.png');
// var map = new PIXI.Sprite(texture);
// app.stage.addChild(map);

// var map2 = new PIXI.Sprite(texture);

// app.stage.addChild(map2);

// var dist = getDistance(texture.width/2, texture.height/2);
// console.log(dist);


// function getDistance(a, b) {
//     return Math.sqrt( Math.pow(a, 2) + Math.pow(b, 2) );
// }
