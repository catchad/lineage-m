var apiKey = $("#apikey").val();
var mapPosition = 0;
var app = new PIXI.Application(window.innerWidth, window.innerHeight, { forceCanvas:false, backgroundColor: 0x000000, view: document.getElementById('pixiCanvas') });
var activePages = {};
var container = new PIXI.Container();
var fakeData = [];
var fakeText = ['賣+10屠龍刀 密我出價 鳥價不回', '賣帳號 99等女妖 意我', '老公我兵單來了 >"<', '幹好lag = =', '靠邀 超多人...', '我要下線了 881', '8口口口口D', '媽我上電視了 ^0^', '徵婆 會養 會疼 要真心 ^^', '收月卡70w 無限收 意密 ^^', '阿貴代練工作室 3天99等 有興趣請密', '血盟【天上人間】收人 歡迎新手 有老手會帶', '貴大師 死白目 搶怪開紅 見一次殺一次'];
for( var i=0; i<1000; i++ ) {    
    fakeData.push({memo: fakeText[Math.floor(Math.random()*fakeText.length)], userwear:(Math.floor(Math.random()*16)+1), guid:i });
}

var loader = new PIXI.loaders.Loader();
loader.add('mapf1', 'assets/images/register/map/f1.png');
loader.add('mapf2', 'assets/images/register/map/f2.png');
loader.add('mapf3', 'assets/images/register/map/f3.png');

for( var i=1; i<=39; i++ ) {
    loader.add('map'+i, 'assets/images/register/map/'+i+'.png');
}

for( var i=1; i<=16; i++ ) {
    loader.add('character'+i, 'assets/images/register/character/'+i+'.png')
}

loader.load((loader, resources) => {
    var mapWidth = 2048; // 1280
    var mapHeight = 1024; // 640

    var chatSpeed = 600;
    var totalPage;
    var totalCount;

    var mapNum = 13; // 地圖數量13行 (39張)
    var frontNum = 2; // 地圖有2行 (6張) 不加入迴圈
    var characterNum = 9; // 每張地圖上人物10行 (30個)
    var pageSize = mapNum*3*characterNum;

    container.pivot.set(0.5, 0.5);
    container.x = window.innerWidth/2;
    container.y = window.innerHeight/2;
    app.stage.addChild(container);

    var mapContainer = new PIXI.Container();
    container.addChild(mapContainer);

    var characterContainer = new PIXI.Container();
    container.addChild(characterContainer);

    var mapDistance = Math.sqrt(Math.pow(mapWidth/2, 2) + Math.pow(mapHeight/2, 2));
    var angle = angleBetween({x:0, y:0}, {x:mapWidth/2, y:-mapHeight/2});

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
        strokeThickness: 3
    });

    // 地圖分成兩大種, 就是上面能站人的, 跟上面不能站人的
    // 能站人的, 再分兩種, 只出現一次的, 跟不斷出現再回圈的
    addMap(0);
    addMap(1);
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
    function addMap(page, completeFn) {
        if( page < 0 || page > totalPage) return;

        // console.log('addmap: ' +page);
        activePages[page] = {};

        var characterData = [];

        $.ajax({
            url: getdataAPIurl,
            type: 'POST',
            dataType: 'json',
            data: {pagecount: pageSize, page:page}
        })
        .always(function(response) {

            console.log(response);



            if( response.data == undefined ) {
                // 測試用
                for( var i=page*pageSize; i<(page*pageSize)+pageSize; i++ ) {
                    if( fakeData[i] !== undefined ) characterData.push(fakeData[i]);       
                }
                if( totalPage == undefined ) totalPage = Math.ceil(fakeData.length/pageSize)-1;
                if( totalCount == undefined ) totalCount = fakeData.length;
                console.log("OK test");
            } else {
                // 正式用
                characterData = response.data.data;
                if( totalPage == undefined ) totalPage = response.data.totalpage;
                if( totalCount == undefined ) totalCount = response.data.totalcount;
                console.log("OK");
            }

            if( characterData.length == 0 || characterData == undefined) {
                console.log("no data");
                return;
            }
            updatePixi();
            if( completeFn !== undefined ) completeFn();
        });



        function updatePixi() {
            var pageMapContainer = new PIXI.Container();
            var pageCharacterContainer = new PIXI.Container();
            var pageTextContainer = new PIXI.Container();



            for( var i=0; i<mapNum; i++ ) {

                var rowCenter = {x: mapWidth/2*i, y: -mapHeight/2*i };
                var pageCenter = {x: mapWidth/2*page*mapNum, y: -mapHeight/2*page*mapNum };
                // console.log( 'map'+((i*3+(mapNum*3)*(page-1)+1)%39+1) );

                var m1 = ((page*mapNum*3) + (i*3)) +1;
                var m2 = ((page*mapNum*3) + (i*3+1)) +1;
                var m3 = ((page*mapNum*3) + (i*3+2)) +1;

                if( m1 > mapNum*3 ) m1 = (((page-1)*mapNum*3) + (i*3))%(mapNum*3-frontNum*3) +1 +frontNum*3;
                if( m2 > mapNum*3 ) m2 = (((page-1)*mapNum*3) + (i*3+1))%(mapNum*3-frontNum*3) +1 +frontNum*3;
                if( m3 > mapNum*3 ) m3 = (((page-1)*mapNum*3) + (i*3+2))%(mapNum*3-frontNum*3) +1 +frontNum*3;


                var map = new PIXI.Sprite(resources['map'+m2].texture);
                map.anchor.set(0.5);
                map.x = pageCenter.x + rowCenter.x;
                map.y = pageCenter.y + rowCenter.y;
                // map.scale.set(1.01, 1.01);
                map.scale.set(0.99, 0.99);

                pageMapContainer.addChild(map);

                var map2 = new PIXI.Sprite(resources['map'+m1].texture);
                map2.anchor.set(0.5);
                map2.x = pageCenter.x + rowCenter.x + mapWidth/2;
                map2.y = pageCenter.y + rowCenter.y + mapHeight/2;
                // map2.scale.set(1.01, 1.01);
                map2.scale.set(0.99, 0.99);
                pageMapContainer.addChild(map2);

                var map3 = new PIXI.Sprite(resources['map'+m3].texture);
                map3.anchor.set(0.5);
                map3.x = pageCenter.x + rowCenter.x - mapWidth/2;
                map3.y = pageCenter.y + rowCenter.y - mapHeight/2;
                // map3.scale.set(1.01, 1.01);
                map3.scale.set(0.99, 0.99);
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
                    characterCenter.x -= 20;
                    characterCenter.y -= 20;

                    for( var k=0; k<3; k++ ) {
                        if( characterData[id+k] !== undefined ) {
                            
                            var newCharacter = new PIXI.Sprite(resources['character'+characterData[id+k].userwear].texture);
                            newCharacter.anchor.set(0.5, 1);

                            if( k == 0 ) {
                                var p = getPoint(-angle + Math.PI, 80);
                                newCharacter.x = pageCenter.x + rowCenter.x + characterCenter.x + p.x;
                                newCharacter.y = pageCenter.y + rowCenter.y + characterCenter.y + p.y;
                            }
                            if( k == 1 ) {
                                newCharacter.x = pageCenter.x + rowCenter.x + characterCenter.x;
                                newCharacter.y = pageCenter.y + rowCenter.y + characterCenter.y;
                            }
                            if( k == 2 ) {
                                var p = getPoint(-angle, 80);
                                newCharacter.x = pageCenter.x + rowCenter.x + characterCenter.x + p.x;
                                newCharacter.y = pageCenter.y + rowCenter.y + characterCenter.y + p.y;
                            }

                            newCharacter.scale.set(0.9, 0.9);
                            newCharacter.interactive = true;
                            newCharacter.buttonMode = true;
                            // newCharacter.alpha = 0.2;
                            newCharacter.on('pointerdown', characterClick);
                            newCharacter.data = {};
                            newCharacter.data.guid = characterData[id+k].guid;
                            newCharacter.data.memo = characterData[id+k].memo;
                            pageCharacterContainer.addChild(newCharacter);

                            var text = new PIXI.Text(characterData[id+k].memo, style);
                            text.x = newCharacter.x;
                            text.y = newCharacter.y - 100;
                            text.anchor.set(0.5, 1);
                            text.alpha = 0;
                            text.data = {fixedPosition:{x:text.x ,y:text.y}, time:Math.floor(Math.random()*chatSpeed)};
                            pageTextContainer.addChild(text);
                        }

                    }

                }

            }

            mapContainer.addChild(pageMapContainer);
            characterContainer.addChild(pageCharacterContainer);
            characterContainer.addChild(pageTextContainer);

            activePages[page] = {content:[pageMapContainer, pageCharacterContainer, pageTextContainer]}
            // activePages.push({page:page, content:[pageMapContainer, pageCharacterContainer]});
        }





    }


    var textAnimateTimer = 0;
    // var textAnimateTarget = [];
    app.ticker.add(function(delta) {
        textAnimateTimer ++;

        for (var key in activePages) {
            if( activePages[key].content == undefined ) continue;
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
        console.log(event.target.data.guid);
    }
    function removeMap(page) {
        if(page < 0 && page > totalPage) return;
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
        if( event.deltaY < 0 ) {
            mapPosition-=mapDistance/5; //60 30

        } else {
            mapPosition+=mapDistance/5;
        }

        updateCamera();
    })


    function updateCamera(parameter) {

        // parameter.targetID
        // parameter.completeFn

        if( parameter !== undefined ) {
            mapPosition = getCharacterMapPosition(parameter.targetID);
        }
        
        var a = Math.floor(-mapPosition+mapDistance/2);
        var b = Math.floor(mapDistance*13);

        // console.log( a/b );
        var c = Math.floor(a/b);
        // console.log(c, c-1, c+1);

        var currentPage = Math.floor(a/b);
        // console.log(currentPage);
        
        if( activePages[currentPage] == undefined ) {
            if( parameter !== undefined ) {
                addMap(currentPage, parameter.completeFn);
            } else {
                addMap(currentPage);
            }
            
        }
        if( activePages[currentPage+1] == undefined ) {
            addMap(currentPage+1);
        }
        if( activePages[currentPage-1] == undefined ) {
            addMap(currentPage-1);
        }



        for (var key in activePages) {
            if( Number(key) !== currentPage && Number(key) !== currentPage+1 && Number(key) !== Math.max(currentPage-1, 0) ) {
                removeMap(key);
            }

        }

        // console.log(activePages);
        var p = getPoint(angle, mapPosition);
        if( parameter !== undefined ) {
            container.x = window.innerWidth/2 + p.x;
            container.y = window.innerHeight/2 + p.y;
        } else {
            TweenMax.to(container, 0.5, {x:window.innerWidth/2 + p.x, y:window.innerHeight/2 + p.y} );
        }


        if( parameter !== undefined && activePages[Math.min(Math.max(currentPage, 0), totalPage)] !== undefined && activePages[Math.min(Math.max(currentPage+1, 0), totalPage)] !== undefined && activePages[Math.min(Math.max(currentPage-1, 0), totalPage)] !== undefined ) {
            parameter.completeFn();
        }

        if( parameter !== undefined && activePages[currentPage] !== undefined && activePages[currentPage+1] !== undefined && activePages[currentPage-1] !== undefined) parameter.completeFn();



        // container.x = window.innerWidth/2 + p.x;
        // container.y = window.innerHeight/2 + p.y;
    }
    // var aa = 0;
    $("#info .search .icon").on('click', function(event) {
        event.preventDefault();
        // searchCharacter(709);
        // $("#searchID").val()
        updateCamera({targetID: 0, completeFn:function(){
            console.log("OK");
        }})
        // aa += 1;
    });
    
    function getCharacterMapPosition(id) {
        // id是玩家編號, 0是第一個
        console.log(id);
        // id = id-1;
        // console.log(pageSize);
        // console.log('頁數:' + Math.floor(id/pageSize) );
        // console.log('再該頁的位置:' + id%pageSize );

        var page = Math.floor(id/pageSize);
        var characterID = id%pageSize;

        // var lastCharacterNum = totalCount%pageSize; //殘數
        var rowNum = Math.floor(characterID/(characterNum*3));
        // console.log(rowNum);
        var characterRowNum = Math.floor((characterID%(characterNum*3))/3);
        // console.log( characterRowNum );
        var r = characterRowNum * mapDistance/characterNum + (mapDistance/characterNum/2) - mapDistance/2;
        var characterCenter = getPoint(angle, r);
        characterCenter.x -= 30;
        characterCenter.y -= 30;

        var rowCenter = {x: mapWidth/2*rowNum, y: -mapHeight/2*rowNum };
        var pageCenter = {x: mapWidth/2*page*mapNum, y: -mapHeight/2*page*mapNum };

        var lastCharacterCenter = {x: rowCenter.x + pageCenter.x + characterCenter.x, y: rowCenter.y + pageCenter.y + characterCenter.y};
        // var lastCharacterCenter = {x: rowCenter.x + pageCenter.x, y: rowCenter.y + pageCenter.y};
        // mapPosition = -(mapDistance*mapNum*(totalPage));
        var position = -distanceBetween(lastCharacterCenter, {x:0, y:0});
        if( id < (characterNum*3) /2 ) position *=-1;
        return position;
        // updateCamera();

    }

    // function skipToLastPage() {
    //     // console.log('總參加量:' + totalCount);
    //     // console.log('總頁數:' + totalPage );
    //     // console.log('殘數:' + totalCount%pageSize);

    //     // var lastPage = Math.ceil(fakeData.length/pageSize);
    //     var lastCharacterNum = totalCount%pageSize; //殘數
    //     var lastRowNum = Math.floor(lastCharacterNum/(characterNum*3));
    //     var lastCharacterRowNum = Math.floor((lastCharacterNum%(characterNum*3))/3)

    //     // 最後一個排隊者, 位在行中第幾個, 0 = 第三個, 1 = 第一個, 2 = 第三個
    //     var lastPosition = (lastCharacterNum%(characterNum*3))%3;

    //     var r = lastCharacterRowNum * mapDistance/characterNum + (mapDistance/characterNum/2) - mapDistance/2;
    //     var characterCenter = getPoint(angle, r);
    //     characterCenter.x -= 30;
    //     characterCenter.y -= 30;

    //     var rowCenter = {x: mapWidth/2*lastRowNum, y: -mapHeight/2*lastRowNum };
    //     var pageCenter = {x: mapWidth/2*totalPage*mapNum, y: -mapHeight/2*totalPage*mapNum };

    //     var lastCharacterCenter = {x: rowCenter.x + pageCenter.x + characterCenter.x, y: rowCenter.y + pageCenter.y + characterCenter.y};
    //     // mapPosition = -(mapDistance*mapNum*(totalPage));
    //     mapPosition = -distanceBetween(lastCharacterCenter, {x:0, y:0});
    //     updateCamera(true);
    // }

    function dropUser(parameter) {
        // parameter.memo
        // parameter.userwear
        // parameter.guid
        var lastCharacterNum = totalCount%pageSize; //殘數
        var lastRowNum = Math.floor(lastCharacterNum/(characterNum*3));
        var lastCharacterRowNum = Math.floor((lastCharacterNum%(characterNum*3))/3)

        // 最後一個排隊者, 位在行中第幾個, 0 = 第三個, 1 = 第一個, 2 = 第三個
        var lastPosition = (lastCharacterNum%(characterNum*3))%3;
        var r = lastCharacterRowNum * mapDistance/characterNum + (mapDistance/characterNum/2) - mapDistance/2;
        var characterCenter = getPoint(angle, r);
        characterCenter.x -= 30;
        characterCenter.y -= 30;
        var rowCenter = {x: mapWidth/2*lastRowNum, y: -mapHeight/2*lastRowNum };
        var pageCenter = {x: mapWidth/2*totalPage*mapNum, y: -mapHeight/2*totalPage*mapNum };

        var lastCharacterCenter = {x: rowCenter.x + pageCenter.x + characterCenter.x, y: rowCenter.y + pageCenter.y + characterCenter.y};
        mapPosition = -distanceBetween(lastCharacterCenter, {x:0, y:0});

        // var newCharacter;
        var r = (lastCharacterRowNum) * mapDistance/characterNum + (mapDistance/characterNum/2) - mapDistance/2;
        var characterCenter = getPoint(angle, r);
        characterCenter.x -= 30;
        characterCenter.y -= 30;

        var newCharacter = new PIXI.Sprite(resources['character'+parameter.userwear].texture);
        newCharacter.anchor.set(0.5, 1);

        if( lastPosition == 0 ) {
            var p = getPoint(-angle + Math.PI, 80);            
            newCharacter.x = pageCenter.x + rowCenter.x + characterCenter.x + p.x;
            newCharacter.y = pageCenter.y + rowCenter.y + characterCenter.y + p.y;
        }

        if( lastPosition == 1) {
            newCharacter.x = pageCenter.x + rowCenter.x + characterCenter.x;
            newCharacter.y = pageCenter.y + rowCenter.y + characterCenter.y;
        }


        if( lastPosition == 2 ) {
            var p = getPoint(-angle, 80);
            newCharacter.x = pageCenter.x + rowCenter.x + characterCenter.x + p.x;
            newCharacter.y = pageCenter.y + rowCenter.y + characterCenter.y + p.y;
        }

        newCharacter.anchor.set(0.5, 1);
        newCharacter.scale.set(0.9, 0.9);
        newCharacter.interactive = true;
        newCharacter.buttonMode = true;
        newCharacter.on('pointerdown', characterClick);
        newCharacter.data = {};
        newCharacter.data.guid = parameter.guid;
        newCharacter.data.memo = parameter.memo;
        activePages[totalPage].content[1].addChild(newCharacter);

        var text = new PIXI.Text(parameter.memo, style);
        text.x = newCharacter.x;
        text.y = newCharacter.y - 100;
        text.anchor.set(0.5, 1);
        text.alpha = 0;
        text.data = {fixedPosition:{x:text.x ,y:text.y}, time:Math.floor(Math.random()*chatSpeed)};
        activePages[totalPage].content[2].addChild(text);


        TweenMax.from(newCharacter, 1, {y:"-=150", alpha:0, ease:Bounce.easeOut, delay:1});

        fakeData.push({memo:$("#form-memo").val(), guid: fakeData.length, userwear:parameter.userwear});
        totalCount+=1;
    }

    $(".lightbox .close").on('click', function(event) {
        $(this).parents(".lightbox").removeClass("active");
    });

    $("#registerSendBtn").on('click', function(event) {
        $.ajax({
            url: lineupAPIurl,
            type: 'POST',
            headers: {
                apikey: apiKey
            },
            dataType: 'json',
            data: {
                location: $("#form-location").val(),
                phone: $("#form-phone").val(),
                memo: $("#form-memo").val(),
                pageCount: pageSize
            }
        })
        .always(function(response) {
            $("#form").removeClass("active");
            $("#registerBtn").removeClass("btn--active");
            if( response.data !== undefined ) {
                updateCamera({targetID: response.data.data.guid, completeFn:function(){
                    console.log("OK");
                    dropUser({memo: response.data.data.memo, userwear: response.data.data.userwear, guid:response.data.data.guid});
                }})
            } else {
                updateCamera({targetID: 1000, completeFn:function(){
                    console.log("OK test");
                    dropUser({memo: $("#form-memo").val(), userwear: '7', guid:700});
                }})
            }
            
            // updateCamera({targetID: 700, completeFn:function(){
            //     console.log("OK");
            //     dropUser();
            // }})
        });        
    });

});


function ready() {
    $("#registerBtn").on('click', function(event) {
        $("#form").addClass("active");
    });
}

// ready();