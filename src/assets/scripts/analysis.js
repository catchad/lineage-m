var quiz = [
	{
		"title": "一、你會注重強化哪一項能力值呢？",
		"options": [
			{
				"data": "A.力量",
				"value": [4,5,1,3]
			},
			{
				"data": "B.敏捷",
				"value": [2,2,5,1]
			},
			{
				"data": "C.智力",
				"value": [3,1,2,5]
			},
			{
				"data": "D.體質",
				"value": [3,4,4,3]
			}
		]
	},
	{
		"title": "二、你想使用哪一種強力的武器？",
		"options": [
			{
				"data": "A.冰之女王魔杖",
				"value": [1,1,2,5]
			},
			{
				"data": "B.克特之劍",
				"value": [4,5,2,2]
			},
			{
				"data": "C.黃金權杖",
				"value": [5,3,2,2]
			},
			{
				"data": "D.沙哈之弓",
				"value": [2,2,5,1]
			}
		]
	},
	{
		"title": "三、遇到比你強的怪物你會？",
		"options": [
			{
				"data": "A.拼了",
				"value": [3,5,2,2]
			},
			{
				"data": "B.頭也不回就跑",
				"value": [1,1,4,4]
			},
			{
				"data": "C.招集夥伴一起打",
				"value": [5,3,3,3]
			},
			{
				"data": "D.沒差...死了就算了",
				"value": [2,4,1,1]
			}
		]
	},
	{
		"title": "四、當你打到對武器施法的捲軸（強化捲軸），你會想要如何使用？",
		"options": [
			{
				"data": "A.賣掉買更好的武器",
				"value": [2,3,4,3]
			},
			{
				"data": "B.當然自己衝裝備",
				"value": [1,4,2,2]
			},
			{
				"data": "C.留著說不定未來會用到",
				"value": [3,2,3,4]
			},
			{
				"data": "D.那是什麼？可以吃嗎？",
				"value": [4,1,1,1]
			}
		]
	},
	{
		"title": "五、看到好友被怪物包圍，你會怎麼做？",
		"options": [
			{
				"data": "A.先判斷自己能力再決定要不要幫",
				"value": [3,3,4,5]
			},
			{
				"data": "B.二話不說直接上前幫打",
				"value": [5,5,2,1]
			},
			{
				"data": "C.在旁邊觀察一下狀況，說不定幫打被認為是貼怪",
				"value": [1,1,2,5]
			},
			{
				"data": "D.他一躺可能就是換我被怪追殺，先跑再說",
				"value": [1,1,5,3]
			}
		]
	},
	{
		"title": "六、有人搶你怪物，撿你的道具，你會怎麼做？",
		"options": [
			{
				"data": "A.是沒看過壞人逆？打就對了",
				"value": [3,4,1,2]
			},
			{
				"data": "B.窮鬼！！你慢慢搶吧",
				"value": [5,4,3,2]
			},
			{
				"data": "C.說不定打了還會輸，怕丟臉，找人一起來",
				"value": [4,2,4,5]
			},
			{
				"data": "D.默默換地方練功",
				"value": [1,2,5,3]
			}
		]
	}
]

var isMobile;
function detect() {
	isMobile = $(window).width() <= 1000;
}
$(window).on("resize", function() {
	var prevIsMobile = isMobile;
	detect();
	if(prevIsMobile != isMobile) {
		if(isMobile) {
			$("#page5 .choose-container").addClass("mobile");
		} else {
			$("#page5 .choose-container").removeClass("mobile");
		}
	}
});

$(document).ready(function() {
	detect();
	if(isMobile) {
		$("#page5 .choose-container").addClass("mobile");
	} else {
		$("#page5 .choose-container").removeClass("mobile");
	}

	
});

$(".debug button").on("click", function(){
	$(".show").removeClass("show");
	$("#"+$(this).data("to")).addClass("show");
	$(".debug button.selected").removeClass("selected");
	$(this).addClass("selected");
})


$(".job-clicker").on("click", function() {
	$(".job.selected").removeClass("selected");
	$(".job."+$(this).data("job")).addClass("selected");
	var index = jobList.indexOf($(this).data("job"));
	jobScroll(index);
})

var jobList = ["king","knight","elf","wizard"];
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


$(".choose-frame").on("mouseover", function() {
	var stat = $(this).data("stat");
	if(stat == "old") {
		$(".new").removeClass("selected").addClass("not-selected");
		$(".old").removeClass("not-selected").addClass("selected");
	} else {
		$(".old").removeClass("selected").addClass("not-selected");
		$(".new").removeClass("not-selected").addClass("selected");
	}
})

$(".choose-frame").on("mouseout", function() {
	var stat = $(this).data("stat");
	if(stat == "new") {
		$(".new").removeClass("selected");
		$(".old").removeClass("not-selected");
	} else {
		$(".old").removeClass("selected");
		$(".new").removeClass("not-selected");
	}
})

$(".quiz-option").on("click", function() {
	$(".quiz-option.selected").removeClass("selected");
	$(this).addClass("selected");
})


var nowQuiz = 1;
$(".btn-quiz-submit").on("click", function() {
	quizGenerator();
})

function quizGenerator() {
	if(nowQuiz < quiz.length && $(".quiz-option.selected").length) {
		//生成下一題
		nowQuiz++;
		$(".quiz-title p").html(quiz[nowQuiz-1].title);
		for(var i=1;i<5;i++) {
			$(".option"+i).html(quiz[nowQuiz-1].options[i-1].data);
			$(".option"+i).data("value",quiz[nowQuiz-1].options[i-1].value);
			$(".option"+i).removeClass("selected");
		}

		$(".quiz-progress.done").removeClass("done");
		$(".quiz-progress[data-qNum="+nowQuiz+"]").addClass("done");
	} else {
		//送出結果
	}

	if(nowQuiz==quiz.length) {
		$(".btn-quiz-submit .btn-container p").html("觀看結果");
	}
}


function drawFinal(name,point,rank) {
	var img = new Image();
	img.src = "assets/images/analysis/final1.png";

	img.onload = function() {
		var canvas = document.createElement('canvas');
		canvas.width = img.width;
		canvas.height = img.height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		ctx.font = "20pt Arial";
		ctx.fillStyle = "white";
		ctx.textBaseline = "middle";
		ctx.fillText(point.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"), 820, 460);
		ctx.fillText(rank.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")+"名", 820, 518);

		ctx.font = "30pt Arial";
		ctx.fillText(name, 633, 375);

		var dataURL = canvas.toDataURL("image/png");
		$(".final-img").append($('<img/>',{ src: dataURL }));
	}
}
