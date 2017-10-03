var APIKey;
var mainAccount;
var userType; //1:new,2:old
var setImgId;

//角色資訊
var charName;
var job;
var jobIndex;
var score;
var rank;

//圖片base64
var imgDataURL;

// 老玩家角色資訊
var playerLog = [];
// 玩家角色列表模板
var playerLogLayout = '<div class="row" data-index={{index}}><div class="left"><div class="check-box"></div></div><div class="right"><div class="top"><div class="server"><p>{{server}}</p></div></div><div class="bottom"><div class="job"><p>{{job}}</p></div><div class="name"><p>{{name}}</p></div></div></div></div><div class="hr"></div>';

//-----------------------------------------------------------------------
//-------------------------------跳轉相關---------------------------------
//-----------------------------------------------------------------------
var isLogin = false;
$(document).ready(function() {
	getAPIKey();
	isLogin = checkLogin();
	if(isLogin) {
		mainAccount = $("#ma").val();
		userType = 2;
		// 獲取玩家資料
		getPlayerLog();
		toPage(2);
	} else {
		userType = 1;
		toPage(1);
	}
})

function getAPIKey() {
	APIKey = $("#APIKey").val();
}

function checkLogin() {
	return $("#ma").length != 0;
}

// 呼叫api得到玩家資料後填入playerLog裡
function getPlayerLog() {
	var postObj = {"ma":mainAccount,"ut":userType};
	console.log("api post: " + JSON.stringify(postObj));
	// post OldPlayerLog API
	// do something...

	// $.ajax({
	// 	url: 'http://localhost:6887/api/E20170921_5/OldplayerLog',
	// 	type: 'POST',
	// 	dataType: 'json',
	// 	data: postObj,
	// 	headers: {apikey: APIKey}
	// })
	// .always(function(request) {
	// 	if(request.code == "0000") {
	// 		//正常取得
	// 		for(var i=0; i<request.data.length; i++) {
	// 			playerLog.push(request.data[i]);
	// 		}
	// 		showPlayerLog();
	// 	} else {
	// 		//有錯誤，回到首頁
	// 		alert(request.message);
	// 		window.open(request.url);
	// 	}		
	// });
	

	// 模擬ajax非同步
	setTimeout(function(){ 
		// 得到api request
		// 以下為模擬資料
		var request = {
		    "code": "0000",
		    "message": "",
		    "data": [
		        {
		            "ID": 26074379,
		            "ServerType": "月服",
		            "MainAccount": "320262320062",
		            "GameServer": "月亮女神阿提密斯",
		            "CharName": "古巴比倫王2",
		            "Job": "王族",
		            "Score": 28550
		        },
		        {
		            "ID": 26074379,
		            "ServerType": "月服",
		            "MainAccount": "320262320062",
		            "GameServer": "月亮女神阿提密斯",
		            "CharName": "阿貴",
		            "Job": "妖精",
		            "Score": 28550
		        }
		    ],
		    "url": "https://tw.beanfun.com/LineageM/"
		}

		if(request.code == "0000") {
			//正常取得
			for(var i=0; i<request.data.length; i++) {
				playerLog.push(request.data[i]);
			}
			showPlayerLog();
		} else {
			//有錯誤，回到首頁
			alert(request.message);
			window.open(request.url);
		}		
	}, 300);
}

// 將playerLog裡的玩家資料呈現在page2上
function showPlayerLog() {
	for(var i=0; i<playerLog.length; i++) {
		var layout = playerLogLayout.replace("{{index}}", i)
									.replace("{{server}}", playerLog[i].GameServer)
									.replace("{{job}}", playerLog[i].Job)
									.replace("{{name}}", playerLog[i].CharName);
		$(".char-table").append(layout);
	}
	$(".char-table .row").on("click", function() {
		$(".row.selected").removeClass("selected");
		$(this).addClass("selected");
		$(".check-box.checked").removeClass("checked");
		$(".row.selected .check-box").addClass("checked");
	})
}


// 題庫
var quiz = [
	{
		"title": "一、你會注重強化哪一項能力值呢？",
		"options": [
			{
				"data": "A.力量",
				"value": "A"
			},
			{
				"data": "B.敏捷",
				"value": "B"
			},
			{
				"data": "C.智力",
				"value": "C"
			},
			{
				"data": "D.體質",
				"value": "D"
			}
		]
	},
	{
		"title": "二、你想使用哪一種強力的武器？",
		"options": [
			{
				"data": "A.冰之女王魔杖",
				"value": "A"
			},
			{
				"data": "B.克特之劍",
				"value": "B"
			},
			{
				"data": "C.黃金權杖",
				"value": "C"
			},
			{
				"data": "D.沙哈之弓",
				"value": "D"
			}
		]
	},
	{
		"title": "三、遇到比你強的怪物你會？",
		"options": [
			{
				"data": "A.拼了",
				"value": "A"
			},
			{
				"data": "B.頭也不回就跑",
				"value": "B"
			},
			{
				"data": "C.招集夥伴一起打",
				"value": "C"
			},
			{
				"data": "D.沒差...死了就算了",
				"value": "D"
			}
		]
	},
	{
		"title": "四、當你打到對武器施法的捲軸（強化捲軸），你會想要如何使用？",
		"options": [
			{
				"data": "A.賣掉買更好的武器",
				"value": "A"
			},
			{
				"data": "B.當然自己衝裝備",
				"value": "B"
			},
			{
				"data": "C.留著說不定未來會用到",
				"value": "C"
			},
			{
				"data": "D.那是什麼？可以吃嗎？",
				"value": "D"
			}
		]
	},
	{
		"title": "五、看到好友被怪物包圍，你會怎麼做？",
		"options": [
			{
				"data": "A.先判斷自己能力再決定要不要幫",
				"value": "A"
			},
			{
				"data": "B.二話不說直接上前幫打",
				"value": "B"
			},
			{
				"data": "C.在旁邊觀察一下狀況，說不定幫打被認為是貼怪",
				"value": "C"
			},
			{
				"data": "D.他一躺可能就是換我被怪追殺，先跑再說",
				"value": "D"
			}
		]
	},
	{
		"title": "六、有人搶你怪物，撿你的道具，你會怎麼做？",
		"options": [
			{
				"data": "A.是沒看過壞人逆？打就對了",
				"value": "A"
			},
			{
				"data": "B.窮鬼！！你慢慢搶吧",
				"value": "B"
			},
			{
				"data": "C.說不定打了還會輸，怕丟臉，找人一起來",
				"value": "C"
			},
			{
				"data": "D.默默換地方練功",
				"value": "D"
			}
		]
	}
]

//-----------------------------------------------------------------------
//-------------------------------RWD相關---------------------------------
//-----------------------------------------------------------------------
$(document).ready(function() {
	detect();
	mobileClassToggle();
})

var isMobile;
function detect() {
	isMobile = $(window).width() <= 1000;
}
$(window).on("resize", function() {
	var prevIsMobile = isMobile;
	detect();
	if(prevIsMobile != isMobile) {
		mobileClassToggle();
	}
});

function mobileClassToggle() {
	if(isMobile) {
		$("#page4 .choose-container").addClass("mobile");
	} else {
		$("#page4 .choose-container").removeClass("mobile");
	}
}


//-----------------------------------------------------------------------
//-------------------------------頁面邏輯---------------------------------
//-----------------------------------------------------------------------

// page 1 （選擇老手或新手）------------------------------------------------
$(".choose-frame").on("click", function(){
	var stat = $(this).data("stat");
	if(stat=="old") {
		// 選擇老手，進行畫面跳轉
		// do something...
	} else {
		// 選擇新手
		// post NewPlayerLog API
		// do something...

		// 模擬ajax非同步
		setTimeout(function(){ 
			// 得到api request
			// 以下為模擬資料
			var request = {
			    "code": "0000",
			    "message": "",
			    "data": [
			        {
			            "ma": "320262320062"
			        }
			    ],
			    "url": "https://tw.beanfun.com/LineageM/"
			}
			if(request.code == "0000") {
				//正常取得
				mainAccount = request.data[0].ma;
				userType = 1;
				toPage(3);
			} else {
				//有錯誤，回到首頁
				alert(request.message);
				window.open(request.url);
			}
		}, 300)
	}
})

//動畫
$(".choose-frame").on("mouseover", function() {
	var tempStat = $(this).data("stat");
	if(tempStat == "old") {
		$(".new").removeClass("selected").addClass("not-selected");
		$(".old").removeClass("not-selected").addClass("selected");
	} else {
		$(".old").removeClass("selected").addClass("not-selected");
		$(".new").removeClass("not-selected").addClass("selected");
	}
})
$(".choose-frame").on("mouseout", function() {
	var tempStat = $(this).data("stat");
	if(tempStat == "new") {
		$(".new").removeClass("selected");
		$(".old").removeClass("not-selected");
	} else {
		$(".old").removeClass("selected");
		$(".new").removeClass("not-selected");
	}
})
//-----------------------------------------------------------------------


// page 2 （老手選擇角色）-------------------------------------------------
$(".btn-char-submit").on("click", function() {
	if($(".row.selected").length) {
		var index = $(".row.selected").data("index");
		job = playerLog[index].Job;
		jobIndex = jobNameToIndex(job);
		charName = playerLog[index].CharName;
		var postObj = {"ma":mainAccount,"ut":userType,"un":charName,"j":job};
		console.log("api post: " + JSON.stringify(postObj));
		// post SavePlayerLog API
		// do something...

		// 模擬ajax非同步
		setTimeout(function(){
			// 得到api request
			var request = {
			    "code": "0000",
			    "message": "",
			    "data": [
			        {
			            "ID": "3",
			            "Score": 64100,
			            "Ranking": 9930
			        }
			    ],
			    "url": "https://tw.beanfun.com/LineageM/"
			}
			if(request.code == "0000") {
				//正常取得
				drawFinal(jobIndex,charName,request.data[0].Score,request.data[0].Ranking);
				toPage(6);
			} else {
				//有錯誤，回到首頁
				alert(request.message);
				window.open(request.url);
			}
		}, 300)
	}
})

function jobNameToIndex(job) {
	var index;
	switch(job) {
		case "王族":
			index = 0;
			break;
		case "騎士":
			index = 1;
			break;
		case "妖精":
			index = 2;
			break;
		case "法師":
			index = 3;
			break;
	}
	return index;
}

//-----------------------------------------------------------------------

// page 3 （新手輸入名字）-------------------------------------------------
$(".btn-name-submit").on("click", function() {
	if($(".name-input").val()) {
		charName = $(".name-input").val();
		console.log(charName);
		toPage(4);
	} else {
		$(".name-container").addClass('copyed');
		setTimeout(function() {
			$(".name-container").removeClass('copyed');
		},800);
	}
})
//-----------------------------------------------------------------------


// page 4 （新手選擇職業）-------------------------------------------------
var jobList = ["king","knight","elf","wizard"];

$(".btn-job-submit").on("click", function() {
	jobIndex = jobList.indexOf($(".job.selected").data("job"));
	job = jobIndexToName(jobIndex);
	console.log($(".job.selected").data("job"));
	toPage(5);
})

$(".job-clicker").on("click", function() {
	$(".job.selected").removeClass("selected");
	$(".job."+$(this).data("job")).addClass("selected");
	var index = jobList.indexOf($(this).data("job"));
	jobScroll(index);
})

var mc = new Hammer($("#page4 .choose-container")[0]);
mc.on("swipeleft", function(ev) {
	scrollTo("right");
});
mc.on("swiperight", function(ev) {
	scrollTo("left");
});

$(".arrow-left").on("click", function() {
	scrollTo("left");
})
$(".arrow-right").on("click", function() {
	scrollTo("right");
})

function scrollTo(direction) {
	var nowJob = $(".job.selected").data("job");
	var index = jobList.indexOf(nowJob);
	if(direction == "right") {
		if(index < jobList.length-1) {
			jobScroll(index+1);
		}
	} else if (direction == "left") {
		if(index > 0) {
			jobScroll(index-1);
		}
	}
}

function jobScroll(index) {
	for(var i=0;i<jobList.length;i++) {
		$(".img-container,.clicker-container").removeClass("job"+i);
	}
	$(".img-container,.clicker-container").addClass("job"+index);
	$(".job.selected").removeClass("selected");
	$("."+jobList[index]).addClass("selected");

	$(".job-switch.selected").removeClass("selected");
	$(".job-switch."+jobList[index]).addClass("selected");

	$(".arrow.disable").removeClass("disable");
	if(index == 0) {
		$(".arrow-left").addClass("disable");
	}
	if (index == 3) {
		$(".arrow-right").addClass("disable");
	}
}

function jobIndexToName(jobIndex) {
	var name;
	switch(jobIndex) {
		case 0:
			name = "王族";
			break;
		case 1:
			name = "騎士";
			break;
		case 2:
			name = "妖精";
			break;
		case 3:
			name = "法師";
			break;
	}
	return name;
}
//-----------------------------------------------------------------------

// page 5 （新手寫題目）---------------------------------------------------
$(".quiz-option").on("click", function() {
	$(".quiz-option.selected").removeClass("selected");
	$(this).addClass("selected");
})

var answer = [];
var nowQuiz = 0;
quizGenerator(++nowQuiz);
$(".btn-quiz-submit").on("click", function() {
	if($(".quiz-option.selected").length) {
		answer.push($(".quiz-option.selected").data("value"));
		if(nowQuiz < quiz.length) {
			quizGenerator(++nowQuiz);
		} else {
			// 答題完畢
			console.log(answer);
			var postObj = {"ma":mainAccount,"ut":userType,"un":charName,"j":job,"t1":answer[0],"t2":answer[1],"t3":answer[2],"t4":answer[3],"t5":answer[4],"t6":answer[5]};
			console.log("api post: " + JSON.stringify(postObj));
			// post SavePlayerLog API
			// do something...

			// 模擬ajax非同步
			setTimeout(function(){
				// 得到api request
				var request = {
				    "code": "0000",
				    "message": "",
				    "data": [
				        {
				            "ID": "3",
				            "Score": 64100,
				            "Ranking": 9930
				        }
				    ],
				    "url": "https://tw.beanfun.com/LineageM/"
				}
				if(request.code == "0000") {
					//正常取得
					setImgId = request.data[0].ID;
					drawFinal(jobIndex,charName,request.data[0].Score,request.data[0].Ranking);
					toPage(6);
				} else {
					//有錯誤，回到首頁
					alert(request.message);
					window.open(request.url);
				}
			}, 300)
		}
	} else {
		$(".quiz-option-list").addClass('after-active');
		setTimeout(function() {
			$(".quiz-option-list").removeClass('after-active');
		},800);
	}
})

function quizGenerator(quizIndex) {
	// 生成下一題
	$(".quiz-title p").html(quiz[quizIndex-1].title);
	for(var i=1;i<5;i++) {
		$(".option"+i).html(quiz[quizIndex-1].options[i-1].data);
		$(".option"+i).data("value",quiz[quizIndex-1].options[i-1].value);
		$(".option"+i).removeClass("selected");
	}

	$(".quiz-progress.done").removeClass("done");
	$(".quiz-progress[data-qNum="+quizIndex+"]").addClass("done");
	if(quizIndex == quiz.length) {
		$(".btn-quiz-submit .btn__container p").html("觀看結果");
	}
}
//-----------------------------------------------------------------------

// page 6 （最後結果）-----------------------------------------------------
function drawFinal(job,name,score,rank) {

	console.log(jobList[jobIndex]+", "+name+", "+score+", "+rank);
	var img = new Image();
	img.src = "assets/images/analysis/final"+(parseInt(jobIndex)+1)+".png";

	img.onload = function() {
		var canvas = document.createElement('canvas');
		canvas.width = img.width;
		canvas.height = img.height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		ctx.font = "30pt Arial";
		ctx.fillStyle = "white";
		ctx.textAlign="start"; 
		ctx.textBaseline = "alphabetic";
		ctx.fillText(score.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"), 255, 465);
		ctx.fillText(rank.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"), 255, 540);
		var rankWidth = ctx.measureText(rank.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")).width;
		ctx.font = "20pt Arial";
		ctx.fillText("名", 258+rankWidth, 540);

		ctx.font = "30pt Arial";
		ctx.textAlign="center"; 
		ctx.textBaseline = "middle";
		ctx.fillText(name, 228, 372);

		imgDataURL = canvas.toDataURL("image/png");
		$(".final-img .img-container").html("");
		$(".final-img .img-container").append($('<img/>',{ src: imgDataURL }));
	}
}

// share btn
var hasCalledImgAPI = false;
var shareURL;
$(".btn-fb-share").on("click", function() {
	if(!hasCalledImgAPI) {
		hasCalledImgAPI = true;
		//post SetImage api
		var postObj = {"ma":mainAccount,"id":setImgId,"ut":userType,"ib":imgDataURL.substring(imgDataURL.indexOf(",")+1)};

		// 模擬ajax非同步
		setTimeout(function(){
			// 得到api request
			var request = {
			    "code": "0000",
			    "message": "",
			    "data": [
			        {
			            "ImageUrl": "1505374469_DtWhE"
			        }
			    ],
			    "url": "https://tw.beanfun.com/LineageM/"
			}
			if(request.code == "0000") {
				//正常取得
				shareURL = request.data[0].ImageUrl;
				console.log(shareURL);
				window.open("http://www.facebook.com/sharer/sharer.php?u="+shareURL, "_blank");
			} else {
				//有錯誤，回到首頁
				alert(request.message);
				window.open(request.url);
			}
		}, 300)
	} else {
		window.open("http://www.facebook.com/sharer/sharer.php?u="+shareURL, "_blank");
	}
})

//-----------------------------------------------------------------------

// debug用
$(".debug button").on("click", function(){
	toPage($(this).data("to"));
})

// change page
function toPage(pageIndex) {
	$(".show").removeClass("show");
	$("#page"+pageIndex).addClass("show");
	$(".debug button.selected").removeClass("selected");
	$(".debug button[data-to="+pageIndex+"]").addClass("selected");
}

