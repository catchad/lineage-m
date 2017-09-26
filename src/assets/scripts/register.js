var apiKey = $("#apikey").val();


var ww = window.innerWidth;
var wh = window.innerHeight;
var mapPosition = 0;
var app = new PIXI.Application(ww, wh, { forceCanvas:false, backgroundColor: 0x000000, view: document.getElementById('pixiCanvas') });
var activePages = {};
var container = new PIXI.Container();
var editData = {};
var fakeData = [];
var fakeText = ['賣+10屠龍刀 密我出價 鳥價不回', '賣帳號 99等女妖 密我', '老公我兵單來了 >"<', '幹好lag = =', '靠邀 超多人...', '我要下線了 881', '8口口口口D', '媽我上電視了 ^0^', '徵婆 會養 會疼 要真心 ^^', '收月卡70w 無限收 意密 ^^', '阿貴代練工作室 3天99等 有興趣請密', '血盟【天上人間】收人 歡迎新手 有老手會帶', '貴大師 死白目 搶怪開紅 見一次殺一次'];
for( var i=0; i<1000; i++ ) {    
    fakeData.push({memo: fakeText[Math.floor(Math.random()*fakeText.length)], userwear:(Math.floor(Math.random()*16)+1), guid:i });
}

var loader = new PIXI.loaders.Loader();
loader.add('mapf1', 'assets/images/register/map/f1.png');
loader.add('mapf2', 'assets/images/register/map/f2.png');
loader.add('mapf3', 'assets/images/register/map/f3.png');
loader.add('edit', 'assets/images/register/edit.png');
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
    var registerCharacter;
    var mapNum = 13; // 地圖數量13行 (39張)
    var frontNum = 2; // 地圖有2行 (6張) 不加入迴圈
    var characterNum = 9; // 每張地圖上人物10行 (30個)
    var pageSize = mapNum*3*characterNum;
    // console.log( pageSize );

    container.pivot.set(0.5, 0.5);
    container.x = window.innerWidth/2;
    container.y = window.innerHeight/2;
    app.stage.addChild(container);

    var mapContainer = new PIXI.Container();
    container.addChild(mapContainer);
    
    var mapEndContainer = new PIXI.Container();
    container.addChild(mapEndContainer);

    var registerContainer = new PIXI.Container();
    container.addChild(registerContainer);

    var characterContainer = new PIXI.Container();
    container.addChild(characterContainer);

    var uiContainer = new PIXI.Container();
    container.addChild(uiContainer);


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
    // addMapEnd();
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
    function addMapEnd() {
        console.log('addmap: '+totalPage);
        
        page = totalPage+1;
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
            // map.alpha = 0.5;
            // map.scale.set(1.01, 1.01);
            // map.scale.set(0.99, 0.99);

            mapEndContainer.addChild(map);

            var map2 = new PIXI.Sprite(resources['map'+m1].texture);
            map2.anchor.set(0.5);
            map2.x = pageCenter.x + rowCenter.x + mapWidth/2;
            map2.y = pageCenter.y + rowCenter.y + mapHeight/2;
            // map2.alpha = 0.5;
            // map2.scale.set(1.01, 1.01);
            // map2.scale.set(0.99, 0.99);
            mapEndContainer.addChild(map2);

            var map3 = new PIXI.Sprite(resources['map'+m3].texture);
            map3.anchor.set(0.5);
            map3.x = pageCenter.x + rowCenter.x - mapWidth/2;
            map3.y = pageCenter.y + rowCenter.y - mapHeight/2;
            // map3.alpha = 0.5;
            // map3.scale.set(1.01, 1.01);
            // map3.scale.set(0.99, 0.99);
            mapEndContainer.addChild(map3);


        }

        mapContainer.addChild(pageMapContainer);
        characterContainer.addChild(pageCharacterContainer);
        characterContainer.addChild(pageTextContainer);

        activePages[page] = {content:[pageMapContainer, pageCharacterContainer, pageTextContainer]}
        // activePages.push({page:page, content:[pageMapContainer, pageCharacterContainer]});
    }
    function addMap(page, completeFn) {
        if( page < 0 || page > totalPage) {
            if( completeFn !== undefined ) {
                completeFn();
            }
            return;
        }

        
        activePages[page] = {};

        var characterData = [];

        $.ajax({
            url: setting.getdataAPIurl,
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
                if( totalPage == undefined ) {
                    // firsttime
                    totalPage = Math.ceil(fakeData.length/pageSize)-1;
                    totalCount = fakeData.length;
                    addMapEnd();
                }
                console.log("addMap(測試): " +page);
            } else {
                // 正式用
                characterData = response.data.data;
                if( totalPage == undefined ) {
                    totalPage = response.data.totalpage;
                    totalCount = response.data.totalcount;
                    addMapEnd();
                }
                console.log("addMap(正式): " +page);
                
            }

            if( characterData.length == 0 || characterData == undefined) {
                console.log("no data");
                if( completeFn !== undefined ) completeFn();
                return;
            }
            updatePixi(page);
            if( completeFn !== undefined ) {
                completeFn();
            }
        });



        function updatePixi(page) {
            // console.log(page);
            // console.log('addmap: ' +page);

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
                map.scale.set(1.01, 1.01);
                // map.scale.set(0.99, 0.99);

                pageMapContainer.addChild(map);

                var map2 = new PIXI.Sprite(resources['map'+m1].texture);
                map2.anchor.set(0.5);
                map2.x = pageCenter.x + rowCenter.x + mapWidth/2;
                map2.y = pageCenter.y + rowCenter.y + mapHeight/2;
                map2.scale.set(1.01, 1.01);
                // map2.scale.set(0.99, 0.99);
                pageMapContainer.addChild(map2);

                var map3 = new PIXI.Sprite(resources['map'+m3].texture);
                map3.anchor.set(0.5);
                map3.x = pageCenter.x + rowCenter.x - mapWidth/2;
                map3.y = pageCenter.y + rowCenter.y - mapHeight/2;
                map3.scale.set(1.01, 1.01);
                // map3.scale.set(0.99, 0.99);
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
                            text.y = newCharacter.y - 120;
                            text.anchor.set(0.5, 0.5);
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

        if( registerCharacter !== undefined ) {
            var target = registerCharacter.text;
            if( target.data.time == textAnimateTimer ) {
                TweenMax.fromTo(target, 0.5, {y:target.data.fixedPosition.y+30, alpha:0}, {y:target.data.fixedPosition.y, alpha:1, immediateRender:false} );
                TweenMax.fromTo(target, 0.5, {y:target.data.fixedPosition.y, alpha:1}, {y:target.data.fixedPosition.y+30, alpha:0, delay:2, immediateRender:false} );

            }
        }
        if( textAnimateTimer == chatSpeed ) textAnimateTimer = 0;


        if( isMoveActive ) {
            // console.log( moveDist );
            mapPosition = mapPosition + (moveDist*0.03);

            mapPosition = Math.max(Math.min(mapPosition, mapDistance/2), getCharacterMapPosition(totalCount)-200);

            updateCamera();
        }
  

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


    function getPoint(theta, r) {
        var x = (r *Math.sin(theta));
        var y = (r *Math.cos(theta));
        return {x:x, y:y};
    }



    window.addEventListener('mousewheel', function(event) {
        if( totalCount == undefined ) return;

        if( event.deltaY < 0 ) {
            mapPosition-=mapDistance/5; //60 30
        } else {
            mapPosition+=mapDistance/5;
        }
        mapPosition = Math.max(Math.min(mapPosition, mapDistance/2), getCharacterMapPosition(totalCount)-200);

        // mapPosition = Math.max( mapPosition, getCharacterMapPosition(totalCount) );

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
        var c = Math.floor(a/b);
        // console.log(c, c-1, c+1);

        var currentPage = Math.floor(a/b);
        // console.log(currentPage)
        console.log(mapPosition);
        
        if( activePages[currentPage] == undefined ) {
            if( parameter !== undefined ) {
                addMap(currentPage, parameter.completeFn);
            } else {
                addMap(currentPage);
            }            
        } else {
            if( parameter !== undefined ) {
                console.log("dssssssssssssssssss")
                parameter.completeFn();
            }   
        }
        if( activePages[currentPage+1] == undefined ) {
            addMap(currentPage+1);
        }
        if( activePages[currentPage-1] == undefined ) {
            addMap(currentPage-1);
        }

        // if( parameter && activePages[currentPage] == undefined ) {

        // }


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

        // 檢查UI

        console.log( "UIC:" + uiContainer.children.length );

        if( uiContainer.children.length > 0 ) {
            
            var uiPosition = -distanceBetween({x:uiContainer.children[2].x, y: uiContainer.children[2].y}, {x:0, y:0});
            var d = Math.abs(mapPosition - uiPosition);
            console.log(d);
            if( d > 1500 ) {
                removeEditMemoUI();
            }

        }
        // if( parameter !== undefined && activePages[Math.min(Math.max(currentPage, 0), totalPage)] !== undefined && activePages[Math.min(Math.max(currentPage+1, 0), totalPage)] !== undefined && activePages[Math.min(Math.max(currentPage-1, 0), totalPage)] !== undefined ) {
        //     console.log("1111");
        //     parameter.completeFn();
        // }

        // if( parameter !== undefined && activePages[currentPage] !== undefined && activePages[currentPage+1] !== undefined && activePages[currentPage-1] !== undefined) {
        //     console.log("2222");
        //     parameter.completeFn();
        // }



        // container.x = window.innerWidth/2 + p.x;
        // container.y = window.innerHeight/2 + p.y;
    }
    // var aa = 0;
    $("#info .search .icon").on('click', function(event) {
        event.preventDefault();
        // searchCharacter(709);
        // $("#searchID").val()
        // updateCamera({targetID: 0, completeFn:function(){
        //     console.log("OK");
        // }})

        $.ajax({
            url: setting.getdataAPIurl,
            type: 'POST',
            dataType: 'json',
            data: {pagecount: 1, location:$("#searchLocation").val(), phone:$("#searchPhone").val()}
        })
        .always(function(response) {

            console.log(response);

            if( response.data == undefined ) {
                // 測試用
                // for( var i=page*pageSize; i<(page*pageSize)+pageSize; i++ ) {
                //     if( fakeData[i] !== undefined ) characterData.push(fakeData[i]);       
                // }
                // if( totalPage == undefined ) {
                //     // firsttime
                //     totalPage = Math.ceil(fakeData.length/pageSize)-1;
                //     totalCount = fakeData.length;
                //     addMapEnd();
                // }
                // console.log("addMap(測試): " +page);
                var guid = 500;
                updateCamera({targetID: guid, completeFn:function(){
                    console.log("search complete");

                    addEditMemoUI(guid);
                }})
            } else {
                // 正式用
                // characterData = response.data.data;
                // if( totalPage == undefined ) {
                //     totalPage = response.data.totalpage;
                //     totalCount = response.data.totalcount;
                //     addMapEnd();
                // }
                // console.log("addMap(正式): " +page);

                if( response.code == "0000" ) {
                    updateCamera({targetID: response.data.data[0].guid, completeFn:function(){
                        console.log("search complete");
                    }})
                } else {
                    alert( response.message );
                }


            }

        });


    });
    
    function addEditMemoUI(guid) {
        if( uiContainer.children.length > 0 ) {
            removeEditMemoUI();
        }

        var character;
        var characterText;
        for (var key in activePages) {
            if( activePages[key].content == undefined ) continue;
            for( var i=0; i<activePages[key].content[1].children.length; i++) {
                // console.log( activePages[key].content[1].children[i].data.guid );
                if( activePages[key].content[1].children[i].data.guid == guid ) {
                    character = activePages[key].content[1].children[i];
                    characterText = activePages[key].content[2].children[i];
                    break;
                }
            }
        }
        characterText.visible = false;

        editData.memo = characterText.text;
        editData.phone = $("#searchPhone").val();
        editData.location = $("#searchLocation").val();
        editData.textObject = characterText;
        editData.characterObject = character;

        // character.alpha = 0.9;
        var textPadding = 10;
        var boxPaddingWidth = 30;
        var boxPaddingHeight = 20;
        var text = new PIXI.Text(character.data.memo, style);
        var editBtn = new PIXI.Sprite(resources['edit'].texture);

        text.x = character.x - editBtn.width/2 - textPadding/2;
        text.y = character.y - 120;
        text.anchor.set(0.5, 0.5);
        
        editBtn.x = character.x + text.width/2 + textPadding/2;
        editBtn.y = character.y -120;
        editBtn.anchor.set(0.5, 0.5);
        editBtn.scale.set(1, 1);
        editBtn.interactive = true;
        editBtn.buttonMode = true;
        editBtn.on('pointerdown', editBtnClick);



        var graphics = new PIXI.Graphics();
        var textBoxWidth = text.width + editBtn.width + textPadding + boxPaddingWidth;
        var textBoxHeight = text.height + boxPaddingHeight;
        // graphics.anchor.set(0.5, 0.5);
        graphics.lineStyle(2, 0xCCCCCC, 1);
        graphics.beginFill(0x000000, 0.5);
        graphics.drawRoundedRect(-textBoxWidth/2, -textBoxHeight/2, textBoxWidth, textBoxHeight, 7);
        graphics.endFill();
        graphics.x = character.x;
        graphics.y = character.y - 120;

        uiContainer.addChild(graphics);
        uiContainer.addChild(text);
        uiContainer.addChild(editBtn);
    }

    function removeEditMemoUI() {
        uiContainer.removeChildren();
        for (var key in activePages) {
            if( activePages[key].content == undefined ) continue;
            for( var i=0; i<activePages[key].content[2].children.length; i++) {
                activePages[key].content[2].children[i].visible = true;                
            }
        }

    }

    function getCharacterMapPosition(id) {
        // id是玩家編號, 0是第一個
        // console.log(id);
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

    function dropUser(parameter) {
        // parameter.memo
        // parameter.userwear
        // parameter.guid
        console.log("drop");
        var page = Math.floor(parameter.guid/pageSize);
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
        var pageCenter = {x: mapWidth/2*page*mapNum, y: -mapHeight/2*page*mapNum };

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
        registerContainer.addChild(newCharacter);

        var text = new PIXI.Text(parameter.memo, style);
        text.x = newCharacter.x;
        text.y = newCharacter.y - 120;
        text.anchor.set(0.5, 0.5);
        text.alpha = 0;
        text.data = {fixedPosition:{x:text.x ,y:text.y}, time:Math.floor(Math.random()*chatSpeed)};
        registerContainer.addChild(text);


        TweenMax.from(newCharacter, 1, {y:"-=150", alpha:0, ease:Bounce.easeOut, delay:1});

        registerCharacter = {character: newCharacter, text: text};
        // fakeData.push({memo:$("#form-memo").val(), guid: fakeData.length, userwear:parameter.userwear});
        // totalCount+=1;
    }

    function editBtnClick() {
        // alert("edit!");
        $("#edit").addClass('active');
        $("#editMemo").val(editData.memo);
    }


    $("#editBtn").on('click', function(event) {
        $.ajax({
            url: setting.writetodayAPIurl,
            type: 'POST',
            headers: {
                apikey: apiKey
            },
            dataType: 'json',
            data: {
                location: editData.location,
                phone: editData.phone,
                memo: $("#editMemo").val()
            }
        })
        .always(function(response) {
            if( response.data == undefined ) {
                // 測試

            } else {
                // 正式

            }
            editData.characterObject.data.memo = $("#editMemo").val();
            editData.textObject.text = $("#editMemo").val();
            $("#edit").removeClass('active');

            removeEditMemoUI();

        });
    });


    $(".lightbox .close").on('click', function(event) {
        $(this).parents(".lightbox").removeClass("active");
    });

    $("#registerSendBtn").on('click', function(event) {
        $.ajax({
            url: setting.lineupAPIurl,
            type: 'POST',
            headers: {
                apikey: apiKey
            },
            dataType: 'json',
            data: {
                location: $("#formLocation").val(),
                phone: $("#formPhone").val(),
                memo: $("#formMemo").val(),
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
                console.log("update camera")
                updateCamera({targetID: totalCount, completeFn:function(){
                    console.log("OK test");                    
                    dropUser({memo: $("#form-memo").val(), userwear: '7', guid:totalCount});
                }})
            }
            
            // updateCamera({targetID: 700, completeFn:function(){
            //     console.log("OK");
            //     dropUser();
            // }})
        });        
    });


    var isMoveActive = false;
    var moveOriginPosition = {x:0, y:0};
    var moveDist = 0;
    $("#pixiCanvas").on('touchstart', function(event) {
        isMoveActive = true;
        // console.log(event.touches[0]);
        moveOriginPosition = {x:event.touches[0].pageX, y:event.touches[0].pageY};
    });

    $("#pixiCanvas").on('touchend', function(event) {
        isMoveActive = false;
    });

    $("#pixiCanvas").on('touchmove', function(event) {
        if( isMoveActive ) {

            moveDist = distanceBetween(moveOriginPosition, {x:event.touches[0].pageX, y:event.touches[0].pageY});
            if( moveOriginPosition.x > event.touches[0].pageX ) {
                moveDist *= -1;
            }
            // var dist = {x: moveOriginPosition.x - event.pageX, y:moveOriginPosition.y - event.pageY};
            // console.log(dist);
            // mapPosition = mapPosition + (dist*0.5);

            // mapPosition = Math.max(Math.min(mapPosition, mapDistance/2), getCharacterMapPosition(totalCount)-200);

            // updateCamera();

        }
    });


    $(window).on('resize', function(event) {
        ww = window.innerWidth;
        wh = window.innerHeight;
        app.renderer.resize(ww, wh);
        updateCamera();
    });


});

function distanceBetween(point1, point2) {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

function ready() {
    $("#registerBtn").on('click', function(event) {
        $("#form").addClass("active");
    });
}

ready();