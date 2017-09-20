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

// mobile dectct
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
		$("#page5 .choose-container").addClass("mobile");
	} else {
		$("#page5 .choose-container").removeClass("mobile");
	}
}

// debug
$(".debug button").on("click", function(){
	toPage($(this).data("to"));
})


// page 1
var tel;
$(".btn-tel-submit").on("click", function() {
	tel = $(".tel-header-selecter").val() + $(".tel-input").val();
	console.log(tel);

	//post tel to API
	toPage(2);
})

//page 2
var stat;
$(".choose-frame").on("click", function(){
	stat = $(this).data("stat");
	console.log(stat);
	//post stat to API
	if(stat=="old") {
		toPage(3);
	} else {
		toPage(4);
	}
})
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

// page 3

// get player log and show

$(".btn-char-submit").on("click", function() {
	// post character to API
	// get score
	drawFinal(3,"卍煞氣a漢克卍","1216666","2359011");
	toPage(7);
})

// page 4
var charName;
$(".btn-name-submit").on("click", function() {
	charName = $(".name-input").val();
	console.log(charName);
	toPage(5);
})

// page 5
var jobList = ["king","knight","elf","wizard"];
var jobIndex = 0;

$(".btn-job-submit").on("click", function() {
	jobIndex = jobList.indexOf($(".job.selected").data("job"));
	console.log($(".job.selected").data("job"));
	toPage(6);
})

$(".job-clicker").on("click", function() {
	$(".job.selected").removeClass("selected");
	$(".job."+$(this).data("job")).addClass("selected");
	var index = jobList.indexOf($(this).data("job"));
	jobScroll(index);
})

var mc = new Hammer($("#page5 .choose-container")[0]);
mc.on("swipeleft", function(ev) {
	var nowJob = $(".job.selected").data("job");
	console.log(nowJob);
	var index = jobList.indexOf(nowJob);
	if(index < jobList.length-1) {
		jobScroll(index+1);
	}
});
mc.on("swiperight", function(ev) {
	var nowJob = $(".job.selected").data("job");
	var index = jobList.indexOf(nowJob);
	if(index > 0) {
		jobScroll(index-1);
	}
});
function jobScroll(index) {
	for(var i=0;i<jobList.length;i++) {
		$(".img-container,.clicker-container").removeClass("job"+i);
	}
	$(".img-container,.clicker-container").addClass("job"+index);
	$(".job.selected").removeClass("selected");
	$("."+jobList[index]).addClass("selected");

	$(".job-switch.selected").removeClass("selected");
	$(".job-switch."+jobList[index]).addClass("selected");
}

// page 6
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
			// post answer to API
			// get score and rank
			var score = 3578910;
			var rank = 23576;
			drawFinal(jobIndex,charName,score,rank);
			toPage(7);
		}
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
		$(".btn-quiz-submit .btn-container p").html("觀看結果");
	}
}

// page 7
function drawFinal(jobIndex,name,score,rank) {
	console.log(jobList[jobIndex]+", "+name+", "+score+", "+rank);
	var img = new Image();
	img.src = "assets/images/analysis/final"+(jobIndex+1)+".png";

	img.onload = function() {
		var canvas = document.createElement('canvas');
		canvas.width = img.width;
		canvas.height = img.height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		ctx.font = "20pt Arial";
		ctx.fillStyle = "white";
		ctx.textBaseline = "middle";
		ctx.fillText(score.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"), 820, 460);
		ctx.fillText(rank.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")+"名", 820, 518);

		ctx.font = "30pt Arial";
		ctx.fillText(name, 633, 375);

		var dataURL = canvas.toDataURL("image/png");
		$(".final-img").html("");
		$(".final-img").append($('<img/>',{ src: dataURL }));
	}
}

// share btn


// change page
function toPage(pageIndex) {
	$(".show").removeClass("show");
	$("#page"+pageIndex).addClass("show");
	$(".debug button.selected").removeClass("selected");
	$(".debug button[data-to="+pageIndex+"]").addClass("selected");
}

