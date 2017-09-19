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
// var all = [];
// var maps = [];
// var groups = [];
var activePages = {};

var loader = new PIXI.loaders.Loader();

for( var i=1; i<=36; i++ ) {
    loader.add('map'+i, 'assets/images/map2048/'+i+'.png');
}

for( var i=1; i<=41; i++ ) {
    loader.add('character'+i, 'assets/images/character/'+i+'.png')
}
      
loader.load((loader, resources) => {
    // resources.bunny
    // resources.spaceship
    var container = new PIXI.Container();

    var mapWidth = 2048; // 1280
    var mapHeight = 1024; // 640

    // container.addChild(sprite);
    container.pivot.set(0.5, 0.5);
    container.x = window.innerWidth/2;
    container.y = window.innerHeight/2;
    app.stage.addChild(container);

    var mapContainer = new PIXI.Container();
    container.addChild(mapContainer);

    var characterContainer = new PIXI.Container();
    container.addChild(characterContainer);

    var mapDistance = Math.sqrt(Math.pow(mapWidth/2, 2) + Math.pow(mapHeight/2, 2));
    // var angle = 2.034131142562238;
    var angle = angleBetween({x:0, y:0}, {x:mapWidth/2, y:-mapHeight/2});
    console.log( mapDistance );
    console.log(angle);

    // var page = 1;

    addMap(1);
    addMap(2);
    // addMap(3);
    // addMap(4);
    // addMap(5);

    // for( var i=1; i<5; i++ ) {
    //     addMap(i);
    // }
    function addMap(page) {
        console.log('addmap: ' +page);
        // var angle = 2.034131142562238;
        var pageMapContainer = new PIXI.Container();
        var pageCharacterContainer = new PIXI.Container();

        var mapNum = 12; //12
        for( var i=0; i<mapNum; i++ ) {

            var rowCenter = {x: mapWidth/2*i, y: -mapHeight/2*i };
            var pageCenter = {x: mapWidth/2*(page-1)*mapNum, y: -mapHeight/2*(page-1)*mapNum };
            // console.log( 'map'+((i*3+(mapNum*3)*(page-1)+1)%36+1) );

            var map = new PIXI.Sprite(resources['map'+((i*3+(mapNum*3)*(page-1)+1)%36+1)].texture);
            map.anchor.set(0.5);
            map.x = pageCenter.x + rowCenter.x;
            map.y = pageCenter.y + rowCenter.y;
            map.scale.set(1.01, 1.01);
            // map.scale.set(0.98, 0.98);
            pageMapContainer.addChild(map);

            var map2 = new PIXI.Sprite(resources['map'+((i*3+(mapNum*3)*(page-1)+0)%36+1)].texture);
            map2.anchor.set(0.5);
            map2.x = pageCenter.x + rowCenter.x + mapWidth/2;
            map2.y = pageCenter.y + rowCenter.y + mapHeight/2;
            map2.scale.set(1.01, 1.01);
            // map2.scale.set(0.98, 0.98);
            pageMapContainer.addChild(map2);

            var map3 = new PIXI.Sprite(resources['map'+((i*3+(mapNum*3)*(page-1)+2)%36+1)].texture);
            map3.anchor.set(0.5);
            map3.x = pageCenter.x + rowCenter.x - mapWidth/2;
            map3.y = pageCenter.y + rowCenter.y - mapHeight/2;
            map3.scale.set(1.01, 1.01);
            // map3.scale.set(0.98, 0.98);
            pageMapContainer.addChild(map3);

            var range = 1150;
            var num = 12;

            for( var j=0; j<num; j++) {
                var r = j * range/num + (range/num/2) - range/2;

                var characterCenter = getPoint(angle, r);

                var newCharacter1 = new PIXI.Sprite(resources['character32'].texture); // +(Math.floor(Math.random()*41)+1)
                newCharacter1.anchor.set(0.5, 1);
                newCharacter1.x = pageCenter.x + rowCenter.x + characterCenter.x -40; // 40
                newCharacter1.y = pageCenter.y + rowCenter.y + characterCenter.y -40;
                newCharacter1.scale.set(0.7, 0.7);
                pageCharacterContainer.addChild(newCharacter1);

                var p = getPoint(-angle, 70);
                var newCharacter2 = new PIXI.Sprite(resources['character32'].texture);
                newCharacter2.anchor.set(0.5, 1);
                newCharacter2.x = pageCenter.x + rowCenter.x + characterCenter.x -40 + p.x;
                newCharacter2.y = pageCenter.y + rowCenter.y + characterCenter.y -40 + p.y;
                newCharacter2.scale.set(0.7, 0.7);
                pageCharacterContainer.addChild(newCharacter2);

                var p = getPoint(-angle + Math.PI, 70);
                var newCharacter3 = new PIXI.Sprite(resources['character32'].texture);
                newCharacter3.anchor.set(0.5, 1);
                newCharacter3.x = pageCenter.x + rowCenter.x + characterCenter.x -40 + p.x;
                newCharacter3.y = pageCenter.y + rowCenter.y + characterCenter.y -40 + p.y;
                newCharacter3.scale.set(0.7, 0.7);
                pageCharacterContainer.addChild(newCharacter3);

            }


        }

        mapContainer.addChild(pageMapContainer);
        characterContainer.addChild(pageCharacterContainer);

        activePages[page] = {content:[pageMapContainer, pageCharacterContainer]}
        // activePages.push({page:page, content:[pageMapContainer, pageCharacterContainer]});


    }

    function removeMap(page) {
        console.log('removemap: '+page);
        for( var i=0; i<activePages[page].content.length; i++ ) {
            activePages[page].content[i].destroy({children: true});
        }
        delete activePages[page];
        
    }

    // console.log( activePages );
    // console.log( activePages[1] );

    function angleBetween(point1, point2) {
        return Math.atan2( point2.x - point1.x, point2.y - point1.y );
    }

    function distanceBetween(point1, point2) {
        return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    }
    function isIntersecting(r1, r2) {
        return !(r2.x > (r1.x + r1.width) || 

                   (r2.x + r2.width) < r1.x || 

                   r2.y > (r1.y + r1.height) ||

                   (r2.y + r2.height) < r1.y);
    }


    function getPoint(theta, r) {
        var x = (r *Math.sin(theta));
        var y = (r *Math.cos(theta));
        return {x:x, y:y};
    }



    window.addEventListener('mousewheel', function(event) {

        // removeMap(1);
        if( event.deltaY > 0 ) {
            mapPosition-=mapDistance/30; //60 30

        } else {
            mapPosition+=mapDistance/30;
        }

        updateCamera();
    })

    function updateCamera() {
        var a = Math.floor(-mapPosition+mapDistance/2);
        var b = Math.floor(mapDistance*12);

        console.log( a/b );
        var c = Math.floor(a/b);
        // console.log(c, c-1, c+1);

        var currentPage = Math.floor(a/b)+1;
        console.log(currentPage);
        if( activePages[currentPage] == undefined ) {
            addMap(currentPage);
        }
        if( activePages[currentPage+1] == undefined ) {
            addMap(currentPage+1);
        }
        if( activePages[Math.max(currentPage-1, 1)] == undefined ) {
            addMap(Math.max(currentPage-1, 1));
        }


        for (var key in activePages) {
            if( Number(key) !== currentPage && Number(key) !== currentPage+1 && Number(key) !== Math.max(currentPage-1, 1) ) {
                removeMap(key);
            }

        }

        console.log(activePages);
        var p = getPoint(angle, mapPosition);
        TweenMax.to(container, 0.5, {x:window.innerWidth/2 + p.x, y:window.innerHeight/2 + p.y} );
        
        // container.x = window.innerWidth/2 + p.x;
        // container.y = window.innerHeight/2 + p.y;
    }


    // checkVisible();
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
