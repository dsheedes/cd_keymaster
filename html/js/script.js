let moving = {

}

let gameSuccess = null;

let settings = {};
let score = 0;
let mistake = 0;

let keycontainer = $("#keymaster-keycontainer");

let game;

let keys = [{
    key:"g",
    right:-128,
    controlled:true,
    shown:true
},{
    key:"e",
    right:-128,
    controlled:false,
    shown:false
}, {
    key:"e",
    right:-128,
    controlled:false,
    shown:false
},{
    key:"r",
    right:-128,
    controlled:false,
    shown:false
},{
    key:"g",
    right:-128,
    controlled:false,
    shown:false
},{
    key:"e",
    right:-128,
    controlled:false,
    shown:false
},{
    key:"t",
    right:-128,
    controlled:false,
    shown:false
},{
    key:"t",
    right:-128,
    controlled:false,
    shown:false
}]
function openModal(title, body){
    if(title)
        $("#keymaster-info-title").html(title);
    if(body)
        $("#keymaster-info-body").html(body);
    $("#keymaster-info").modal('show');
}
function showKeymaster(){
    let promise = new Promise((resolve, reject) => {
        score = 0;
        $("#keymaster-score").html("0");
        $("#keymaster-timer").html("0s");
        $("#keymaster-field").fadeIn(500, () => {
            let countdown = 5;
            $("#keymaster-overlay").show(0);
            let cd = window.setInterval(() => {
                if(countdown == -1){
                    clearInterval(cd);
                    $("#keymaster-overlay").hide(0);
                    resolve(true);
                } else if(countdown == 0){
                    $("#keymaster-countdown").html("START");
                    countdown--;
                } else $("#keymaster-countdown").html(countdown--);
                
            }, 1000);
        })
    });
    return promise;
}
function startGame(){
    showKeymaster().then(()=>{
        moveKey();
        drawKeys();
        initKeymaster();
    })
}
function generateKeys(keylist){
    if(keylist.length > 0){
        keys = [];
        for(let i = 0; i < keylist.length; i++){
            keys.push({
                key:keylist[i],
                right:-128,
                shown:((i===0)?true:false)
            })
        }
    }
}
function endGame(status, message){
    clearInterval(game);
    settings.speed = settings.baseSpeed;
    
    mistake = 0;
    
    if(status)
        gameSuccess = true;
    else gameSuccess = false;
    
    $("#keymaster-field").fadeOut(500);
    if(settings.handleEnd){
        openModal(((status)?"Completed!":"Failed!"), message);
    } else {
        var xhr = new XMLHttpRequest();
        let u = "fail";
        if(status)
            u = "success";
        xhr.open("POST", `http://cd_keymaster/${u}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({}));
    }
}
async function nextKey(i){
    if(i >= keys.length)
        i = 0;
    $("#keymaster-point-char").html(keys[i].key);
    keys[i].shown = true;
    $(`[data-kid='${i}']`).css("right", "-128px").css("background-color", "#eee").show(200);
    keys[i].right = -128;
}
async function evalStatus(){
    if(score >= settings.scoreWin){
        endGame(true, "Win");
        return;
    } 
    if(score <= settings.scoreLose){
        endGame(false, "You went into the negative!");
        return;
    } 
    if(mistake > settings.maxMistake){
        endGame(false, `Made more than ${settings.maxMistake} mistakes.`);
        return
    }
}
async function evalKey(key){
    for(let i = 0; i < keys.length; i++){
        if(keys[i].key == key && keys[i].shown){
            if(keys[i].right+128 <= settings.boxL && keys[i].right+128 >= settings.boxR){
                settings.speed += settings.speedIncrement;
                keys[i].shown = false;
                updateScore(keys[i].right+128 - settings.boxR);
                await animateKeypress(i, true);
                evalStatus();
                nextKey(i+1);
                return;
            } else {
                settings.speed = settings.baseSpeed;
                keys[i].shown = false;
                updateScore(-50);
                mistake++;
                await animateKeypress(i, false);
                evalStatus();
                nextKey(i+1);
                return;
            }
        }
    }

}
async function animateKeypress(kid, success){
    if(success){
        $("[data-kid='"+kid+"']").css("background-color", "#99e7ab").hide(300);
    } else {
        $("[data-kid='"+kid+"']").css("background-color", "#ed99a1").hide(300);
    }
}
async function updateScore(s){
    score += s;
    $("#keymaster-score").html(Math.ceil(score));
}
function initKeymaster(){
    settings.handleEnd = true;

    settings.time = 0;

    settings.width = window.innerWidth;
    settings.height = window.innerHeight;

    let element = document.getElementById("keymaster-point");
    settings.boxR = Math.floor(settings.width - element.getBoundingClientRect().right);
    settings.boxL = Math.floor(settings.width - element.getBoundingClientRect().left);
}
async function drawKeys(){
    keycontainer.html(`<div id="keymaster-point"><span id="keymaster-point-char"></span></div>`);
    for(let i = 0; i < keys.length; i++){
        if(keys[i].shown){
            keycontainer.append(`<div class="keymaster-key" data-kid="${i}" style="right:${keys[i].right}px"><span>${keys[i].key}</span></div>`);
            $("#keymaster-point-char").html(keys[i].key);
        }else keycontainer.append(`<div class="keymaster-key" data-kid="${i}"style="display:none"><span>${keys[i].key}</span></div>`);
    }
}
async function moveKey(){
    game = window.setInterval(() => {
        for(let i = 0; i < keys.length; i++){
            if(keys[i].shown){
                $("[data-kid='"+i+"']").css("right", `+=${settings.speed}px`);
                keys[i].right += settings.speed;

                if(keys[i].right >= settings.boxR+128){
                    keys[i].shown = false;
                    updateScore(-50);
                    animateKeypress(i, false);
                    nextKey(i+1);
                    settings.speed = settings.baseSpeed;
                    mistake++;
                    evalStatus();
                }
            }
        }
        settings.time += 10;
        $("#keymaster-timer").html((settings.time/1000).toFixed(1)+"s");
        if(settings.time >= settings.maxTime){
            endGame(false, "Time ran out!");
        }
    }, 10);
}

$(window).keydown((event) => {
    evalKey(event.key);
})
window.addEventListener("message", (event) => {
    if(event.data.action == "start"){
        let s = event.data.settings;
        if(!s){
            settings.speed = 10;
            settings.scoreWin = 1000;
            settings.scoreLose = -150;
            settings.maxTime = 30000; // 30 sec
            settings.maxMistake = 5;
            settings.speedIncrement = 1;
            settings.baseSpeed = 10;
        } else {
            if(s.handleEnd != null){
                settings.handleEnd = s.handleEnd;
            } else settings.handleEnd = true;
            if(s.speed != null){
                settings.speed = s.speed;
                settings.baseSpeed = s.speed;
            } else {
                settings.speed = 10;
                settings.baseSpeed = 10;
            }
            if(s.scoreWin != null){
                settings.scoreWin = s.scoreWin;
            } else settings.scoreWin = 1000;
            if(s.scoreLose != null){
                settings.scoreLose = s.scoreLose;
            } else settings.scoreLose = -150;
            if(s.maxTime != null){
                settings.maxTime = s.maxTime;
            } else settings.maxTime = 30000;
            if(s.maxMistake != null){
                settings.maxMistake = s.maxMistake
            } else settings.maxMistake = 5;
            if(s.speedIncrement != null){
                settings.speedIncrement = s.speedIncrement
            } else settings.speedIncrement = 1;
        }
        let k = event.data.keys;
        if(k && k.length > 0){
            generateKeys(k);
        }
        startGame();
    }
});
$('#keymaster-info').on('hide.bs.modal', () => {
    var xhr = new XMLHttpRequest();
    let u;
    if(gameSuccess !== null){
        if(gameSuccess)
            u = "success";
        else u = "fail";
    }

    xhr.open("POST", `http://cd_keymaster/${u}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({}));
});
