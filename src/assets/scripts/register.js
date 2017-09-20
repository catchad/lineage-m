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


PIXI.settings.PRECISION_FRAGMENT = 'highp';
var mapPosition = 0;
var app = new PIXI.Application(window.innerWidth, window.innerHeight, { forceCanvas:false, backgroundColor: 0x000000, view: document.getElementById('pixiCanvas') });
// app.renderer.roundPixels = true;
// var all = [];
// var maps = [];
// var groups = [];
var activePages = {};
var fakeData = [];
var fakeText = ['賣+10屠龍刀 密我出價 鳥價不回', '賣帳號 99等女妖 意我', '老公我兵單來了 >"<', '幹好lag = =', '靠邀 超多人...', '我要下線了 881', '8口口口口D', '媽我上電視了 ^0^', '徵婆 會養 會疼 要真心 ^^', '收月卡70w 無限收 意密 ^^', '阿貴代練工作室 3天99等 有興趣請密', '血盟【天上人間】收人 歡迎新手 有老手會帶', '貴大師 死白目 搶怪開紅 見一次殺一次'];
for( var i=0; i<1001; i++ ) {    
    fakeData.push({msg: fakeText[Math.floor(Math.random()*fakeText.length)]});
}



var loader = new PIXI.loaders.Loader();
loader.add('mapf1', 'assets/images/register/map/f1.png');
loader.add('mapf2', 'assets/images/register/map/f2.png');
loader.add('mapf3', 'assets/images/register/map/f3.png');

for( var i=1; i<=36; i++ ) {
    loader.add('map'+i, 'assets/images/register/map/'+i+'.png');
}
// for( var i=1; i<=39; i++ ) {
//     loader.add('map'+i, 'assets/images/register/newmap/'+i+'.png');
// }



for( var i=1; i<=41; i++ ) {
    loader.add('character'+i, 'assets/images/register/character/'+i+'.png')
}
      
loader.load((loader, resources) => {
    console.log("loaded");
    // resources.bunny
    // resources.spaceship
    var container = new PIXI.Container();

    var mapWidth = 2048; // 1280
    var mapHeight = 1024; // 640

    var chatSpeed = 600;

    var mapNum = 11; // 地圖數量11行 (33張)
    var frontNum = 2; // 地圖有2行 (6張) 不加入迴圈
    var characterNum = 12; // 每張地圖上人物12行 (36個)
    var pageSize = mapNum*3*characterNum;

    console.log('總參加量:' + fakeData.length);
    console.log('總頁數:' + Math.floor(fakeData.length/pageSize) );

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

    mapPosition = mapDistance/2;
    var p = getPoint(angle, mapPosition);
    container.x = window.innerWidth/2 + p.x;
    container.y = window.innerHeight/2 + p.y;
    // TweenMax.to(container, 0.5, {x:window.innerWidth/2 + p.x, y:window.innerHeight/2 + p.y} );
    // var page = 1;


    var style = new PIXI.TextStyle({
        fontFamily: '微軟正黑體',
        fontSize: 16,
        fill: ['#ffffff'], // gradient
        stroke: '#000000',
        strokeThickness: 3,
        // dropShadow: true,
        // dropShadowColor: '#000000',
        // dropShadowBlur: 0,
        // dropShadowAngle: Math.PI / 6,
        // dropShadowDistance: 6,
        // wordWrap: true,
        // wordWrapWidth: 440
        // trim: true
    });


    // 地圖分成兩大種, 就是上面能站人的, 跟上面不能站人的
    // 能站人的, 再分兩種, 只出現一次的, 跟不斷出現再回圈的
    
    addMap(1);
    addMap(2);
    addMapFront();
    // addMap(3);
    // addMap(4);
    // addMap(5);

    // for( var i=1; i<5; i++ ) {
    //     addMap(i);
    // }

    function addMapFront() {
        var rowCenter = {x: mapWidth/2*-1, y: -mapHeight/2*-1 };
        // var pageCenter = {x: mapWidth/2*(page-1)*mapNum, y: -mapHeight/2*(page-1)*mapNum };

        var map = new PIXI.Sprite(resources['mapf2'].texture);
        map.anchor.set(0.5);
        map.x = -mapWidth/2;
        map.y = mapHeight/2;
        map.scale.set(1.01, 1.01);
        container.addChild(map);

        var map2 = new PIXI.Sprite(resources['mapf1'].texture);
        map2.anchor.set(0.5);
        map2.x = rowCenter.x + mapWidth/2;
        map2.y = rowCenter.y + mapHeight/2;
        map2.scale.set(1.01, 1.01);
        container.addChild(map2);

        var map3 = new PIXI.Sprite(resources['mapf3'].texture);
        map3.anchor.set(0.5);
        map3.x = rowCenter.x - mapWidth/2;
        map3.y = rowCenter.y - mapHeight/2;
        map3.scale.set(1.01, 1.01);
        container.addChild(map3);
    }
    function addMap(page) {
        if( page <= 0 ) return;


        console.log('addmap: ' +page);
        var characterData = [];
        



        for( var i=(page-1)*pageSize; i<((page-1)*pageSize)+pageSize; i++ ) {
            if( fakeData[i] !== undefined ) characterData.push(fakeData[i]);            
        }
        console.log(characterData);
        if( characterData.length == 0 ) {
            console.log("no file");
            return;
        }

        var pageMapContainer = new PIXI.Container();
        var pageCharacterContainer = new PIXI.Container();
        var pageTextContainer = new PIXI.Container();


        // console.log('page:' + page);
        // console.log('pageSize:' + pageSize);



        // console.log(characterData);

        for( var i=0; i<mapNum; i++ ) {

            var rowCenter = {x: mapWidth/2*i, y: -mapHeight/2*i };
            var pageCenter = {x: mapWidth/2*(page-1)*mapNum, y: -mapHeight/2*(page-1)*mapNum };
            // console.log( 'map'+((i*3+(mapNum*3)*(page-1)+1)%39+1) );

            var m1 = (((page-1)*mapNum*3) + (i*3)) +1;
            var m2 = (((page-1)*mapNum*3) + (i*3+1)) +1;
            var m3 = (((page-1)*mapNum*3) + (i*3+2)) +1;

            if( m1 > mapNum*3 ) m1 = (((page-2)*mapNum*3) + (i*3))%(mapNum*3-frontNum*3) +1 +frontNum*3;
            if( m2 > mapNum*3 ) m2 = (((page-2)*mapNum*3) + (i*3+1))%(mapNum*3-frontNum*3) +1 +frontNum*3;
            if( m3 > mapNum*3 ) m3 = (((page-2)*mapNum*3) + (i*3+2))%(mapNum*3-frontNum*3) +1 +frontNum*3;

            // console.log(m1, m2, m3);
            var map = new PIXI.Sprite(resources['map'+m2].texture);
            map.anchor.set(0.5);
            map.x = pageCenter.x + rowCenter.x;
            map.y = pageCenter.y + rowCenter.y;
            map.scale.set(1.01, 1.01);
            // map.scale.set(0.98, 0.98);
            // if( i==0 ) map.alpha = 0.5;
            // map.scale.set(mapWidth/map.width+0.01, mapWidth/map.width +0.01);
            pageMapContainer.addChild(map);

            var map2 = new PIXI.Sprite(resources['map'+m1].texture);
            map2.anchor.set(0.5);
            map2.x = pageCenter.x + rowCenter.x + mapWidth/2;
            map2.y = pageCenter.y + rowCenter.y + mapHeight/2;
            map2.scale.set(1.01, 1.01);
            // map2.scale.set(0.98, 0.98);
            // map2.scale.set(mapWidth/map2.width+0.01, mapWidth/map2.width +0.01);
            pageMapContainer.addChild(map2);

            var map3 = new PIXI.Sprite(resources['map'+m3].texture);
            map3.anchor.set(0.5);
            map3.x = pageCenter.x + rowCenter.x - mapWidth/2;
            map3.y = pageCenter.y + rowCenter.y - mapHeight/2;
            map3.scale.set(1.01, 1.01);
            // map3.scale.set(0.98, 0.98);
            // map3.scale.set(mapWidth/map3.width+0.01, mapWidth/map3.width +0.01);
            pageMapContainer.addChild(map3);


            for( var j=0; j<characterNum; j++) {
                // console.log( ((page-1)*characterNum*3*mapNum) + (i*characterNum*3) + (j*3) + 1 );
                // console.log( ((page-1)*characterNum*3*mapNum) + (i*characterNum*3) + (j*3) + 2 );
                // console.log( ((page-1)*characterNum*3*mapNum) + (i*characterNum*3) + (j*3) + 3 );
                // console.log( (i*characterNum*3) + (j*3) + 1 );
                // console.log( (i*characterNum*3) + (j*3) + 2 );
                // console.log( (i*characterNum*3) + (j*3) + 3 );
                var id = (i*characterNum*3) + (j*3);

                var r = j * mapDistance/characterNum + (mapDistance/characterNum/2) - mapDistance/2;
                var characterCenter = getPoint(angle, r);
                characterCenter.x -= 30;
                characterCenter.y -= 30;

                if( characterData[id] !== undefined ) {
                    var p = getPoint(-angle + Math.PI, 80);
                    var newCharacter1 = new PIXI.Sprite(resources['character32'].texture);
                    newCharacter1.anchor.set(0.5, 1);
                    newCharacter1.x = pageCenter.x + rowCenter.x + characterCenter.x + p.x;
                    newCharacter1.y = pageCenter.y + rowCenter.y + characterCenter.y + p.y;
                    newCharacter1.scale.set(0.7, 0.7);
                    newCharacter1.interactive = true;
                    newCharacter1.buttonMode = true;
                    newCharacter1.on('pointerdown', characterClick);
                    newCharacter1.data = {};
                    newCharacter1.data.cid = ((page-1)*characterNum*3*mapNum) + (i*characterNum*3) + (j*3) + 1;
                    newCharacter1.data.msg = characterData[id].msg;
                    pageCharacterContainer.addChild(newCharacter1);

                    var text1 = new PIXI.Text(characterData[id].msg, style);
                    text1.x = newCharacter1.x;
                    text1.y = newCharacter1.y - 80;
                    text1.anchor.set(0.5, 1);
                    text1.alpha = 0;
                    text1.data = {fixedPosition:{x:text1.x ,y:text1.y}, time:Math.floor(Math.random()*chatSpeed)};
                    pageTextContainer.addChild(text1);
                }

                if( characterData[id+1] !== undefined ) {
                    var newCharacter2 = new PIXI.Sprite(resources['character32'].texture); // +(Math.floor(Math.random()*41)+1)
                    newCharacter2.anchor.set(0.5, 1);
                    newCharacter2.x = pageCenter.x + rowCenter.x + characterCenter.x; // 40
                    newCharacter2.y = pageCenter.y + rowCenter.y + characterCenter.y;
                    newCharacter2.scale.set(0.7, 0.7);
                    // if( j == 0 ) newCharacter1.scale.set(1, 1);
                    newCharacter2.interactive = true;
                    newCharacter2.buttonMode = true;
                    newCharacter2.on('pointerdown', characterClick);
                    newCharacter2.data = {};
                    newCharacter2.data.cid = ((page-1)*characterNum*3*mapNum) + (i*characterNum*3) + (j*3) + 2;
                    newCharacter2.data.msg = characterData[id+1].msg;
                    pageCharacterContainer.addChild(newCharacter2);

                    var text2 = new PIXI.Text(characterData[id+1].msg, style);
                    text2.x = newCharacter2.x;
                    text2.y = newCharacter2.y - 80;
                    text2.anchor.set(0.5, 1);
                    text2.alpha = 0;
                    text2.data = {fixedPosition:{x:text2.x ,y:text2.y}, time:Math.floor(Math.random()*chatSpeed)};
                    pageTextContainer.addChild(text2);
                }

                if( characterData[id+2] !== undefined ) {
                    var p = getPoint(-angle, 80);
                    var newCharacter3 = new PIXI.Sprite(resources['character32'].texture);
                    newCharacter3.anchor.set(0.5, 1);
                    newCharacter3.x = pageCenter.x + rowCenter.x + characterCenter.x + p.x;
                    newCharacter3.y = pageCenter.y + rowCenter.y + characterCenter.y + p.y;
                    newCharacter3.scale.set(0.7, 0.7);
                    newCharacter3.interactive = true;
                    newCharacter3.buttonMode = true;
                    newCharacter3.on('pointerdown', characterClick);
                    newCharacter3.data = {};
                    newCharacter3.data.cid = ((page-1)*characterNum*3*mapNum) + (i*characterNum*3) + (j*3) + 3;
                    newCharacter3.data.msg = characterData[id+2].msg;
                    pageCharacterContainer.addChild(newCharacter3);

                    var text3 = new PIXI.Text(characterData[id+2].msg, style);
                    text3.x = newCharacter3.x;
                    text3.y = newCharacter3.y - 80;
                    text3.anchor.set(0.5, 1);
                    text3.alpha = 0;
                    text3.data = {fixedPosition:{x:text3.x ,y:text3.y}, time:Math.floor(Math.random()*chatSpeed)};
                    pageTextContainer.addChild(text3);
                }


                // console.log(text1.data.time, text2.data.time, text3.data.time);
            }

        }

        mapContainer.addChild(pageMapContainer);
        characterContainer.addChild(pageCharacterContainer);
        characterContainer.addChild(pageTextContainer);

        activePages[page] = {content:[pageMapContainer, pageCharacterContainer, pageTextContainer]}
        // activePages.push({page:page, content:[pageMapContainer, pageCharacterContainer]});
    }

    // console.log( activePages );

    // console.log( activePages['1'].content[2] );// 字幕

    var textAnimateTimer = 0;
    // var textAnimateTarget = [];
    app.ticker.add(function(delta) {
        // just for fun, let's rotate mr rabbit a little
        // delta is 1 if running at 100% performance
        // creates frame-independent tranformation

        // textAnimateTimer += 1*delta;

        // if( textAnimateTimer > 600 ) {
            
            
        //     textAnimateTarget = [];
        //     for (var key in activePages) {
        //         // activePages[key].content[2].children[i]
        //         for( var i=0; i<120; i++) {
        //             var rndID = Math.floor(Math.random()*activePages[key].content[2].children.length);
        //             if( textAnimateTarget.indexOf(rndID) == -1 ) {
        //                 textAnimateTarget.push(rndID);
        //                 var target = activePages[key].content[2].children[rndID];
        //                 var delay = Math.random()*6;
        //                 TweenMax.fromTo(target, 0.5, {y:target.data.fixedPosition.y+50, alpha:0}, {y:target.data.fixedPosition.y, alpha:1, delay:delay, immediateRender:false} );
        //                 TweenMax.fromTo(target, 0.5, {y:target.data.fixedPosition.y, alpha:1}, {y:target.data.fixedPosition.y+50, alpha:0, delay:delay+3.5, immediateRender:false} );
                   
        //             } else {
        //                 i--;
        //                 continue
        //             }

        //         }

                
        //     }

        //     console.log( textAnimateTarget.length );
        //     textAnimateTimer = 0;
        // }

        textAnimateTimer ++;

        for (var key in activePages) {
            for( var i=0; i<activePages[key].content[2].children.length; i++) {
                var target = activePages[key].content[2].children[i];
                // console.log( target.data.time);
                if( target.data.time == textAnimateTimer ) {
                    TweenMax.fromTo(target, 0.5, {y:target.data.fixedPosition.y+30, alpha:0}, {y:target.data.fixedPosition.y, alpha:1, immediateRender:false} );
                    TweenMax.fromTo(target, 0.5, {y:target.data.fixedPosition.y, alpha:1}, {y:target.data.fixedPosition.y+30, alpha:0, delay:2, immediateRender:false} );

                }


            }

        }



        if( textAnimateTimer == chatSpeed ) textAnimateTimer = 0;
  

    });


    function characterClick(event) {
        // console.log(event);
        console.log(this.data.cid);
        console.log(this.x, this.y);
        // skipToLastPage();
        // console.log('click');
    }
    function removeMap(page) {
        if(page <=0 ) return;
        console.log('removemap: '+page);
        for( var i=0; i<activePages[page].content[2].children.length; i++ ) {
            TweenMax.killTweensOf(activePages[page].content[2].children[i]);
        }
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
            mapPosition-=mapDistance/20; //60 30

        } else {
            mapPosition+=mapDistance/20;
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
        // console.log(currentPage);
        if( activePages[currentPage] == undefined ) {
            addMap(currentPage);
        }
        if( activePages[currentPage+1] == undefined ) {
            addMap(currentPage+1);
        }
        if( activePages[currentPage-1] == undefined ) {
            addMap(currentPage-1);
        }


        for (var key in activePages) {
            if( Number(key) !== currentPage && Number(key) !== currentPage+1 && Number(key) !== Math.max(currentPage-1, 1) ) {
                removeMap(key);
            }

        }

        // console.log(activePages);
        var p = getPoint(angle, mapPosition);
        TweenMax.to(container, 0.5, {x:window.innerWidth/2 + p.x, y:window.innerHeight/2 + p.y} );
        
        // container.x = window.innerWidth/2 + p.x;
        // container.y = window.innerHeight/2 + p.y;
    }

    function skipToLastPage() {
        console.log('總參加量:' + fakeData.length);
        console.log('總頁數:' + Math.ceil(fakeData.length/pageSize) );
        console.log('殘數:' + fakeData.length%pageSize);

        var lastPage = Math.ceil(fakeData.length/pageSize);
        var lastCharacterNum = fakeData.length%pageSize;
        var lastRowNum = Math.floor(lastCharacterNum/(characterNum*3));

        var lastCharacterRowNum = Math.floor((lastCharacterNum%(characterNum*3))/3)


        // 最後一個排隊者, 位在行中第幾個, 0 = 第三個, 1 = 第一個, 2 = 第三個
        var lastPosition = (lastCharacterNum%(characterNum*3))%3;



        var r = lastCharacterRowNum * mapDistance/characterNum + (mapDistance/characterNum/2) - mapDistance/2;
        var characterCenter = getPoint(angle, r);
        characterCenter.x -= 30;
        characterCenter.y -= 30;

        var rowCenter = {x: mapWidth/2*lastRowNum, y: -mapHeight/2*lastRowNum };
        var pageCenter = {x: mapWidth/2*(lastPage-1)*mapNum, y: -mapHeight/2*(lastPage-1)*mapNum };


        var lastCharacterCenter = {x: rowCenter.x + pageCenter.x + characterCenter.x, y: rowCenter.y + pageCenter.y + characterCenter.y};
        // mapPosition = -(mapDistance*mapNum*(lastPage));
        mapPosition = -distanceBetween(lastCharacterCenter, {x:0, y:0});

        updateCamera();

        var newCharacter;
        if( lastPosition == 0 ) {
            // var rowCenter = {x: mapWidth/2*(lastRowNum+1), y: -mapHeight/2*(lastRowNum+1) };
            var r = (lastCharacterRowNum) * mapDistance/characterNum + (mapDistance/characterNum/2) - mapDistance/2;
            var characterCenter = getPoint(angle, r);
            characterCenter.x -= 30;
            characterCenter.y -= 30;

            var p = getPoint(-angle + Math.PI, 80);
            var newCharacter = new PIXI.Sprite(resources['character32'].texture);
            newCharacter.anchor.set(0.5, 1);
            newCharacter.x = pageCenter.x + rowCenter.x + characterCenter.x + p.x;
            newCharacter.y = pageCenter.y + rowCenter.y + characterCenter.y + p.y;
            newCharacter.scale.set(0.7, 0.7);
            // newCharacter.scale.set(1, 1);
            newCharacter.interactive = true;
            newCharacter.buttonMode = true;
            newCharacter.on('pointerdown', characterClick);
            newCharacter.data = {};
            // newCharacter1.data.cid = ((page-1)*characterNum*3*mapNum) + (i*characterNum*3) + (j*3) + 1;
            newCharacter.data.msg = 'test';
            activePages[lastPage].content[1].addChild(newCharacter);

            var text = new PIXI.Text('test', style);
            text.x = newCharacter.x;
            text.y = newCharacter.y - 80;
            text.anchor.set(0.5, 1);
            text.alpha = 0;
            text.data = {fixedPosition:{x:text.x ,y:text.y}, time:Math.floor(Math.random()*chatSpeed)};
            activePages[lastPage].content[2].addChild(text);
            console.log(activePages[lastPage]);
            console.log("add");
        }

        if( lastPosition == 1) {

            var newCharacter = new PIXI.Sprite(resources['character32'].texture);
            newCharacter.anchor.set(0.5, 1);
            newCharacter.x = pageCenter.x + rowCenter.x + characterCenter.x;
            newCharacter.y = pageCenter.y + rowCenter.y + characterCenter.y;
            newCharacter.scale.set(0.7, 0.7);
            // newCharacter.scale.set(1, 1);
            newCharacter.interactive = true;
            newCharacter.buttonMode = true;
            newCharacter.on('pointerdown', characterClick);
            newCharacter.data = {};
            // newCharacter1.data.cid = ((page-1)*characterNum*3*mapNum) + (i*characterNum*3) + (j*3) + 1;
            newCharacter.data.msg = 'test';
            activePages[lastPage].content[1].addChild(newCharacter);

            var text = new PIXI.Text('test', style);
            text.x = newCharacter.x;
            text.y = newCharacter.y - 80;
            text.anchor.set(0.5, 1);
            text.alpha = 0;
            text.data = {fixedPosition:{x:text.x ,y:text.y}, time:Math.floor(Math.random()*chatSpeed)};
            activePages[lastPage].content[2].addChild(text);
        }


        if( lastPosition == 2 ) {

            var p = getPoint(-angle, 80);
            var newCharacter = new PIXI.Sprite(resources['character32'].texture);
            newCharacter.anchor.set(0.5, 1);
            newCharacter.x = pageCenter.x + rowCenter.x + characterCenter.x + p.x;
            newCharacter.y = pageCenter.y + rowCenter.y + characterCenter.y + p.y;
            newCharacter.scale.set(0.7, 0.7);
            // newCharacter.scale.set(1, 1);
            newCharacter.interactive = true;
            newCharacter.buttonMode = true;
            newCharacter.on('pointerdown', characterClick);
            newCharacter.data = {};
            // newCharacter1.data.cid = ((page-1)*characterNum*3*mapNum) + (i*characterNum*3) + (j*3) + 1;
            newCharacter.data.msg = 'test';
            activePages[lastPage].content[1].addChild(newCharacter);

            var text = new PIXI.Text('test', style);
            text.x = newCharacter.x;
            text.y = newCharacter.y - 80;
            text.anchor.set(0.5, 1);
            text.alpha = 0;
            text.data = {fixedPosition:{x:text.x ,y:text.y}, time:Math.floor(Math.random()*chatSpeed)};
            activePages[lastPage].content[2].addChild(text);
        }

        TweenMax.from(newCharacter, 1, {y:"-=150", alpha:0, ease:Bounce.easeOut, delay:1});

        fakeData.push({msg:'test'});
        

    }

    document.getElementById('test').addEventListener('click', function() {
        // document.getElementById('test').classList.add("hide");
        skipToLastPage();
    })


    // checkVisible();
});


